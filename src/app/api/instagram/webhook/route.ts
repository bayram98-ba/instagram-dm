import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { generateAiResponse } from "@/lib/ai";
import { sendInstagramMessage } from "@/lib/instagram";

// ── Signature validation ───────────────────────────────────────────────────────
function isValidSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature) return !secret; // skip in dev if secret not set
  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── Find or create conversation for an Instagram sender ───────────────────────
async function resolveConversation(senderId: string): Promise<string> {
  const mappingKey = `ig_conv_${senderId}`;
  const existing = await prisma.setting.findUnique({ where: { key: mappingKey } });
  if (existing) return JSON.parse(existing.value) as string;

  const defaultModeSetting = await prisma.setting.findUnique({ where: { key: "defaultMode" } });
  const defaultMode = defaultModeSetting ? (JSON.parse(defaultModeSetting.value) as string) : "semi";

  const customer = await prisma.customer.create({
    data: { name: `Instagram: ${senderId}`, phone: "", address: "" },
  });
  const conv = await prisma.conversation.create({
    data: { customerId: customer.id, channel: "instagram", mode: defaultMode },
  });

  await prisma.setting.create({
    data: { key: mappingKey, value: JSON.stringify(conv.id) },
  });

  return conv.id;
}

// ── Auto-reply in "auto" mode ─────────────────────────────────────────────────
async function handleAutoReply(conversationId: string, senderId: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!conv || conv.mode !== "auto") return;

  const [products, settingsRows] = await Promise.all([
    prisma.product.findMany({ where: { stock: { gt: -1 } } }),
    prisma.setting.findMany(),
  ]);

  const settings = Object.fromEntries(settingsRows.map(s => [s.key, JSON.parse(s.value)]));
  const existingOrder = conv.orders[0];

  const aiResult = await generateAiResponse(
    conv.messages.map(m => ({ direction: m.direction as "incoming" | "outgoing", text: m.text })),
    products,
    settings.deliveryZones ?? [],
    (settings.paymentMethods ?? []).filter((p: { on: boolean }) => p.on).map((p: { name: string }) => p.name),
    settings.faq ?? [],
    existingOrder
      ? {
          product: existingOrder.productName,
          variant: existingOrder.variant,
          qty: existingOrder.qty,
          customerName: existingOrder.customerName,
          phone: existingOrder.phone,
          address: existingOrder.address,
          zone: existingOrder.zone,
          deliveryFee: existingOrder.deliveryFee,
          paymentMethod: existingOrder.paymentMethod,
          total: existingOrder.total,
        }
      : {}
  );

  // Save AI reply to DB
  await prisma.message.create({
    data: { conversationId, direction: "outgoing", text: aiResult.draft, isAiGenerated: true },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  // Send via Instagram Graph API
  await sendInstagramMessage(senderId, aiResult.draft);
}

// ── GET: webhook verification ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ── POST: receive DM events ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!isValidSignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let body: unknown;
  try { body = JSON.parse(rawBody); }
  catch { return new NextResponse("Invalid JSON", { status: 400 }); }

  const data = body as { object?: string; entry?: Array<{ messaging?: Array<{ sender: { id: string }; message?: { text?: string; is_echo?: boolean } }> }> };

  if (data.object === "instagram") {
    for (const entry of data.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        if (!event.message || event.message.is_echo) continue;

        const senderId   = event.sender.id;
        const messageText = event.message.text;
        if (!messageText) continue;

        const conversationId = await resolveConversation(senderId);

        await prisma.message.create({
          data: { conversationId, direction: "incoming", text: messageText, isAiGenerated: false },
        });
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { unreadCount: { increment: 1 }, lastMessageAt: new Date() },
        });

        // Fire auto-reply without blocking the 200 response
        handleAutoReply(conversationId, senderId).catch(console.error);
      }
    }
  }

  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}

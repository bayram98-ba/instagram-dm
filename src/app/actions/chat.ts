"use server";

import { prisma } from "@/lib/db";
import { generateAiResponse, readReceipt } from "@/lib/ai";
import { revalidatePath } from "next/cache";

// ─── Conversations ───────────────────────────────────────────────────────────

export async function getConversations() {
  return prisma.conversation.findMany({
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function sendMessage(conversationId: string, text: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!conv) throw new Error("Söhbət tapılmadı");

  await prisma.message.create({
    data: { conversationId, direction: "outgoing", text, isAiGenerated: false },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0, lastMessageAt: new Date() },
  });

  revalidatePath("/");
}

// ─── AI Draft ────────────────────────────────────────────────────────────────

export async function generateDraft(conversationId: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!conv) throw new Error("Söhbət tapılmadı");

  const [products, settingsRows] = await Promise.all([
    prisma.product.findMany({ where: { stock: { gt: -1 } } }),
    prisma.setting.findMany(),
  ]);

  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, JSON.parse(s.value)]));

  const existingOrder = conv.orders[0];
  const existingFields = existingOrder
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
    : {};

  const aiResult = await generateAiResponse(
    conv.messages.map((m) => ({
      direction: m.direction as "incoming" | "outgoing",
      text: m.text,
    })),
    products,
    settings.deliveryZones ?? [],
    (settings.paymentMethods ?? []).filter((p: { on: boolean }) => p.on).map((p: { name: string }) => p.name),
    settings.faq ?? [],
    existingFields
  );

  const mergedFields = { ...existingFields };
  for (const [key, val] of Object.entries(aiResult.order)) {
    if (val !== null && val !== undefined) {
      (mergedFields as Record<string, unknown>)[key] = val;
    }
  }

  const currentFilled: string[] = existingOrder
    ? (JSON.parse(existingOrder.aiFilledFields) as string[])
    : [];
  const newFilled = [...new Set([...currentFilled, ...aiResult.aiFilledFields])];

  let productId: string | undefined;
  if (aiResult.order.product) {
    const found = products.find(
      (p) => p.name.toLowerCase() === aiResult.order.product!.toLowerCase()
    );
    productId = found?.id;
  }

  const orderData = {
    productId: productId ?? existingOrder?.productId ?? undefined,
    productName: aiResult.order.product ?? existingOrder?.productName ?? undefined,
    variant: aiResult.order.variant ?? existingOrder?.variant ?? undefined,
    qty: aiResult.order.qty ?? existingOrder?.qty ?? 1,
    customerName: aiResult.order.customerName ?? existingOrder?.customerName ?? undefined,
    phone: aiResult.order.phone ?? existingOrder?.phone ?? undefined,
    address: aiResult.order.address ?? existingOrder?.address ?? undefined,
    zone: aiResult.order.zone ?? existingOrder?.zone ?? undefined,
    deliveryFee: aiResult.order.deliveryFee ?? existingOrder?.deliveryFee ?? 0,
    paymentMethod: aiResult.order.paymentMethod ?? existingOrder?.paymentMethod ?? undefined,
    total: aiResult.order.total ?? existingOrder?.total ?? 0,
    aiFilledFields: JSON.stringify(newFilled),
  };

  let savedOrderId: string;
  if (existingOrder) {
    await prisma.order.update({ where: { id: existingOrder.id }, data: orderData });
    savedOrderId = existingOrder.id;
  } else {
    const created = await prisma.order.create({
      data: {
        conversationId,
        customerId: conv.customerId ?? undefined,
        ...orderData,
      },
    });
    savedOrderId = created.id;
  }

  revalidatePath("/");
  return {
    draft: aiResult.draft,
    aiFilledFields: aiResult.aiFilledFields,
    order: orderData,
    orderId: savedOrderId,
  };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      product: true,
      customer: true,
      conversation: { include: { customer: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/");
}

export async function confirmOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "Təsdiqlənib" },
  });
  revalidatePath("/");
}

// ─── Products (Catalog) ──────────────────────────────────────────────────────

export async function getProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "asc" } });
}

export async function upsertProduct(data: {
  id?: string;
  name: string;
  price: number;
  stock: number;
  variants: string[];
  description?: string;
  category?: string;
  emoji?: string;
  tone?: string;
}) {
  const payload = {
    name: data.name,
    price: data.price,
    stock: data.stock,
    variants: JSON.stringify(data.variants),
    description: data.description ?? "",
    category: data.category ?? "",
    emoji: data.emoji ?? "📦",
    tone: data.tone ?? "green",
  };

  if (data.id) {
    await prisma.product.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }
  revalidatePath("/");
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function setConversationMode(conversationId: string, mode: "semi" | "auto") {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { mode },
  });
  revalidatePath("/");
}

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));
}

export async function saveSetting(key: string, value: unknown) {
  await prisma.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
  revalidatePath("/");
}

// ─── Incoming message (local test + webhook) ─────────────────────────────────

export async function receiveIncomingMessage(conversationId: string, text: string) {
  await prisma.message.create({
    data: { conversationId, direction: "incoming", text, isAiGenerated: false },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: { increment: 1 }, lastMessageAt: new Date() },
  });
  revalidatePath("/");
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}

// ─── Receipt reading (Claude Vision) ─────────────────────────────────────────

export async function readReceiptImage(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
) {
  return readReceipt(imageBase64, mediaType);
}

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export async function getDashboardData() {
  const [convos, orders] = await Promise.all([
    prisma.conversation.findMany({
      include: { customer: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { lastMessageAt: "desc" },
    }),
    prisma.order.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const totalUnread = convos.reduce((s, c) => s + c.unreadCount, 0);
  const newOrders = orders.filter(o => o.status === "Yeni").length;
  const todayTotal = orders.reduce((s, o) => s + o.total, 0);

  return {
    totalMessages: totalUnread + 14,
    unread: totalUnread,
    newOrders,
    todayTotal: Math.round(todayTotal),
    recentOrders: orders.slice(0, 4),
    attentionConvos: convos.filter(c => c.unreadCount > 0).slice(0, 3),
  };
}

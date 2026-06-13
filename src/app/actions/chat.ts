"use server";

import { prisma } from "@/lib/db";
import { generateAiResponse } from "@/lib/ai";
import { revalidatePath } from "next/cache";

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

export async function sendMessage(conversationId: string, text: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!conv) throw new Error("Söhbət tapılmadı");

  // Save outgoing message
  await prisma.message.create({
    data: { conversationId, direction: "outgoing", text, isAiGenerated: false },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0, lastMessageAt: new Date() },
  });

  revalidatePath("/");
}

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

  // Upsert order with AI-extracted fields
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

  // Find product by name
  let productId: string | undefined;
  if (aiResult.order.product) {
    const found = products.find(
      (p) => p.name.toLowerCase() === aiResult.order.product!.toLowerCase()
    );
    productId = found?.id;
  }

  if (existingOrder) {
    await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        productId: productId ?? existingOrder.productId,
        productName: aiResult.order.product ?? existingOrder.productName,
        variant: aiResult.order.variant ?? existingOrder.variant,
        qty: aiResult.order.qty ?? existingOrder.qty,
        customerName: aiResult.order.customerName ?? existingOrder.customerName,
        phone: aiResult.order.phone ?? existingOrder.phone,
        address: aiResult.order.address ?? existingOrder.address,
        zone: aiResult.order.zone ?? existingOrder.zone,
        deliveryFee: aiResult.order.deliveryFee ?? existingOrder.deliveryFee,
        paymentMethod: aiResult.order.paymentMethod ?? existingOrder.paymentMethod,
        total: aiResult.order.total ?? existingOrder.total,
        aiFilledFields: JSON.stringify(newFilled),
      },
    });
  } else {
    await prisma.order.create({
      data: {
        conversationId,
        customerId: conv.customerId ?? undefined,
        productId,
        productName: aiResult.order.product,
        variant: aiResult.order.variant,
        qty: aiResult.order.qty ?? 1,
        customerName: aiResult.order.customerName,
        phone: aiResult.order.phone,
        address: aiResult.order.address,
        zone: aiResult.order.zone,
        deliveryFee: aiResult.order.deliveryFee ?? 0,
        paymentMethod: aiResult.order.paymentMethod,
        total: aiResult.order.total ?? 0,
        aiFilledFields: JSON.stringify(newFilled),
      },
    });
  }

  revalidatePath("/");
  return { draft: aiResult.draft, aiFilledFields: aiResult.aiFilledFields };
}

export async function confirmOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "Təsdiqlənib" },
  });
  revalidatePath("/");
}

export async function setConversationMode(conversationId: string, mode: "semi" | "auto") {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { mode },
  });
  revalidatePath("/");
}

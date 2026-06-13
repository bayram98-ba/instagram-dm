"use client";
import { useState, useCallback, useEffect } from "react";
import { ConvoList, Convo } from "./ConvoList";
import { ChatThread, Message } from "./ChatThread";
import { ChatHeader } from "./ChatHeader";
import { AiComposer } from "./AiComposer";
import { OrderPanel, OrderData } from "./OrderPanel";
import {
  getConversations,
  generateDraft,
  sendMessage,
  setConversationMode,
  confirmOrder,
  receiveIncomingMessage,
} from "@/app/actions/chat";
import { useToast } from "@/components/ui/Toast";
import type { ReceiptData } from "@/lib/ai";

function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString("az", { hour: "2-digit", minute: "2-digit" });
}

function toneName(hex: string): string {
  const map: Record<string, string> = {
    "#dceee3": "green", "#ecf5ef": "green",
    "#fbefd9": "amber", "#f3ecdd": "amber",
    "#f7e2dc": "rose",  "#fdf0ee": "rose",
    "#e4ecf3": "blue",  "#eef2f8": "blue",
    "#ede8f5": "purple","#f3f0fa": "purple",
  };
  return map[hex.toLowerCase()] ?? "green";
}

const TEST_MESSAGES = [
  "Bu məhsul hələ var?",
  "Bakıya dostavka neçəyədi?",
  "M ölçüsü var?",
  "Qara rəngdə var?",
  "Nağd ödəniş olur?",
  "Neçə gündə çatdırırsız?",
];

export function Inbox() {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<OrderData>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [aiFilledFields, setAiFilledFields] = useState<string[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [mode, setMode] = useState<"semi" | "auto">("semi");
  const [isTyping, setIsTyping] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(true);
  const [loading, setLoading] = useState(true);

  const rawConvosRef = useState<Awaited<ReturnType<typeof getConversations>>>([]);
  const [rawConvos, setRawConvos] = rawConvosRef;

  const toast = useToast();

  useEffect(() => {
    getConversations().then(data => {
      setRawConvos(data);
      const mapped: Convo[] = data.map(c => ({
        id: c.id,
        customerName: c.customer?.name ?? "Müştəri",
        lastMessage: c.messages.at(-1)?.text ?? "",
        lastTime: c.messages.length ? fmtTime(c.messages.at(-1)!.createdAt) : "",
        unread: c.unreadCount,
        mode: c.mode as "semi" | "auto",
        online: false,
      }));
      setConvos(mapped);
      if (mapped.length) {
        selectConvo(data[0].id, data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectConvo(id: string, data?: typeof rawConvos) {
    const src = data ?? rawConvos;
    const raw = src.find(c => c.id === id);
    if (!raw) return;

    setSelectedId(id);
    setMode(raw.mode as "semi" | "auto");
    setDraft(null);

    const msgs: Message[] = raw.messages.map(m => ({
      id: m.id,
      direction: m.direction as "incoming" | "outgoing",
      text: m.text,
      time: fmtTime(m.createdAt),
      isAiGenerated: m.isAiGenerated,
    }));
    setMessages(msgs);

    const latestOrder = raw.orders[0];
    if (latestOrder) {
      setOrderId(latestOrder.id);
      const prod = (raw as { orders: (typeof raw.orders[0] & { product?: { emoji?: string; tone?: string } | null })[] }).orders[0];
      setOrder({
        productName: latestOrder.productName ?? undefined,
        productEmoji: (prod as { product?: { emoji?: string } | null }).product?.emoji ?? "📦",
        productTone: toneName((prod as { product?: { tone?: string } | null }).product?.tone ?? "green"),
        productPrice: latestOrder.total && latestOrder.qty ? latestOrder.total / latestOrder.qty : undefined,
        variant: latestOrder.variant ?? undefined,
        qty: latestOrder.qty,
        customerName: latestOrder.customerName ?? undefined,
        phone: latestOrder.phone ?? undefined,
        address: latestOrder.address ?? undefined,
        deliveryZone: latestOrder.zone ?? undefined,
        deliveryFee: latestOrder.deliveryFee,
        paymentMethod: latestOrder.paymentMethod ?? undefined,
        status: (latestOrder.status as "Yeni" | "Təsdiqlənib" | "Göndərilib") ?? "Yeni",
      });
      setAiFilledFields(JSON.parse(latestOrder.aiFilledFields) as string[]);
    } else {
      setOrderId(null);
      setOrder({});
      setAiFilledFields([]);
    }

    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  }

  const handleSelect = (id: string) => selectConvo(id);

  function applyOrderResult(res: { order: Record<string, unknown>; aiFilledFields: string[]; orderId?: string }) {
    if (res.orderId) setOrderId(res.orderId);
    if (res.order) {
      setOrder(prev => ({
        ...prev,
        productName: (res.order.productName ?? prev.productName) as string | undefined,
        variant: (res.order.variant ?? prev.variant) as string | undefined,
        qty: (res.order.qty ?? prev.qty) as number | undefined,
        customerName: (res.order.customerName ?? prev.customerName) as string | undefined,
        phone: (res.order.phone ?? prev.phone) as string | undefined,
        address: (res.order.address ?? prev.address) as string | undefined,
        deliveryZone: (res.order.zone ?? prev.deliveryZone) as string | undefined,
        deliveryFee: (res.order.deliveryFee ?? prev.deliveryFee) as number | undefined,
        paymentMethod: (res.order.paymentMethod ?? prev.paymentMethod) as string | undefined,
        total: (res.order.total ?? prev.productPrice) as number | undefined,
      }));
    }
    if (res.aiFilledFields?.length) {
      setAiFilledFields(prev => [...new Set([...prev, ...res.aiFilledFields])]);
    }
  }

  const handleSend = useCallback(async (text: string) => {
    if (!selectedId) return;
    const now = fmtTime(new Date());
    setMessages(prev => [...prev, { id: Date.now().toString(), direction: "outgoing", text, time: now }]);
    setDraft(null);

    try { await sendMessage(selectedId, text); } catch { /* offline fallback */ }

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsTyping(false);

    setDraftLoading(true);
    try {
      const res = await generateDraft(selectedId);
      if (res.draft) setDraft(res.draft);
      applyOrderResult(res as Parameters<typeof applyOrderResult>[0]);
    } catch {
      setDraft("Başa düşdüm! Əlavə məlumat lazımdır.");
    } finally {
      setDraftLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleGenerateDraft = useCallback(async () => {
    if (!selectedId) return;
    setDraftLoading(true);
    try {
      const res = await generateDraft(selectedId);
      if (res.draft) setDraft(res.draft);
      applyOrderResult(res as Parameters<typeof applyOrderResult>[0]);
    } catch (e) {
      console.error("Draft error:", e);
      setDraft("Salam! Necə kömək edə bilərəm?");
    } finally {
      setDraftLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleConfirm = useCallback(async () => {
    if (!orderId) {
      setOrder(prev => ({ ...prev, status: "Təsdiqlənib" }));
      return;
    }
    try {
      await confirmOrder(orderId);
      setOrder(prev => ({ ...prev, status: "Təsdiqlənib" }));
      toast("Sifariş təsdiqləndi!");
    } catch {
      toast("Xəta baş verdi", "error");
    }
  }, [orderId, toast]);

  const handleReceiptScan = useCallback((data: ReceiptData) => {
    const merged: Partial<OrderData> = {};
    if (data.customerName) merged.customerName = data.customerName;
    if (data.phone)        merged.phone = data.phone;
    if (data.address)      merged.address = data.address;
    if (data.paymentMethod) merged.paymentMethod = data.paymentMethod;
    if (data.total)        merged.productPrice = data.total;

    setOrder(prev => ({ ...prev, ...merged }));

    const count = Object.keys(merged).length;
    if (count > 0) {
      toast(`Çekdən ${count} sahə oxundu!`);
    } else {
      toast("Çekdə məlumat tapılmadı", "error");
    }
  }, [toast]);

  const handleModeChange = useCallback(async (m: "semi" | "auto") => {
    setMode(m);
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, mode: m } : c));
    if (selectedId) {
      try { await setConversationMode(selectedId, m); } catch { /* offline */ }
    }
  }, [selectedId]);

  const handleTestMessage = useCallback(async () => {
    if (!selectedId) return;
    const text = TEST_MESSAGES[Math.floor(Math.random() * TEST_MESSAGES.length)];
    const now = fmtTime(new Date());

    try {
      await receiveIncomingMessage(selectedId, text);
    } catch { /* offline */ }

    setMessages(prev => [...prev, { id: Date.now().toString(), direction: "incoming", text, time: now }]);
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, unread: c.unread + 1, lastMessage: text, lastTime: now } : c));

    // Auto-generate AI draft
    await new Promise(r => setTimeout(r, 600));
    setDraftLoading(true);
    try {
      const res = await generateDraft(selectedId);
      if (res.draft) setDraft(res.draft);
      applyOrderResult(res as Parameters<typeof applyOrderResult>[0]);
    } catch { /* ignore */ } finally {
      setDraftLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selectedConvo = convos.find(c => c.id === selectedId);
  const filledCount = Object.values(order).filter(v => v !== undefined && v !== null && v !== "").length;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--muted)] text-[14px]">
        Yüklənir…
      </div>
    );
  }

  if (!convos.length) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--muted)] text-[14px]">
        Hələ heç bir söhbət yoxdur.
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list */}
      <ConvoList convos={convos} selectedId={selectedId} onSelect={handleSelect} />

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {selectedConvo && (
          <ChatHeader
            name={selectedConvo.customerName}
            handle="@müştəri"
            presence={selectedConvo.online ? "onlayn" : "son görülmə bir az əvvəl"}
            mode={mode}
            onModeChange={handleModeChange}
            orderCount={6}
            filledCount={filledCount}
            onShowOrder={() => setShowOrderPanel(p => !p)}
          />
        )}
        <ChatThread messages={messages} isTyping={isTyping} isAuto={mode === "auto"} />

        {/* Dev-only: simulate incoming message */}
        {process.env.NODE_ENV === "development" && selectedId && (
          <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-200 flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wide">Dev</span>
            <button
              onClick={handleTestMessage}
              className="text-[12px] text-amber-700 font-semibold hover:text-amber-900 transition-colors"
            >
              📨 Müştəri mesajı simulyasiya et
            </button>
          </div>
        )}

        <AiComposer
          draft={draft}
          mode={mode}
          onSend={handleSend}
          onGenerateDraft={handleGenerateDraft}
          loading={draftLoading}
        />
      </div>

      {/* Order panel */}
      {showOrderPanel && (
        <OrderPanel
          order={order}
          aiFilledFields={aiFilledFields}
          onConfirm={handleConfirm}
          onClose={() => setShowOrderPanel(false)}
          onReceiptScan={handleReceiptScan}
        />
      )}
    </div>
  );
}

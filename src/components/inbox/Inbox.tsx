"use client";
import { useState, useCallback, useEffect } from "react";
import { ConvoList, Convo } from "./ConvoList";
import { ChatThread, Message } from "./ChatThread";
import { ChatHeader } from "./ChatHeader";
import { AiComposer } from "./AiComposer";
import { OrderPanel, OrderData } from "./OrderPanel";
import { getConversations, generateDraft, sendMessage, setConversationMode } from "@/app/actions/chat";

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

export function Inbox() {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<OrderData>({});
  const [aiFilledFields, setAiFilledFields] = useState<string[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [mode, setMode] = useState<"semi" | "auto">("semi");
  const [isTyping, setIsTyping] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(true);
  const [loading, setLoading] = useState(true);

  // Raw DB data cache (keyed by conversation id)
  const [rawConvos, setRawConvos] = useState<Awaited<ReturnType<typeof getConversations>>>([]);

  // Load all conversations on mount
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
      if (mapped.length && !selectedId) {
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

    // Map messages
    const msgs: Message[] = raw.messages.map(m => ({
      id: m.id,
      direction: m.direction as "incoming" | "outgoing",
      text: m.text,
      time: fmtTime(m.createdAt),
      isAiGenerated: m.isAiGenerated,
    }));
    setMessages(msgs);

    // Map order from latest order in convo
    const latestOrder = raw.orders[0];
    if (latestOrder) {
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
      setOrder({});
      setAiFilledFields([]);
    }

    // Mark as read
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  }

  const handleSelect = (id: string) => selectConvo(id);

  const handleSend = useCallback(async (text: string) => {
    if (!selectedId) return;
    const now = fmtTime(new Date());
    setMessages(prev => [...prev, { id: Date.now().toString(), direction: "outgoing", text, time: now }]);
    setDraft(null);

    // Persist to DB
    try { await sendMessage(selectedId, text); } catch { /* offline fallback */ }

    // Simulate customer typing → reply → AI draft
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsTyping(false);

    // In production: incoming message arrives via webhook.
    // For local testing we skip fake reply; just auto-generate AI draft.
    setDraftLoading(true);
    try {
      const res = await generateDraft(selectedId);
      if (res.draft) setDraft(res.draft);
      if (res.order) {
        setOrder(prev => ({
          ...prev,
          productName: res.order.productName ?? prev.productName,
          variant: res.order.variant ?? prev.variant,
          qty: res.order.qty ?? prev.qty,
          customerName: res.order.customerName ?? prev.customerName,
          phone: res.order.phone ?? prev.phone,
          address: res.order.address ?? prev.address,
          deliveryZone: res.order.zone ?? prev.deliveryZone,
          deliveryFee: res.order.deliveryFee ?? prev.deliveryFee,
          paymentMethod: res.order.paymentMethod ?? prev.paymentMethod,
          total: res.order.total ?? prev.productPrice,
        }));
      }
      if (res.aiFilledFields?.length) {
        setAiFilledFields(prev => [...new Set([...prev, ...res.aiFilledFields])]);
      }
    } catch {
      setDraft("Başa düşdüm! Əlavə məlumat lazımdır.");
    } finally {
      setDraftLoading(false);
    }
  }, [selectedId]);

  const handleGenerateDraft = useCallback(async () => {
    if (!selectedId) return;
    setDraftLoading(true);
    try {
      const res = await generateDraft(selectedId);
      if (res.draft) setDraft(res.draft);
      if (res.order) {
        setOrder(prev => ({
          ...prev,
          productName: res.order.productName ?? prev.productName,
          variant: res.order.variant ?? prev.variant,
          customerName: res.order.customerName ?? prev.customerName,
          phone: res.order.phone ?? prev.phone,
          address: res.order.address ?? prev.address,
          deliveryZone: res.order.zone ?? prev.deliveryZone,
          deliveryFee: res.order.deliveryFee ?? prev.deliveryFee,
          paymentMethod: res.order.paymentMethod ?? prev.paymentMethod,
        }));
      }
      if (res.aiFilledFields?.length) {
        setAiFilledFields(prev => [...new Set([...prev, ...res.aiFilledFields])]);
      }
    } catch (e) {
      console.error("Draft error:", e);
      setDraft("Salam! Necə kömək edə bilərəm?");
    } finally {
      setDraftLoading(false);
    }
  }, [selectedId]);

  const handleConfirm = useCallback(async () => {
    setOrder(prev => ({ ...prev, status: "Təsdiqlənib" }));
  }, []);

  const handleModeChange = useCallback(async (m: "semi" | "auto") => {
    setMode(m);
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, mode: m } : c));
    if (selectedId) {
      try { await setConversationMode(selectedId, m); } catch { /* offline */ }
    }
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
        />
      )}
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { ConvoList, Convo } from "./ConvoList";
import { ChatThread, Message } from "./ChatThread";
import { ChatHeader } from "./ChatHeader";
import { AiComposer } from "./AiComposer";
import { OrderPanel, OrderData } from "./OrderPanel";
import { generateDraft, sendMessage, confirmOrder, setConversationMode } from "@/app/actions/chat";

const SEED_CONVOS: Convo[] = [
  { id: 1, customerName: "Nigar Əliyeva",    lastMessage: "Çantanın qara rəngi varmı?",         lastTime: "10:42", unread: 2, mode: "semi", online: true },
  { id: 2, customerName: "Rəşad Hüseynov",   lastMessage: "dostavka neçədir sumqayıta?",         lastTime: "10:15", unread: 1, mode: "auto", online: false },
  { id: 3, customerName: "Aytən Məmmədova",  lastMessage: "salam, bu üzük neçəyədi?",            lastTime: "09:58", unread: 0, mode: "semi", online: true },
  { id: 4, customerName: "Türkan Qasımova",  lastMessage: "Ölçüm S/M arasında, hansı gərək?",   lastTime: "09:30", unread: 3, mode: "semi", online: false },
  { id: 5, customerName: "Elvin Babayev",    lastMessage: "kart ilə ödəniş olur?",               lastTime: "08:55", unread: 0, mode: "semi", online: false },
];

const SEED_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, direction: "incoming", text: "Salam! Saytda gördüm o dəri çantanı. Qara rəngi var?",             time: "10:40" },
    { id: 2, direction: "outgoing", text: "Salam! Bəli, qara rəng var. 89 ₼, çatdırılma Bakıya 2 ₼.",        time: "10:41" },
    { id: 3, direction: "incoming", text: "Çantanın qara rəngi varmı?",                                        time: "10:42" },
  ],
  2: [
    { id: 1, direction: "incoming", text: "Salam, dostavka sumqayıta neçədir?",                                time: "10:10" },
    { id: 2, direction: "outgoing", text: "Salam! Sumqayıta çatdırılma 3 ₼, 1-2 gün ərzində.",                time: "10:12", isAiGenerated: true },
    { id: 3, direction: "incoming", text: "dostavka neçədir sumqayıta?",                                       time: "10:15" },
  ],
  3: [
    { id: 1, direction: "incoming", text: "salam, bu üzük neçəyədi?",                                         time: "09:58" },
  ],
  4: [
    { id: 1, direction: "incoming", text: "Salam! Bluzka almaq istəyirəm. Ölçüm S/M arasında, hansı gərək?", time: "09:28" },
    { id: 2, direction: "outgoing", text: "Salam! S/M arasında olsanız, M ölçüsünü tövsiyə edirik.",         time: "09:29" },
    { id: 3, direction: "incoming", text: "Ölçüm S/M arasında, hansı gərək?",                                  time: "09:30" },
  ],
  5: [
    { id: 1, direction: "incoming", text: "kart ilə ödəniş olur?",                                             time: "08:55" },
  ],
};

const SEED_ORDERS: Record<number, OrderData> = {
  1: { productName: "Dəri çanta", productEmoji: "👜", productTone: "amber", productPrice: 89, status: "Yeni" },
  2: { productName: "Dəri çanta", productEmoji: "👜", productTone: "amber", productPrice: 89, customerName: "Rəşad Hüseynov", deliveryZone: "Sumqayıt", deliveryFee: 3, status: "Yeni" },
  3: {},
  4: { productName: "Bluzka", productEmoji: "👗", productTone: "rose", productPrice: 45, variant: "M", status: "Yeni" },
  5: {},
};

const SEED_AI_FILLED: Record<number, string[]> = {
  1: [], 2: ["customerName", "deliveryZone", "deliveryFee"], 3: [], 4: ["variant"], 5: [],
};

export function Inbox() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [convos, setConvos] = useState<Convo[]>(SEED_CONVOS);
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(SEED_MESSAGES);
  const [allOrders, setAllOrders] = useState<Record<number, OrderData>>(SEED_ORDERS);
  const [allAiFilled, setAllAiFilled] = useState<Record<number, string[]>>(SEED_AI_FILLED);
  const [allDrafts, setAllDrafts] = useState<Record<number, string | null>>({});
  const [allModes, setAllModes] = useState<Record<number, "semi" | "auto">>({});
  const [isTyping, setIsTyping] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(true);

  const convo = convos.find(c => c.id === selectedId);
  const messages = allMessages[selectedId] ?? [];
  const order = allOrders[selectedId] ?? {};
  const aiFilledFields = allAiFilled[selectedId] ?? [];
  const draft = allDrafts[selectedId] ?? null;
  const mode = allModes[selectedId] ?? convo?.mode ?? "semi";

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = useCallback(async (text: string) => {
    const now = new Date().toLocaleTimeString("az", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), direction: "outgoing", text, time: now };
    setAllMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), newMsg] }));
    setAllDrafts(prev => ({ ...prev, [selectedId]: null }));
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, lastMessage: text, lastTime: now } : c));

    // Simulate customer reply + order fill after send
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 2200));
    setIsTyping(false);

    const replies: Record<number, string> = {
      1: "Bəli, qara istəyirəm. Ünvan: Bakı, Nərimanov 45.",
      2: "ok, hazırəm. Əlaqə nömrəm: 055 234 56 78.",
      3: "89 ₼ manatdı, qara rəngdə birini istəyirəm.",
      4: "M götürürəm. Ünvan göndərim?",
      5: "kart olar, M10 da qəbul edirsiniz?",
    };
    const replyText = replies[selectedId] ?? "Sağ olun, gözləyirəm.";
    const replyTime = new Date().toLocaleTimeString("az", { hour: "2-digit", minute: "2-digit" });
    const replyMsg: Message = { id: Date.now() + 1, direction: "incoming", text: replyText, time: replyTime };
    setAllMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), replyMsg] }));

    // Trigger AI draft generation
    setDraftLoading(true);
    try {
      const res = await generateDraft(String(selectedId));
      if (res.draft) {
        setAllDrafts(prev => ({ ...prev, [selectedId]: res.draft }));
        if (res.aiFilledFields?.length) {
          setAllAiFilled(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), ...res.aiFilledFields] }));
        }
      }
    } catch {
      // fallback draft when DB not available (numeric seed IDs ≠ real UUIDs)
      setAllDrafts(prev => ({ ...prev, [selectedId]: "Başa düşdüm! Sifarişinizi hazırlayıram." }));
    } finally {
      setDraftLoading(false);
    }
  }, [selectedId]);

  const handleGenerateDraft = useCallback(async () => {
    setDraftLoading(true);
    try {
      const res = await generateDraft(String(selectedId));
      if (res.draft) setAllDrafts(prev => ({ ...prev, [selectedId]: res.draft }));
    } catch {
      setAllDrafts(prev => ({ ...prev, [selectedId]: "Salam! Necə kömək edə bilərəm?" }));
    } finally {
      setDraftLoading(false);
    }
  }, [selectedId]);

  const handleConfirm = useCallback(async () => {
    const currentOrder = allOrders[selectedId];
    if (currentOrder?.status === "Yeni") {
      setAllOrders(prev => ({ ...prev, [selectedId]: { ...prev[selectedId], status: "Təsdiqlənib" } }));
    }
  }, [selectedId, allOrders]);

  const handleModeChange = useCallback((m: "semi" | "auto") => {
    setAllModes(prev => ({ ...prev, [selectedId]: m }));
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, mode: m } : c));
  }, [selectedId]);

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list */}
      <ConvoList convos={convos} selectedId={selectedId} onSelect={handleSelect} />

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {convo && (
          <ChatHeader
            name={convo.customerName}
            handle="@müştəri"
            presence={convo.online ? "onlayn" : "son görülmə bir az əvvəl"}
            mode={mode}
            onModeChange={handleModeChange}
            orderCount={6}
            filledCount={Object.values(order).filter(Boolean).length}
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

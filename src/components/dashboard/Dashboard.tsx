"use client";
import { IconChat, IconClock, IconBag, IconSparkle, IconChevronR, IconTrend } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Thumb } from "@/components/ui/Thumb";
import { Button } from "@/components/ui/Button";

type Screen = "dashboard" | "inbox" | "orders" | "catalog" | "settings";

interface DashboardProps { onNav: (s: Screen) => void; }

const stats = [
  { label: "Yeni mesaj",      value: "14",      delta: "+4 dünənə görə",  up: true,  icon: IconChat,    tint: "#ECF5EF", iconColor: "#2E7D5B" },
  { label: "Cavablanmamış",   value: "3",       delta: "tez cavabla",      up: false, icon: IconClock,   tint: "#FBEFD9", iconColor: "#C77D1A" },
  { label: "Yeni sifariş",    value: "6",       delta: "+2 bu gün",        up: true,  icon: IconBag,     tint: "#E4ECF3", iconColor: "#4F6D8C" },
  { label: "Qənaət edilən vaxt", value: "2.5 saat", delta: "AI sayəsində", up: true,  icon: IconSparkle, tint: "#ECF5EF", iconColor: "#2E7D5B" },
];

const recentOrders = [
  { id: 1, emoji: "👜", tone: "amber", product: "Dəri çanta",      customer: "Nigar Ə.", variant: "Qara", total: 91, status: "Yeni" as const },
  { id: 2, emoji: "💍", tone: "purple", product: "Gümüş üzük",     customer: "Aytən M.", variant: "17mm", total: 85, status: "Təsdiqlənib" as const },
  { id: 3, emoji: "👗", tone: "rose",  product: "Bluzka",           customer: "Türkan Q.", variant: "M",  total: 47, status: "Göndərilib" as const },
  { id: 4, emoji: "🕶️", tone: "blue",  product: "Günəş eynəyi",    customer: "Elvin B.", variant: "—",   total: 34, status: "Yeni" as const },
];

const attentionConvos = [
  { id: 1, name: "Nigar Əliyeva",    snippet: "Çantanın qara rəngi varmı?",         unread: 2 },
  { id: 2, name: "Türkan Qasımova",  snippet: "Ölçüm S/M arasında, hansı gərək?",  unread: 3 },
  { id: 3, name: "Rəşad Hüseynov",  snippet: "dostavka neçədir sumqayıta?",         unread: 1 },
];

export function Dashboard({ onNav }: DashboardProps) {
  return (
    <div className="px-6 py-6 space-y-6 max-w-[1100px]">
      {/* Hero banner */}
      <div className="rounded-[var(--r-lg)] border border-[var(--green-200)] p-6"
        style={{ background: "linear-gradient(120deg,#ECF5EF,#fff 70%)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--green-200)] text-[var(--green-600)] text-[12px] font-semibold mb-3 shadow-[var(--sh-1)]">
              <IconSparkle size={13} /> AI köməkçi aktiv
            </div>
            <h2 className="text-[24px] font-extrabold text-[var(--ink)] tracking-[-0.02em] mb-1">Sabahınız xeyir, Aysun 👋</h2>
            <p className="text-[14px] text-[var(--ink-2)]">
              Bu gün <strong>14 mesaj</strong> gəlib, AI-ın köməyi ilə <strong>71%-i</strong> dərhal cavablanıb.
            </p>
          </div>
          <Button onClick={() => onNav("inbox")} className="shrink-0">
            Söhbətlərə bax
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, delta, up, icon: Icon, tint, iconColor }) => (
          <div key={label} className="bg-[var(--surface)] rounded-[var(--r-lg)] p-4 shadow-[var(--sh-1)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-[var(--r-sm)] flex items-center justify-center shrink-0" style={{ background: tint }}>
                <span style={{ color: iconColor }}><Icon size={18} /></span>
              </div>
            </div>
            <div className="text-[30px] font-extrabold text-[var(--ink)] tracking-[-0.03em] leading-none mb-1">{value}</div>
            <div className="text-[13px] text-[var(--muted)] mb-1">{label}</div>
            <div className={`text-[11.5px] font-bold flex items-center gap-1 ${up ? "text-[var(--green-600)]" : "text-[var(--new)]"}`}>
              {up ? <IconTrend size={12} /> : <IconClock size={12} />} {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Recent orders */}
        <div className="bg-[var(--surface)] rounded-[var(--r-lg)] border border-[var(--border)] shadow-[var(--sh-1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
            <h3 className="font-bold text-[15px] text-[var(--ink)]">Son sifarişlər</h3>
            <button onClick={() => onNav("orders")} className="text-[12.5px] text-[var(--green-600)] font-semibold hover:underline flex items-center gap-0.5">
              Hamısı <IconChevronR size={14} />
            </button>
          </div>
          <div>
            {recentOrders.map(o => (
              <button key={o.id} onClick={() => onNav("orders")}
                className="w-full flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors text-left">
                <Thumb emoji={o.emoji} tone={o.tone} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13.5px] text-[var(--ink)] truncate">{o.product}</div>
                  <div className="text-[12px] text-[var(--muted)] truncate">{o.customer} · {o.variant}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[13.5px] text-[var(--ink)]">{o.total} ₼</div>
                  <StatusBadge status={o.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Attention */}
          <div className="bg-[var(--surface)] rounded-[var(--r-lg)] border border-[var(--border)] shadow-[var(--sh-1)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
              <h3 className="font-bold text-[15px] text-[var(--ink)]">Diqqət tələb edir</h3>
              <span className="w-6 h-6 rounded-full bg-[var(--new-bg)] text-[var(--new)] text-[11px] font-bold flex items-center justify-center">
                {attentionConvos.reduce((s, c) => s + c.unread, 0)}
              </span>
            </div>
            <div>
              {attentionConvos.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] last:border-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-700)] font-bold text-[13px] shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-[var(--ink)] truncate">{c.name}</div>
                    <div className="text-[12px] text-[var(--muted)] truncate">{c.snippet}</div>
                  </div>
                  <Button size="sm" variant="soft" onClick={() => onNav("inbox")}>Cavabla</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Today's sales */}
          <div className="rounded-[var(--r-lg)] p-5 text-white" style={{ background: "var(--green-500)" }}>
            <div className="text-[12.5px] font-semibold opacity-80 mb-1">Bu günün satışı</div>
            <div className="text-[36px] font-extrabold tracking-[-0.03em] leading-none mb-1">312 ₼</div>
            <div className="text-[12.5px] opacity-75">6 sifariş · orta çek 52 ₼</div>
          </div>
        </div>
      </div>
    </div>
  );
}

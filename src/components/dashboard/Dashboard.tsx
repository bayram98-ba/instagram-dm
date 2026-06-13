"use client";
import { useEffect, useState } from "react";
import { IconChat, IconClock, IconBag, IconSparkle, IconChevronR, IconTrend } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Thumb } from "@/components/ui/Thumb";
import { Button } from "@/components/ui/Button";
import { getDashboardData } from "@/app/actions/chat";

type Screen = "dashboard" | "inbox" | "orders" | "catalog" | "settings";

interface DashboardProps { onNav: (s: Screen) => void; }

const TONE_GRADIENTS: Record<string, string> = {
  green:  "linear-gradient(135deg,#dceee3,#ecf5ef)",
  amber:  "linear-gradient(135deg,#fbefd9,#f3ecdd)",
  rose:   "linear-gradient(135deg,#f7e2dc,#fdf0ee)",
  blue:   "linear-gradient(135deg,#e4ecf3,#eef2f8)",
  purple: "linear-gradient(135deg,#ede8f5,#f3f0fa)",
};

function hexToTone(hex: string) {
  const map: Record<string, string> = {
    "#dceee3":"green","#ecf5ef":"green","#2e7d5b":"green","#4e9a77":"green",
    "#fbefd9":"amber","#f3ecdd":"amber","#c77d1a":"amber",
    "#f7e2dc":"rose", "#fdf0ee":"rose", "#bf4530":"rose",
    "#e4ecf3":"blue", "#eef2f8":"blue", "#4f6d8c":"blue",
    "#ede8f5":"purple","#f3f0fa":"purple",
  };
  return map[hex?.toLowerCase?.()] ?? "green";
}

type DashData = Awaited<ReturnType<typeof getDashboardData>>;

export function Dashboard({ onNav }: DashboardProps) {
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData).catch(() => {});
  }, []);

  const stats = [
    { label: "Yeni mesaj",         value: String(data?.totalMessages ?? "—"),  delta: "bu gün gəldi",         up: true,  icon: IconChat,    tint: "#ECF5EF", iconColor: "#2E7D5B" },
    { label: "Cavablanmamış",      value: String(data?.unread ?? "—"),          delta: "tez cavabla",           up: false, icon: IconClock,   tint: "#FBEFD9", iconColor: "#C77D1A" },
    { label: "Yeni sifariş",       value: String(data?.newOrders ?? "—"),       delta: "bu gün",               up: true,  icon: IconBag,     tint: "#E4ECF3", iconColor: "#4F6D8C" },
    { label: "Bu günün satışı",    value: `${data?.todayTotal ?? "—"} ₼`,       delta: "AI sayəsində",         up: true,  icon: IconSparkle, tint: "#ECF5EF", iconColor: "#2E7D5B" },
  ];

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
              Bu gün{" "}
              <strong>{data?.totalMessages ?? "…"} mesaj</strong> gəlib,
              AI-ın köməyi ilə{" "}
              <strong>{data ? Math.round(((data.totalMessages - data.unread) / Math.max(data.totalMessages, 1)) * 100) : "…"}%-i</strong> dərhal cavablanıb.
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
          {!data?.recentOrders?.length ? (
            <div className="py-8 text-center text-[13px] text-[var(--muted)]">Hələ sifariş yoxdur</div>
          ) : (
            <div>
              {data.recentOrders.map(o => {
                const tone = hexToTone(o.product?.tone ?? "");
                return (
                  <button key={o.id} onClick={() => onNav("orders")}
                    className="w-full flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors text-left">
                    <Thumb emoji={o.product?.emoji ?? "📦"} tone={tone} size={42} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13.5px] text-[var(--ink)] truncate">{o.productName ?? o.product?.name ?? "Məhsul"}</div>
                      <div className="text-[12px] text-[var(--muted)] truncate">
                        {o.customerName ?? "Müştəri"} · {o.variant ?? "—"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-[13.5px] text-[var(--ink)]">{o.total} ₼</div>
                      <StatusBadge status={o.status as "Yeni" | "Təsdiqlənib" | "Göndərilib"} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Attention */}
          <div className="bg-[var(--surface)] rounded-[var(--r-lg)] border border-[var(--border)] shadow-[var(--sh-1)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
              <h3 className="font-bold text-[15px] text-[var(--ink)]">Diqqət tələb edir</h3>
              <span className="w-6 h-6 rounded-full bg-[var(--new-bg)] text-[var(--new)] text-[11px] font-bold flex items-center justify-center">
                {data?.attentionConvos?.reduce((s, c) => s + c.unreadCount, 0) ?? 0}
              </span>
            </div>
            {!data?.attentionConvos?.length ? (
              <div className="py-6 text-center text-[13px] text-[var(--muted)]">Oxunmamış söhbət yoxdur 🎉</div>
            ) : (
              <div>
                {data.attentionConvos.map(c => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] last:border-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-700)] font-bold text-[13px] shrink-0">
                      {(c.customer?.name ?? "M").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-[var(--ink)] truncate">{c.customer?.name ?? "Müştəri"}</div>
                      <div className="text-[12px] text-[var(--muted)] truncate">
                        {c.messages[0]?.text ?? "Yeni mesaj"}
                      </div>
                    </div>
                    <Button size="sm" variant="soft" onClick={() => onNav("inbox")}>Cavabla</Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's sales */}
          <div className="rounded-[var(--r-lg)] p-5 text-white" style={{ background: "var(--green-500)" }}>
            <div className="text-[12.5px] font-semibold opacity-80 mb-1">Bu günün satışı</div>
            <div className="text-[36px] font-extrabold tracking-[-0.03em] leading-none mb-1">
              {data?.todayTotal ?? "—"} ₼
            </div>
            <div className="text-[12.5px] opacity-75">
              {data?.newOrders ?? "—"} sifariş
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

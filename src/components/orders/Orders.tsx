"use client";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Thumb } from "@/components/ui/Thumb";
import { Button } from "@/components/ui/Button";
import { IconDownload, IconChevronR, IconX, IconPhone, IconPin, IconTruck, IconCard } from "@/components/ui/Icon";

type Status = "Yeni" | "Təsdiqlənib" | "Göndərilib";

interface Order {
  id: number;
  emoji: string;
  tone: string;
  product: string;
  variant: string;
  qty: number;
  customer: string;
  phone: string;
  address: string;
  delivery: string;
  deliveryFee: number;
  payment: string;
  total: number;
  status: Status;
  time: string;
}

const ORDERS: Order[] = [
  { id: 1, emoji: "👜", tone: "amber",  product: "Dəri çanta",    variant: "Qara",  qty: 1, customer: "Nigar Əliyeva",    phone: "050 123 45 67", address: "Bakı, Nərimanov 45",    delivery: "Bakı",      deliveryFee: 2,  payment: "Nağd",        total: 91,  status: "Yeni",        time: "Bu gün 10:42" },
  { id: 2, emoji: "💍", tone: "purple", product: "Gümüş üzük",    variant: "17mm",  qty: 1, customer: "Aytən Məmmədova", phone: "055 987 65 43", address: "Sumqayıt, Nizami 12",   delivery: "Sumqayıt",  deliveryFee: 3,  payment: "Bank kartı",  total: 88,  status: "Təsdiqlənib", time: "Bu gün 09:58" },
  { id: 3, emoji: "👗", tone: "rose",   product: "Bluzka",         variant: "M",     qty: 1, customer: "Türkan Qasımova", phone: "070 456 78 90", address: "Bakı, Xətai 7",         delivery: "Bakı",      deliveryFee: 2,  payment: "M10",         total: 47,  status: "Göndərilib",  time: "Dünən 15:30" },
  { id: 4, emoji: "🕶️", tone: "blue",  product: "Günəş eynəyi",  variant: "—",     qty: 1, customer: "Elvin Babayev",   phone: "051 321 09 87", address: "Bakı, Yasamal 3",       delivery: "Bakı",      deliveryFee: 2,  payment: "Nağd",        total: 36,  status: "Yeni",        time: "Dünən 12:10" },
  { id: 5, emoji: "👛", tone: "amber",  product: "Mini çanta",     variant: "Beige", qty: 2, customer: "Rəşad Hüseynov",  phone: "055 234 56 78", address: "Sumqayıt, Əliheydər 8", delivery: "Sumqayıt",  deliveryFee: 3,  payment: "Bank kartı",  total: 119, status: "Təsdiqlənib", time: "Dünən 09:00" },
  { id: 6, emoji: "📿", tone: "green",  product: "Bilərzik",       variant: "Qızıl", qty: 1, customer: "Lalə Əhmədova",   phone: "070 111 22 33", address: "Gəncə, İstiqlal 22",    delivery: "Gəncə",     deliveryFee: 5,  payment: "Nağd",        total: 65,  status: "Göndərilib",  time: "2 gün əvvəl" },
];

const FILTER_TABS: { label: string; value: "all" | Status }[] = [
  { label: "Hamısı", value: "all" },
  { label: "Yeni", value: "Yeni" },
  { label: "Təsdiqlənib", value: "Təsdiqlənib" },
  { label: "Göndərilib", value: "Göndərilib" },
];

function OrderDrawer({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (id: number, s: Status) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end" style={{ background: "rgba(33,30,24,.35)" }} onClick={onClose}>
      <div className="h-full w-full max-w-[400px] bg-[var(--surface)] flex flex-col animate-slide-in shadow-[var(--sh-3)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <div className="font-bold text-[15px] text-[var(--ink)]">Sifariş #{order.id}</div>
            <div className="text-[12px] text-[var(--muted)]">{order.time}</div>
          </div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors"><IconX size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[var(--surface-2)] rounded-[var(--r-sm)]">
            <Thumb emoji={order.emoji} tone={order.tone} size={50} radius={12} />
            <div>
              <div className="font-bold text-[14px]">{order.product}</div>
              <div className="text-[12.5px] text-[var(--muted)]">{order.variant} · {order.qty} ədəd</div>
              <div className="text-[14px] font-bold text-[var(--green-600)]">{order.total} ₼</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { icon: IconPhone, label: "Müştəri",    value: `${order.customer} · ${order.phone}` },
              { icon: IconPin,   label: "Ünvan",       value: order.address },
              { icon: IconTruck, label: "Çatdırılma",  value: `${order.delivery} · ${order.deliveryFee} ₼` },
              { icon: IconCard,  label: "Ödəniş",     value: order.payment },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 text-[13.5px]">
                <Icon size={15} className="text-[var(--muted)] shrink-0" />
                <span className="text-[var(--muted)] w-[80px] shrink-0">{label}</span>
                <span className="text-[var(--ink)] font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-[.05em] mb-2">Status</div>
            <div className="flex gap-2">
              {(["Yeni", "Təsdiqlənib", "Göndərilib"] as Status[]).map(s => (
                <button key={s} onClick={() => onStatusChange(order.id, s)}
                  className={`flex-1 py-2 rounded-[var(--r-sm)] text-[12.5px] font-semibold border transition-colors
                    ${order.status === s ? "border-[var(--green-400)] bg-[var(--green-050)] text-[var(--green-700)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green-200)]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Bağla</Button>
          <Button className="flex-1" onClick={onClose}>Yadda saxla</Button>
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = { all: orders.length, Yeni: orders.filter(o => o.status === "Yeni").length, Təsdiqlənib: orders.filter(o => o.status === "Təsdiqlənib").length, Göndərilib: orders.filter(o => o.status === "Göndərilib").length };

  const handleStatusChange = (id: number, status: Status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setSelectedOrder(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="px-6 py-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--r-sm)]">
          {FILTER_TABS.map(({ label, value }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-[var(--r-xs)] text-[13px] font-semibold transition-colors
                ${filter === value ? "bg-[var(--surface)] text-[var(--green-700)] shadow-[var(--sh-1)]" : "text-[var(--muted)] hover:text-[var(--ink-2)]"}`}>
              {label}
              <span className="ml-1.5 text-[11px] opacity-70">{counts[value]}</span>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <IconDownload size={14} /> Excel / CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] rounded-[var(--r-lg)] border border-[var(--border)] shadow-[var(--sh-1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Sifariş", "Müştəri", "Çatdırılma", "Ödəniş", "Məbləğ", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11.5px] font-bold text-[var(--muted)] uppercase tracking-[.05em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Thumb emoji={o.emoji} tone={o.tone} size={36} radius={8} />
                      <div>
                        <div className="font-semibold text-[13.5px] text-[var(--ink)]">{o.product}</div>
                        <div className="text-[11.5px] text-[var(--muted)]">{o.variant} · #{o.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13.5px] text-[var(--ink)] font-medium">{o.customer}</div>
                    <div className="text-[12px] text-[var(--muted)]">{o.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--ink-2)] max-w-[140px]">
                    <div className="truncate">{o.address}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--ink-2)]">{o.payment}</td>
                  <td className="px-4 py-3 font-bold text-[13.5px] text-[var(--ink)]">{o.total} ₼</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-[var(--muted)]"><IconChevronR size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

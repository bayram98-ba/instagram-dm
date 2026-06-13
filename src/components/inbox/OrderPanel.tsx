"use client";
import { useRef, useState } from "react";
import { AiTag } from "@/components/ui/AiTag";
import { Thumb } from "@/components/ui/Thumb";
import { Button } from "@/components/ui/Button";
import { IconBag, IconSparkle, IconX, IconImage } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { readReceiptImage } from "@/app/actions/chat";
import type { ReceiptData } from "@/lib/ai";

export interface OrderData {
  productName?: string;
  productEmoji?: string;
  productTone?: string;
  productPrice?: number;
  variant?: string;
  qty?: number;
  customerName?: string;
  phone?: string;
  address?: string;
  deliveryZone?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  status?: "Yeni" | "Təsdiqlənib" | "Göndərilib";
}

interface OrderPanelProps {
  order: OrderData;
  aiFilledFields: string[];
  onConfirm: () => void;
  onClose?: () => void;
  onReceiptScan?: (data: ReceiptData) => void;
  className?: string;
}

function Field({ label, value, aiKey, aiFields }: { label: string; value?: string | number; aiKey: string; aiFields: string[] }) {
  const isFilled = value !== undefined && value !== null && value !== "";
  const isAi = aiFields.includes(aiKey);
  return (
    <div className="flex items-start gap-2 py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-[12px] text-[var(--muted)] w-[92px] shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        {isFilled ? (
          <>
            <span className="text-[13.5px] text-[var(--ink)] font-semibold">{value}</span>
            {isAi && <AiTag />}
          </>
        ) : (
          <span className="text-[13px] text-[var(--muted-2)] italic">gözlənilir…</span>
        )}
      </div>
    </div>
  );
}

function countFilled(order: OrderData): number {
  const fields = [order.productName, order.customerName, order.phone, order.address, order.deliveryZone, order.paymentMethod];
  return fields.filter(v => v !== undefined && v !== null && v !== "").length;
}

// ── Receipt scanner ────────────────────────────────────────────────────────────
function ReceiptScanner({ onScan }: { onScan: (data: ReceiptData) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const [meta, base64] = dataUrl.split(",");
      const mimeType = (meta.match(/:(.*?);/)?.[1] ?? "image/jpeg") as
        | "image/jpeg" | "image/png" | "image/gif" | "image/webp";

      try {
        const result = await readReceiptImage(base64, mimeType);
        if (result) onScan(result);
      } finally {
        setScanning(false);
        // reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden" onChange={handleFile} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={scanning}
        title="Ödəniş çekini şəkil kimi yüklə, AI məlumatları oxusun"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border)] text-[12px] font-semibold text-[var(--muted)] hover:text-[var(--green-700)] hover:border-[var(--green-300)] transition-colors disabled:opacity-50"
      >
        <IconImage size={13} />
        {scanning ? "Oxunur…" : "Çek"}
      </button>
    </>
  );
}

// ── Main OrderPanel ────────────────────────────────────────────────────────────
export function OrderPanel({ order, aiFilledFields, onConfirm, onClose, onReceiptScan, className = "" }: OrderPanelProps) {
  const filled = countFilled(order);
  const total = (order.productPrice ?? 0) * (order.qty ?? 1) + (order.deliveryFee ?? 0);

  return (
    <div className={`w-[332px] shrink-0 bg-[var(--surface)] border-l border-[var(--border)] flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <IconBag size={16} className="text-[var(--ink-2)]" />
          <span className="font-bold text-[14px] text-[var(--ink)]">Sifariş kartı</span>
        </div>
        <div className="flex items-center gap-2">
          {onReceiptScan && <ReceiptScanner onScan={onReceiptScan} />}
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--green-050)] text-[var(--green-600)] text-[11px] font-bold border border-[var(--green-200)]">
            <IconSparkle size={11} /> {filled}/6 sahə
          </span>
          {onClose && (
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              <IconX size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Product summary */}
        {order.productName && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Thumb emoji={order.productEmoji ?? "📦"} tone={order.productTone ?? "green"} size={50} radius={12} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-[var(--ink)] truncate">{order.productName}</div>
              {order.productPrice && (
                <div className="text-[13px] text-[var(--green-600)] font-semibold">{order.productPrice} ₼ / ədəd</div>
              )}
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="px-4 py-1">
          <Field label="Variant"    value={order.variant}       aiKey="variant"      aiFields={aiFilledFields} />
          <Field label="Miqdar"     value={order.qty}           aiKey="qty"          aiFields={aiFilledFields} />
          <Field label="Müştəri"    value={order.customerName}  aiKey="customerName" aiFields={aiFilledFields} />
          <Field label="Telefon"    value={order.phone}         aiKey="phone"        aiFields={aiFilledFields} />
          <Field label="Ünvan"      value={order.address}       aiKey="address"      aiFields={aiFilledFields} />
          <Field label="Çatdırılma" value={order.deliveryZone ? `${order.deliveryZone} · ${order.deliveryFee ?? 0}₼` : undefined}
                                                                aiKey="deliveryZone" aiFields={aiFilledFields} />
          <Field label="Ödəniş"    value={order.paymentMethod} aiKey="paymentMethod" aiFields={aiFilledFields} />
        </div>

        {/* Total */}
        {total > 0 && (
          <div className="px-4 py-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--ink-2)]">Cəmi</span>
              <span className="text-[20px] font-extrabold text-[var(--green-600)] tracking-[-0.02em]">{total} ₼</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border)] shrink-0">
        {order.status === "Yeni" || !order.status ? (
          <Button className="w-full gap-1.5 justify-center" onClick={onConfirm} disabled={filled < 4}>
            Sifarişi təsdiqlə
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2">
            <StatusBadge status={order.status} />
          </div>
        )}
        {filled < 4 && !order.status && (
          <p className="text-center text-[11.5px] text-[var(--muted)] mt-1.5">Təsdiqləmək üçün ən azı 4 sahə doldurulmalıdır</p>
        )}
      </div>
    </div>
  );
}

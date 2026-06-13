"use client";
import { IconInstagram, IconBag } from "@/components/ui/Icon";
import { ModeToggle } from "./ModeToggle";

interface ChatHeaderProps {
  name: string;
  handle: string;
  presence: string;
  mode: "semi" | "auto";
  onModeChange: (m: "semi" | "auto") => void;
  orderCount: number;
  filledCount: number;
  onShowOrder?: () => void;
}

export function ChatHeader({ name, handle, presence, mode, onModeChange, orderCount, filledCount, onShowOrder }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-600)] font-bold text-[15px]">
          {name.charAt(0)}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)" }}>
          <IconInstagram size={9} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[14px] text-[var(--ink)] leading-tight">{name}</div>
        <div className="text-[12px] text-[var(--muted)]">{handle} · {presence}</div>
      </div>

      {/* Order count (mobile / focus) */}
      <button onClick={onShowOrder}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--green-200)] transition-colors text-[12px] font-semibold text-[var(--ink-2)]">
        <IconBag size={14} />
        {filledCount}/6
      </button>

      <ModeToggle mode={mode} onChange={onModeChange} />
    </div>
  );
}

"use client";

interface ModeToggleProps {
  mode: "semi" | "auto";
  onChange: (m: "semi" | "auto") => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const isAuto = mode === "auto";
  return (
    <button
      onClick={() => onChange(isAuto ? "semi" : "auto")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--green-200)] transition-colors select-none"
    >
      <span className="text-[12px] font-semibold text-[var(--ink-2)] whitespace-nowrap">
        {isAuto ? "Avtomatik" : "Yarı-avtomat"}
      </span>
      <div className={`relative w-[38px] h-[22px] rounded-full transition-colors ${isAuto ? "bg-[var(--green-500)]" : "bg-[var(--border-2)]"}`}>
        <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${isAuto ? "left-[19px]" : "left-[3px]"}`} />
      </div>
    </button>
  );
}

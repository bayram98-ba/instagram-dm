"use client";
import { IconSearch, IconSparkle } from "@/components/ui/Icon";

export interface Convo {
  id: number;
  customerName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  mode: "semi" | "auto";
  online: boolean;
}

interface ConvoListProps {
  convos: Convo[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ConvoList({ convos, selectedId, onSelect }: ConvoListProps) {
  return (
    <div className="w-[248px] shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Search */}
      <div className="px-3 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
          <IconSearch size={14} className="text-[var(--muted-2)] shrink-0" />
          <input placeholder="Axtarış..." className="flex-1 text-[13px] bg-transparent outline-none text-[var(--ink)] placeholder:text-[var(--muted-2)]" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {convos.map(c => {
          const isSelected = c.id === selectedId;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)]
                ${isSelected ? "bg-[var(--green-050)]" : ""}`}>
              {/* Avatar + online */}
              <div className="relative shrink-0">
                <div className="w-[42px] h-[42px] rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-600)] font-bold text-[15px]">
                  {c.customerName.charAt(0)}
                </div>
                {c.online && (
                  <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[13.5px] font-semibold text-[var(--ink)] truncate ${isSelected ? "text-[var(--green-700)]" : ""}`}>
                    {c.customerName}
                  </span>
                  <span className="text-[11px] text-[var(--muted-2)] shrink-0">{c.lastTime}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {c.mode === "auto" && <IconSparkle size={12} className="text-[var(--green-400)] shrink-0" />}
                  <span className="text-[12px] text-[var(--muted)] truncate">{c.lastMessage}</span>
                  {c.unread > 0 && (
                    <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-[var(--green-500)] text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

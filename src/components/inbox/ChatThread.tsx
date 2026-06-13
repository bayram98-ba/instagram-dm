"use client";
import { useEffect, useRef } from "react";
import { IconSparkle } from "@/components/ui/Icon";

export interface Message {
  id: number;
  direction: "incoming" | "outgoing";
  text: string;
  time: string;
  isAiGenerated?: boolean;
}

interface ChatThreadProps {
  messages: Message[];
  isTyping?: boolean;
  isAuto?: boolean;
}

export function ChatThread({ messages, isTyping, isAuto }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--cream-bg)] px-4 py-4 space-y-2">
      {/* Auto mode notice */}
      {isAuto && (
        <div className="text-center text-[12px] text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--r-pill)] px-4 py-2 mx-auto max-w-[380px]">
          🤖 Bu söhbətə avtomatik köməkçi cavab verir · sahib istənilən vaxt müdaxilə edə bilər
        </div>
      )}

      {/* Day separator */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[11px] text-[var(--muted-2)] font-semibold">Bu gün</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {messages.map(m => {
        const isIn = m.direction === "incoming";
        const isAiGen = m.isAiGenerated;

        if (isAiGen) {
          return (
            <div key={m.id} className="flex flex-col items-end gap-1 max-w-[76%] ml-auto">
              <div className="flex items-center gap-1 text-[11px] text-[var(--green-500)]">
                <IconSparkle size={11} /> <span>AI avtomatik cavab</span>
              </div>
              <div className="bg-[var(--green-050)] border border-dashed border-[var(--green-400)] rounded-[var(--r-md)] rounded-br-[7px] px-3.5 py-2.5 text-[14.5px] text-[var(--ink)] leading-relaxed">
                {m.text}
              </div>
              <span className="text-[10.5px] text-[var(--muted-2)]">{m.time}</span>
            </div>
          );
        }

        if (!isIn) {
          return (
            <div key={m.id} className="flex flex-col items-end gap-1 max-w-[76%] ml-auto">
              <div className="bg-[var(--green-500)] rounded-[var(--r-md)] rounded-br-[7px] px-3.5 py-2.5 text-[14.5px] text-white leading-relaxed">
                {m.text}
              </div>
              <span className="text-[10.5px] text-[var(--muted-2)]">{m.time}</span>
            </div>
          );
        }

        return (
          <div key={m.id} className="flex flex-col items-start gap-1 max-w-[76%]">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-md)] rounded-bl-[7px] px-3.5 py-2.5 text-[14.5px] text-[var(--ink)] leading-relaxed shadow-[var(--sh-1)]">
              {m.text}
            </div>
            <span className="text-[10.5px] text-[var(--muted-2)]">{m.time}</span>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start gap-1 max-w-[76%]">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-md)] rounded-bl-[7px] px-4 py-3 shadow-[var(--sh-1)]">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-[var(--muted-2)]"
                  style={{ animation: `typeBounce 1.2s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

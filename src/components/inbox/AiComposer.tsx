"use client";
import { useState } from "react";
import { IconSparkle, IconSend, IconEdit } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface AiComposerProps {
  draft: string | null;
  mode: "semi" | "auto";
  onSend: (text: string) => void;
  onGenerateDraft: () => void;
  loading?: boolean;
}

export function AiComposer({ draft, mode, onSend, onGenerateDraft, loading }: AiComposerProps) {
  const [editMode, setEditMode] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [editText, setEditText] = useState(draft ?? "");
  const [manualText, setManualText] = useState("");

  const handleSendDraft = () => { if (draft) { onSend(draft); } };
  const handleSendEdit  = () => { if (editText.trim()) { onSend(editText); setEditMode(false); } };
  const handleSendManual = () => { if (manualText.trim()) { onSend(manualText); setManualMode(false); setManualText(""); } };

  if (mode === "auto" && !draft) {
    return (
      <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
        <p className="text-[12.5px] text-[var(--muted)] text-center">🤖 AI bu söhbəti avtomatik idarə edir</p>
      </div>
    );
  }

  if (manualMode) {
    return (
      <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)] space-y-2">
        <textarea value={manualText} onChange={e => setManualText(e.target.value)} rows={3}
          placeholder="Mesajınızı yazın..."
          className="w-full text-[14px] text-[var(--ink)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--r-md)] px-3 py-2 resize-none outline-none focus:border-[var(--green-400)]" />
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setManualMode(false)}>Geri</Button>
          <Button size="sm" onClick={handleSendManual} className="gap-1.5">
            <IconSend size={14} /> Göndər
          </Button>
        </div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)] space-y-2">
        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3}
          className="w-full text-[14px] text-[var(--ink)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--r-md)] px-3 py-2 resize-none outline-none focus:border-[var(--green-400)]" />
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>Geri</Button>
          <Button size="sm" onClick={handleSendEdit} className="gap-1.5">
            <IconSend size={14} /> Göndər
          </Button>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)] space-y-2">
        <div className="flex gap-2 items-center">
          <input placeholder="Mesaj yazın..."
            className="flex-1 text-[14px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--r-pill)] px-4 py-2 outline-none focus:border-[var(--green-400)]"
            onKeyDown={e => { if (e.key === "Enter") { onGenerateDraft(); } }} />
          <Button size="sm" variant="soft" onClick={onGenerateDraft} disabled={loading} className="shrink-0 gap-1">
            <IconSparkle size={14} />
            {loading ? "..." : "AI draft"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)] space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--green-600)]">
        <IconSparkle size={13} /> AI cavab hazırladı
      </div>

      {/* Draft box */}
      <div className="text-[14px] text-[var(--ink)] bg-[var(--green-050)] border border-[var(--green-200)] rounded-[var(--r-md)] px-3 py-2.5 leading-relaxed">
        {draft}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={handleSendDraft} className="gap-1.5">
          <IconSend size={14} /> Göndər
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditMode(true); setEditText(draft); }} className="gap-1.5">
          <IconEdit size={14} /> Redaktə et
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setManualMode(true)}>
          Özüm yazaram
        </Button>
      </div>
    </div>
  );
}

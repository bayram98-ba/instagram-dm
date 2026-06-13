"use client";
import { IconSearch, IconBell } from "@/components/ui/Icon";

const titles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "İcmal",           subtitle: "Bu günün xülasəsi" },
  inbox:     { title: "Söhbətlər",       subtitle: "Instagram DM" },
  orders:    { title: "Sifarişlər",      subtitle: "Bütün sifarişlər" },
  catalog:   { title: "Məhsul kataloqu", subtitle: "AI bu kataloqudan istifadə edir" },
  settings:  { title: "Tənzimlər",       subtitle: "Hesab və AI tənzimləməsi" },
};

export function Topbar({ screen }: { screen: string }) {
  const { title, subtitle } = titles[screen] ?? titles.dashboard;
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10 shrink-0">
      <div>
        <h1 className="text-[20px] font-extrabold text-[var(--ink)] tracking-[-0.02em] leading-tight">{title}</h1>
        <p className="text-[11.5px] text-[var(--muted)] leading-tight">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-[var(--r-sm)] text-[var(--muted)] hover:bg-[var(--surface-2)] transition-colors">
          <IconSearch size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-[var(--r-sm)] text-[var(--muted)] hover:bg-[var(--surface-2)] transition-colors">
          <IconBell size={18} />
        </button>
      </div>
    </header>
  );
}

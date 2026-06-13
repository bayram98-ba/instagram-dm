"use client";
import { IconHome, IconChat, IconOrders, IconCatalog, IconSettings, IconChevronD, IconUser } from "@/components/ui/Icon";

type Screen = "dashboard" | "inbox" | "orders" | "catalog" | "settings";

const navItems: { id: Screen; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "dashboard", label: "İcmal",            Icon: IconHome },
  { id: "inbox",     label: "Söhbətlər",        Icon: IconChat },
  { id: "orders",    label: "Sifarişlər",       Icon: IconOrders },
  { id: "catalog",   label: "Məhsul kataloqu",  Icon: IconCatalog },
  { id: "settings",  label: "Tənzimlər",        Icon: IconSettings },
];

interface SidebarProps {
  active: Screen;
  onNav: (s: Screen) => void;
  unread?: number;
}

export function Sidebar({ active, onNav, unread = 0 }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-[248px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(160deg,#2E7D5B,#1F5C42)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6l-3 3V5Z" fill="white" fillOpacity=".9"/>
              <path d="M7 9.5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-[var(--ink)] tracking-[-0.02em] leading-tight">Sifariş</div>
            <div className="text-[11.5px] text-[var(--muted)] leading-tight">AI satış köməkçisi</div>
          </div>
        </div>
      </div>

      {/* Channel switcher */}
      <div className="px-3 py-3 border-b border-[var(--border)]">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--r-sm)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors">
          <div className="w-7 h-7 rounded-lg shrink-0" style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)" }} />
          <div className="flex-1 text-left min-w-0">
            <div className="text-[12.5px] font-semibold text-[var(--ink)] truncate">@aysun.boutique</div>
            <div className="text-[11px] text-[var(--muted)]">Instagram DM</div>
          </div>
          <IconChevronD size={16} className="text-[var(--muted-2)] shrink-0" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--r-sm)] text-[13.5px] font-semibold transition-colors
                ${isActive ? "bg-[var(--green-050)] text-[var(--green-600)]" : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"}`}>
              <Icon size={18} />
              {label}
              {id === "inbox" && unread > 0 && (
                <span className="ml-auto bg-[var(--green-500)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="px-3 pb-4 border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-600)] shrink-0">
            <IconUser size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-[var(--ink)] truncate">Aysun</div>
            <div className="text-[11px] text-[var(--muted)]">Hesab tənzimləri</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

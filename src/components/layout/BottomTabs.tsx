"use client";
import { IconHome, IconChat, IconOrders, IconCatalog, IconSettings } from "@/components/ui/Icon";

type Screen = "dashboard" | "inbox" | "orders" | "catalog" | "settings";

const tabs: { id: Screen; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "dashboard", label: "İcmal",    Icon: IconHome },
  { id: "inbox",     label: "Söhbət",   Icon: IconChat },
  { id: "orders",    label: "Sifariş",  Icon: IconOrders },
  { id: "catalog",   label: "Kataloq",  Icon: IconCatalog },
  { id: "settings",  label: "Tənzim",   Icon: IconSettings },
];

interface BottomTabsProps {
  active: Screen;
  onNav: (s: Screen) => void;
  unread?: number;
}

export function BottomTabs({ active, onNav, unread = 0 }: BottomTabsProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md pb-safe">
      <div className="flex">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-colors
                ${isActive ? "text-[var(--green-500)]" : "text-[var(--muted)]"}`}>
              <div className="relative">
                <Icon size={22} />
                {id === "inbox" && unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--green-500)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

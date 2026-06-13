"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomTabs } from "./BottomTabs";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Inbox } from "@/components/inbox/Inbox";
import { Orders } from "@/components/orders/Orders";
import { Catalog } from "@/components/catalog/Catalog";
import { Settings } from "@/components/settings/Settings";

type Screen = "dashboard" | "inbox" | "orders" | "catalog" | "settings";

export function AppShell() {
  const [screen, setScreen] = useState<Screen>("inbox");
  const unread = 3;

  const screens: Record<Screen, React.ReactNode> = {
    dashboard: <Dashboard onNav={setScreen} />,
    inbox:     <Inbox />,
    orders:    <Orders />,
    catalog:   <Catalog />,
    settings:  <Settings />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--cream-bg)]">
      <Sidebar active={screen} onNav={setScreen} unread={unread} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar screen={screen} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {screens[screen]}
        </main>
      </div>
      <BottomTabs active={screen} onNav={setScreen} unread={unread} />
    </div>
  );
}

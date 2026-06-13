"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { IconCheck, IconX } from "./Icon";

type ToastType = "success" | "error";
interface ToastItem { id: number; message: string; type: ToastType }

const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none md:bottom-6 md:left-auto md:right-6 md:translate-x-0">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--r-md)] shadow-lg text-[13.5px] font-semibold text-white pointer-events-auto animate-[fadeIn_0.2s_ease]
              ${t.type === "success" ? "bg-[var(--green-600)]" : "bg-red-600"}`}>
            {t.type === "success" ? <IconCheck size={15} /> : <IconX size={15} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() { return useContext(ToastCtx); }

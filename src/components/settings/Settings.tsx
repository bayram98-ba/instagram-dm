"use client";
import { useState, useEffect } from "react";
import {
  IconInstagram, IconPin, IconCard, IconCash, IconWallet,
  IconPlus, IconInfo, IconX, IconCheck,
} from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getSettings, saveSetting } from "@/app/actions/chat";
import { useToast } from "@/components/ui/Toast";

type Section = "instagram" | "delivery" | "payment" | "faq" | "ai";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "instagram", label: "Instagram hesabı" },
  { id: "delivery",  label: "Çatdırılma zonaları" },
  { id: "payment",   label: "Ödəniş üsulları" },
  { id: "faq",       label: "Tez-tez verilən suallar" },
  { id: "ai",        label: "AI rejimi" },
];

type Zone    = { name: string; price: number; time: string };
type Payment = { id: string; name: string; on: boolean };
type Faq     = { q: string; a: string };

type AppSettings = {
  deliveryZones: Zone[];
  paymentMethods: Payment[];
  faq: Faq[];
  defaultMode: "semi" | "auto";
  shopName: string;
  igHandle: string;
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-[42px] h-[24px] rounded-full transition-colors ${on ? "bg-[var(--green-500)]" : "bg-[var(--border-2)]"}`}>
      <div className={`absolute top-[4px] w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-[4px]"}`} />
    </button>
  );
}

// ── Instagram ──────────────────────────────────────────────────────────────────
function InstagramSection({ shopName, igHandle }: { shopName: string; igHandle: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)" }}>
          <IconInstagram size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-[14.5px] text-[var(--ink)]">{igHandle || "@aysun.boutique"}</div>
          <div className="text-[12.5px] text-[var(--muted)]">{shopName || "Instagram Business"} · Webhook gözlənilir</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[12px] font-bold border border-amber-200">Qurulur</span>
      </div>
      <div className="p-4 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)] space-y-2">
        <p className="text-[13px] font-semibold text-[var(--ink)]">Webhook URL</p>
        <code className="block text-[12px] bg-[var(--cream-bg)] px-3 py-2 rounded-lg text-[var(--ink-2)] font-mono break-all">
          {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/instagram/webhook
        </code>
        <p className="text-[12px] text-[var(--muted)]">Meta Developer Panel-də bu URL-i webhook ünvanı kimi daxil edin.</p>
      </div>
      <p className="text-[13px] text-[var(--muted)]">Gələcəkdə əlavə kanallar:</p>
      {["WhatsApp Business", "Telegram"].map(ch => (
        <div key={ch} className="flex items-center justify-between p-4 border-2 border-dashed border-[var(--border)] rounded-[var(--r-md)]">
          <span className="text-[13.5px] font-semibold text-[var(--muted)]">{ch}</span>
          <span className="text-[12px] text-[var(--muted-2)] font-medium px-2 py-0.5 bg-[var(--surface-2)] rounded-full">Tezliklə</span>
        </div>
      ))}
    </div>
  );
}

// ── Delivery zones ────────────────────────────────────────────────────────────
function DeliverySection({ zones }: { zones: Zone[] }) {
  return (
    <div className="space-y-3">
      {zones.map(z => (
        <div key={z.name} className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
          <IconPin size={16} className="text-[var(--muted)] shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-[13.5px] text-[var(--ink)]">{z.name}</span>
            <span className="text-[12.5px] text-[var(--muted)] ml-2">{z.time}</span>
          </div>
          <span className="font-bold text-[14px] text-[var(--green-600)]">{z.price} ₼</span>
        </div>
      ))}
      <p className="text-[12px] text-[var(--muted)] text-center">Zona redaktəsi gələcək versiyada əlavə ediləcək.</p>
    </div>
  );
}

// ── Payment methods ───────────────────────────────────────────────────────────
function PaymentSection({ methods, onToggle }: { methods: Payment[]; onToggle: (id: string) => void }) {
  const iconFor = (id: string) => id === "cash" ? IconCash : id === "card" ? IconCard : IconWallet;

  return (
    <div className="space-y-3">
      {methods.map(p => {
        const Ic = iconFor(p.id);
        return (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
            <Ic size={16} className="text-[var(--muted)] shrink-0" />
            <span className="flex-1 font-semibold text-[13.5px] text-[var(--ink)]">{p.name}</span>
            <Toggle on={p.on} onChange={() => onToggle(p.id)} />
          </div>
        );
      })}
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FaqSection({
  faqs,
  onDelete,
  onAdd,
}: {
  faqs: Faq[];
  onDelete: (i: number) => void;
  onAdd: (f: Faq) => void;
}) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (!q.trim() || !a.trim()) return;
    onAdd({ q: q.trim(), a: a.trim() });
    setQ(""); setA(""); setAdding(false);
  }

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)] space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-[13.5px] text-[var(--ink)]">{f.q}</span>
            <button onClick={() => onDelete(i)} className="text-[var(--muted)] hover:text-red-500 shrink-0 transition-colors">
              <IconX size={14} />
            </button>
          </div>
          <p className="text-[12.5px] text-[var(--muted)]">{f.a}</p>
        </div>
      ))}

      {adding ? (
        <div className="p-4 border-2 border-[var(--green-300)] rounded-[var(--r-md)] space-y-2 bg-[var(--green-050)]">
          <input
            autoFocus
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Sual…"
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-[var(--border)] bg-white text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--green-300)]"
          />
          <textarea
            value={a} onChange={e => setA(e.target.value)}
            placeholder="Cavab…"
            rows={2}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-[var(--border)] bg-white text-[var(--ink)] outline-none resize-none focus:ring-2 focus:ring-[var(--green-300)]"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="gap-1"><IconCheck size={14} /> Əlavə et</Button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">Ləğv et</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border)] rounded-[var(--r-md)] text-[13px] text-[var(--muted)] hover:border-[var(--green-300)] hover:text-[var(--green-600)] transition-colors"
        >
          <IconPlus size={15} /> Sual əlavə et
        </button>
      )}
    </div>
  );
}

// ── AI mode ───────────────────────────────────────────────────────────────────
function AiSection({ mode, onSave }: { mode: "semi" | "auto"; onSave: (m: "semi" | "auto") => void }) {
  const [local, setLocal] = useState(mode);

  useEffect(() => setLocal(mode), [mode]);

  return (
    <div className="space-y-3">
      {[
        { id: "semi" as const, label: "Yarı-avtomat", desc: "AI cavab hazırlayır, siz təsdiqləyib göndərirsiniz. Tam nəzarət sizdədir." },
        { id: "auto" as const, label: "Avtomatik",    desc: "AI özü cavablayır. Siz hər şeyi görür və istənilən anda müdaxilə edə bilirsiniz." },
      ].map(opt => (
        <button key={opt.id} onClick={() => { setLocal(opt.id); onSave(opt.id); }}
          className={`w-full text-left px-4 py-4 rounded-[var(--r-md)] border-2 transition-all
            ${local === opt.id ? "border-[var(--green-400)] bg-[var(--green-050)]" : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--green-200)]"}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${local === opt.id ? "border-[var(--green-500)]" : "border-[var(--border-2)]"}`}>
              {local === opt.id && <div className="w-2 h-2 rounded-full bg-[var(--green-500)]" />}
            </div>
            <span className="font-bold text-[14px] text-[var(--ink)]">{opt.label}</span>
          </div>
          <p className="text-[12.5px] text-[var(--muted)] ml-6">{opt.desc}</p>
        </button>
      ))}
      {local === "auto" && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-[var(--new-bg)] border border-[#f5d89a] rounded-[var(--r-md)]">
          <IconInfo size={15} className="text-[var(--new)] shrink-0 mt-0.5" />
          <div className="text-[12.5px] text-[#6B4B0D]">
            <strong>Meta tələbi:</strong> Avtomatik rejimdə söhbətin əvvəlində açıqlama göndərilməlidir:
            <br />
            <em className="block mt-1 opacity-80">"Salam! Bu mesajlara avtomatik köməkçi cavab verir 🤖 İstənilən vaxt sahiblə birbaşa danışa bilərsiniz."</em>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Settings component ───────────────────────────────────────────────────
export function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("instagram");
  const toast = useToast();

  useEffect(() => {
    getSettings().then(s => {
      setSettings({
        deliveryZones:  (s.deliveryZones  as Zone[])    ?? [],
        paymentMethods: (s.paymentMethods as Payment[]) ?? [],
        faq:            (s.faq            as Faq[])     ?? [],
        defaultMode:    (s.defaultMode    as "semi" | "auto") ?? "semi",
        shopName:       (s.shopName       as string)    ?? "",
        igHandle:       (s.igHandle       as string)    ?? "",
      });
    });
  }, []);

  const save = async (key: string, value: unknown) => {
    try {
      await saveSetting(key, value);
      toast("Yadda saxlanıldı");
    } catch {
      toast("Xəta baş verdi", "error");
    }
  };

  const handleTogglePayment = async (id: string) => {
    if (!settings) return;
    const updated = settings.paymentMethods.map(p => p.id === id ? { ...p, on: !p.on } : p);
    setSettings(prev => prev && { ...prev, paymentMethods: updated });
    await save("paymentMethods", updated);
  };

  const handleSaveMode = async (mode: "semi" | "auto") => {
    setSettings(prev => prev && { ...prev, defaultMode: mode });
    await save("defaultMode", mode);
  };

  const handleDeleteFaq = async (i: number) => {
    if (!settings) return;
    const updated = settings.faq.filter((_, idx) => idx !== i);
    setSettings(prev => prev && { ...prev, faq: updated });
    await save("faq", updated);
  };

  const handleAddFaq = async (f: Faq) => {
    if (!settings) return;
    const updated = [...settings.faq, f];
    setSettings(prev => prev && { ...prev, faq: updated });
    await save("faq", updated);
  };

  if (!settings) {
    return (
      <div className="px-6 py-5 flex items-center justify-center h-40 text-[13px] text-[var(--muted)]">
        Yüklənir…
      </div>
    );
  }

  return (
    <div className="px-6 py-5">
      <div className="flex gap-5">
        {/* Section nav */}
        <div className="w-[230px] shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-1)] overflow-hidden h-fit">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-4 py-3 text-[13.5px] font-semibold border-b border-[var(--border)] last:border-0 transition-colors
                ${activeSection === s.id ? "bg-[var(--green-050)] text-[var(--green-700)]" : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-1)] p-5">
          <h3 className="font-bold text-[16px] text-[var(--ink)] mb-4">
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h3>

          {activeSection === "instagram" && (
            <InstagramSection shopName={settings.shopName} igHandle={settings.igHandle} />
          )}
          {activeSection === "delivery" && (
            <DeliverySection zones={settings.deliveryZones} />
          )}
          {activeSection === "payment" && (
            <PaymentSection methods={settings.paymentMethods} onToggle={handleTogglePayment} />
          )}
          {activeSection === "faq" && (
            <FaqSection faqs={settings.faq} onDelete={handleDeleteFaq} onAdd={handleAddFaq} />
          )}
          {activeSection === "ai" && (
            <AiSection mode={settings.defaultMode} onSave={handleSaveMode} />
          )}
        </div>
      </div>
    </div>
  );
}

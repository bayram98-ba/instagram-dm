"use client";
import { useState } from "react";
import { IconInstagram, IconPin, IconCard, IconCash, IconWallet, IconPlus, IconInfo, IconEdit } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

type Section = "instagram" | "delivery" | "payment" | "faq" | "ai";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "instagram", label: "Instagram hesabı" },
  { id: "delivery",  label: "Çatdırılma zonaları" },
  { id: "payment",   label: "Ödəniş üsulları" },
  { id: "faq",       label: "Tez-tez verilən suallar" },
  { id: "ai",        label: "AI rejimi" },
];

const ZONES = [
  { zone: "Bakı",      time: "1-2 gün",  price: 2 },
  { zone: "Sumqayıt", time: "1-2 gün",  price: 3 },
  { zone: "Gəncə",    time: "2-3 gün",  price: 5 },
  { zone: "Xəzər",    time: "1-2 gün",  price: 3 },
];

const FAQS = [
  { q: "Məhsul qaytarılır?",              a: "14 gün ərzində, istifadə edilməmişdirsə qəbul edirik." },
  { q: "Dostavka haçan çatır?",           a: "Bakıya 1-2 iş günü, rayonlara 2-3 iş günü." },
  { q: "Nağd ödəniş olurmu?",             a: "Bəli, qapıda nağd ödəniş qəbul edirik." },
  { q: "Ölçü uyğun gəlməsə nə olur?",   a: "Dəyişdirə bilərik, əlaqə saxlayın." },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-[42px] h-[24px] rounded-full transition-colors ${on ? "bg-[var(--green-500)]" : "bg-[var(--border-2)]"}`}>
      <div className={`absolute top-[4px] w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-[4px]"}`} />
    </button>
  );
}

function InstagramSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)" }}>
          <IconInstagram size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-[14.5px] text-[var(--ink)]">@aysun.boutique</div>
          <div className="text-[12.5px] text-[var(--muted)]">Instagram Business · 4.2K izləyici</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[var(--confirmed-bg)] text-[var(--confirmed)] text-[12px] font-bold">Bağlıdır</span>
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

function DeliverySection() {
  return (
    <div className="space-y-3">
      {ZONES.map(z => (
        <div key={z.zone} className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
          <IconPin size={16} className="text-[var(--muted)] shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-[13.5px] text-[var(--ink)]">{z.zone}</span>
            <span className="text-[12.5px] text-[var(--muted)] ml-2">{z.time}</span>
          </div>
          <span className="font-bold text-[14px] text-[var(--green-600)]">{z.price} ₼</span>
          <button className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors"><IconEdit size={15} /></button>
        </div>
      ))}
      <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border)] rounded-[var(--r-md)] text-[13px] text-[var(--muted)] hover:border-[var(--green-300)] hover:text-[var(--green-600)] transition-colors">
        <IconPlus size={15} /> Zona əlavə et
      </button>
    </div>
  );
}

function PaymentSection() {
  const [payments, setPayments] = useState([
    { key: "cash",  label: "Nağd (qapıda ödəniş)", icon: IconCash,   on: true },
    { key: "card",  label: "Bank kartı",             icon: IconCard,   on: true },
    { key: "m10",   label: "M10 cüzdan",             icon: IconWallet, on: true },
  ]);
  return (
    <div className="space-y-3">
      {payments.map(p => (
        <div key={p.key} className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)]">
          <p.icon size={16} className="text-[var(--muted)] shrink-0" />
          <span className="flex-1 font-semibold text-[13.5px] text-[var(--ink)]">{p.label}</span>
          <Toggle on={p.on} onChange={v => setPayments(prev => prev.map(x => x.key === p.key ? { ...x, on: v } : x))} />
        </div>
      ))}
    </div>
  );
}

function FaqSection() {
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => (
        <div key={i} className="px-4 py-3 bg-[var(--surface-2)] rounded-[var(--r-md)] border border-[var(--border)] space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-[13.5px] text-[var(--ink)]">{f.q}</span>
            <button className="text-[var(--muted)] hover:text-[var(--ink)] shrink-0 transition-colors"><IconEdit size={14} /></button>
          </div>
          <p className="text-[12.5px] text-[var(--muted)]">{f.a}</p>
        </div>
      ))}
      <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border)] rounded-[var(--r-md)] text-[13px] text-[var(--muted)] hover:border-[var(--green-300)] hover:text-[var(--green-600)] transition-colors">
        <IconPlus size={15} /> Sual əlavə et
      </button>
    </div>
  );
}

function AiSection() {
  const [mode, setMode] = useState<"semi" | "auto">("semi");
  return (
    <div className="space-y-3">
      {[
        { id: "semi" as const, label: "Yarı-avtomat", desc: "AI cavab hazırlayır, siz təsdiqləyib göndərirsiniz. Tam nəzarət sizdədir." },
        { id: "auto" as const, label: "Avtomatik",    desc: "AI özü cavablayır. Siz hər şeyi görür və istənilən anda müdaxilə edə bilirsiniz." },
      ].map(opt => (
        <button key={opt.id} onClick={() => setMode(opt.id)}
          className={`w-full text-left px-4 py-4 rounded-[var(--r-md)] border-2 transition-all
            ${mode === opt.id ? "border-[var(--green-400)] bg-[var(--green-050)]" : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--green-200)]"}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mode === opt.id ? "border-[var(--green-500)]" : "border-[var(--border-2)]"}`}>
              {mode === opt.id && <div className="w-2 h-2 rounded-full bg-[var(--green-500)]" />}
            </div>
            <span className="font-bold text-[14px] text-[var(--ink)]">{opt.label}</span>
          </div>
          <p className="text-[12.5px] text-[var(--muted)] ml-6">{opt.desc}</p>
        </button>
      ))}
      {mode === "auto" && (
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

export function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("instagram");

  const sectionContent: Record<Section, React.ReactNode> = {
    instagram: <InstagramSection />,
    delivery:  <DeliverySection />,
    payment:   <PaymentSection />,
    faq:       <FaqSection />,
    ai:        <AiSection />,
  };

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
          {sectionContent[activeSection]}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { IconInfo, IconSearch, IconPlus, IconX, IconImage } from "@/components/ui/Icon";
import { Thumb } from "@/components/ui/Thumb";
import { Button } from "@/components/ui/Button";

interface Product {
  id: number;
  name: string;
  emoji: string;
  tone: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  variants: string[];
  description: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Dəri çanta",     emoji: "👜", tone: "amber",  category: "Çanta",     price: 89,  stock: 5,  sold: 23, variants: ["Qara", "Qəhvəyi", "Beige"],   description: "Yüksək keyfiyyətli süni dəri çanta, daxilindən parça örtüklü." },
  { id: 2, name: "Mini çanta",     emoji: "👛", tone: "amber",  category: "Çanta",     price: 55,  stock: 8,  sold: 15, variants: ["Qara", "Çəhrayı", "Beige"],   description: "Kompakt mini çanta, hər gün üçün." },
  { id: 3, name: "Gümüş üzük",    emoji: "💍", tone: "purple", category: "Zinət",     price: 85,  stock: 3,  sold: 41, variants: ["16mm", "17mm", "18mm"],       description: "925 gümüş, hypoallergenik." },
  { id: 4, name: "Bilərzik",      emoji: "📿", tone: "green",  category: "Zinət",     price: 60,  stock: 0,  sold: 28, variants: ["Qızıl", "Gümüş"],             description: "İncə zəncir bilərzik, altın örtüklü." },
  { id: 5, name: "Bluzka",        emoji: "👗", tone: "rose",   category: "Geyim",     price: 45,  stock: 12, sold: 9,  variants: ["XS","S","M","L","XL"],        description: "Viskon bluzka, yay üçün ideal." },
  { id: 6, name: "Günəş eynəyi", emoji: "🕶️", tone: "blue",  category: "Aksesuar",  price: 34,  stock: 2,  sold: 17, variants: ["Qara", "Mavi"],               description: "UV400 qoruma, hafif çərçivə." },
  { id: 7, name: "Parlaq dodaqsalma", emoji: "💄", tone: "rose", category: "Kosmetika", price: 22, stock: 20, sold: 55, variants: ["Nude", "Berry", "Coral", "Red"], description: "Uzunömürlü mat lip gloss." },
  { id: 8, name: "Parfüm dəsti",  emoji: "🧴", tone: "purple", category: "Kosmetika", price: 120, stock: 1,  sold: 8,  variants: ["30ml", "50ml"],               description: "Çiçəkli ətir, mini dəst." },
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--danger-bg)] text-[var(--danger)]">Bitib</span>;
  if (stock <= 3) return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--new-bg)] text-[var(--new)]">Az qalıb · {stock}</span>;
  return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--confirmed-bg)] text-[var(--confirmed)]">{stock} ədəd</span>;
}

function ProductDrawer({ product, onClose }: { product: Product | null; isNew: boolean; onClose: () => void }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end" style={{ background: "rgba(33,30,24,.35)" }} onClick={onClose}>
      <div className="h-full w-full max-w-[380px] bg-[var(--surface)] flex flex-col animate-slide-in shadow-[var(--sh-3)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="font-bold text-[15px] text-[var(--ink)]">{product.name}</h3>
          <button onClick={onClose}><IconX size={20} className="text-[var(--muted)]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Image area */}
          <div className="w-full h-40 rounded-[var(--r-md)] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] cursor-pointer hover:border-[var(--green-300)] transition-colors">
            <Thumb emoji={product.emoji} tone={product.tone} size={64} radius={16} />
            <div className="flex items-center gap-1 text-[12px] text-[var(--muted)]">
              <IconImage size={14} /> Şəkil əlavə et
            </div>
          </div>
          {/* Fields */}
          {[
            { label: "Ad",     val: product.name },
            { label: "Qiymət", val: `${product.price} ₼` },
            { label: "Stok",   val: `${product.stock} ədəd` },
            { label: "Kateqoriya", val: product.category },
          ].map(({ label, val }) => (
            <div key={label}>
              <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">{label}</label>
              <input defaultValue={val} className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--r-sm)] text-[13.5px] text-[var(--ink)] bg-[var(--surface-2)] outline-none focus:border-[var(--green-400)]" />
            </div>
          ))}
          <div>
            <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">Variantlar</label>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map(v => (
                <span key={v} className="flex items-center gap-1 px-2.5 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-[12.5px] text-[var(--ink-2)] font-medium">
                  {v} <button className="text-[var(--muted-2)] hover:text-[var(--danger)]"><IconX size={10} /></button>
                </span>
              ))}
              <button className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-[var(--border)] rounded-full text-[12.5px] text-[var(--muted)] hover:border-[var(--green-400)] hover:text-[var(--green-600)] transition-colors">
                <IconPlus size={12} /> Əlavə et
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">Təsvir</label>
            <textarea defaultValue={product.description} rows={3}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--r-sm)] text-[13.5px] text-[var(--ink)] bg-[var(--surface-2)] outline-none focus:border-[var(--green-400)] resize-none" />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Ləğv et</Button>
          <Button className="flex-1" onClick={onClose}>Saxla</Button>
        </div>
      </div>
    </div>
  );
}

export function Catalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-[var(--green-050)] border border-[var(--green-200)] rounded-[var(--r-md)] mb-5">
        <IconInfo size={16} className="text-[var(--green-600)] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[var(--green-700)]">
          ✨ <strong>AI cavabları məhz bu kataloqdan qurur.</strong> Məhsul adı, qiymət, variant və mövcudluq nə qədər dəqiq olsa, cavablar bir o qədər doğru olur.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-sm)]">
          <IconSearch size={15} className="text-[var(--muted-2)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Məhsul axtar..."
            className="flex-1 text-[13.5px] bg-transparent outline-none text-[var(--ink)] placeholder:text-[var(--muted-2)]" />
        </div>
        <Button className="gap-1.5 shrink-0">
          <IconPlus size={15} /> Məhsul əlavə et
        </Button>
      </div>

      {/* Product grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {filtered.map(p => (
          <button key={p.id} onClick={() => setSelectedProduct(p)}
            className="text-left bg-[var(--surface)] rounded-[var(--r-lg)] border border-[var(--border)] shadow-[var(--sh-1)] overflow-hidden hover:shadow-[var(--sh-2)] hover:border-[var(--green-200)] transition-all">
            {/* Image area */}
            <div className="relative w-full" style={{ paddingTop: "75%" }}>
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: p.tone === "amber" ? "linear-gradient(135deg,#fbefd9,#f3ecdd)" : p.tone === "rose" ? "linear-gradient(135deg,#f7e2dc,#fdf0ee)" : p.tone === "purple" ? "linear-gradient(135deg,#ede8f5,#f3f0fa)" : p.tone === "blue" ? "linear-gradient(135deg,#e4ecf3,#eef2f8)" : "linear-gradient(135deg,#dceee3,#ecf5ef)" }}>
                <span style={{ fontSize: 48 }}>{p.emoji}</span>
              </div>
              <div className="absolute top-2 right-2"><StockBadge stock={p.stock} /></div>
            </div>
            {/* Info */}
            <div className="p-3">
              <div className="font-bold text-[14px] text-[var(--ink)] mb-0.5 truncate">{p.name}</div>
              <div className="text-[12px] text-[var(--muted)] mb-2">{p.category} · {p.sold} satılıb</div>
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-extrabold text-[var(--green-600)] tracking-[-0.02em]">{p.price} ₼</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.variants.slice(0, 3).map(v => (
                    <span key={v} className="px-1.5 py-0.5 bg-[var(--surface-2)] border border-[var(--border)] rounded text-[10.5px] text-[var(--ink-2)]">{v}</span>
                  ))}
                  {p.variants.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-[var(--surface-2)] border border-[var(--border)] rounded text-[10.5px] text-[var(--muted)]">+{p.variants.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <ProductDrawer product={selectedProduct} isNew={false} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

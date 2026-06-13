"use client";
import { useState, useEffect } from "react";
import { IconInfo, IconSearch, IconPlus, IconX, IconImage } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getProducts, upsertProduct } from "@/app/actions/chat";

interface UiProduct {
  id: string;
  name: string;
  emoji: string;
  tone: string;
  toneHex: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  variants: string[];
  description: string;
}

const TONE_GRADIENTS: Record<string, string> = {
  green:  "linear-gradient(135deg,#dceee3,#ecf5ef)",
  amber:  "linear-gradient(135deg,#fbefd9,#f3ecdd)",
  rose:   "linear-gradient(135deg,#f7e2dc,#fdf0ee)",
  blue:   "linear-gradient(135deg,#e4ecf3,#eef2f8)",
  purple: "linear-gradient(135deg,#ede8f5,#f3f0fa)",
  slate:  "linear-gradient(135deg,#e4ecf3,#eef2f8)",
};

function hexToTone(hex: string): string {
  const map: Record<string, string> = {
    "#dceee3": "green", "#ecf5ef": "green", "#2e7d5b": "green", "#4e9a77": "green",
    "#fbefd9": "amber", "#f3ecdd": "amber", "#c77d1a": "amber",
    "#f7e2dc": "rose",  "#fdf0ee": "rose",  "#bf4530": "rose",
    "#e4ecf3": "blue",  "#eef2f8": "blue",  "#4f6d8c": "blue",
    "#ede8f5": "purple","#f3f0fa": "purple",
  };
  return map[hex?.toLowerCase?.()] ?? "green";
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--danger-bg)] text-[var(--danger)]">Bitib</span>;
  if (stock <= 3) return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--new-bg)] text-[var(--new)]">Az qalıb · {stock}</span>;
  return <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--confirmed-bg)] text-[var(--confirmed)]">{stock} ədəd</span>;
}

function ProductDrawer({ product, onClose, onSave }: {
  product: UiProduct | null;
  onClose: () => void;
  onSave: (data: Partial<UiProduct>) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? ""));
  const [category, setCategory] = useState(product?.category ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [variants, setVariants] = useState<string[]>(product?.variants ?? []);
  const [newVariant, setNewVariant] = useState("");
  const [saving, setSaving] = useState(false);

  if (!product) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave({ name, price: parseFloat(price), stock: parseInt(stock), category, description, variants });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end" style={{ background: "rgba(33,30,24,.35)" }} onClick={onClose}>
      <div className="h-full w-full max-w-[380px] bg-[var(--surface)] flex flex-col animate-slide-in shadow-[var(--sh-3)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="font-bold text-[15px] text-[var(--ink)]">{product.name}</h3>
          <button onClick={onClose}><IconX size={20} className="text-[var(--muted)]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Image area */}
          <div className="w-full h-40 rounded-[var(--r-md)] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] cursor-pointer hover:border-[var(--green-300)] transition-colors"
            style={{ background: TONE_GRADIENTS[product.tone] }}>
            <span style={{ fontSize: 56 }}>{product.emoji}</span>
            <div className="flex items-center gap-1 text-[12px] text-[var(--muted)]">
              <IconImage size={14} /> Şəkil əlavə et
            </div>
          </div>
          {/* Fields */}
          {[
            { label: "Ad",        val: name,     set: setName },
            { label: "Qiymət (₼)", val: price,  set: setPrice,    type: "number" },
            { label: "Stok",      val: stock,    set: setStock,    type: "number" },
            { label: "Kateqoriya",val: category, set: setCategory },
          ].map(({ label, val, set, type }) => (
            <div key={label}>
              <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">{label}</label>
              <input type={type ?? "text"} value={val} onChange={e => set(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--r-sm)] text-[13.5px] text-[var(--ink)] bg-[var(--surface-2)] outline-none focus:border-[var(--green-400)]" />
            </div>
          ))}
          <div>
            <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">Variantlar</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {variants.map(v => (
                <span key={v} className="flex items-center gap-1 px-2.5 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-[12.5px] text-[var(--ink-2)] font-medium">
                  {v}
                  <button onClick={() => setVariants(prev => prev.filter(x => x !== v))} className="text-[var(--muted-2)] hover:text-[var(--danger)]">
                    <IconX size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newVariant} onChange={e => setNewVariant(e.target.value)}
                placeholder="Yeni variant…"
                onKeyDown={e => { if (e.key === "Enter" && newVariant.trim()) { setVariants(p => [...p, newVariant.trim()]); setNewVariant(""); } }}
                className="flex-1 px-3 py-1.5 border border-[var(--border)] rounded-[var(--r-sm)] text-[13px] text-[var(--ink)] bg-[var(--surface-2)] outline-none focus:border-[var(--green-400)]" />
              <Button variant="soft" size="sm" onClick={() => { if (newVariant.trim()) { setVariants(p => [...p, newVariant.trim()]); setNewVariant(""); } }}>
                <IconPlus size={14} />
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--muted)] mb-1">Təsvir</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--r-sm)] text-[13.5px] text-[var(--ink)] bg-[var(--surface-2)] outline-none focus:border-[var(--green-400)] resize-none" />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Ləğv et</Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saxlanır…" : "Saxla"}</Button>
        </div>
      </div>
    </div>
  );
}

export function Catalog() {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    getProducts().then(data => {
      const mapped: UiProduct[] = data.map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        tone: hexToTone(p.tone),
        toneHex: p.tone,
        category: p.category ?? "",
        price: p.price,
        stock: p.stock,
        sold: p.salesCount,
        variants: (() => { try { return JSON.parse(p.variants) as string[]; } catch { return []; } })(),
        description: p.description ?? "",
      }));
      setProducts(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<UiProduct>) => {
    if (!selectedProduct) return;
    await upsertProduct({
      id: selectedProduct.id,
      name: data.name ?? selectedProduct.name,
      price: data.price ?? selectedProduct.price,
      stock: data.stock ?? selectedProduct.stock,
      variants: data.variants ?? selectedProduct.variants,
      description: data.description ?? selectedProduct.description,
      category: data.category ?? selectedProduct.category,
      emoji: selectedProduct.emoji,
      tone: selectedProduct.toneHex,
    });
    load();
  };

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-[var(--muted)] text-[14px]">Yüklənir…</div>;
  }

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
                style={{ background: TONE_GRADIENTS[p.tone] ?? TONE_GRADIENTS.green }}>
                <span style={{ fontSize: 48 }}>{p.emoji}</span>
              </div>
              <div className="absolute top-2 right-2"><StockBadge stock={p.stock} /></div>
            </div>
            {/* Info */}
            <div className="p-3">
              <div className="font-bold text-[14px] text-[var(--ink)] mb-0.5 truncate">{p.name}</div>
              <div className="text-[12px] text-[var(--muted)] mb-2">{p.category || "—"} · {p.sold} satılıb</div>
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
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

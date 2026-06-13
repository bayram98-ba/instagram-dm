import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Message {
  direction: "incoming" | "outgoing";
  text: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  variants: string; // JSON
  stock: number;
  description: string | null;
  category: string | null;
}

export interface DeliveryZone {
  name: string;
  price: number;
  time: string;
}

export interface OrderFields {
  product: string | null;
  variant: string | null;
  qty: number | null;
  customerName: string | null;
  phone: string | null;
  address: string | null;
  zone: string | null;
  deliveryFee: number | null;
  paymentMethod: string | null;
  total: number | null;
}

export interface AiResponse {
  draft: string;
  order: OrderFields;
  aiFilledFields: string[]; // field names extracted in this turn
}

function buildSystemPrompt(
  products: Product[],
  deliveryZones: DeliveryZone[],
  paymentMethods: string[],
  faqs: { q: string; a: string }[]
): string {
  const catalog = products
    .map((p) => {
      const variants = JSON.parse(p.variants) as string[];
      const stockStatus = p.stock === 0 ? "BITIB" : p.stock <= 3 ? `Az qalıb (${p.stock} ədəd)` : `${p.stock} ədəd`;
      return `- ${p.name} | Qiymət: ${p.price} ₼ | Variantlar: ${variants.join(", ")} | Stok: ${stockStatus}${p.description ? ` | ${p.description}` : ""}`;
    })
    .join("\n");

  const zones = deliveryZones
    .map((z) => `- ${z.name}: ${z.price} ₼ (${z.time})`)
    .join("\n");

  const faqText = faqs
    .map((f) => `S: ${f.q}\nC: ${f.a}`)
    .join("\n\n");

  return `Sən "Sifarish" adlı Instagram mağazasının AI satış köməkçisisən. Azərbaycanlı kiçik biznes sahibləri üçün işləyirsən.

== MƏHSUL KATALOQU ==
${catalog}

== ÇATDIRILMA ZONALARI ==
${zones}

== ÖDƏNİŞ ÜSULLARI ==
${paymentMethods.join(", ")}

== FAQ ==
${faqText}

== QAYDALAR ==
1. YALNIZ kataloqdakı məhsulları təklif et. Uydurma məhsul, qiymət, variant söyləmə.
2. Azərbaycan dilində cavab ver. Rus-Azərbaycan qarışığını (dostavka, çexol, sumqayıta) başa düş.
3. Sifariş məlumatlarını çıxar: məhsul, variant, miqdar, müştəri adı, telefon, ünvan, zona, ödəniş.
4. Çatışmayan məlumatları nəzakətlə soruş — hamısını bir anda soruşma.
5. Cavab qısa, mehriban və peşəkar olsun. Emoji məqbuldu.
6. Stoku bitmiş məhsul üçün "bu an stokumuzda yoxdur" de, uydurma vaxt verme.

== ÇIXIŞ FORMATI ==
Cavabını aşağıdakı JSON formatında ver:
{
  "draft": "müştəriyə göndəriləcək cavab mətni",
  "order": {
    "product": "məhsul adı və ya null",
    "variant": "seçilmiş variant və ya null",
    "qty": miqdar ədədi və ya null,
    "customerName": "müştəri adı və ya null",
    "phone": "telefon nömrəsi və ya null",
    "address": "çatdırılma ünvanı və ya null",
    "zone": "çatdırılma zonası adı (kataloqdakı kimi) və ya null",
    "deliveryFee": çatdırılma qiyməti ədədi və ya null,
    "paymentMethod": "ödəniş üsulu və ya null",
    "total": ümumi məbləğ (məhsul × miqdar + çatdırılma) və ya null
  },
  "aiFilledFields": ["bu söhbətdə yeni çıxarılan sahələrin adları"]
}

aiFilledFields-ə YALNIZ BU SÖHBƏTDƏ yeni öyrənilən sahələri daxil et (əvvəllər bilinənləri yox).`;
}

// ── Receipt / payment screenshot reading ─────────────────────────────────────

export interface ReceiptData {
  customerName: string | null;
  phone: string | null;
  total: number | null;
  address: string | null;
  paymentMethod: string | null;
  confirmed: boolean;
}

export async function readReceipt(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
): Promise<ReceiptData | null> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: imageBase64 },
          },
          {
            type: "text",
            text: `Bu ödəniş çeki və ya bank köçürməsi screenshot-udur. Şəkildən aşağıdakı məlumatları çıxar:

{
  "customerName": "göndərənin / alıcının adı (varsa, null yoxsa)",
  "phone": "telefon nömrəsi (varsa, null yoxsa)",
  "total": ödənilən məbləğ rəqəmlə — yalnız ədəd (varsa, null yoxsa),
  "address": "çatdırılma ünvanı (varsa, null yoxsa)",
  "paymentMethod": "ödəniş üsulu: Nağd, Bank kartı və ya M10 (varsa, null yoxsa)",
  "confirmed": true əgər ödəniş uğurlu görünürsə, false əgər qeyri-müəyyəndirsə
}

Yalnız JSON qaytar. Şərhsiz.`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as ReceiptData;
  } catch {
    return null;
  }
}

// ── Chat response ─────────────────────────────────────────────────────────────

export async function generateAiResponse(
  messages: Message[],
  products: Product[],
  deliveryZones: DeliveryZone[],
  paymentMethods: string[],
  faqs: { q: string; a: string }[],
  existingOrder: Partial<OrderFields> = {}
): Promise<AiResponse> {
  const systemPrompt = buildSystemPrompt(products, deliveryZones, paymentMethods, faqs);

  // Format conversation for Claude
  const formattedMessages = messages.map((m) => ({
    role: m.direction === "incoming" ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));

  // Add existing order context if any fields are already filled
  const filledFields = Object.entries(existingOrder)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const contextSuffix = filledFields
    ? `\n\n[Mövcud sifariş məlumatları: ${filledFields}]`
    : "";

  // Ensure last message is from user
  const messagesForApi = formattedMessages.length > 0 && formattedMessages[formattedMessages.length - 1].role === "user"
    ? formattedMessages
    : [...formattedMessages, { role: "user" as const, content: "Cavab hazırla" }];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt + contextSuffix,
    messages: messagesForApi,
  });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON from response
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]) as AiResponse;
    return parsed;
  } catch {
    // Fallback if parsing fails
    return {
      draft: rawText,
      order: {
        product: null, variant: null, qty: null,
        customerName: null, phone: null, address: null,
        zone: null, deliveryFee: null, paymentMethod: null, total: null,
      },
      aiFilledFields: [],
    };
  }
}

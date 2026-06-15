# Sifarish — PROGRESS.md

> Bu fayl hər session-da yenilənir. Növbəti Claude Code session-u buradan başlasın.

---

## Layihə haqqında

**Sifarish** — Azərbaycanda Instagram-da satan kiçik bizneslər üçün AI satış köməkçisi.

- **Repo:** https://github.com/bayram98-ba/instagram-dm
- **Lokal:** `/Users/abdullayevbe/sifarish`
- **Stack:** Next.js 15 (App Router) + TypeScript + Prisma 7 (SQLite) + Anthropic Claude API + Tailwind CSS 4
- **Font:** Plus Jakarta Sans (latin-ext — Azərbaycan hərfləri üçün)

---

## Tamamlananlar

### ✅ Mərhələ 1 — Core (Session 1, 2026-06-14)

#### 1. Layihə qurulumu
- Next.js 15, TypeScript, Tailwind CSS 4, App Router
- GitHub repo: `instagram-dm` (bayram98-ba)
- `.env`, `.env.example`, `.gitignore` (`.env` commit edilmir)
- `CLAUDE.md` — layihə konteksti

#### 2. Database (Prisma 7 + SQLite)
- **Schema:** `prisma/schema.prisma`
  - `Customer` — ad, telefon, ünvan
  - `Product` — ad, qiymət, variantlar (JSON string), stok, emoji, tone rəngi
  - `Conversation` — müştəri ref, kanal (test/instagram), rejim (semi/auto), oxunmamış sayı
  - `Message` — söhbət ref, istiqamət (incoming/outgoing), isAiGenerated flag
  - `Order` — bütün sifariş sahələri + `aiFilledFields` (JSON) — AI tərəfindən doldurulmuş sahələr
  - `Setting` — key/value cütləri (JSON value)
- **Migration:** `prisma/migrations/20260613215449_init/`
- **Seed:** `prisma/seed.ts`
  - 8 məhsul (çanta, aksesuar, zinət, kosmetika) — real Azərbaycan adları
  - 6 müştəri + 6 söhbət (Azərbaycan+rus dilləri qarışığı)
  - 8 sifariş (Yeni, Təsdiqlənib, Göndərilib)
  - Settings: çatdırılma zonaları (Bakı 2₼, Sumqayıt 3₼, Gəncə 5₼...), ödəniş üsulları, FAQ

**Seed əmri:** `npm run db:seed`

**Prisma 7 xüsusiyyəti (vacib!):**
- `PrismaClient` `adapter` tələb edir — `datasourceUrl` işləmir
- SQLite üçün: `@prisma/adapter-better-sqlite3` paketi
- DB client: `src/lib/db.ts`
```typescript
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);
```
- Adapter URL formatı: `{ url: "file:./dev.db" }` — string deyil, object

#### 3. AI Core (`src/lib/ai.ts`)
- Anthropic Claude Haiku (`claude-haiku-4-5-20251001`)
- **Giriş:** söhbət tarixçəsi + məhsul kataloqu + çatdırılma zonaları + ödəniş üsulları + FAQ + mövcud sifariş sahələri
- **Çıxış:** `{ draft: string, order: OrderFields, aiFilledFields: string[] }`
- Sistem promptu: Azərbaycan dilində, kataloqa əsaslı, qarışıq az+rus dilini başa düşür
- JSON format çıxışı — sifariş kartına birbaşa bağlanır
- `aiFilledFields` — yalnız BU söhbətdə yeni öyrənilən sahələr

#### 4. Server Actions (`src/app/actions/chat.ts`)
- `getConversations()` — bütün söhbətlər (customer, messages, orders include)
- `getConversation(id)` — tək söhbət
- `sendMessage(conversationId, text)` — mesaj göndər (outgoing)
- `generateDraft(conversationId)` → AI draft + order upsert + **orderId** qaytarır
- `confirmOrder(orderId)` → status: Yeni → Təsdiqlənib
- `setConversationMode(conversationId, mode)` → semi | auto

#### 5. CSS Design System (`src/app/globals.css`)
- Handoff-dan bütün tokenlar: `--green-500: #2E7D5B`, `--cream-bg: #FBF8F2`, etc.
- Tailwind 4 `@theme inline` ilə birləşdirilmiş
- Animasiyalar: `slideIn`, `fillIn`, `typeBounce`, `fadeIn`
- Plus Jakarta Sans Google Font (latin-ext subset)

---

### ✅ Mərhələ 2 — UI Komponentlər (Session 2, 2026-06-14)

Bütün 5 ekran + AppShell tam tamamlandı. App `http://localhost:3000`-da HTTP 200 qaytarır.

**Yaradılan fayllar:**
- `src/components/ui/` — Icon (37 SVG), StatusBadge, Thumb, AiTag, Button
- `src/components/layout/` — Sidebar, Topbar, BottomTabs, AppShell
- `src/components/inbox/` — ModeToggle, ChatHeader, ConvoList, ChatThread, AiComposer, OrderPanel, Inbox
- `src/components/dashboard/Dashboard.tsx`
- `src/components/orders/Orders.tsx`
- `src/components/catalog/Catalog.tsx`
- `src/components/settings/Settings.tsx`

---

### ✅ Mərhələ 3 — Real DB + Canlı data (Session 3, 2026-06-14)

#### Yeni server actions (`src/app/actions/chat.ts`):
- `getAllOrders()` — bütün sifarişlər (product + customer include)
- `updateOrderStatus(id, status)` — status dəyişdirmə
- `getProducts()` — bütün məhsullar
- `upsertProduct(data)` — məhsul əlavə/yenilə
- `getDashboardData()` — stat kartları + son sifarişlər + diqqət söhbətləri
- `getSettings()` / `saveSetting()` — tənzimlər

#### UI güncəlləmələri:
- `Inbox.tsx` — `getConversations()` ilə real UUID söhbətlər, mesajlar, sifarişlər yüklənir
- `Orders.tsx` — `getAllOrders()` ilə real sifarişlər; `updateOrderStatus` ilə status yenilənir
- `Catalog.tsx` — `getProducts()` ilə real məhsullar; `upsertProduct` ilə Drawer-dən save
- `Dashboard.tsx` — `getDashboardData()` ilə real stat kartları, son sifarişlər, diqqət söhbətləri

---

### ✅ Mərhələ 4 — UX Yeniləmələri + Instagram İnteqrasiyası (Session 4, 2026-06-14)

#### Bug düzəltmələri:
- `generateDraft` artıq `orderId` qaytarır — `Inbox` onu state-də saxlayır
- `confirmOrder(orderId)` real DB-yə yazır (əvvəl yalnız lokal state dəyişirdi)

#### Toast bildiriş sistemi (`src/components/ui/Toast.tsx`):
- `ToastProvider` + `useToast()` hook
- `AppShell` `ToastProvider` ilə sarılmışdır
- Sifariş təsdiqlənəndə, Settings-də save ediləndə toast çıxır

#### Inbox UX yenilikləri:
- **Dev test düyməsi**: `NODE_ENV=development` halında "📨 Müştəri mesajı simulyasiya et" düyməsi görünür
- `receiveIncomingMessage()` server action — incoming message DB-ə yazır (webhook-dan da istifadə edir)
- `deleteProduct()` server action əlavə edildi

#### Settings — Real DB inteqrasiyası:
- `getSettings()` ilə yüklənir (öncə hardcoded idi)
- Ödəniş üsulları toggle → `saveSetting("paymentMethods", ...)` ilə DB-ə yazılır
- FAQ: əlavə et / sil → `saveSetting("faq", ...)` ilə DB-ə yazılır
- AI rejimi: `saveSetting("defaultMode", ...)` ilə DB-ə yazılır
- Instagram bölməsindəki Webhook URL-i real domain-ə əsaslanır

#### Instagram Webhook (`src/app/api/instagram/webhook/route.ts`):
- **GET** — Meta webhook doğrulaması (`META_VERIFY_TOKEN` ilə)
- **POST** — DM qəbul edir; `x-hub-signature-256` ilə imzanı yoxlayır
- Instagram sender ID → söhbət mapping: `ig_conv_{senderId}` setting key-i
- Yeni sender üçün avtomatik `Customer` + `Conversation` yaradır
- **Auto rejim**: AI cavab hazırlayır, DB-ə yazır, `sendInstagramMessage()` ilə göndərir

#### Instagram helper (`src/lib/instagram.ts`):
- `sendInstagramMessage(recipientId, text)` — Meta Graph API v22.0

#### `.env.example` yeniləndi:
- `META_VERIFY_TOKEN` — webhook verify token
- `META_APP_SECRET` — imza yoxlaması üçün
- `META_PAGE_ACCESS_TOKEN` — DM göndərmək üçün

---

### ✅ Mərhələ 5 — İstehsal hazırlığı (Session 5, 2026-06-14)

#### PostgreSQL dəstəyi:
- `@prisma/adapter-pg` + `pg` + `@types/pg` quraşdırıldı
- `src/lib/db.ts` — `DATABASE_URL` prefiksə əsasən adapter avtomatik seçilir:
  - `file:` → `PrismaBetterSqlite3` (dev)
  - `postgresql://` / `postgres://` → `PrismaPg` (prod)
- `package.json` build skripti: `prisma generate && next build`
- `vercel.json` yaradıldı (buildCommand + framework)

#### Çek oxuma — Claude Vision (`src/lib/ai.ts`):
- `readReceipt(imageBase64, mediaType)` → `ReceiptData` çıxarır
- Model: `claude-haiku-4-5-20251001` (vision dəstəkli)
- Sahələr: `customerName`, `phone`, `total`, `address`, `paymentMethod`, `confirmed`
- Server action: `readReceiptImage()` (`src/app/actions/chat.ts`-də)

#### Çek scanner UI:
- `OrderPanel.tsx` — başlıqda "Çek" düyməsi (IconImage)
- Fayl seçilir → FileReader → base64 → `readReceiptImage()` → sahələr avtomatik doldurulur
- `Inbox.tsx` — `handleReceiptScan()` ilə toast + order state güncəlləmə

---

---

### ✅ Mərhələ 6-A — Meta App Review Hazırlığı (Session 6, 2026-06-15)

- `src/app/privacy/page.tsx` — Privacy Policy (English + Azərbaycan dili xülasəsi)
- `src/app/terms/page.tsx` — Terms of Service
- `META_REVIEW.md` — tam submission guide: izahat mətni, test case-lər, checklist
- `.env.example` — `NEXT_PUBLIC_APP_URL` əlavə edildi
- Build: `✓ Compiled successfully` — `/privacy` + `/terms` static page kimi

---

---

### ✅ Mərhələ 6-B — PostgreSQL Migrasiya + Deploy Konfiqurasiyası (Session 6, 2026-06-15)

- `prisma/migrations/20260615000000_init_postgresql/migration.sql` — PostgreSQL-ə uyğun migrasiya SQL-i (köhnə SQLite migrasiyası silindi)
- `vercel.json` — build zamanı `sed` ilə provider avtomatik `sqlite → postgresql` dəyişir
- `package.json` — `db:migrate` skripti əlavə edildi
- `.env.example` — PostgreSQL `DATABASE_URL` nümunəsi əlavə edildi
- **Texniki qeyd:** `schema.prisma` lokal dev üçün `sqlite` qalır; Vercel build-i onu avtomatik `postgresql`-ə çevirir

#### Deploy cəhdləri:
- **Vercel** — istifadəçi problem yaşadı (xəta detalı bilinmir)
- **Railway** — pullu olduğundan kənara qoyuldu
- **Supabase + hosting** — növbəti session-da davam ediləcək

---

## Qalan işlər

### 🔲 Mərhələ 6-C — Supabase + Hosting Deploy

#### 1. Supabase (pulsuz PostgreSQL)
- [ ] [supabase.com](https://supabase.com) → yeni proje: `sifarish`, region: West EU
- [ ] Connection string-i kopyala: `postgresql://postgres:[PASS]@db.xxxx.supabase.co:5432/postgres`
- [ ] `.env`-ə əlavə et: `DATABASE_URL=postgresql://...`
- [ ] `npx prisma migrate deploy` — migrasiyanı Supabase-ə tətbiq et
- [ ] `npm run db:seed` — test datanı Supabase-ə yüklə

#### 2. Next.js Hosting (pulsuz seçimlər)
- [ ] Vercel-dəki problemi müəyyən et (xəta mesajı) → düzəlt
- [ ] **ƏGƏR Vercel işləmirsə:** Netlify alternativ kimi cəhd et
  - [netlify.com](https://netlify.com) → "Import from GitHub" → `instagram-dm`
  - Build command: `npm run build`
  - Environment Variables əlavə et (DATABASE_URL, ANTHROPIC_API_KEY, META_*)

#### 3. Production sonrası
- [ ] `NEXT_PUBLIC_APP_URL` real domain ilə yenilə
- [ ] Meta Developer Panel → App → Privacy Policy + Terms URL-lərini daxil et
- [ ] Webhook URL-i production domain ilə aktivləşdir
- [ ] `instagram_manage_messages` izni üçün submission göndər
- [ ] Business verification (Meta)
- [ ] Uzun ömürlü Page Access Token al

---

## Növbəti session üçün prompt

```
PROGRESS.md-i oxu. Sifarish layihəsi Mərhələ 6-B tamamdır.
Qalan: Mərhələ 6-C — Supabase pulsuz PostgreSQL qur + Next.js hosting seç.
Supabase addımları PROGRESS.md-də yazılıb.
Əgər Vercel problemi həll olunmursa, Netlify ilə cəhd et.
```

---

## Fayl strukturu (cari)

```
/Users/abdullayevbe/sifarish/
├── prisma/
│   ├── schema.prisma          ✅
│   ├── seed.ts                ✅
│   └── migrations/            ✅
├── src/
│   ├── generated/prisma/      ✅ (npx prisma generate)
│   ├── lib/
│   │   ├── db.ts              ✅ Prisma client singleton
│   │   ├── ai.ts              ✅ Claude AI core function
│   │   └── instagram.ts       ✅ sendInstagramMessage helper
│   └── app/
│       ├── actions/
│       │   └── chat.ts        ✅ Server actions (tam)
│       ├── api/
│       │   └── instagram/
│       │       └── webhook/
│       │           └── route.ts ✅ GET verify + POST receive
│       ├── globals.css        ✅ Design tokens + font
│       ├── layout.tsx         ✅
│       └── page.tsx           ✅ → AppShell
├── src/components/
│   ├── ui/
│   │   ├── Icon.tsx           ✅
│   │   ├── Toast.tsx          ✅ ToastProvider + useToast
│   │   ├── Button.tsx         ✅
│   │   ├── StatusBadge.tsx    ✅
│   │   ├── AiTag.tsx          ✅
│   │   └── Thumb.tsx          ✅
│   ├── layout/
│   │   ├── AppShell.tsx       ✅ (ToastProvider ilə sarılmış)
│   │   ├── Sidebar.tsx        ✅
│   │   ├── Topbar.tsx         ✅
│   │   └── BottomTabs.tsx     ✅
│   ├── inbox/
│   │   ├── Inbox.tsx          ✅ (orderId fix + confirmOrder + test button)
│   │   ├── ConvoList.tsx      ✅
│   │   ├── ChatThread.tsx     ✅
│   │   ├── ChatHeader.tsx     ✅
│   │   ├── AiComposer.tsx     ✅
│   │   └── OrderPanel.tsx     ✅
│   ├── dashboard/Dashboard.tsx ✅
│   ├── orders/Orders.tsx       ✅
│   ├── catalog/Catalog.tsx     ✅
│   └── settings/Settings.tsx  ✅ (real DB inteqrasiyası)
├── .env                       ✅ (gitignored)
├── .env.example               ✅ (Meta vars əlavə edildi)
├── CLAUDE.md                  ✅
└── PROGRESS.md                ✅ (bu fayl)
```

---

## Mühüm texniki qeydlər

### Prisma 7 ilə işləmə
```typescript
// ✅ Düzgün
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

// ❌ Səhv (Prisma 7-də işləmir)
new PrismaClient({ datasourceUrl: "..." })
new PrismaClient() // adapter olmadan
```

### DB yenidən sıfırlamaq lazım olsa
```bash
rm prisma/dev.db
npx prisma migrate dev
npm run db:seed
```

### Instagram Webhook qurulumu
1. `.env`-ə `META_VERIFY_TOKEN`, `META_APP_SECRET`, `META_PAGE_ACCESS_TOKEN` əlavə et
2. `ngrok http 3000` ilə public URL al
3. Meta Developer Panel → App → Webhooks → `{ngrok-url}/api/instagram/webhook`
4. Subscribe: `messages` permission

### Dev-mode test
`npm run dev` işlədib Söhbətlər ekranında "📨 Müştəri mesajı simulyasiya et" düyməsini sınaın.

---

## Növbəti session üçün prompt

```
PROGRESS.md-i oxu. Sifarish layihəsi Mərhələ 5 tamamdır.
Dev server: npm run dev → http://localhost:3000
Seed: npm run db:seed (dev.db project root-dadır)
Qalan: Mərhələ 6 — Vercel deploy + PostgreSQL (schema.prisma provider dəyişikliyi + migrate) + Meta App Review.
```

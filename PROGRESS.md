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
- `generateDraft(conversationId)` → AI draft + order upsert
- `confirmOrder(orderId)` → status: Yeni → Təsdiqlənib
- `setConversationMode(conversationId, mode)` → semi | auto

#### 5. CSS Design System (`src/app/globals.css`)
- Handoff-dan bütün tokenlar: `--green-500: #2E7D5B`, `--cream-bg: #FBF8F2`, etc.
- Tailwind 4 `@theme inline` ilə birləşdirilmiş
- Animasiyalar: `slideIn`, `fillIn`, `typeBounce`, `fadeIn`
- Plus Jakarta Sans Google Font (latin-ext subset)

---

## Tamamlananlar (davam)

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

**Texniki düzəltmə:**
- `globals.css` — Google Fonts `@import` Tailwind 4 PostCSS conflict → `layout.tsx` `<link>` olaraq köçürüldü
- `next.config.ts` — `turbopack.root` əlavə edildi

---

## Qalan işlər

### 🔲 Mərhələ 3 — Canlı data + real AI cavablar

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
│   │   └── ai.ts              ✅ Claude AI core function
│   └── app/
│       ├── actions/
│       │   └── chat.ts        ✅ Server actions
│       ├── globals.css        ✅ Design tokens + font
│       ├── layout.tsx         ✅
│       └── page.tsx           🔲 (hələ default Next.js)
├── .env                       ✅ (gitignored — ANTHROPIC_API_KEY + DATABASE_URL)
├── .env.example               ✅
├── CLAUDE.md                  ✅
├── PROGRESS.md                ✅ (bu fayl)
└── package.json               ✅
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

### Seed yenilənməsi
```bash
cd /Users/abdullayevbe/sifarish
npm run db:seed
```

### DB yenidən sıfırlamaq lazım olsa
```bash
rm prisma/dev.db
npx prisma migrate dev
npm run db:seed
```

### Generated client
```bash
npx prisma generate   # schema dəyişəndə
```

---

## Design Handoff

Tam dizayn kodu `Sifaris-handoff-full.md` faylındadır (istifadəçi tərəfindən verildi).

**Əsas fayllar:**
- `app/sifaris.css` — bütün CSS tokenlar (globals.css-ə köçürüldü ✅)
- `app/data.js` — seed datası kimi istifadə edildi ✅
- `app/icons.jsx` → `src/components/ui/Icon.tsx` olaraq yazılacaq 🔲
- `app/common.jsx` → shared UI komponentlər 🔲
- `app/inbox.jsx` → Söhbətlər hero ekranı 🔲
- `app/screens-a.jsx` → İcmal + Sifarişlər 🔲
- `app/screens-b.jsx` → Kataloq + Tənzimlər 🔲
- `app/app.jsx` → AppShell 🔲

**Default seçimlər:**
- Accent rəng: Emerald `#2E7D5B`
- Şrift: Plus Jakarta Sans
- Inbox layout: Yan-yana (split)
- Rejim: Yarı-avtomat (semi)

---

## Növbəti session üçün prompt

```
PROGRESS.md-i oxu. Sifarish layihəsinin Phase 1 core-u tamamdır.
İndi UI komponentlərinə başlayırıq — prioritet sırası PROGRESS.md-də yazılıb.
Başla: Icon.tsx → shared UI → AppShell → Söhbətlər (Inbox hero).
Handoff kodu Sifaris-handoff-full.md-dədir.
```

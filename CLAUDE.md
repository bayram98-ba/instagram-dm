# Sifarish — Layihə təlimatı (CLAUDE.md)

Bu fayl layihənin sabit kontekstidir. Hər session-da bu qaydalara əməl et.

## Məhsul nədir

**Sifarish** — Azərbaycanda Instagram-da satış edən kiçik biznes sahibləri (geyim, aksesuar, kosmetika) üçün AI satış köməkçisi. İki əsas iş görür:

1. **Cavablama** — gələn DM mesajlarını AI oxuyur, kataloqa əsasən cavab hazırlayır. İki rejim: Yarı-avtomat (AI hazırlayır → sahib təsdiqləyir) və Avtomatik (AI özü cavablayır, sahib müdaxilə edə bilər).
2. **Sifariş toplama** — AI söhbətdən strukturlaşdırılmış sifariş çıxarır (məhsul, variant, miqdar, müştəri, telefon, ünvan, çatdırılma, ödəniş) və təmiz sifariş kartı yaradır.

## Əsas prinsiplər

1. **Instagram inteqrasiyası ƏN SONA saxlanılır.** Sistem Instagram olmadan tam işləməlidir.
2. **Hər mərhələdə işləyən nəsə olmalıdır.** Kiçik, sınanan addımlar.
3. **Sirlər koda yazılmır.** `.env` faylında, `.gitignore`-a əlavə olunur.
4. **İnterfeys dili Azərbaycan dilidir.** Bütün istifadəçi mətni azərbaycanca.
5. **Sadəlik məhsulun əsas dəyəridir.**

## Texnologiya

- **Framework:** Next.js 15 (App Router, TypeScript)
- **DB:** SQLite (dev) → PostgreSQL (prod), Prisma ORM
- **AI:** Anthropic Claude API (`@anthropic-ai/sdk`)
- **Stil:** Tailwind CSS

## Data modeli

- **products** — id, name, price, variants(JSON), stock, description, category
- **conversations** — id, customerId, channel, mode(semi/auto), unreadCount, lastMessageAt
- **messages** — id, conversationId, direction(incoming/outgoing), text, createdAt, isAiGenerated
- **orders** — id, conversationId, productId, variant, qty, customerName, phone, address, zone, deliveryFee, paymentMethod, total, status
- **customers** — id, name, phone, address
- **settings** — key/value (deliveryZones, paymentMethods, faq, defaultMode)

## İş ardıcıllığı

- **Mərhələ 1 (indi):** Prisma schema + seed data + AI core function + test paneli (fake inbox)
- **Mərhələ 2:** Dizayn (mövcud HTML prototip → real frontend)
- **Mərhələ 3:** Çek oxuma (Claude Vision)
- **Mərhələ 4:** Instagram inteqrasiyası

## AI funksiyasının davranışı

- Cavab həmişə kataloqa əsaslanmalıdır — uydurma məhsul/qiymət YOX.
- Azərbaycan + rus dili qarışığını anla ("bu çexol neçəyədi, dostavka sumqayıta?").
- Sifariş sahələrini çıxaranda hər sahə üçün "AI tərəfindən dolduruldu" işarəsi saxla.
- Çatışmayan sahələri nəzakətlə soruş.

## Dizayn rəngləri (Mərhələ 2 üçün)

- Brend: Emerald yaşıl `#2E7D5B` (500), `#1F5C42` (700), `#ECF5EF` (050)
- Şrift: Plus Jakarta Sans
- Fon: `#FBF8F2`, səth `#FFFFFF`
- Status: Yeni = amber `#C77D1A`, Təsdiqlənib = yaşıl `#2E7D5B`, Göndərilib = slate `#4F6D8C`

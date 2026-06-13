import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Seed başlayır...");

  // Settings
  await prisma.setting.upsert({
    where: { key: "deliveryZones" },
    update: {},
    create: {
      key: "deliveryZones",
      value: JSON.stringify([
        { name: "Bakı (daxili)", price: 2, time: "Bugün–sabah" },
        { name: "Sumqayıt", price: 3, time: "1–2 gün" },
        { name: "Xırdalan / Abşeron", price: 3, time: "1–2 gün" },
        { name: "Gəncə", price: 5, time: "2–3 gün" },
        { name: "Digər rayonlar", price: 6, time: "2–4 gün" },
      ]),
    },
  });

  await prisma.setting.upsert({
    where: { key: "paymentMethods" },
    update: {},
    create: {
      key: "paymentMethods",
      value: JSON.stringify([
        { id: "cash", name: "Nağd (qapıda ödəniş)", on: true },
        { id: "card", name: "Bank kartı", on: true },
        { id: "m10", name: "M10 cüzdan", on: true },
      ]),
    },
  });

  await prisma.setting.upsert({
    where: { key: "faq" },
    update: {},
    create: {
      key: "faq",
      value: JSON.stringify([
        {
          q: "Çatdırılma neçə gün çəkir?",
          a: "Bakı daxili 1 gün, regionlara 2–4 gün ərzində.",
        },
        {
          q: "Geri qaytarma var?",
          a: "Bəli, 3 gün ərzində istifadə olunmamış məhsulu dəyişə bilərsiniz.",
        },
        {
          q: "Ödəniş üsulları?",
          a: "Nağd (qapıda), bank kartı və M10 ilə ödəyə bilərsiniz.",
        },
      ]),
    },
  });

  await prisma.setting.upsert({
    where: { key: "defaultMode" },
    update: {},
    create: { key: "defaultMode", value: JSON.stringify("semi") },
  });

  await prisma.setting.upsert({
    where: { key: "shopName" },
    update: {},
    create: { key: "shopName", value: JSON.stringify("Aysun Boutique") },
  });

  await prisma.setting.upsert({
    where: { key: "igHandle" },
    update: {},
    create: { key: "igHandle", value: JSON.stringify("@aysun.boutique") },
  });

  // Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Mini çiyin çantası",
        price: 45,
        category: "Çanta",
        variants: JSON.stringify(["Qara", "Bej", "Ağ"]),
        stock: 12,
        salesCount: 38,
        emoji: "👜",
        tone: "#C9A24B",
        description: "22×16 sm · uzun qayış · içində telefon, pul kisəsi, açar rahat yerləşir",
      },
    }),
    prisma.product.create({
      data: {
        name: "Krossbody çanta «Lola»",
        price: 59,
        category: "Çanta",
        variants: JSON.stringify(["Qara", "Qəhvəyi"]),
        stock: 7,
        salesCount: 21,
        emoji: "👝",
        tone: "#7B5230",
        description: "Təbii dəri tekstura · tənzimlənən qayış",
      },
    }),
    prisma.product.create({
      data: {
        name: "Telefon çexolu (silikon)",
        price: 12,
        category: "Aksesuar",
        variants: JSON.stringify(["iPhone 13/14/15", "Samsung S23", "Xiaomi"]),
        stock: 40,
        salesCount: 96,
        emoji: "📱",
        tone: "#5B8DBE",
        description: "Mat səth · barmaq izi qoymur · 14 rəng",
      },
    }),
    prisma.product.create({
      data: {
        name: "İpək kaşne",
        price: 25,
        category: "Aksesuar",
        variants: JSON.stringify([
          "Bənövşəyi naxış",
          "Yaşıl naxış",
          "Krem",
          "Tünd mavi",
          "Qırmızı",
        ]),
        stock: 18,
        salesCount: 44,
        emoji: "🧣",
        tone: "#9B6FB0",
        description: "90×90 sm · 100% mikro ipək",
      },
    }),
    prisma.product.create({
      data: {
        name: "Qızıl suyuna çəkilmiş sırğa",
        price: 32,
        category: "Zinət",
        variants: JSON.stringify(["Halqa", "Damcı", "Ulduz"]),
        stock: 9,
        salesCount: 27,
        emoji: "💍",
        tone: "#C9A24B",
        description: "Hipoallergen · qutu ilə hədiyyə qablaşdırması",
      },
    }),
    prisma.product.create({
      data: {
        name: "Mat ruj «Velvet»",
        price: 18,
        category: "Kosmetika",
        variants: JSON.stringify([
          "01 Çılpaq",
          "02 Gül",
          "03 Mərcan",
          "04 Albalı",
          "05 Şərab",
          "06 Tünd qəhvə",
        ]),
        stock: 24,
        salesCount: 71,
        emoji: "💄",
        tone: "#C0405A",
        description: "Uzun davamlı · qurutmur · 6 çalar",
      },
    }),
    prisma.product.create({
      data: {
        name: "Ətirli əl kremi dəsti",
        price: 38,
        category: "Kosmetika",
        variants: JSON.stringify(["3-lü dəst"]),
        stock: 2,
        salesCount: 33,
        emoji: "🧴",
        tone: "#5FA37E",
        description: "Şirin badam · qızılgül · vanil · 3×60 ml",
      },
    }),
    prisma.product.create({
      data: {
        name: "Günəş eynəyi",
        price: 28,
        category: "Aksesuar",
        variants: JSON.stringify(["Qara", "Qəhvəyi"]),
        stock: 0,
        salesCount: 52,
        emoji: "🕶️",
        tone: "#3A3A3A",
        description: "UV400 qoruma · unisex",
      },
    }),
  ]);

  const [p1, p2, p3, p4, p5, p6, p7] = products;

  // Customers
  const [c1, c2, c3, c4, c5, c6] = await Promise.all([
    prisma.customer.create({ data: { name: "Günəl M.", phone: "050-•••-••-••", address: "Sumqayıt, 18-ci məhəllə" } }),
    prisma.customer.create({ data: { name: "Aysel Q.", phone: "051-•••-••-••", address: "Bakı, Xətai r." } }),
    prisma.customer.create({ data: { name: "Nigar Ə.", phone: "", address: "" } }),
    prisma.customer.create({ data: { name: "Leyla R.", phone: "077-•••-••-••", address: "Bakı, Yasamal r." } }),
    prisma.customer.create({ data: { name: "Orxan H.", phone: "055-•••-••-••", address: "Bakı, Yasamal r., Şərifzadə küç. 24" } }),
    prisma.customer.create({ data: { name: "Səbinə K.", phone: "070-•••-••-••", address: "Bakı, Nizami r., Qara Qarayev pr." } }),
  ]);

  // Conversations + Messages
  const now = new Date();
  const ago = (min: number) => new Date(now.getTime() - min * 60000);

  // Conv 1 — Günəl (semi, unread 2)
  const conv1 = await prisma.conversation.create({
    data: {
      customerId: c1.id,
      channel: "test",
      mode: "semi",
      unreadCount: 2,
      lastMessageAt: ago(8),
      messages: {
        create: [
          { direction: "incoming", text: "Salam 👋 bu çantanın qiyməti neçədi?", createdAt: ago(22) },
          { direction: "outgoing", text: "Salam Günəl! 😊 Mini çiyin çantası 45 ₼-dir. Qara, bej və ağ rənglərimiz var.", createdAt: ago(20), isAiGenerated: true },
          { direction: "incoming", text: "Qara rəng var? Ölçüsü necədi?", createdAt: ago(16) },
          { direction: "outgoing", text: "Bəli, qara mövcuddur ✓ Ölçü 22×16 sm, uzun qayışla. Telefon, pul kisəsi, açar rahat yerləşir.", createdAt: ago(15), isAiGenerated: true },
          { direction: "incoming", text: "Çatdırılma neçəyədi Sumqayıta?", createdAt: ago(11) },
          { direction: "outgoing", text: "Sumqayıta çatdırılma 3 ₼, 1–2 iş günü ərzində 🚚", createdAt: ago(10), isAiGenerated: true },
          { direction: "incoming", text: "Karta köçürüm yoxsa nağd?", createdAt: ago(8) },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv1.id,
      customerId: c1.id,
      productId: p1.id,
      productName: "Mini çiyin çantası",
      variant: "Qara",
      qty: 1,
      customerName: "Günəl M.",
      phone: "050-•••-••-••",
      address: "Sumqayıt, 18-ci məhəllə",
      zone: "Sumqayıt",
      deliveryFee: 3,
      total: 48,
      status: "Yeni",
      aiFilledFields: JSON.stringify(["product", "variant", "customer", "address", "zone", "delivery"]),
    },
  });

  // Conv 2 — Aysel (semi, unread 1)
  const conv2 = await prisma.conversation.create({
    data: {
      customerId: c2.id,
      channel: "test",
      mode: "semi",
      unreadCount: 1,
      lastMessageAt: ago(35),
      messages: {
        create: [
          { direction: "incoming", text: "Çexol da satırsız?", createdAt: ago(40) },
          { direction: "incoming", text: "iPhone 14 üçün lazımdır", createdAt: ago(39) },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv2.id,
      customerId: c2.id,
      productId: p3.id,
      productName: "Telefon çexolu (silikon)",
      variant: "iPhone 14",
      qty: 1,
      customerName: "Aysel Q.",
      total: 12,
      status: "Yeni",
      aiFilledFields: JSON.stringify(["product", "variant", "customer"]),
    },
  });

  // Conv 3 — Nigar (semi, unread 1)
  const conv3 = await prisma.conversation.create({
    data: {
      customerId: c3.id,
      channel: "test",
      mode: "semi",
      unreadCount: 1,
      lastMessageAt: ago(78),
      messages: {
        create: [
          { direction: "incoming", text: "Salam, bu kaşnedən yaşıl rəng var? 😊", createdAt: ago(82) },
          { direction: "incoming", text: "Bir də qiyməti?", createdAt: ago(81) },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv3.id,
      customerId: c3.id,
      productId: p4.id,
      productName: "İpək kaşne",
      variant: "Yaşıl naxış",
      qty: 1,
      customerName: "Nigar Ə.",
      total: 25,
      status: "Yeni",
      aiFilledFields: JSON.stringify(["product", "variant", "customer"]),
    },
  });

  // Conv 4 — Leyla (auto mode)
  const conv4 = await prisma.conversation.create({
    data: {
      customerId: c4.id,
      channel: "test",
      mode: "auto",
      unreadCount: 0,
      lastMessageAt: ago(100),
      messages: {
        create: [
          { direction: "incoming", text: "Rujun çalarları hansılardır?", createdAt: ago(104) },
          { direction: "outgoing", text: "Salam! 💄 «Velvet» mat rujumuz 6 çalardadır: Çılpaq, Gül, Mərcan, Albalı, Şərab, Tünd qəhvə. Hər biri 18 ₼.", createdAt: ago(104), isAiGenerated: true },
          { direction: "incoming", text: "Albalı və Şərab götürərdim", createdAt: ago(102) },
          { direction: "outgoing", text: "Əla seçim 😊 2 ədəd = 36 ₼. Adınızı, telefon və ünvanı yazsanız sifarişi hazırlayım.", createdAt: ago(102), isAiGenerated: true },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv4.id,
      customerId: c4.id,
      productId: p6.id,
      productName: "Mat ruj «Velvet»",
      variant: "Albalı + Şərab",
      qty: 2,
      customerName: "Leyla R.",
      phone: "077-•••-••-••",
      address: "Bakı, Yasamal r.",
      total: 36,
      status: "Yeni",
      aiFilledFields: JSON.stringify(["product", "variant", "qty", "customer"]),
    },
  });

  // Conv 5 — Orxan (tamamlanmış)
  const conv5 = await prisma.conversation.create({
    data: {
      customerId: c5.id,
      channel: "test",
      mode: "semi",
      unreadCount: 0,
      lastMessageAt: ago(160),
      messages: {
        create: [
          { direction: "incoming", text: "Salam, əl kremi dəstini sifariş etmək istəyirəm. Bakıya çatdırırsız?", createdAt: ago(165) },
          { direction: "outgoing", text: "Salam Orxan! 🧴 3-lü dəst 38 ₼. Bakı daxili çatdırılma 2 ₼. Ünvanı yazın, bu gün göndərək.", createdAt: ago(162), isAiGenerated: true },
          { direction: "incoming", text: "Yasamal, Şərifzadə küç. 24. Nağd olar", createdAt: ago(160) },
          { direction: "outgoing", text: "Qeyd etdim — Yasamal, Şərifzadə küç. 24 — sabah 11:00–14:00 arası çatdırılacaq. Cəmi 40 ₼ (38 + 2 çatdırılma), nağd. Təsdiqləyirsiniz?", createdAt: ago(159), isAiGenerated: true },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv5.id,
      customerId: c5.id,
      productId: p7.id,
      productName: "Ətirli əl kremi dəsti",
      variant: "3-lü dəst",
      qty: 1,
      customerName: "Orxan H.",
      phone: "055-•••-••-••",
      address: "Bakı, Yasamal r., Şərifzadə küç. 24",
      zone: "Bakı (daxili)",
      deliveryFee: 2,
      paymentMethod: "Nağd",
      total: 40,
      status: "Təsdiqlənib",
      aiFilledFields: JSON.stringify(["product", "variant", "customer", "phone", "address", "zone", "delivery", "payment"]),
    },
  });

  // Conv 6 — Səbinə (göndərilmiş)
  const conv6 = await prisma.conversation.create({
    data: {
      customerId: c6.id,
      channel: "test",
      mode: "semi",
      unreadCount: 0,
      lastMessageAt: ago(1200),
      messages: {
        create: [
          { direction: "incoming", text: "Çantanı sifariş etmişdim, nə vaxt çatır?", createdAt: ago(1210) },
          { direction: "outgoing", text: "Salam Səbinə! Sifarişiniz kuryerə verildi 📦 sabah 12:00–15:00 arası əlinizdə olar.", createdAt: ago(1205), isAiGenerated: true },
          { direction: "incoming", text: "Çox sağ olun, gözləyirəm 🙏", createdAt: ago(1200) },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      conversationId: conv6.id,
      customerId: c6.id,
      productId: p2.id,
      productName: "Krossbody çanta «Lola»",
      variant: "Qəhvəyi",
      qty: 1,
      customerName: "Səbinə K.",
      phone: "070-•••-••-••",
      address: "Bakı, Nizami r., Qara Qarayev pr.",
      zone: "Bakı (daxili)",
      deliveryFee: 2,
      paymentMethod: "Kart",
      total: 61,
      status: "Göndərilib",
      aiFilledFields: JSON.stringify(["product", "variant", "customer", "phone", "address", "zone", "delivery", "payment"]),
    },
  });

  // Extra historical orders
  await prisma.order.createMany({
    data: [
      {
        conversationId: conv3.id,
        productName: "İpək kaşne",
        variant: "Bənövşəyi naxış",
        qty: 1,
        customerName: "Aytən S.",
        phone: "050-•••-••-••",
        address: "Gəncə, Kəpəz r.",
        zone: "Gəncə",
        deliveryFee: 5,
        paymentMethod: "Kart",
        total: 30,
        status: "Göndərilib",
        aiFilledFields: JSON.stringify(["product", "variant", "customer", "phone", "address", "zone", "delivery", "payment"]),
      },
      {
        conversationId: conv1.id,
        productName: "Mat ruj «Velvet»",
        variant: "Çılpaq",
        qty: 3,
        customerName: "Günay T.",
        phone: "051-•••-••-••",
        address: "Bakı, Nəsimi r.",
        zone: "Bakı (daxili)",
        deliveryFee: 2,
        paymentMethod: "Nağd",
        total: 54,
        status: "Göndərilib",
        aiFilledFields: JSON.stringify(["product", "variant", "customer", "phone", "address", "zone", "delivery", "payment"]),
      },
    ],
  });

  console.log("✓ Seed tamamlandı!");
  console.log(`  ${products.length} məhsul`);
  console.log(`  6 müştəri`);
  console.log(`  6 söhbət`);
  console.log(`  8 sifariş`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

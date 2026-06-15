# Meta App Review — Sifariş

> Bu fayl Meta Developer Panel-ə submission zamanı istifadə olunur.
> Son yenilənmə: 2026-06-15

---

## App məlumatları

| Sahə | Dəyər |
|------|-------|
| App adı | Sifariş |
| Kateqoriya | Business |
| Platform | Web (Next.js) |
| Contact | bayramabdullayev307@gmail.com |
| Privacy Policy URL | `https://your-domain.com/privacy` |
| Terms of Service URL | `https://your-domain.com/terms` |

---

## İstənilən izin: `instagram_manage_messages`

### Niyə bu izin lazımdır?

Sifariş, Azərbaycanda Instagram vasitəsilə məhsul satan kiçik biznes sahibləri (geyim, aksesuar, kosmetika) üçün
AI satış köməkçisidir. Bu izin olmadan tətbiqin əsas funksiyası işləmir:

1. **Gələn mesajları oxumaq** — müştəri sorğularını anlamaq üçün
2. **Cavab göndərmək** — AI tərəfindən hazırlanmış cavabları müştəriyə çatdırmaq üçün

### Necə istifadə edirik?

```
Müştəri DM → Webhook (POST /api/instagram/webhook) → AI analiz → Sifariş kartı
     ↓ (auto rejimdə)
Cavab → sendInstagramMessage() → Müştəriyə çatır
```

- **Semi-auto rejim**: AI cavab hazırlayır → biznes sahibi nəzərdən keçirir → "Göndər" düyməsinə basır
- **Auto rejim**: AI cavab hazırlayır → avtomatik göndərilir (sahibin müdaxiləsi olmadan)

---

## Meta Developer Panel-ə doldurulacaq mətn

### "Describe how your app uses this permission" (Detailed use case)

```
Sifariş is an AI-powered sales assistant for small businesses selling products via Instagram Direct Messages
in Azerbaijan. The app uses instagram_manage_messages for two specific purposes:

1. READING MESSAGES: When a customer sends a DM to the connected Instagram Business account, our webhook
   (POST /api/instagram/webhook) receives the message event. We read the message text to understand the
   customer's product inquiry, extract order details (product name, size, color, quantity, delivery address,
   payment method), and maintain conversation context.

2. SENDING REPLIES: Based on the business owner's product catalog, our AI generates a response in
   Azerbaijani (and understands mixed Azerbaijani/Russian language). In "Semi-auto" mode, the business
   owner reviews the AI draft before clicking Send. In "Auto" mode, the reply is sent automatically.
   Messages are sent via the Instagram Graph API (v22.0) using the sendMessage endpoint.

We do NOT use this permission to: send marketing campaigns, message users who have not initiated contact,
access message content outside of the active DM thread, or store messages for any purpose other than
order fulfillment.
```

### "How does a user connect your app to their Instagram account?" 

```
1. The business owner navigates to Settings → Instagram Account section in the Sifariş dashboard.
2. They click "Connect Instagram Account" which initiates the Meta OAuth flow.
3. They select their Instagram Business account and grant the instagram_manage_messages permission.
4. Sifariş saves the Page Access Token securely as an environment variable.
5. The webhook URL (https://your-domain.com/api/instagram/webhook) is registered in the Meta App settings.
6. From this point, incoming DMs trigger the webhook and the AI assistant becomes active.
```

---

## Test case — Meta Reviewer üçün

> Meta Reviewer tətbiqi test etmək üçün bu addımları izləyir.

### Ön şərtlər (Reviewer-ə verilməlidir)

| Maddə | Dəyər |
|-------|-------|
| Test URL | `https://your-domain.com` |
| Test istifadəçi emaili | _(test account yaradılacaq)_ |
| Test şifrəsi | _(təyin ediləcək)_ |
| Test Instagram hesabı | _(Meta test user kimi əlavə edilib)_ |

### Addım-addım test ssenarisi

#### Ssenari 1: Semi-auto rejim (əsas iş axını)

1. **Giriş**: Test URL-ə daxil olun → Dashboard ekranı açılır
2. **Söhbətlər**: Sol menüdən "Söhbətlər" seçin
3. **Söhbət seçin**: Birinci söhbətə klikləyin (məs. "Leyla Hüseynova")
4. **Mesaj görün**: Sol tərəfdə müştəri mesajları görünür ("bu çanta neçəyədi?")
5. **AI draft**: "✨ AI cavab hazırla" düyməsinə basın
   - AI cavabı "Hazırlanır..." ilə başlayır
   - 2-3 saniyə sonra cavab mətni sahəsini doldurur
   - Sağ paneldə Sifariş Kartı avtomatik dolur (məhsul, qiymət, çatdırılma)
6. **Cavabı göndər**: "Göndər" düyməsinə basın
   - Mesaj "outgoing" bubble kimi chat-da görünür
   - Toast bildirişi: "Mesaj göndərildi"
7. **Sifarişi təsdiqlə**: OrderPanel-də "Sifarişi Təsdiqlə" düyməsinə basın
   - Status: "Yeni" → "Təsdiqlənib" dəyişir
   - Toast: "Sifariş təsdiqləndi"

#### Ssenari 2: Dev mode — Incoming message simulyasiyası

> Bu funksiya yalnız `NODE_ENV=development`-da görünür

1. "📨 Müştəri mesajı simulyasiya et" düyməsinə basın
2. Bir incoming message yaranır (müştəri tərəfindən gəlmiş kimi)
3. Unread sayacı artır
4. AI draft yenidən generate edilir

#### Ssenari 3: Auto rejim

1. ChatHeader-da "Yarı-avtomat" → "Avtomatik" keçidinə basın
2. Yeni incoming message gəldikdə (webhook vasitəsilə)
3. AI cavabı avtomatik göndərilir — heç bir manual addım tələb olunmur
4. Mesaj "AI avtomatik cavab" etiketiylə görünür

#### Ssenari 4: Məhsul Kataloqu

1. Sol menüdən "Məhsul kataloqu" seçin
2. 8 məhsul görünür (çanta, sırğa, üzük, parfüm...)
3. "+" düyməsi ilə yeni məhsul əlavə edin
4. Stok badge-ləri: Bitib (qırmızı), Az qalıb (sarı), Mövcuddur (yaşıl)

#### Ssenari 5: Sifarişlər

1. Sol menüdən "Sifarişlər" seçin
2. Hamısı / Yeni / Təsdiqlənib / Göndərilib tab-larını yoxlayın
3. Sifariş sırasına klikləyin → Detal panel açılır
4. Status dəyişdirin: "Göndərilib" seçin

---

## Checklist — Submission öncəsi

### Texniki
- [ ] App HTTPS ilə işləyir (production domain)
- [ ] Webhook doğrulama işləyir (GET `/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=...`)
- [ ] Webhook imzası yoxlanılır (`x-hub-signature-256`)
- [ ] `META_VERIFY_TOKEN` environment variable-da (hardcoded deyil)
- [ ] `META_APP_SECRET` environment variable-da
- [ ] `META_PAGE_ACCESS_TOKEN` environment variable-da

### Meta Panel
- [ ] App Type: Business
- [ ] Privacy Policy URL doldurulub: `https://your-domain.com/privacy`
- [ ] Terms of Service URL doldurulub: `https://your-domain.com/terms`
- [ ] App Icon yüklənib (1024×1024 PNG)
- [ ] App Category: Business
- [ ] `instagram_manage_messages` permissioni əlavə edilib
- [ ] Webhook subscribed: `messages` field

### Business Verification
- [ ] Meta Business Manager hesabı yaradılıb
- [ ] Business doğrulaması tamamlanıb (sənəd yüklənib)
- [ ] App Business Manager-ə bağlanıb

### Test User
- [ ] Meta Developer Panel-də test user yaradılıb
- [ ] Test user-ə `instagram_manage_messages` tester icazəsi verilıb
- [ ] Test Instagram Business hesabı mövcuddur

---

## Webhook qurulumu (production)

```bash
# 1. Vercel deploy tamamlandıqdan sonra
# 2. Meta Developer Panel → App → Messenger Settings → Webhooks

Callback URL: https://your-domain.vercel.app/api/instagram/webhook
Verify Token: (META_VERIFY_TOKEN dəyəri)

# Subscribe ediləcək sahələr:
✅ messages
```

---

## Tez-tez soruşulan suallar (Meta Reviewer-lər üçün)

**S: Tətbiq məlumatları üçüncü tərəflərə satırmı?**  
C: Xeyr. Mesaj məlumatları yalnız sifarişin yerinə yetirilməsi üçün istifadə olunur.

**S: Automated messages haqqında istifadəçilər xəbərdar edilirmi?**  
C: AI cavablar "AI avtomatik cavab" etiketi ilə işarələnir. İşgüzar sahiblər müştərilərini xəbərdar etməlidir.

**S: Spam göndərirsinizmi?**  
C: Xeyr. Yalnız müştərinin özünün başlatdığı söhbətlərə cavab verilir. Heç bir outbound marketing göndərilmir.

**S: Necə izni ləğv etmək olar?**  
C: Meta Settings → Business Integrations → Sifariş → Remove. Ya da tətbiqdən çıxmaq yetər.

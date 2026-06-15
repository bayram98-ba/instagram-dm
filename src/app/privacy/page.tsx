import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Sifariş",
  description: "Sifariş tətbiqinin məxfilik siyasəti / Privacy Policy for the Sifariş application",
};

export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 760, margin: "0 auto", padding: "48px 24px", color: "#1a1a1a" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🛍️</span>
          <span style={{ fontWeight: 800, fontSize: 22, color: "#2E7D5B" }}>Sifariş</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>Privacy Policy</h1>
        <p style={{ color: "#666", margin: 0 }}>Last updated: June 15, 2026</p>
      </div>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. Overview</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Sifariş (&quot;we&quot;, &quot;our&quot;, &quot;the app&quot;) is an AI-powered sales assistant designed for small businesses
          selling products via Instagram Direct Messages in Azerbaijan. This Privacy Policy explains how we collect,
          use, and protect information when you connect your Instagram Business account to our platform.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. Data We Access via Instagram</h2>
        <p style={{ lineHeight: 1.7, color: "#333", marginBottom: 12 }}>
          When you connect your Instagram Business account, we request the following permission:
        </p>
        <ul style={{ lineHeight: 1.9, color: "#333", paddingLeft: 20 }}>
          <li><strong>instagram_manage_messages</strong> — to read incoming DMs and send replies on your behalf</li>
        </ul>
        <p style={{ lineHeight: 1.7, color: "#333", marginTop: 12 }}>
          We access only messages from your connected Instagram Business account. We do not access personal Instagram
          accounts, follower lists, post data, or any other Instagram data outside of direct messages.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. How We Use Your Data</h2>
        <ul style={{ lineHeight: 1.9, color: "#333", paddingLeft: 20 }}>
          <li>
            <strong>Message processing:</strong> Incoming DMs are read to understand customer inquiries and
            automatically generate AI-powered replies based on your product catalog.
          </li>
          <li>
            <strong>Order extraction:</strong> Our AI identifies order details (product, quantity, address, payment
            method) from customer messages and organizes them into structured order records.
          </li>
          <li>
            <strong>Automated replies:</strong> In &quot;Auto&quot; mode, we send AI-generated responses directly to your
            customers via Instagram. In &quot;Semi-auto&quot; mode, you review and approve each reply before it is sent.
          </li>
          <li>
            <strong>Message history storage:</strong> Messages are stored in your database to maintain conversation
            context and order history. You control this database.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. Data Storage</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Message content, customer names, phone numbers, and delivery addresses collected from Instagram conversations
          are stored in your own database (PostgreSQL). This data is used solely to fulfill orders and provide the
          sales assistant functionality. We do not sell, rent, or share this data with third parties.
        </p>
        <p style={{ lineHeight: 1.7, color: "#333", marginTop: 12 }}>
          AI response generation is powered by the Anthropic Claude API. Message content is sent to Anthropic&apos;s API
          for processing. Anthropic&apos;s data handling is governed by their{" "}
          <a href="https://www.anthropic.com/privacy" style={{ color: "#2E7D5B" }}>Privacy Policy</a>.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Data Retention</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Conversation and order data is retained as long as you use the application. You can delete your data at any
          time by contacting us or by deleting your account. Upon disconnecting your Instagram account, we stop
          receiving new messages immediately.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. User Rights</h2>
        <ul style={{ lineHeight: 1.9, color: "#333", paddingLeft: 20 }}>
          <li><strong>Access:</strong> You can view all stored messages and orders in the Sifariş dashboard.</li>
          <li><strong>Deletion:</strong> You can request deletion of your data at any time.</li>
          <li><strong>Revocation:</strong> You can revoke Instagram access at any time via Meta settings. This will immediately stop message processing.</li>
          <li><strong>Portability:</strong> Your order data can be exported from the dashboard.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Security</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          All communication between Instagram and Sifariş is secured via HTTPS. Webhook requests are verified using
          HMAC-SHA256 signature validation with your Meta App Secret. Access tokens are stored as environment variables
          and never exposed to the client.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Children&apos;s Privacy</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Sifariş is a business tool intended for adults operating small businesses. We do not knowingly collect data
          from individuals under 18 years of age.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>9. Changes to This Policy</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page
          reflects the most recent revision. Continued use of the application after changes constitutes acceptance of
          the updated policy.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>10. Contact</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          For privacy-related requests or questions, contact us at:{" "}
          <a href="mailto:bayramabdullayev307@gmail.com" style={{ color: "#2E7D5B" }}>
            bayramabdullayev307@gmail.com
          </a>
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "40px 0" }} />

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Azərbaycan dilində xülasə</h2>
        <p style={{ lineHeight: 1.7, color: "#555", fontSize: 14 }}>
          Sifariş tətbiqi Instagram Biznes hesabınızdaki DM mesajlarını oxuyur, AI ilə cavab hazırlayır və sifariş
          məlumatlarını toplayır. Məlumatlar yalnız sizin verilənlər bazanızda saxlanılır, üçüncü tərəflərə
          satılmır. İstədiyiniz vaxt Instagram giriş icazəsini ləğv edə bilərsiniz. Sorğular üçün:
          bayramabdullayev307@gmail.com
        </p>
      </section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #e5e7eb", color: "#999", fontSize: 13 }}>
        © 2026 Sifariş. Built in Azerbaijan.
      </div>
    </div>
  );
}

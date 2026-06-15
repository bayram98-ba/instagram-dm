import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Sifariş",
  description: "Sifariş tətbiqinin istifadə şərtləri / Terms of Service for the Sifariş application",
};

export default function TermsOfService() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 760, margin: "0 auto", padding: "48px 24px", color: "#1a1a1a" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🛍️</span>
          <span style={{ fontWeight: 800, fontSize: 22, color: "#2E7D5B" }}>Sifariş</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>Terms of Service</h1>
        <p style={{ color: "#666", margin: 0 }}>Last updated: June 15, 2026</p>
      </div>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. Acceptance of Terms</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          By accessing or using Sifariş (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, do not use the Service.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. Description of Service</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Sifariş is an AI-powered sales assistant that connects to Instagram Business accounts to help small
          businesses manage customer inquiries, generate automated replies, and track orders received via
          Instagram Direct Messages.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Instagram Platform Compliance</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Sifariş operates in compliance with Meta&apos;s Platform Terms and Instagram&apos;s Platform Policy. By using
          this Service, you agree to also comply with Meta&apos;s terms. You are responsible for ensuring that your
          use of automated messaging complies with all applicable laws and Meta&apos;s policies.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. User Responsibilities</h2>
        <ul style={{ lineHeight: 1.9, color: "#333", paddingLeft: 20 }}>
          <li>You must own or have authorization to manage the Instagram Business account you connect.</li>
          <li>You are responsible for the accuracy of your product catalog and pricing.</li>
          <li>You are responsible for fulfilling orders collected through the Service.</li>
          <li>You must not use the Service to send spam, misleading content, or violate consumer protection laws.</li>
          <li>You must inform your customers that automated AI responses may be used.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. AI-Generated Content</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          The Service uses AI to generate draft responses and extract order information from conversations.
          AI-generated content may occasionally be inaccurate. You are responsible for reviewing AI-generated
          responses before sending them (in Semi-auto mode) and for the accuracy of any automatically sent
          replies (in Auto mode).
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Limitation of Liability</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Sifariş is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages
          arising from the use of the Service, including lost sales, incorrect orders, or disruptions in
          Instagram message delivery.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Termination</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          You may stop using the Service at any time by disconnecting your Instagram account and ceasing
          to use the application. We reserve the right to suspend access for violations of these Terms.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Contact</h2>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Questions about these Terms:{" "}
          <a href="mailto:bayramabdullayev307@gmail.com" style={{ color: "#2E7D5B" }}>
            bayramabdullayev307@gmail.com
          </a>
        </p>
      </section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #e5e7eb", color: "#999", fontSize: 13 }}>
        © 2026 Sifariş. Built in Azerbaijan.
      </div>
    </div>
  );
}

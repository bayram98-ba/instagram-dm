import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sifarish — AI satış köməkçisi",
  description: "Instagram DM satışları üçün AI idarəetmə paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}

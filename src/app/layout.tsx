import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sifariş — AI satış köməkçisi",
  description: "Instagram DM satışları üçün AI idarəetmə paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap&subset=latin,latin-ext" rel="stylesheet" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}

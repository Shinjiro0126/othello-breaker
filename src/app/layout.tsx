import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Othello Breaker - AI対戦オセロゲーム",
  description: "強力なAIと対戦できるオセロゲーム。1秒制限の最強CPUに挑戦しよう！",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="ja">
      <head>
        {process.env.NODE_ENV === "production" && client && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
            crossOrigin="anonymous"></script>
        )}
      </head>
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}

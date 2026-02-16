import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Othello Breaker - AI対戦オセロゲーム",
  description: "強力なAIと対戦できるオセロゲーム。1秒制限の最強CPUに挑戦しよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      <body className="antialiased">
        <GameProvider>
          {children}
          {process.env.NODE_ENV === "production" && client && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
            crossOrigin="anonymous"
          />
        )}
        </GameProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";

export const metadata: Metadata = {
  title: {
    default: "Othello Breaker - AI対戦オセロゲーム | 無料ブラウザゲーム",
    template: "%s | Othello Breaker"
  },
  description: "強力すぎるAIと対戦できる無料オセロゲーム。1秒制限の最強CPUに挑戦！初心者から上級者まで楽しめる4つの難易度。ブラウザで今すぐプレイ可能。",
  keywords: ["オセロ", "リバーシ", "AI対戦", "ブラウザゲーム", "無料ゲーム", "戦略ゲーム", "ボードゲーム", "CPU対戦", "オンラインゲーム"],
  authors: [{ name: "Othello Breaker" }],
  creator: "Othello Breaker",
  publisher: "Othello Breaker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://othello-breaker.web.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Othello Breaker - AI対戦オセロゲーム",
    description: "強力すぎるAIと対戦できる無料オセロゲーム。1秒制限の最強CPUに挑戦！初心者から上級者まで楽しめる4つの難易度。",
    url: "https://othello-breaker.web.app",
    siteName: "Othello Breaker",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Othello Breaker - AI対戦オセロゲーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Othello Breaker - AI対戦オセロゲーム",
    description: "強力すぎるAIと対戦できる無料オセロゲーム。1秒制限の最強CPUに挑戦！",
    images: ["/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Othello Breaker",
              "applicationCategory": "GameApplication",
              "genre": "Strategy Game",
              "description": "強力すぎるAIと対戦できる無料オセロゲーム。1秒制限の最強CPUに挑戦！初心者から上級者まで楽しめる4つの難易度。",
              "url": "https://othello-breaker.web.app",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "featureList": [
                "4段階の難易度設定（ビギナー、ノーマル、ハード、マスター）",
                "強力すぎるAI対戦",
                "対戦成績の記録",
                "無料プレイ"
              ],
              "inLanguage": "ja"
            })
          }}
        />
      </head>
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}

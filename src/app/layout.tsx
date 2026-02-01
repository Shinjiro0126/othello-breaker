import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";

export const metadata: Metadata = {
  title: "Othello Breaker - AI対戦オセロゲーム",
  description: "強力なAIと対戦できるオセロゲーム。1秒制限の最強CPUに挑戦しよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}

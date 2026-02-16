// src/app/components/AdsenseUnit.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type Props = {
  className?: string;
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
};

export default function AdsenseUnit({ className = "", slot, format = "auto" }: Props) {
  const pushedRef = useRef(false);

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!client || !adSlot) return;

    // SPA遷移でも表示されるように push（重複push防止）
    if (pushedRef.current) return;
    pushedRef.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 失敗しても落とさない
    }
  }, [client, adSlot]);

  // 開発中はプレースホルダ
  if (process.env.NODE_ENV !== "production") {
    return (
      <div className={`rounded-xl border border-white/20 bg-white/10 p-4 text-white/70 ${className}`}>
        Ad placeholder (dev)
      </div>
    );
  }

  if (!client || !adSlot) return null;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
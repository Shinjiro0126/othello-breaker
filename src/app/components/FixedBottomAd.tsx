"use client";

import AdsenseUnit from "./AdsenseUnit";

export default function FixedBottomAd() {
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-50 backdrop-blur-sm">
      <div className="mx-auto">
        <AdsenseUnit className="rounded-lg overflow-hidden" slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} format="horizontal" />
      </div>
    </div>
  );
}
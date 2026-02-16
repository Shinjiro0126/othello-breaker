// src/app/components/AdsenseModal.tsx
"use client";

import { useEffect, useState } from "react";
import AdsenseUnit from "./AdsenseUnit";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdComplete: () => void;
};

export default function AdsenseModal({ isOpen, onClose, onAdComplete }: Props) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    // カウントダウンタイマー（5秒後に自動で遷移）
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onAdComplete();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onAdComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* モーダルコンテンツ */}
      <div className="relative z-10 w-full max-w-2xl mx-4 backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 animate-fade-in">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-xl"
        >
          ✕
        </button>

        {/* タイトル */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">ただいま準備中...</h2>
          <p className="text-white/80">いつもプレイしてくれてありがとうございます。</p>
          <p className="text-white/60 text-sm mt-2">
            {countdown > 0 ? `${countdown}秒後に自動で遷移します` : "移動中..."}
          </p>
        </div>

        {/* 広告エリア */}
        <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
          <AdsenseUnit 
            className="min-h-[250px]"
            format="rectangle"
          />
        </div>

        {/* スキップボタン */}
        {countdown <= 0 && (
          <button
            onClick={onAdComplete}
            className="mt-6 w-full py-4 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 text-white font-bold text-lg rounded-2xl hover:scale-102 transition-all duration-300 shadow-2xl"
          >
            続ける
          </button>
        )}
      </div>
    </div>
  );
}
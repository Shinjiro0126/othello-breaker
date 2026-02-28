'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';

export default function AudioControl() {
  const { isMuted, volume, toggleMute, setVolume } = useAudio();
  const [showModal, setShowModal] = useState(false);
  // SSR とクライアント初回レンダリングを一致させるため、マウント後に true にする
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // マウント前（SSR）は isMuted=false として扱い、ハイドレーションミスマッチを防ぐ
  const effectiveMuted = mounted && isMuted;

  return (
    <>
      {/* アイコンボタン */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-2xl border border-white/20"
        aria-label="音量設定"
      >
        {effectiveMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
      </button>

      {/* モーダル */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border-2 border-white/20 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg">
              音量設定
            </h2>

            {/* ミュートボタン */}
            <button
              onClick={toggleMute}
              className="w-full p-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 mb-6 flex items-center justify-center gap-3"
            >
              {effectiveMuted ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                  <span className="text-white text-lg font-medium">ミュート中</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                  <span className="text-white text-lg font-medium">音量 {Math.round(volume * 100)}%</span>
                </>
              )}
            </button>

            {/* 音量スライダー */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                aria-label="音量調整"
              />
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-200"
            >
              閉じる
            </button>

            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
              }

              .slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
              }

              .slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
              }

              .slider::-moz-range-thumb:hover {
                transform: scale(1.2);
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

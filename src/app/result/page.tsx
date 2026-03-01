'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import AudioControl from '../components/AudioControl';
import { OthelloGame } from '../utils/othelloGame';
import VictoryAnimation from '../components/VictoryAnimation';
import { LooseAnimation } from '../components/LooseAnimation';
import TieAnimation from '../components/TieAnimation';
import FixedBottomAd from '../components/FixedBottomAd';
import AdsenseUnit from '../components/AdsenseUnit';
import OthelloBoard from '../components/OthelloBoard';

export default function ResultPage() {
  const { gameState, startNewGame } = useGameContext();
  const { playBGM } = useAudio();
  const router = useRouter();
  const winner = OthelloGame.getWinner(gameState.board);
  const [showBoardModal, setShowBoardModal] = useState(false);



  // リザルト画面を開いた時にBGMを再生（初回のみ）
  useEffect(() => {
    playBGM('top');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRematch = () => {
    startNewGame();
    router.push('/game');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-8">
      <AudioControl />
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background.jpg')`,
        }}
      />
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* 浮遊する円形装飾 */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="w-xl max-w-xl mx-auto px-4 relative z-10 mb-80">
        <div className="backdrop-blur-xl bg-white/10 p-4 sm:p-8 rounded-3xl shadow-2xl border border-white/20 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-4xl font-bold text-white mb-4 drop-shadow-2xl">ゲーム終了！</h1>

            {winner === 'W' && (
              <div className="text-8xl mb-4"><VictoryAnimation /></div>
            )}
            {winner === 'B' && (
              <div className="text-8xl mb-4"><LooseAnimation /></div>
            )}
            {winner === 'tie' && (
              <div className="text-8xl"><TieAnimation /></div>
            )}

            <div className="font-bold mb-6 drop-shadow-lg">
              {winner === 'W' && <span className="text-green-300 text-2xl font-bold">あなたの勝利です！</span>}
              {winner === 'B' && <span className="text-red-400 text-2xl font-bold">CPUの勝利です</span>}
              {winner === 'tie' && <span className="text-yellow-300 text-2xl font-bold">引き分けです</span>}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center text-white drop-shadow-lg">最終スコア</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="backdrop-blur-md bg-gradient-to-br from-gray-800/60 to-black/60 py-2 sm:py-6 px-2 rounded-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 space-y-2 sm:space-y-0 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-full border-3 border-gray-600 shadow-xl"></div>
                  <span className="font-bold text-white drop-shadow-lg">CPU (黒)</span>
                </div>
                <div className="text-2xl sm:text-4xl sm:text-5xl font-bold text-center text-white drop-shadow-xl">{gameState.scores.black}</div>
              </div>
              
              <div className="backdrop-blur-md py-2 sm:py-6 px-2 rounded-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 space-y-2 sm:space-y-0 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full border-3 border-gray-300 shadow-xl"></div>
                  <span className="font-bold text-white drop-shadow-lg">あなた (白)</span>
                </div>
                <div className="text-2xl sm:text-4xl sm:text-5xl font-bold text-center text-white drop-shadow-xl">{gameState.scores.white}</div>
              </div>
            </div>
            <div className='w-full grid'>
              <button
                onClick={() => setShowBoardModal(true)}
                className="grid-cols py-4 backdrop-blur-md bg-emerald-500/20 text-emerald-300 font-bold sm:text-lg rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 shadow-xl border border-emerald-400/40 flex items-center justify-center gap-2"
              >
                最終盤面を確認
              </button>
            </div>
          </div>

          {winner === 'B' && (
            <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl mb-8 text-center border border-blue-300/40">
              <p className="text-white font-semibold sm:text-lg mb-3">
                惜しい！今回はちょっと及びませんでした！
              </p>
              <p className="text-yellow-300 font-semibold text-sm">
               「Break」のタイミングを少し変えるだけで、
              </p>
              <p className="text-yellow-300 font-semibold text-sm mb-3">
                結果は大きく変わります！
              </p>
              <p className="text-white/80 text-sm">
                もう一度挑戦してみましょう。勝利はすぐそこです！
              </p>
            </div>
          )}

          {winner === 'tie' && (
            <div className="backdrop-blur-md bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl mb-8 text-center border border-yellow-300/40">
              <p className="text-yellow-300 font-black text-xl mb-3">
                ⚖️ 互角の勝負！ ⚖️
              </p>
              <p className="text-white text-lg font-semibold mb-2">
                最強AIと引き分けとは、驚異的です！
              </p>
              <p className="text-orange-300 font-semibold mb-3">
                あなたの実力は本物。次は勝利を掴みましょう！
              </p>
              <p className="text-white/80 text-sm">
                Breakの使い方次第で、完全勝利も夢じゃありません！
              </p>
            </div>
          )}

          {winner === 'W' && (
            <div className="backdrop-blur-md bg-gradient-to-r from-green-500/30 to-yellow-500/20 p-6 rounded-2xl mb-8 text-center border-2 border-green-300/50 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
              <p className="text-2xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(251,191,36,1)] mb-3">
                CPUを完全に撃破！
              </p>
              <p className="text-green-300 font-semibold mb-2">
                あなたの戦略眼は完璧でした！
              </p>
              <p className="text-white/90 text-sm">
                あなたの一勝が、全体の勝率を押し上げました！<br/>
                この勢いで、さらに記録を伸ばしますか？
              </p>
            </div>
          )}

          <div className="grid gap-4 w-full mx-auto">
            <button
              onClick={handleRematch}
              className="grid-cols d-block py-4 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 text-white font-bold sm:text-lg rounded-2xl hover:scale-102 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
            >
              再戦する
            </button>
            <button
              onClick={handleBackToHome}
              className="grid-cols px-10 py-4 backdrop-blur-md bg-white/20 text-white font-bold sm:text-lg rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-xl border border-white/30"
            >
              トップへ戻る
            </button>
          </div>

          {/* インライン広告 */}
          <div className="mt-8">
            <AdsenseUnit
              className="rounded-xl overflow-hidden"
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
              format="auto"
            />
          </div>
        </div>
      </div>

      <FixedBottomAd />

      {/* 盤面確認モーダル */}
      {showBoardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowBoardModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-3 sm:p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">最終盤面</h2>
              <button
                onClick={() => setShowBoardModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* スコア */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-gray-800 to-black rounded-full border-2 border-gray-600 shadow shrink-0"></div>
                <span className="text-xs sm:text-sm font-bold text-white">CPU (黒)</span>
                <span className="text-xl sm:text-2xl font-black text-white">{gameState.scores.black}</span>
              </div>
              <span className="text-white/40 font-bold">vs</span>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-100 rounded-full border-2 border-gray-300 shadow shrink-0 sm:order-3"></div>
                <span className="text-xs sm:text-sm font-bold text-white sm:order-2">あなた (白)</span>
                <span className="text-xl sm:text-2xl font-black text-white sm:order-1">{gameState.scores.white}</span>
              </div>
            </div>

            {/* 盤面 */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <OthelloBoard
                gameState={{
                  ...gameState,
                  validMoves: [],
                  isThinking: false,
                }}
                onCellClick={() => {}}
              />
            </div>

            <p className="text-center text-white/40 text-xs mt-3 flex items-center justify-center">
            <span className='ring-1 ring-red-400 w-3 h-3 inline-block rounded-full mr-2'></span>は最後の手を示しています
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

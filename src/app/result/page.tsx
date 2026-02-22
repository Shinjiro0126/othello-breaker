'use client';

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../contexts/GameContext';
import { OthelloGame } from '../utils/othelloGame';
import VictoryAnimation from '../components/VictoryAnimation';
import { LooseAnimation } from '../components/LooseAnimation';
import TieAnimation from '../components/TieAnimation';
import FixedBottomAd from '../components/FixedBottomAd';
import AdsenseModal from '../components/AdsenseModal';

export default function ResultPage() {
  const { gameState, startNewGame } = useGameContext();
  const router = useRouter();
  const winner = OthelloGame.getWinner(gameState.board);

  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | 'rematch' | 'home'>(null);

  const handleRematch = () => {
    setPendingAction('rematch');
    setShowAdModal(true);
  };

  const handleBackToHome = () => {
    setPendingAction('home');
    setShowAdModal(true);
  };

  const handleAdComplete = () => {
    setShowAdModal(false);

    if(pendingAction === 'rematch') {
      startNewGame();
      router.push('/game');
    } else if (pendingAction === 'home') {
      router.push('/');
    }

    setPendingAction(null);
  }

  const handleCloseModal = () => {
    setShowAdModal(false);
    setPendingAction(null);
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-8">
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
      
      <div className="w-xl max-w-xl mx-auto px-4 relative z-10 mb-24">
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

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-white drop-shadow-lg">最終スコア</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="backdrop-blur-md bg-gradient-to-br from-gray-800/60 to-black/60 py-6 px-2 rounded-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-full border-3 border-gray-600 shadow-xl"></div>
                  <span className="font-bold text-white drop-shadow-lg">CPU (黒)</span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-center text-white drop-shadow-xl">{gameState.scores.black}</div>
              </div>
              
              <div className="backdrop-blur-md py-6 px-2 rounded-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full border-3 border-gray-300 shadow-xl"></div>
                  <span className="font-bold text-white drop-shadow-lg">あなた (白)</span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-center text-white drop-shadow-xl">{gameState.scores.white}</div>
              </div>
            </div>
          </div>

          {winner === 'B' && (
            <div className="backdrop-blur-md bg-blue-500/20 p-6 rounded-2xl mb-8 text-center border border-blue-300/30">
              <p className="text-white/90 drop-shadow-lg">
                CPUは強力ですが、時間制限により完璧ではありません。<br />
                次の対局でもう一手先を読んでみましょう。
              </p>
            </div>
          )}

          {winner === 'W' && (
            <div className="backdrop-blur-md bg-green-500/20 p-6 rounded-2xl mb-8 text-center border border-green-300/30">
              <p className="text-white/90 drop-shadow-lg">
                素晴らしい！時間制限のあるCPUに勝利しました。<br />
                この調子で連勝を目指しましょう！
              </p>
            </div>
          )}

          <div className="grid gap-4 w-full mx-auto">
            <button
              onClick={handleRematch}
              className="grid-cols d-block py-4 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 text-white font-bold text-lg rounded-2xl hover:scale-102 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
            >
              再戦する
            </button>
            <button
              onClick={handleBackToHome}
              className="grid-cols px-10 py-4 backdrop-blur-md bg-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-xl border border-white/30"
            >
              トップへ戻る
            </button>
          </div>
        </div>
      </div>

      <FixedBottomAd />

      {/* 広告モーダル */}
      <AdsenseModal
        isOpen={showAdModal}
        onClose={handleCloseModal}
        onAdComplete={handleAdComplete}
      />
    </div>
  );
}

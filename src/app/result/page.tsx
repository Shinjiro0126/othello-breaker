'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../contexts/GameContext';
import { OthelloGame } from '../utils/othelloGame';

const ResultPage: React.FC = () => {
  const { gameState, startNewGame } = useGameContext();
  const router = useRouter();
  const winner = OthelloGame.getWinner(gameState.board);

  const handleRematch = () => {
    startNewGame();
    router.push('/game');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">ゲーム終了！</h1>
            
            {winner === 'B' && (
              <div className="text-6xl mb-4">🎉</div>
            )}
            {winner === 'W' && (
              <div className="text-6xl mb-4">😤</div>
            )}
            {winner === 'tie' && (
              <div className="text-6xl mb-4">🤝</div>
            )}

            <div className="text-3xl font-bold mb-6">
              {winner === 'B' && <span className="text-green-600">あなたの勝利です！</span>}
              {winner === 'W' && <span className="text-red-600">CPUの勝利です</span>}
              {winner === 'tie' && <span className="text-gray-600">引き分けです</span>}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">最終スコア</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg text-white">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-black rounded-full border-2 border-gray-400"></div>
                  <span className="font-bold">あなた (黒)</span>
                </div>
                <div className="text-4xl font-bold text-center">{gameState.scores.black}</div>
              </div>
              
              <div className="bg-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-400"></div>
                  <span className="font-bold">CPU (白)</span>
                </div>
                <div className="text-4xl font-bold text-center">{gameState.scores.white}</div>
              </div>
            </div>
          </div>

          {winner === 'W' && (
            <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
              <p className="text-sm text-gray-700">
                CPUは強力ですが、時間制限により完璧ではありません。<br />
                次の対局でもう一手先を読んでみましょう。
              </p>
            </div>
          )}

          {winner === 'B' && (
            <div className="bg-green-50 p-4 rounded-lg mb-8 text-center">
              <p className="text-sm text-gray-700">
                素晴らしい！時間制限のあるCPUに勝利しました。<br />
                この調子で連勝を目指しましょう！
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRematch}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              再戦する
            </button>
            <button
              onClick={handleBackToHome}
              className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
            >
              トップへ戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

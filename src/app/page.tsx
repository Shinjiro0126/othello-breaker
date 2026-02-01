'use client';

import { useGameContext } from './contexts/GameContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { stats, startNewGame } = useGameContext();
  const router = useRouter();

  const handleStartGame = () => {
    startNewGame();
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Othello Breaker</h1>
          <p className="text-lg text-gray-600 mb-8">
            CPUは1秒で最善手を狙う強敵です。でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">対戦成績</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.totalGames}</div>
              <div className="text-sm text-gray-600">対戦数</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">勝率</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{stats.wins}</div>
              <div className="text-sm text-gray-600">勝利</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{stats.losses}</div>
              <div className="text-sm text-gray-600">敗北</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-700">{stats.ties}</div>
              <div className="text-sm text-gray-600">引分</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            ゲームを開始
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-3 text-gray-800">ゲームについて</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 黒（あなた）が先手、白（CPU）が後手です</li>
            <li>• 黄色のマーカーが表示された場所に駒を置けます</li>
            <li>• 相手の駒を挟むように置くことでひっくり返せます</li>
            <li>• 置ける場所がない場合は自動的にパスされます</li>
            <li>• ゲーム終了時に駒の多い方が勝利です</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


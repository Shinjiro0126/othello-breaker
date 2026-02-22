'use client';

import { useGameContext } from './contexts/GameContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { DifficultyLevel } from './types/game';
import { DIFFICULTY_LABELS, DIFFICULTY_DESCRIPTIONS, DIFFICULTY_CONFIGS } from './config/difficulty';

export default function Home() {
  const { getStatsByDifficulty, difficulty, startNewGame } = useGameContext();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('normal');
  const [statsFilter, setStatsFilter] = useState<DifficultyLevel | 'all'>('all');
  
  // フィルタされた統計を取得
  const stats = getStatsByDifficulty(statsFilter === 'all' ? undefined : statsFilter);

  useEffect(() => {
    setSelectedDifficulty(difficulty);
  }, [difficulty]);

  const handleStartGame = () => {
    startNewGame(selectedDifficulty);
    router.push('/game');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background.jpg')`,
        }}
      />
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* 浮遊する円形装飾 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Othello Breaker
            </span>
          </h1>
          <p className="text-lg text-white/90 mb-8 drop-shadow-lg">
            CPUは1秒で最善手を狙う強敵です。<br/>でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="backdrop-blur-xl bg-white/10 p-4 sm:p-8 rounded-3xl shadow-2xl mb-4 sm:mb-0 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">対戦成績</h2>
            </div>
            
            {/* 難易度フィルタ */}
            <div className="mb-6">
              <select
                value={statsFilter}
                onChange={(e) => setStatsFilter(e.target.value as DifficultyLevel | 'all')}
                className="w-full px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all cursor-pointer"
              >
                <option value="all" className="bg-gray-800">全ての難易度</option>
                <option value="beginner" className="bg-gray-800">ビギナー</option>
                <option value="normal" className="bg-gray-800">ノーマル</option>
                <option value="hard" className="bg-gray-800">ハード</option>
                <option value="master" className="bg-gray-800">マスター</option>
              </select>
            </div>

            <div className='space-y-4'>
              <div className="backdrop-blur-md bg-gradient-to-br from-blue-800/20 to-blue-500/20 p-4 sm:p-6 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300 text-center">
                <div className="text-4xl font-bold text-yellow-400 drop-shadow-lg mb-2">
                  {stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0}<span className='ml-1 text-lg'>%</span>
                </div>
                <div className="text-sm text-white/80">勝率</div>
              </div>

              <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300 flex items-center justify-between">
                <div className="text-sm font-bold text-white/80">総対戦数</div>
                <div className="text-xl font-bold text-white drop-shadow-lg">{stats.totalGames}</div>
              </div>

              <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300 flex items-center justify-between">
                <div className="text-sm font-bold text-white/80">勝利</div>
                <div className="text-xl font-bold text-green-400 drop-shadow-lg">{stats.wins}</div>
              </div>

              <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300 flex items-center justify-between">
                <div className="text-sm font-bold text-white/80">敗北</div>
                <div className="text-xl font-bold text-red-400 drop-shadow-lg">{stats.losses}</div>
              </div>

              <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300 flex items-center justify-between">
                <div className="text-sm font-bold text-white/80">引分</div>
                <div className="text-xl font-bold text-gray-400 drop-shadow-lg">{stats.ties}</div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 space-y-6'>
            <div className="backdrop-blur-xl bg-white/10 p-4 sm:p-8 rounded-3xl shadow-2xl mb-8 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">難易度選択</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map((level) => (
                  <label
                    key={level}
                    className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedDifficulty === level
                        ? 'border-violet-300/70 bg-blue-500/20 ring-2 ring-blue-300/40 shadow-[0_0_30px_rgba(139,92,246,0.35)] backdrop-blur-md scale-102'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={selectedDifficulty === level}
                      onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                      className="mt-1 mr-3 accent-blue-500 hidden"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white drop-shadow-md">{DIFFICULTY_LABELS[level]}</div>
                      <div className="text-sm text-white/80 mt-1">{DIFFICULTY_DESCRIPTIONS[level]}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="text-center animate-slide-up mt-8" style={{animationDelay: '0.2s'}}>
                <button
                  onClick={handleStartGame}
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white font-bold text-xl rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
                >
                  <span className="relative z-10">ゲームを開始</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>


            <div className="backdrop-blur-xl bg-white/10 p-4 sm:p-8 rounded-3xl mt-8 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <h3 className="font-semibold mb-3 text-white drop-shadow-lg">AIについて</h3>
              <div className="mb-4 text-sm text-white/90 space-y-2">
                <p>このAIは<span className='text-blue-400 font-bold'>Negamax法</span>と<span className='text-blue-400 font-bold'>Alpha-Beta枝刈り</span>を使用し、 最大15手先まで読む高度な思考エンジンを搭載しています。</p>
                <p>終盤（残り14マス以下）では完全読みを行い、必勝手順を見逃しません。</p>
              </div>
              <h3 className='font-semibold mb-3 text-white drop-shadow-lg'>勝利のコツ</h3>
              <ul className="text-sm text-white/90 space-y-2">
                <li>• <span className='font-bold text-blue-400'>角を取る</span> ：角は絶対に取り返されない最強の位置です（+100点）</li>
                <li>• <span className='font-bold text-blue-400'>X打ちを避ける</span>：角の斜め隣は角を取られるリスクがあります（-30点）</li>
                <li>• <span className='font-bold text-blue-400'>手数を残す</span>：選択肢が多いほど有利な展開に持ち込めます</li>
                <li>• <span className='font-bold text-blue-400'>終盤を制する</span>：最後に打つ側が有利になる傾向があります</li>
              </ul>
            </div>
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20">
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <a 
                href="/about" 
                className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
              >
                このサイトについて
              </a>
              <span className="text-white/40">|</span>
              <a 
                href="/privacy" 
                className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
              >
                プライバシーポリシー
              </a>
            </div>
            <p className="mt-3 text-white/70 text-xs">
              © 2026 Othello Breaker. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}


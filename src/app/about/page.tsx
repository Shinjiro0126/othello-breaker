'use client';

import Link from "next/link";
import { useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import AudioControl from '../components/AudioControl';

export default function About() {
  const { playBGM } = useAudio();

  // ページ読み込み時にBGM再生
  useEffect(() => {
    playBGM('top');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      <AudioControl />
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

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-2xl">
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Othello Breaker について
          </span>
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            絶望からの逆転劇を、あなたの手で
          </h2>
          <p className="text-white/90 leading-relaxed mb-3">
            <span className="text-yellow-300 font-bold">Othello Breaker</span>は、最強AIとの緊張感あふれる対戦に、必殺技「Break」による逆転の興奮を加えた、まったく新しいオセロ体験です。
          </p>
          <p className="text-white/90 leading-relaxed">
            劣勢でも諦めない。終盤の一手が、全てを変える。それがOthello Breakerの世界です。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            Othello Breakerの特徴
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-yellow-300 font-bold mr-3 text-xl">⚡</span>
              <div>
                <h3 className="font-semibold text-white">必殺技「Break」</h3>
                <p className="text-white/90">
                  1ゲームに1回だけ。終盤の劣勢を一瞬で覆す、運命を変える一手
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">最強クラスのAI対戦</h3>
                <p className="text-white/90">
                  4つの難易度で、15手先まで読む高度な思考エンジンと対戦
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">臨場感あふれる演出</h3>
                <p className="text-white/90">
                  雷鳴が響くBreak演出、BGM・効果音で没入感のある対戦体験
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">詳細な戦績管理</h3>
                <p className="text-white/90">
                  難易度別の勝率・戦績を記録し、あなたの成長を可視化
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">全デバイス対応</h3>
                <p className="text-white/90">
                  スマホ、タブレット、PCで快適にプレイ可能
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            遊び方
          </h2>
          <ol className="list-decimal list-inside text-white/90 space-y-3 ml-4">
            <li>トップページから難易度とBreak Modeを選択</li>
            <li>盤面をクリック/タップして石を配置（あなたは白、CPUは黒）</li>
            <li>相手の石を挟んで自分の色に変えよう</li>
            <li className="text-yellow-300 font-semibold">残り10マス以下で「Break」発動可能！相手の石1つを強制変換</li>
            <li>最終的に石が多い方が勝利。Breakで形勢逆転を狙え！</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            お問い合わせ
          </h2>
          <p className="text-white/90 leading-relaxed">
            バグ報告や機能要望などがありましたら、お気軽にお問い合わせください。
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:scale-105 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg text-center"
          >
            トップページに戻る
          </Link>
          <Link
            href="/privacy"
            className="inline-block backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg text-center"
          >
            プライバシーポリシー
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

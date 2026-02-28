'use client';

import Link from "next/link";
import { useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import AudioControl from '../components/AudioControl';

export default function About() {
  const { playBGM } = useAudio();

  useEffect(() => {
    playBGM('top');

    // 自動再生失敗時のフォールバック
    const handleFirstInteraction = () => {
      playBGM('top');
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4">
      <AudioControl />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/background.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="max-w-4xl mx-auto relative z-10 w-full space-y-8">

        {/* ページタイトル */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-white/20 animate-fade-in">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Othello Breaker について
            </span>
          </h1>
          <p className="text-white/80 leading-relaxed">
            最強AIとの戦いに、前代未聞の必殺技「Break」を加えた新次元のオセロ体験。このページでは遊び方・戦略・AIの仕組みを詳しく解説します。
          </p>
        </div>

        {/* ① 遊び方説明 */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-white/20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-xl sm:text-3xl md:text-4xl">📖</span> 遊び方
          </h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "難易度・モードを選ぶ", desc: "トップページで4段階の難易度と「Break Mode」のON/OFFを設定。初めての方はビギナーがおすすめです。" },
              { step: "2", title: "石を置く", desc: "あなたは白、CPUは黒。盤面の緑の点が置ける場所です。相手の石を縦・横・斜めに挟むとひっくり返せます。" },
              { step: "3", title: "ターンを繰り返す", desc: "CPUが思考して手を打ちます。置ける場所がない場合はパスになります。" },
              { step: "4", title: "Break を狙う", desc: "残りマスが10以下になると「Break」ボタンが出現。1ゲームに1回だけ、相手の石を1つ強制的に自分の色に変えられます。" },
              { step: "5", title: "勝利条件", desc: "ゲーム終了時（双方が置けなくなった時点）に石の数が多い方が勝ち。Break一発で形勢逆転も十分狙えます！" },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500/60 rounded-full flex items-center justify-center text-white font-bold text-sm border border-blue-400/50">
                  {step}
                </span>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="text-white/80 text-sm mt-1">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ② 必殺技「Break」の解説 */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-yellow-400/30">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-xl sm:text-3xl">⚡</span> 必殺技「Break」
          </h2>
          <p className="text-yellow-300 font-bold mb-6">絶望を希望に変える、運命の一手</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/30 rounded-2xl p-5 border border-yellow-400/20">
              <h3 className="font-bold text-yellow-300 mb-3">🎯 発動条件</h3>
              <ul className="text-white/90 text-sm space-y-2">
                <li>• Break Mode が有効になっている</li>
                <li>• <strong className="text-yellow-300">残りマスが10以下</strong>（終盤のみ）</li>
                <li>• あなたのターン（白番）</li>
                <li>• まだ1度も使用していない</li>
              </ul>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 border border-yellow-400/20">
              <h3 className="font-bold text-yellow-300 mb-3">⚡ 効果</h3>
              <ul className="text-white/90 text-sm space-y-2">
                <li>• 盤面上のCPUの石（黒）を1つ選択</li>
                <li>• その石を<strong className="text-yellow-300">強制的に白に変換</strong></li>
                <li>• 使用後は通常の白番として石を置く</li>
                <li>• 1ゲームにつき<strong className="text-yellow-300">1回限り</strong></li>
              </ul>
            </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-5 border border-yellow-400/20">
            <h3 className="font-bold text-yellow-300 mb-3">💡 Breakを使うベストタイミング</h3>
            <ul className="text-white/90 text-sm space-y-2">
              <li>• <strong className="text-white">角の隣の相手石</strong>を変換 → 角を取るチャンスが生まれる</li>
              <li>• <strong className="text-white">大量の石を支えているキーストーン</strong>を変換 → 連鎖ひっくり返しに繋がる</li>
              <li>• <strong className="text-white">残り数マスで逆転できる石数差がある時</strong> → 一発で形勢逆転</li>
              <li>• 勝ち確定状態ではなく、<strong className="text-yellow-300">3〜5石差の拮抗時</strong>が最も効果的</li>
            </ul>
          </div>
        </div>

        {/* ③ AIレベル説明 */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-white/20">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-xl sm:text-3xl">🤖</span> AIレベル解説
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Othello Breakerは<strong className="text-white">ミニマックス法</strong>と<strong className="text-white">アルファベータ枝刈り</strong>を用いた高度な探索エンジンを搭載。角・辺・危険マスの位置評価を組み合わせて最善手を計算します。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "ビギナー",
                color: "from-green-500/30 to-green-700/20",
                border: "border-green-400/40",
                badge: "bg-green-500/30 text-green-300",
                depth: "読み深さ：1手先",
                detail: "最初の1手だけ評価するシンプルなAI。角重視の基本戦略のみで、反撃に全力を出しません。オセロ初心者や「Breakの感覚をつかみたい」方に最適。",
              },
              {
                label: "ノーマル",
                color: "from-blue-500/30 to-blue-700/20",
                border: "border-blue-400/40",
                badge: "bg-blue-500/30 text-blue-300",
                depth: "読み深さ：3手先",
                detail: "3手先まで読む標準AI。終盤の完全読みは行わないため、人間の一工夫でひっくり返せる機会があります。慣れてきた方向けのちょうどよい挑戦度。",
              },
              {
                label: "ハード",
                color: "from-orange-500/30 to-orange-700/20",
                border: "border-orange-400/40",
                badge: "bg-orange-500/30 text-orange-300",
                depth: "読み深さ：6手先 + 終盤完全読み（残り10マス以下）",
                detail: "反復深化探索を採用し、残り10マス以下では盤面を完全に読みきって最善手を指します。素直な戦略では勝てません。Breakを駆使した逆転が攻略の鍵。",
              },
              {
                label: "マスター",
                color: "from-red-500/30 to-purple-700/20",
                border: "border-red-400/40",
                badge: "bg-red-500/30 text-red-300",
                depth: "読み深さ：最大15手先 + 終盤完全読み（残り14マス以下）",
                detail: "終盤のほぼすべてを完全読みで解く最強AI。序盤・中盤から角を意識した最善手を打ち続けます。Breakを最高のタイミングで使わない限り、勝利は困難です。",
              },
            ].map(({ label, color, border, badge, depth, detail }) => (
              <div key={label} className={`bg-gradient-to-r ${color} rounded-2xl p-3 sm:p-5 border ${border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge} border ${border}`}>{label}</span>
                  </div>
                  <p className="text-white/60 text-xs">{depth}</p>
                </div>
                <p className="text-white/90 text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ④ 戦略ヒント */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-white/20">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-xl sm:text-3xl">🎯</span> 勝利への戦略ヒント
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: "🏆", title: "角を制する者がゲームを制す", body: "4つの角は一度取ると絶対に取り返せない最強の陣地。AI評価でも+100点の最高評価。序盤から角への道筋を意識してください。" },
              { icon: "⚠️", title: "X打ち・C打ちを避ける", body: "角の斜め隣（X打ち）・辺の2番目（C打ち）は相手に角を渡すリスク大。やむを得ない時以外は絶対に避けること。" },
              { icon: "🔢", title: "手数（着手可能数）を大切に", body: "自分が打てる手の数が多いほど選択肢が広がり有利。相手の手数を減らす手を意識すると中盤が安定します。" },
              { icon: "🏁", title: "終盤は最後に打つ側が有利", body: "終盤は「奇数理論」と呼ばれる原則があり、最後に石を置いた側が得をするケースが多い。残り手数のコントロールが重要。" },
              { icon: "⚡", title: "Breakは「引き分け回避」より「逆転」に使う", body: "Breakを守りで使うのは勿体ない。3〜5石差の拮抗状態で、角周辺の石に使うと一気に逆転できます。" },
              { icon: "📐", title: "辺の石を先に確保しない", body: "辺の端以外を早めに埋めると相手に角を渡しやすくなります。辺は角確保の確定後に進めるのが基本セオリー。" },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-black/30 rounded-2xl p-3 sm:p-5 border border-white/10">
                <h3 className="sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><span>{icon}</span>{title}</h3>
                <p className="text-white/80 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⑤ 勝率の意味 */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 border border-white/20">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-xl sm:text-3xl">📊</span> 勝率・対戦成績の見方
          </h2>
          <p className="text-white/80 text-sm mb-6">
            トップページの「対戦成績」は、プレイした全ゲームの結果をクラウドに保存・集計したものです。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "勝率", color: "text-yellow-400", desc: "勝利数 ÷ 総対戦数 × 100。数値が高いほど実力が上がっている証拠。難易度マスターで30%超えが目標！" },
              { label: "総対戦数", color: "text-blue-400", desc: "これまでに完了したゲームの合計。引き分けや途中終了は含まれません。" },
              { label: "引き分け", color: "text-gray-400", desc: "双方が28個ずつの状態。最強AIと引き分けは実質的に「勝利相当」の実力です。" },
            ].map(({ label, color, desc }) => (
              <div key={label} className="bg-black/30 rounded-2xl p-3 sm:p-5 border border-white/10">
                <p className={`text-lg sm:text-xl font-bold ${color} mb-2`}>{label}</p>
                <p className="text-white/80 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-3 sm:p-5 border border-blue-400/30">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">🎖️ 難易度別の目安勝率</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-center">
              {[
                { level: "ビギナー", target: "60〜80%", note: "まず角を意識しよう" },
                { level: "ノーマル", target: "30〜50%", note: "Break活用で突破口を" },
                { level: "ハード", target: "10〜25%", note: "Breakの使い方がカギ" },
                { level: "マスター", target: "5〜15%", note: "超えたら真の強者" },
              ].map(({ level, target, note }) => (
                <div key={level} className="bg-black/30 rounded-xl p-3 border border-white/10">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{level}</p>
                  <p className="text-yellow-300 text-lg sm:text-xl md:text-2xl font-bold">{target}</p>
                  <p className="text-white/60 text-xs mt-1">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex flex-col sm:flex-row gap-4 pb-4">
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
  );
}


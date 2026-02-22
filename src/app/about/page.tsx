import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
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
            このサイトについて
          </h2>
          <p className="text-white/90 leading-relaxed mb-4">
            Othello Breaker
            は、ブラウザで遊べるオセロゲームです。強力なAIと対戦して、あなたのオセロスキルを試してみましょう！
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            主な機能
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">AI対戦</h3>
                <p className="text-white/90">
                  3つの難易度レベル（簡単・普通・難しい）から選択可能
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">リアルタイムスコア表示</h3>
                <p className="text-white/90">
                  現在のスコアをリアルタイムで確認できます
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">勝敗記録</h3>
                <p className="text-white/90">
                  あなたの戦績を記録し、成長を追跡できます
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-3">●</span>
              <div>
                <h3 className="font-semibold text-white">レスポンシブデザイン</h3>
                <p className="text-white/90">
                  スマートフォンからPCまで、あらゆるデバイスで快適にプレイ可能
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
            <li>トップページから難易度を選択してゲームを開始</li>
            <li>盤面をクリック/タップして石を配置</li>
            <li>相手の石を挟んで自分の色に変えよう</li>
            <li>最終的に石が多い方が勝利！</li>
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

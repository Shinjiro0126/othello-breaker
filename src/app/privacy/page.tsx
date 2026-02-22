import Link from "next/link";

export default function PrivacyPolicy() {
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
            プライバシーポリシー
          </span>
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            1. 収集する情報
          </h2>
          <p className="text-white/90 leading-relaxed mb-4">
            当サイトでは、サービスの提供および改善のために、以下の情報を収集する場合があります：
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>ゲームプレイに関する統計情報（スコア、勝敗記録など）</li>
            <li>アクセス解析のための匿名化されたデータ</li>
            <li>Cookie等の技術を用いた利用状況の情報</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            2. 情報の利用目的
          </h2>
          <p className="text-white/90 leading-relaxed mb-4">
            収集した情報は、以下の目的で利用します：
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>ゲーム体験の向上およびサービスの改善</li>
            <li>サイトの利用状況の分析</li>
            <li>不正利用の防止</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            3. Google Adsenseについて
          </h2>
          <p className="text-white/90 leading-relaxed mb-4">
            当サイトでは、広告配信のためにGoogle Adsenseを使用しています。Google
            Adsenseは、Cookieを使用してユーザーの興味に基づいた広告を表示します。
          </p>
          <p className="text-white/90 leading-relaxed mb-4">
            Cookieを無効にする方法については、
            <a
              href="https://support.google.com/adsense/answer/113771?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Googleの広告設定
            </a>
            をご確認ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            4. Firebaseの使用について
          </h2>
          <p className="text-white/90 leading-relaxed mb-4">
            当サイトでは、Google Firebase
            を使用してゲームデータの保存および分析を行っています。Firebaseは、Googleのプライバシーポリシーに従って運用されています。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            5. 第三者への情報提供
          </h2>
          <p className="text-white/90 leading-relaxed">
            当サイトは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            6. プライバシーポリシーの変更
          </h2>
          <p className="text-white/90 leading-relaxed">
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            7. お問い合わせ
          </h2>
          <p className="text-white/90 leading-relaxed">
            本プライバシーポリシーに関するお問い合わせは、当サイトの管理者までご連絡ください。
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-white/20">
          <p className="text-white/70 text-sm mb-4">
            最終更新日: 2026年2月22日
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:scale-105 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            トップページに戻る
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

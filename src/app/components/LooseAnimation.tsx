export function LooseAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-label="cute robot cpu win animation">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="botBody" x1="70" y1="70" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E5E7EB" />
            <stop offset="0.55" stopColor="#C7D2FE" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>

          <linearGradient id="panel" x1="80" y1="90" x2="160" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B1220" stopOpacity="0.95" />
            <stop offset="1" stopColor="#111827" stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="softAura" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(120 120) rotate(90) scale(90)">
            <stop stopColor="#A78BFA" stopOpacity="0.25" />
            <stop offset="0.6" stopColor="#60A5FA" stopOpacity="0.12" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <filter id="glowPink" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="
                1 0 0 0 0
                0 0.4 0 0 0
                0 0 0.6 0 0
                0 0 0 0.55 0"
              result="g"
            />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="s" />
            <feColorMatrix
              in="s"
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.35 0"
              result="so"
            />
            <feMerge>
              <feMergeNode in="so" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* やわらかいオーラ */}
        <circle cx="120" cy="124" r="88" fill="url(#softAura)">
          <animate attributeName="opacity" values="0.18;0.35;0.18" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* アンテナ（ハートっぽいランプ） */}
        <g filter="url(#softShadow)">
          <path d="M120 38v18" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <circle cx="120" cy="30" r="10" fill="#111827" stroke="#CBD5E1" strokeWidth="4" />
          <path
            d="M120 26c-2.2-3-7-1.6-7 2.2 0 4.8 7 8.8 7 8.8s7-4 7-8.8c0-3.8-4.8-5.2-7-2.2Z"
            fill="#F472B6"
            filter="url(#glowPink)"
          >
            <animate attributeName="opacity" values="0.35;1;0.35" dur="1.4s" repeatCount="indefinite" />
          </path>
        </g>

        {/* まるっとした頭 */}
        <g filter="url(#softShadow)">
          <rect x="58" y="64" width="124" height="120" rx="40" fill="url(#botBody)" />
          <rect x="58" y="64" width="124" height="120" rx="40" stroke="#E5E7EB" strokeWidth="2" opacity="0.8" />

          {/* 画面パネル */}
          <rect x="72" y="84" width="96" height="84" rx="40" fill="url(#panel)" opacity="0.95" />
        </g>

        {/* 目（やさしい丸目） */}
        <g>
          {/* 左目 */}
          <circle cx="102" cy="118" r="10" fill="#93C5FD" opacity="0.9" filter="url(#glowPink)">
            {/* まばたき（縦につぶれる） */}
            {/* <animate attributeName="r" values="10;10;10;2;10" dur="3.4s" repeatCount="indefinite" /> */}
          </circle>
          <circle cx="98" cy="114" r="3" fill="#FFFFFF" opacity="0.9" />
          {/* 右目 */}
          <circle cx="138" cy="118" r="10" fill="#93C5FD" opacity="0.9" filter="url(#glowPink)">
            {/* <animate attributeName="r" values="10;10;10;2;10" dur="3.2s" repeatCount="indefinite" /> */}
          </circle>
          <circle cx="134" cy="114" r="3" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* ほっぺ（ふわっと） */}
        <g filter="url(#glowPink)" opacity="0.9">
          <circle cx="88" cy="138" r="8" fill="#FCA5A5">
            <animate attributeName="opacity" values="0.25;0.75;0.25" dur="2.0s" repeatCount="indefinite" />
          </circle>
          <circle cx="152" cy="138" r="8" fill="#FCA5A5">
            <animate attributeName="opacity" values="0.25;0.75;0.25" dur="2.0s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 口（にこっ） */}
        <path
          d="M110 140c4 6 16 6 20 0"
          stroke="#E5E7EB"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 下のボディ（ちいさく） */}
        {/* <g filter="url(#softShadow)">
          <rect x="78" y="186" width="84" height="26" rx="13" fill="#111827" opacity="0.45" />
          <rect x="88" y="192" width="10" height="10" rx="5" fill="#22C55E" opacity="0.85">
            <animate attributeName="opacity" values="0.25;1;0.25" dur="1.1s" repeatCount="indefinite" />
          </rect>
          <rect x="104" y="192" width="10" height="10" rx="5" fill="#60A5FA" opacity="0.85">
            <animate attributeName="opacity" values="0.25;1;0.25" dur="1.4s" repeatCount="indefinite" />
          </rect>
          <rect x="120" y="192" width="10" height="10" rx="5" fill="#A78BFA" opacity="0.85">
            <animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" repeatCount="indefinite" />
          </rect>
        </g> */}

      </svg>
    </div>
  );
}
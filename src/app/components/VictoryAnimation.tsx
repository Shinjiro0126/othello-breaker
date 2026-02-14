// どこか適当なファイルに追加（同じコンポーネント内でもOK）
export default function VictoryAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-label="victory animation">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="cup" x1="80" y1="40" x2="160" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="0.45" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#FBBF24" />
          </linearGradient>

          <radialGradient id="shine" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(120 92) rotate(90) scale(90 90)">
            <stop stopColor="white" stopOpacity="0.45" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.6 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 背景の光 */}
        <circle cx="120" cy="100" r="78" fill="url(#shine)">
          <animate attributeName="opacity" values="0.35;0.7;0.35" dur="1.6s" repeatCount="indefinite" />
        </circle>

        {/* 紙吹雪（落下） */}
        <g opacity="0.95">
          {[
            { x: 46, c: "#A78BFA", d: "1.4s", r: "8" },
            { x: 70, c: "#F472B6", d: "1.2s", r: "-10" },
            { x: 96, c: "#34D399", d: "1.6s", r: "12" },
            { x: 144, c: "#60A5FA", d: "1.3s", r: "-6" },
            { x: 170, c: "#FBBF24", d: "1.5s", r: "10" },
            { x: 194, c: "#FB7185", d: "1.25s", r: "-12" },
          ].map((p, i) => (
            <rect key={i} x={p.x} y={28} width="10" height="18" rx="3" fill={p.c}>
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,0; 0,170`}
                dur={p.d}
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                additive="sum"
                type="rotate"
                values={`0 ${p.x + 5} 40; ${p.r} ${p.x + 5} 40; 0 ${p.x + 5} 40`}
                dur="0.8s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={p.d} repeatCount="indefinite" />
            </rect>
          ))}
        </g>

        {/* トロフィー（ぷるん） */}
        <g filter="url(#glow)">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,2; 0,-2; 0,2"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              additive="sum"
              type="rotate"
              values="0 120 120; 1.2 120 120; 0 120 120; -1.2 120 120; 0 120 120"
              dur="1.4s"
              repeatCount="indefinite"
            />

            {/* 持ち手 */}
            <path
              d="M82 70c-18 0-26 10-26 22 0 18 14 31 34 31h8v-16h-6c-11 0-18-7-18-15 0-6 4-10 12-10h8V70h-12Z"
              fill="url(#cup)"
              opacity="0.92"
            />
            <path
              d="M158 70c18 0 26 10 26 22 0 18-14 31-34 31h-8v-16h6c11 0 18-7 18-15 0-6-4-10-12-10h-8V70h12Z"
              fill="url(#cup)"
              opacity="0.92"
            />

            {/* 本体 */}
            <path
              d="M86 52h68v32c0 30-20 52-34 52s-34-22-34-52V52Z"
              fill="url(#cup)"
            />

            {/* 縁 */}
            <path d="M80 52h80v14H80V52Z" fill="#FCD34D" opacity="0.95" />

            {/* 台座 */}
            <path d="M108 136h24v18h-24v-18Z" fill="#D97706" />
            <path d="M86 154h68v18c0 10-8 18-18 18h-32c-10 0-18-8-18-18v-18Z" fill="#B45309" />
            <path d="M76 172h88v16H76v-16Z" fill="#92400E" />

            {/* 星（キラッ） */}
            <g>
              <path
                d="M120 68l4.2 10.8 11.6.8-8.9 7.1 3 11.1-9.9-6-9.9 6 3-11.1-8.9-7.1 11.6-.8L120 68Z"
                fill="#FFFFFF"
                opacity="0.9"
              >
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.0s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
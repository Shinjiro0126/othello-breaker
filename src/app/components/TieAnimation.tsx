export default function TieAnimation({className = ""}: {className?: string}) {
  return (
    <div className={`flex justify-center ${className}`} aria-label="tie fist bump animation">
      <svg
        width="260"
        height="240"
        viewBox="0 0 260 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <radialGradient
            id="impactGlow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(130 118) rotate(90) scale(90)"
          >
            <stop stopColor="#FDE68A" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#FB7185" stopOpacity="0.28" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="fistLeft" x1="40" y1="120" x2="140" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#252525" />
            <stop offset="1" stopColor="#282828" />
          </linearGradient>

          <linearGradient id="fistRight" x1="220" y1="120" x2="120" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#fefefe" />
          </linearGradient>

          <filter id="sparkGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0.55 0 0 0
                0 0 0 0.75 0"
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

        {/* 衝突の光（ドン！） */}
        <g transform="translate(130 118) scale(1.08) translate(-130 -118)">
          <circle cx="130" cy="118" r="86" fill="url(#impactGlow)">
            <animate attributeName="opacity" values="0;0.55;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 火花（放射状） */}
        <g filter="url(#sparkGlow)">
          {/* 太い火花 */}
          {[
            { x1: 130, y1: 118, x2: 130, y2: 72, d: "1.2s", delay: "0s" },    // up
            { x1: 130, y1: 118, x2: 176, y2: 98, d: "1.2s", delay: "0.05s" }, // right-up
            { x1: 130, y1: 118, x2: 188, y2: 118, d: "1.2s", delay: "0.1s" }, // right
            { x1: 130, y1: 118, x2: 176, y2: 138, d: "1.2s", delay: "0.15s" },// right-down
            { x1: 130, y1: 118, x2: 130, y2: 164, d: "1.2s", delay: "0.2s" }, // down
            { x1: 130, y1: 118, x2: 84,  y2: 138, d: "1.2s", delay: "0.25s" },// left-down
            { x1: 130, y1: 118, x2: 72,  y2: 118, d: "1.2s", delay: "0.3s" }, // left
            { x1: 130, y1: 118, x2: 84,  y2: 98,  d: "1.2s", delay: "0.35s" },// left-up
          ].map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#FDE68A"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={l.d}
                begin={l.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-width"
                values="5;2;0"
                dur={l.d}
                begin={l.delay}
                repeatCount="indefinite"
              />
            </line>
          ))}

          {/* 小さい火花粒 */}
          {[
            { cx: 130, cy: 118, dx: -28, dy: -20, d: "1.2s", delay: "0.08s" },
            { cx: 130, cy: 118, dx:  30, dy: -12, d: "1.2s", delay: "0.12s" },
            { cx: 130, cy: 118, dx:  34, dy:  18, d: "1.2s", delay: "0.16s" },
            { cx: 130, cy: 118, dx: -32, dy:  22, d: "1.2s", delay: "0.20s" },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#FB7185" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={p.d}
                begin={p.delay}
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0; ${p.dx} ${p.dy}; ${p.dx * 1.2} ${p.dy * 1.2}`}
                dur={p.d}
                begin={p.delay}
                repeatCount="indefinite"
              />
              <animate attributeName="r" values="4;2;0" dur={p.d} begin={p.delay} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* 左の拳（青） */}
        <g filter="url(#softShadow)" transform="translate(86 140) scale(1.1) translate(-86 -140)">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-16 0; -2 0; -16 0"
              dur="1.2s"
              repeatCount="indefinite"
            />
            {/* 前腕 */}
            <path
              d="M26 150c18-18 44-30 72-30l10 34c-22-2-40 6-56 22L26 150Z"
              fill="url(#fistLeft)"
              opacity="0.95"
            />
            {/* 拳（丸っこく） */}
            <path
              d="M86 106c18 0 34 14 34 32v8c0 10-8 18-18 18H78c-12 0-22-10-22-22v-4c0-16 12-32 30-32Z"
              fill="url(#fistLeft)"
            />
            {/* 指の凹凸 */}
            <path d="M74 128h40" stroke="#E0F2FE" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <path d="M74 142h38" stroke="#E0F2FE" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
          </g>
        </g>

        {/* 右の拳（赤） */}
        <g filter="url(#softShadow)" transform="translate(174 140) scale(1.1) translate(-174 -140)">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="16 0; 2 0; 16 0"
              dur="1.2s"
              repeatCount="indefinite"
            />
            {/* 前腕 */}
            <path
              d="M234 150c-18-18-44-30-72-30l-10 34c22-2 40 6 56 22l26-26Z"
              fill="url(#fistRight)"
              opacity="0.95"
            />
            {/* 拳（丸っこく） */}
            <path
              d="M174 106c-18 0-34 14-34 32v8c0 10 8 18 18 18h24c12 0 22-10 22-22v-4c0-16-12-32-30-32Z"
              fill="url(#fistRight)"
            />
            {/* 指の凹凸 */}
            <path d="M146 128h40" stroke="#FFE4E6" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <path d="M148 142h38" stroke="#FFE4E6" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
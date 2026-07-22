/**
 * HeroSection 装饰 SVG 插图
 * 抽象风信子花茎 + 数据流/代码行视觉主题
 * 纯 SVG + CSS 动画，无外部依赖
 */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 420" fill="none" className="w-full h-auto">
      <defs>
        <linearGradient id="hero-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(140,110,159,0.3)" />
          <stop offset="100%" stopColor="rgba(108,203,76,0.15)" />
        </linearGradient>
        <linearGradient id="hero-petal-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8C6E9F" />
          <stop offset="100%" stopColor="#B49BC4" />
        </linearGradient>
        <linearGradient id="hero-petal-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#862C3B" />
          <stop offset="100%" stopColor="#B33F4E" />
        </linearGradient>
        <linearGradient id="hero-petal-g3" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#6CCB4C" />
          <stop offset="100%" stopColor="#4A9E32" />
        </linearGradient>
        <filter id="hero-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 主茎 */}
      <path d="M240 420 Q240 280 230 180 Q225 120 240 60" stroke="url(#hero-stem)" strokeWidth="3" fill="none" opacity="0.6">
        <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
          M240 420 Q240 280 230 180 Q225 120 240 60;
          M240 420 Q235 280 240 180 Q245 120 240 60;
          M240 420 Q240 280 230 180 Q225 120 240 60"
        />
      </path>

      {/* 左侧分枝 */}
      <path d="M235 200 Q200 170 160 155" stroke="rgba(140,110,159,0.3)" strokeWidth="2" fill="none">
        <animate attributeName="d" dur="7s" repeatCount="indefinite" values="
          M235 200 Q200 170 160 155;
          M235 200 Q205 175 165 160;
          M235 200 Q200 170 160 155"
        />
      </path>
      {/* 右侧分枝 */}
      <path d="M238 150 Q280 125 320 120" stroke="rgba(180,155,196,0.3)" strokeWidth="2" fill="none">
        <animate attributeName="d" dur="9s" repeatCount="indefinite" values="
          M238 150 Q280 125 320 120;
          M238 150 Q275 120 315 115;
          M238 150 Q280 125 320 120"
        />
      </path>

      {/* 花序: 从上到下排列的风信子小花 */}
      {/* 顶部花簇 */}
      <g filter="url(#hero-glow)" opacity="0.7">
        <g transform="translate(240,55)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="0" cy="-14" rx="5" ry="12"
              fill="url(#hero-petal-g1)"
              transform={`rotate(${a} 0 0)`}
              opacity={0.5 + 0.3 * Math.sin(a * Math.PI / 180)}
            >
              <animate attributeName="opacity" dur="4s" repeatCount="indefinite"
                values={`${0.5 + 0.3 * Math.sin(a * Math.PI / 180)};${0.7 + 0.2 * Math.sin(a * Math.PI / 180)};${0.5 + 0.3 * Math.sin(a * Math.PI / 180)}`}
              />
            </ellipse>
          ))}
        </g>
      </g>

      {/* 左侧小花簇 */}
      <g filter="url(#hero-glow)" opacity="0.5">
        <g transform="translate(155,148)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="0" cy="-10" rx="4" ry="9"
              fill="url(#hero-petal-g2)"
              transform={`rotate(${a} 0 0)`}
              opacity={0.4 + 0.2 * Math.cos(a * Math.PI / 180)}
            >
              <animate attributeName="opacity" dur="5s" repeatCount="indefinite"
                values={`${0.4 + 0.2 * Math.cos(a * Math.PI / 180)};${0.6 + 0.15 * Math.cos(a * Math.PI / 180)};${0.4 + 0.2 * Math.cos(a * Math.PI / 180)}`}
              />
            </ellipse>
          ))}
        </g>
      </g>

      {/* 右侧小花簇 */}
      <g filter="url(#hero-glow)" opacity="0.5">
        <g transform="translate(325,115)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-9" rx="3.5" ry="8"
              fill="url(#hero-petal-g3)"
              transform={`rotate(${a} 0 0)`}
              opacity={0.4 + 0.2 * Math.sin(a * Math.PI / 180)}
            >
              <animate attributeName="opacity" dur="6s" repeatCount="indefinite"
                values={`${0.4 + 0.2 * Math.sin(a * Math.PI / 180)};${0.55 + 0.15 * Math.sin(a * Math.PI / 180)};${0.4 + 0.2 * Math.sin(a * Math.PI / 180)}`}
              />
            </ellipse>
          ))}
        </g>
      </g>

      {/* 数据流粒子: 沿茎流动的光点 */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} r="2" fill="#B49BC4" opacity="0.6">
          <animateMotion dur={`${3 + i * 0.7}s`} repeatCount="indefinite"
            path="M240 420 Q240 280 230 180 Q225 120 240 60"
            begin={`${i * 0.8}s`}
          />
          <animate attributeName="opacity" dur={`${3 + i * 0.7}s`} repeatCount="indefinite"
            values="0;0.8;0.8;0"
            begin={`${i * 0.8}s`}
          />
        </circle>
      ))}

      {/* 底部散落的代码行装饰 */}
      <g opacity="0.12" fontFamily="monospace" fontSize="11" fill="#B49BC4">
        <text x="60" y="350">{`const scan = vuln_detect(code);`}</text>
        <text x="50" y="370">{`if (scan.risk > THRESHOLD) {`}</text>
        <text x="60" y="390">{`  patch(scan.issues);`}</text>
        <text x="50" y="410">{`}`}</text>
      </g>

      {/* 浮动几何装饰: 安全相关的六边形 */}
      <g opacity="0.15">
        <polygon points="380,250 400,238 420,250 420,274 400,286 380,274" stroke="#8C6E9F" strokeWidth="1.5" fill="none">
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0.15;0.3;0.15" />
          <animateTransform attributeName="transform" type="rotate" dur="20s" repeatCount="indefinite" from="0 400 262" to="360 400 262" />
        </polygon>
      </g>
      <g opacity="0.12">
        <polygon points="80,280 95,272 110,280 110,296 95,304 80,296" stroke="#6CCB4C" strokeWidth="1.5" fill="none">
          <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0.12;0.25;0.12" />
          <animateTransform attributeName="transform" type="rotate" dur="25s" repeatCount="indefinite" from="0 95 288" to="-360 95 288" />
        </polygon>
      </g>

      {/* 盾牌图标 (安全) */}
      <g transform="translate(400,180)" opacity="0.2">
        <path d="M0,-20 L15,-12 L15,5 Q15,18 0,25 Q-15,18 -15,5 L-15,-12 Z"
          stroke="#B33F4E" strokeWidth="1.5" fill="none">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0.2;0.35;0.2" />
        </path>
      </g>
    </svg>
  );
}

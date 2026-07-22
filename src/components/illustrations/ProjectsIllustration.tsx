/**
 * ProjectsPage 装饰 SVG 插图
 * 开源项目主题: Git 分支图 + 代码仓库 + 贡献热力图
 */
export default function ProjectsIllustration() {
  return (
    <svg viewBox="0 0 800 240" fill="none" className="w-full h-auto">
      <defs>
        <linearGradient id="pj-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6CCB4C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4A9E32" stopOpacity="0.2" />
        </linearGradient>
        <filter id="pj-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Git 分支图 */}
      {/* main 分支线 */}
      <path d="M60 120 L260 120 L460 120 L660 120 L760 120" stroke="rgba(108,203,76,0.3)" strokeWidth="2" />

      {/* feature 分支 */}
      <path d="M160 120 Q180 80 220 75 L380 75" stroke="rgba(140,110,159,0.25)" strokeWidth="1.5" fill="none" />
      <path d="M380 75 Q400 75 420 90 L460 120" stroke="rgba(140,110,159,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" from="0" to="7" dur="2s" repeatCount="indefinite" />
      </path>

      {/* hotfix 分支 */}
      <path d="M360 120 Q380 170 420 175 L580 175" stroke="rgba(134,44,59,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M580 175 Q610 175 630 150 L660 120" stroke="rgba(134,44,59,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" from="0" to="7" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* commit 节点 - main */}
      {[
        { cx: 60, cy: 120 }, { cx: 160, cy: 120 }, { cx: 260, cy: 120 },
        { cx: 460, cy: 120 }, { cx: 660, cy: 120 }, { cx: 760, cy: 120 },
      ].map((n, i) => (
        <circle key={`m${i}`} cx={n.cx} cy={n.cy} r="5" fill="#6CCB4C" opacity="0.4">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`}
            values="0.3;0.6;0.3" />
        </circle>
      ))}

      {/* commit 节点 - feature */}
      {[
        { cx: 220, cy: 75 }, { cx: 300, cy: 75 }, { cx: 380, cy: 75 },
      ].map((n, i) => (
        <circle key={`f${i}`} cx={n.cx} cy={n.cy} r="4" fill="#8C6E9F" opacity="0.35">
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" begin={`${i * 0.7}s`}
            values="0.25;0.5;0.25" />
        </circle>
      ))}

      {/* commit 节点 - hotfix */}
      {[
        { cx: 420, cy: 175 }, { cx: 500, cy: 175 }, { cx: 580, cy: 175 },
      ].map((n, i) => (
        <circle key={`h${i}`} cx={n.cx} cy={n.cy} r="4" fill="#B33F4E" opacity="0.3">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" begin={`${i * 0.8}s`}
            values="0.2;0.4;0.2" />
        </circle>
      ))}

      {/* merge 点 */}
      <circle cx="460" cy="120" r="7" fill="none" stroke="#6CCB4C" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" dur="4s" repeatCount="indefinite" values="7;9;7" />
      </circle>
      <circle cx="660" cy="120" r="7" fill="none" stroke="#B33F4E" strokeWidth="1.5" opacity="0.25">
        <animate attributeName="r" dur="5s" repeatCount="indefinite" values="7;9;7" />
      </circle>

      {/* 分支标签 */}
      <text x="60" y="108" fontSize="10" fontFamily="monospace" fill="#6CCB4C" opacity="0.5">main</text>
      <text x="220" y="65" fontSize="10" fontFamily="monospace" fill="#8C6E9F" opacity="0.4">feature</text>
      <text x="420" y="192" fontSize="10" fontFamily="monospace" fill="#B33F4E" opacity="0.35">hotfix</text>

      {/* 右侧贡献热力图 (mini grid) */}
      <g transform="translate(660,30)" opacity="0.2">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => {
            const v = Math.sin(row * 3 + col * 2 + 1) * 0.5 + 0.5;
            const opacity = v > 0.7 ? 0.5 : v > 0.3 ? 0.25 : 0.08;
            return (
              <rect key={`${row}-${col}`}
                x={col * 7} y={row * 7}
                width="5" height="5" rx="1"
                fill="#6CCB4C" opacity={opacity} />
            );
          })
        )}
      </g>

      {/* 左侧终端装饰 */}
      <g transform="translate(20,35)" opacity="0.18">
        <rect x="0" y="0" width="90" height="50" rx="4" stroke="#8C6E9F" strokeWidth="1" fill="rgba(140,110,159,0.04)" />
        <circle cx="10" cy="8" r="3" fill="#B33F4E" opacity="0.5" />
        <circle cx="20" cy="8" r="3" fill="#B49BC4" opacity="0.4" />
        <circle cx="30" cy="8" r="3" fill="#6CCB4C" opacity="0.4" />
        <text x="8" y="28" fontSize="8" fontFamily="monospace" fill="#B49BC4" opacity="0.6">$ git push</text>
        <text x="8" y="40" fontSize="7" fontFamily="monospace" fill="#6CCB4C" opacity="0.4">✓ deployed</text>
      </g>

      {/* 流动光点 */}
      <circle r="2" fill="#6CCB4C" opacity="0">
        <animateMotion dur="5s" repeatCount="indefinite"
          path="M60 120 L260 120 L460 120 L660 120 L760 120" />
        <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0;0.7;0.7;0" />
      </circle>
    </svg>
  );
}

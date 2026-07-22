/**
 * ResearchPage 装饰 SVG 插图
 * 学术研究主题: 知识图谱节点网络 + 放大镜 + 文档元素
 */
export default function ResearchIllustration() {
  return (
    <svg viewBox="0 0 800 240" fill="none" className="w-full h-auto">
      <defs>
        <linearGradient id="res-g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8C6E9F" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B49BC4" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="res-g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#862C3B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#B33F4E" stopOpacity="0.15" />
        </linearGradient>
        <filter id="res-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景流线 */}
      <path d="M0 120 Q200 80 400 120 Q600 160 800 120" stroke="rgba(140,110,159,0.08)" strokeWidth="1" fill="none" />
      <path d="M0 140 Q200 100 400 140 Q600 180 800 140" stroke="rgba(180,155,196,0.06)" strokeWidth="1" fill="none" />

      {/* 知识图谱节点网络 */}
      {/* 连接线 */}
      {[
        ["160,90", "320,100"],
        ["320,100", "480,80"],
        ["480,80", "640,110"],
        ["320,100", "400,170"],
        ["160,90", "240,160"],
        ["480,80", "560,170"],
        ["640,110", "560,170"],
      ].map(([a, b], i) => (
        <line key={i}
          x1={a.split(",")[0]} y1={a.split(",")[1]}
          x2={b.split(",")[0]} y2={b.split(",")[1]}
          stroke="rgba(140,110,159,0.15)" strokeWidth="1"
          strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite" />
        </line>
      ))}

      {/* 节点 */}
      {[
        { cx: 160, cy: 90, r: 12, color: "#8C6E9F", label: "LLM", delay: 0 },
        { cx: 320, cy: 100, r: 16, color: "#862C3B", label: "安全", delay: 0.5 },
        { cx: 480, cy: 80, r: 10, color: "#6CCB4C", label: "内核", delay: 1 },
        { cx: 640, cy: 110, r: 8, color: "#B49BC4", label: "开源", delay: 1.5 },
        { cx: 400, cy: 170, r: 7, color: "#B33F4E", label: "", delay: 2 },
        { cx: 240, cy: 160, r: 6, color: "#8C6E9F", label: "", delay: 2.5 },
        { cx: 560, cy: 170, r: 9, color: "#6CCB4C", label: "", delay: 3 },
      ].map((node, i) => (
        <g key={i} filter="url(#res-glow)">
          <circle cx={node.cx} cy={node.cy} r={node.r}
            fill={node.color} opacity="0.5">
            <animate attributeName="opacity" dur="4s" repeatCount="indefinite"
              begin={`${node.delay}s`}
              values="0.3;0.6;0.3" />
            <animate attributeName="r" dur="4s" repeatCount="indefinite"
              begin={`${node.delay}s`}
              values={`${node.r};${node.r + 2};${node.r}`} />
          </circle>
          {node.label && (
            <text x={node.cx} y={node.cy - node.r - 8}
              textAnchor="middle" fill={node.color}
              fontSize="11" fontFamily="sans-serif" opacity="0.7">
              {node.label}
            </text>
          )}
        </g>
      ))}

      {/* 放大镜 (左侧) */}
      <g transform="translate(80,120)" opacity="0.25">
        <circle cx="0" cy="0" r="18" stroke="#B49BC4" strokeWidth="2" fill="none">
          <animate attributeName="r" dur="5s" repeatCount="indefinite" values="18;20;18" />
        </circle>
        <line x1="12" y1="12" x2="26" y2="26" stroke="#B49BC4" strokeWidth="2.5" strokeLinecap="round" />
        {/* 镜片内的文字装饰 */}
        <text x="-8" y="4" fontSize="8" fontFamily="monospace" fill="#B49BC4" opacity="0.6">&lt;/&gt;</text>
      </g>

      {/* 右侧文档/论文装饰 */}
      <g transform="translate(700,60)" opacity="0.2">
        <rect x="-25" y="0" width="50" height="65" rx="3" stroke="#8C6E9F" strokeWidth="1.5" fill="rgba(140,110,159,0.05)" />
        <line x1="-18" y1="12" x2="18" y2="12" stroke="#8C6E9F" strokeWidth="1" opacity="0.5" />
        <line x1="-18" y1="20" x2="10" y2="20" stroke="#8C6E9F" strokeWidth="1" opacity="0.4" />
        <line x1="-18" y1="28" x2="15" y2="28" stroke="#8C6E9F" strokeWidth="1" opacity="0.3" />
        <line x1="-18" y1="36" x2="8" y2="36" stroke="#8C6E9F" strokeWidth="1" opacity="0.3" />
        <line x1="-18" y1="44" x2="12" y2="44" stroke="#8C6E9F" strokeWidth="1" opacity="0.2" />
      </g>

      {/* 流动数据点 */}
      {[0, 1, 2].map((i) => (
        <circle key={i} r="2.5" fill="#B49BC4" opacity="0">
          <animateMotion dur="6s" repeatCount="indefinite" begin={`${i * 2}s`}
            path="M0 120 Q200 80 400 120 Q600 160 800 120" />
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" begin={`${i * 2}s`}
            values="0;0.6;0.6;0" />
        </circle>
      ))}
    </svg>
  );
}

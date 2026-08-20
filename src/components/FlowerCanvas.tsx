import { useEffect, useRef } from "react";

// Hero 画布：一株由光绘成的"安全风信子"——茎蔓生长、花瓣如数据流绽放、花粉微粒漂浮
export function FlowerCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      s: 0.15 + Math.random() * 0.5,
      a: Math.random() * Math.PI * 2,
    }));

    const petal = (x: number, y: number, ang: number, len: number, wid: number, col: string, glow: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(wid * 0.5, -len * 0.35, wid * 0.45, -len * 0.8, 0, -len);
      ctx.bezierCurveTo(-wid * 0.45, -len * 0.8, -wid * 0.5, -len * 0.35, 0, 0);
      ctx.shadowColor = col;
      ctx.shadowBlur = glow;
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      const stemX = w * 0.5;
      const stemBot = h * 0.94;
      const stemTop = h * 0.3;
      const grow = Math.min(1, time / 3.2);
      const sway = Math.sin(time * 0.6) * 6;
      const stemLen = (stemBot - stemTop) * grow;

      // 茎
      ctx.beginPath();
      ctx.moveTo(stemX, stemBot);
      ctx.quadraticCurveTo(stemX + sway * 0.4, stemBot - stemLen * 0.5, stemX + sway, stemTop + (stemBot - stemTop) * (1 - grow));
      ctx.strokeStyle = "rgba(94, 234, 212, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 花簇：自下而上依次绽放
      const clusters = 7;
      for (let c = 0; c < clusters; c++) {
        const p = c / (clusters - 1);
        const cy = stemBot - stemLen * (0.12 + p * 0.82);
        const bloom = Math.max(0, Math.min(1, (time - 0.5 - p * 0.45) / 0.9));
        if (bloom <= 0) continue;
        const cx = stemX + sway * p * 0.9;
        const n = 6;
        const baseAng = Math.sin(time * 0.5 + c) * 0.18;
        for (let j = 0; j < n; j++) {
          const ang = (Math.PI * 2 * j) / n + baseAng + (1 - bloom) * Math.PI;
          const shimmer = 1 + 0.05 * Math.sin(time * 1.6 + j * 1.3 + c);
          const len = (11 + 6 * Math.sin(c * 2.1 + j)) * (0.5 + bloom * 0.5) * (1 - p * 0.15) * shimmer;
          const wid = len * 0.34;
          const col = c % 2 === 0 ? "rgba(45, 212, 191, 0.72)" : "rgba(139, 92, 246, 0.72)";
          petal(cx, cy, ang, len, wid, col, 10);
        }
        // 花心微光
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
        g.addColorStop(0, "rgba(251, 191, 36, 0.32)");
        g.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // 花粉微粒
      for (const pt of particles) {
        pt.y -= pt.s * 0.0016;
        pt.x += Math.sin(time * 0.8 + pt.a) * 0.0004;
        if (pt.y < -0.02) {
          pt.y = 1.02;
          pt.x = Math.random();
        }
        const alpha = 0.25 + 0.35 * Math.sin(time * 2 + pt.a);
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0, alpha)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="flower-canvas" aria-hidden="true" />;
}

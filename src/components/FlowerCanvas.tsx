import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  s: number;
  a: number;
  vx: number;
  vy: number;
  life: number;
}

// Hero 画布：一朵由光绘成的"安全风信子"——无茎、放射状绽放，花瓣如数据流。
// 交互：光标左右轻移花心，点击激起花粉迸射。
export function FlowerCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement ?? canvas;

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

    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      s: 0.15 + Math.random() * 0.5,
      a: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0,
      life: Infinity,
    }));

    const burst = (nx: number, ny: number) => {
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 0.002 + Math.random() * 0.006;
        particles.push({
          x: nx,
          y: ny,
          r: 1 + Math.random() * 1.8,
          s: 0,
          a: ang,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 90,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
    };
    const onClick = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      burst((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
    };
    host.addEventListener("mousemove", onMove);
    host.addEventListener("click", onClick);

    // 放射状花瓣（指向 +x 方向，旋转后朝外）
    const petal = (x: number, y: number, ang: number, len: number, wid: number, col: string, glow: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(len * 0.34, wid * 0.5, len * 0.8, wid * 0.45, len, 0);
      ctx.bezierCurveTo(len * 0.8, -wid * 0.45, len * 0.34, -wid * 0.5, 0, 0);
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
      const cx = w * 0.6;
      const cy = h * 0.46;
      const sway = (mouse.current.x - 0.5) * 30;
      const grow = Math.min(1, time / 2.6);

      // 光晕
      const halo = ctx.createRadialGradient(cx + sway, cy, 0, cx + sway, cy, 130 * grow);
      halo.addColorStop(0, "rgba(139, 92, 246, 0.14)");
      halo.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx + sway, cy, 130 * grow, 0, Math.PI * 2);
      ctx.fill();

      // 两圈放射花瓣：内圈 6 片紫、外圈 9 片青
      const rings = [
        { n: 6, base: 30, w: 0.34, col: "rgba(139, 92, 246, 0.75)", off: 0.0 },
        { n: 9, base: 52, w: 0.28, col: "rgba(45, 212, 191, 0.72)", off: 0.35 },
      ];
      for (const ring of rings) {
        for (let j = 0; j < ring.n; j++) {
          const ang = (Math.PI * 2 * j) / ring.n + ring.off + Math.sin(time * 0.4 + j) * 0.06;
          const bloom = Math.max(0, Math.min(1, (time - 0.4 - ring.off - j * 0.05) / 0.9));
          if (bloom <= 0) continue;
          const shimmer = 1 + 0.05 * Math.sin(time * 1.7 + j * 1.4);
          const len = ring.base * (0.4 + bloom * 0.6) * shimmer;
          petal(cx + sway, cy, ang, len, len * ring.w, ring.col, 12);
        }
      }

      // 花心
      const g = ctx.createRadialGradient(cx + sway, cy, 0, cx + sway, cy, 20);
      g.addColorStop(0, "rgba(251, 191, 36, 0.5)");
      g.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + sway, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      // 花粉微粒（环境漂浮 + 点击迸射）
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        if (pt.life !== Infinity) {
          pt.life--;
          if (pt.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.00004;
        } else {
          pt.y -= pt.s * 0.0016;
          pt.x += Math.sin(time * 0.8 + pt.a) * 0.0004;
          if (pt.y < -0.02) {
            pt.y = 1.02;
            pt.x = Math.random();
          }
        }
        const alpha =
          pt.life === Infinity ? 0.25 + 0.35 * Math.sin(time * 2 + pt.a) : Math.max(0, Math.min(1, pt.life / 30));
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} className="flower-canvas" aria-hidden="true" />;
}

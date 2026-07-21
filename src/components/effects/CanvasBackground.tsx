import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
  layer: number;
  floatOffset: number;
  floatSpeed: number;
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!canvas || !ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    const colors = [
      "rgba(140, 110, 159,",
      "rgba(180, 155, 196,",
      "rgba(134, 44, 59,",
      "rgba(179, 63, 78,",
      "rgba(108, 203, 76,",
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < 80; i++) {
        const layer = i < 25 ? 0 : i < 55 ? 1 : 2;
        const distMin = layer === 0 ? 80 : layer === 1 ? 180 : 320;
        const distMax = layer === 0 ? 140 : layer === 1 ? 280 : 470;
        const dist = distMin + Math.random() * (distMax - distMin);
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          radius:
            layer === 0
              ? 2 + Math.random() * 2
              : layer === 1
                ? 1.5 + Math.random() * 1.5
                : 1 + Math.random() * 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle,
          speed: (0.0002 + Math.random() * 0.0003) * (layer === 0 ? 1 : layer === 1 ? 0.7 : 0.4),
          layer,
          floatOffset: Math.random() * Math.PI * 2,
          floatSpeed: 0.001 + Math.random() * 0.002,
        });
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function draw() {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
      glow.addColorStop(0, "rgba(140, 110, 159, 0.08)");
      glow.addColorStop(1, "rgba(140, 110, 159, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Orbit
        p.angle += p.speed;
        const baseX = cx + Math.cos(p.angle) * Math.hypot(p.x - cx, p.y - cy);
        const baseY = cy + Math.sin(p.angle) * Math.hypot(p.x - cx, p.y - cy);

        // Float
        const floatX = Math.sin(Date.now() * p.floatSpeed + p.floatOffset) * 8;
        const floatY = Math.cos(Date.now() * p.floatSpeed + p.floatOffset) * 6;

        let px = baseX + floatX;
        let py = baseY + floatY;

        // Mouse repulsion
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const distMouse = Math.hypot(dx, dy);
        if (distMouse < 150) {
          const force = ((150 - distMouse) / 150) * 20;
          px += (dx / distMouse) * force;
          py += (dy / distMouse) * force;
        }

        p.x = px;
        p.y = py;

        // Draw particle
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 3);
        gradient.addColorStop(0, p.color + " " + (p.layer === 0 ? "0.8)" : p.layer === 1 ? "0.5)" : "0.3)"));
        gradient.addColorStop(1, p.color + " 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Connection lines (same layer only)
        for (let j = idx + 1; j < particles.length; j++) {
          const other = particles[j];
          if (other.layer !== p.layer) continue;
          const d = Math.hypot(px - other.x, py - other.y);
          if (d < 80) {
            ctx.strokeStyle = p.color + " " + (0.08 * (1 - d / 80)) + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

import { useEffect, useRef } from "react";

interface Petal {
  cx: number;
  cy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  dx: number;
  dy: number;
  layer: number;
  phase: number;
}

const COLORS = [
  "rgba(140, 110, 159,",   // hyacinth-light
  "rgba(180, 155, 196,",   // hyacinth-lavender
  "rgba(134, 44, 59,",    // hyacinth-crimson
  "rgba(179, 63, 78,",    // hyacinth-red
  "rgba(108, 203, 76,",   // hyacinth-green
];

export default function CanvasBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;";
    container.appendChild(svg);

    let W = window.innerWidth;
    let H = window.innerHeight;
    let petals: Petal[] = [];
    let edges: [number, number][] = [];

    // defs: glow filter
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "petal-glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    const blur = document.createElementNS(svgNS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "3");
    blur.setAttribute("result", "blur");
    filter.appendChild(blur);
    const merge = document.createElementNS(svgNS, "feMerge");
    const mn1 = document.createElementNS(svgNS, "feMergeNode");
    mn1.setAttribute("in", "blur");
    merge.appendChild(mn1);
    const mn2 = document.createElementNS(svgNS, "feMergeNode");
    mn2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mn2);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // central glow
    const centerGlow = document.createElementNS(svgNS, "circle");
    centerGlow.setAttribute("cx", "50%");
    centerGlow.setAttribute("cy", "40%");
    centerGlow.setAttribute("r", "350");
    centerGlow.setAttribute("fill", "url(#centerRadial)");
    const radGrad = document.createElementNS(svgNS, "radialGradient");
    radGrad.setAttribute("id", "centerRadial");
    const s1 = document.createElementNS(svgNS, "stop");
    s1.setAttribute("offset", "0%");
    s1.setAttribute("stop-color", "rgba(140,110,159,0.06)");
    const s2 = document.createElementNS(svgNS, "stop");
    s2.setAttribute("offset", "100%");
    s2.setAttribute("stop-color", "rgba(140,110,159,0)");
    radGrad.appendChild(s1);
    radGrad.appendChild(s2);
    defs.appendChild(radGrad);
    svg.appendChild(centerGlow);

    // edges group
    const edgeGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(edgeGroup);

    // petals group
    const petalGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(petalGroup);

    function createPetalPath(size: number): string {
      // stylized hyacinth petal: teardrop with slight curve
      const s = Math.max(4, size);
      return `M0,${-s * 2} C${s * 0.8},${-s * 1.2} ${s * 0.6},${s * 0.4} 0,${s * 1.2} C${-s * 0.6},${s * 0.4} ${-s * 0.8},${-s * 1.2} 0,${-s * 2}Z`;
    }

    function init() {
      // clear
      while (petalGroup.firstChild) petalGroup.removeChild(petalGroup.firstChild);
      while (edgeGroup.firstChild) edgeGroup.removeChild(edgeGroup.firstChild);

      petals = [];
      edges = [];
      const count = Math.min(35, Math.floor((W * H) / 40000));

      for (let i = 0; i < count; i++) {
        const layer = i < count * 0.3 ? 0 : i < count * 0.65 ? 1 : 2;
        const size =
          layer === 0
            ? 8 + Math.random() * 6
            : layer === 1
              ? 5 + Math.random() * 4
              : 3 + Math.random() * 3;
        const opacity =
          layer === 0 ? 0.25 + Math.random() * 0.15 : layer === 1 ? 0.15 + Math.random() * 0.1 : 0.08 + Math.random() * 0.08;

        const petal: Petal = {
          cx: Math.random() * W,
          cy: Math.random() * H,
          size,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity,
          rotation: Math.random() * 360,
          rotSpeed: (0.05 + Math.random() * 0.15) * (Math.random() > 0.5 ? 1 : -1),
          dx: (Math.random() - 0.5) * 0.15 * (layer === 0 ? 1 : 0.5),
          dy: (Math.random() - 0.5) * 0.1 * (layer === 0 ? 1 : 0.5),
          layer,
          phase: Math.random() * Math.PI * 2,
        };
        petals.push(petal);

        // create SVG path element
        const el = document.createElementNS(svgNS, "path");
        el.setAttribute("d", createPetalPath(size));
        el.setAttribute("fill", petal.color + " " + petal.opacity + ")");
        el.setAttribute("filter", "url(#petal-glow)");
        petalGroup.appendChild(el);
      }

      // pre-compute edges (pairs within distance threshold)
      for (let i = 0; i < petals.length; i++) {
        for (let j = i + 1; j < petals.length; j++) {
          if (petals[i].layer !== petals[j].layer) continue;
          const d = Math.hypot(petals[i].cx - petals[j].cx, petals[i].cy - petals[j].cy);
          if (d < 200) {
            edges.push([i, j]);
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("stroke", petals[i].color + " 0.04)");
            line.setAttribute("stroke-width", "0.5");
            edgeGroup.appendChild(line);
          }
        }
      }
    }

    let t = 0;
    function draw() {
      t += 0.016;

      // update petals
      petals.forEach((p, i) => {
        // drift
        p.cx += p.dx + Math.sin(t * 0.3 + p.phase) * 0.3;
        p.cy += p.dy + Math.cos(t * 0.2 + p.phase) * 0.2;
        p.rotation += p.rotSpeed;

        // wrap
        if (p.cx < -60) p.cx = W + 60;
        if (p.cx > W + 60) p.cx = -60;
        if (p.cy < -60) p.cy = H + 60;
        if (p.cy > H + 60) p.cy = -60;

        // update SVG element
        const el = petalGroup.children[i] as SVGElement;
        if (!el) return;
        el.setAttribute(
          "transform",
          `translate(${p.cx},${p.cy}) rotate(${p.rotation})`
        );
      });

      // update edges
      edges.forEach((e, i) => {
        const a = petals[e[0]];
        const b = petals[e[1]];
        const d = Math.hypot(a.cx - b.cx, a.cy - b.cy);
        if (d > 200) {
          const line = edgeGroup.children[i] as SVGElement;
          if (line) line.setAttribute("opacity", "0");
          return;
        }
        const alpha = 0.06 * (1 - d / 200);
        const line = edgeGroup.children[i] as SVGElement;
        if (line) {
          line.setAttribute("x1", String(a.cx));
          line.setAttribute("y1", String(a.cy));
          line.setAttribute("x2", String(b.cx));
          line.setAttribute("y2", String(b.cy));
          line.setAttribute("stroke", a.color + " " + alpha + ")");
          line.setAttribute("opacity", "1");
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      centerGlow.setAttribute("cx", String(W * 0.5));
      centerGlow.setAttribute("cy", String(H * 0.4));
      init();
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      container.removeChild(svg);
    };
  }, []);

  return <div ref={containerRef} />;
}

import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  speed: number;
}

/** Канвас со «светлячками» — светящиеся частицы с плавным дрейфом */
export default function Fireflies({ count = 42 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let flies: Firefly[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flies = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const f of flies) {
        f.x += f.vx + Math.sin(t / 2400 + f.phase) * 0.18 * f.speed;
        f.y += f.vy + Math.cos(t / 3000 + f.phase) * 0.12 * f.speed;
        if (f.x < -20) f.x = w + 20;
        if (f.x > w + 20) f.x = -20;
        if (f.y < -20) f.y = h + 20;
        if (f.y > h + 20) f.y = -20;

        const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 900 * f.speed + f.phase));
        const R = f.r * (4 + glow * 4);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
        g.addColorStop(0, `rgba(255, 150, 60, ${0.5 * glow})`);
        g.addColorStop(0.4, `rgba(255, 107, 0, ${0.18 * glow})`);
        g.addColorStop(1, "rgba(255, 107, 0, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 190, 120, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="firefly-canvas" aria-hidden="true" />;
}

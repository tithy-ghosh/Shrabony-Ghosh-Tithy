"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

/**
 * Lightweight particle constellation drawn on a canvas.
 * Automatically degrades: fewer particles on small/reduced-motion devices.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    let running = true;

    const count = () => {
      const area = w * h;
      const base = Math.round(area / 16000);
      return Math.max(28, Math.min(reduced ? 30 : 80, base));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: count() }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue("--accent").trim() || "#0f766e";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.55;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.globalAlpha = (1 - dist / 130) * 0.22;
            ctx.lineWidth = 1;
            ctx.strokeStyle = accent;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduced) {
      draw();
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            loop();
          } else if (!entry.isIntersecting) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      running = true;
      loop();
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

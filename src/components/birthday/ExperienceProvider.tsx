import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { BirthdayMusic } from "@/lib/music";

type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string;
  kind: "confetti" | "spark"; rot: number; vr: number;
};

type Experience = {
  soundOn: boolean;
  toggleSound: () => void;
  celebrate: (opts?: { fireworks?: boolean }) => void;
  chime: () => void;
};

const ExperienceContext = createContext<Experience | null>(null);

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside ExperienceProvider");
  return ctx;
}

function readColors(names: string[]) {
  const style = getComputedStyle(document.documentElement);
  return names.map((n) => style.getPropertyValue(n).trim()).filter(Boolean);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [soundOn, setSoundOn] = useState(false);
  const musicRef = useRef<BirthdayMusic | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      musicRef.current?.stop();
      if (raf.current) cancelAnimationFrame(raf.current);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const toggleSound = useCallback(() => {
    if (!musicRef.current) musicRef.current = new BirthdayMusic();
    const m = musicRef.current;
    if (m.playing) {
      m.stop();
      setSoundOn(false);
    } else {
      void m.start().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    }
  }, []);

  const chime = useCallback(() => musicRef.current?.chime(), []);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    particles.current = particles.current.filter((p) => p.life < p.maxLife && p.y < h + 40);
    for (const p of particles.current) {
      p.life++;
      if (p.kind === "confetti") {
        p.vy = Math.min(p.vy + 0.05, 3.2);
        p.vx *= 0.99;
        p.x += p.vx + Math.sin(p.life / 12) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, (p.maxLife - p.life) / 40);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else {
        p.vy += 0.035;
        p.vx *= 0.975;
        p.vy *= 0.975;
        p.x += p.vx;
        p.y += p.vy;
        const a = 1 - p.life / p.maxLife;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + a * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    ctx.globalAlpha = 1;

    if (particles.current.length > 0) {
      raf.current = requestAnimationFrame(loop);
    } else {
      raf.current = null;
      ctx.clearRect(0, 0, w, h);
    }
  }, []);

  const kick = useCallback(() => {
    if (raf.current == null) raf.current = requestAnimationFrame(loop);
  }, [loop]);

  const celebrate = useCallback(
    (opts?: { fireworks?: boolean }) => {
      musicRef.current?.chime();
      if (reduce) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const confettiColors = readColors(["--rose", "--gold", "--peach", "--blush", "--code-cyan", "--code-pink"]);
      const goldColors = readColors(["--gold", "--gold-soft", "--starlight"]);
      const count = w < 640 ? 110 : 180;
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * w,
          y: -20 - Math.random() * h * 0.5,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          life: 0,
          maxLife: 320 + Math.random() * 120,
          size: 7 + Math.random() * 7,
          color: confettiColors[i % confettiColors.length],
          kind: "confetti",
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.2,
        });
      }
      if (opts?.fireworks) {
        for (let b = 0; b < 6; b++) {
          const t = window.setTimeout(() => {
            const cx = w * (0.15 + Math.random() * 0.7);
            const cy = h * (0.15 + Math.random() * 0.35);
            const n = w < 640 ? 40 : 60;
            for (let i = 0; i < n; i++) {
              const angle = (Math.PI * 2 * i) / n;
              const speed = 2.2 + Math.random() * 2.4;
              particles.current.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0, maxLife: 70 + Math.random() * 40,
                size: 2.2 + Math.random() * 1.6,
                color: goldColors[i % goldColors.length],
                kind: "spark", rot: 0, vr: 0,
              });
            }
            kick();
          }, b * 420);
          timers.current.push(t);
        }
      }
      kick();
    },
    [kick, reduce],
  );

  const value = useMemo(() => ({ soundOn, toggleSound, celebrate, chime }), [soundOn, toggleSound, celebrate, chime]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />
    </ExperienceContext.Provider>
  );
}

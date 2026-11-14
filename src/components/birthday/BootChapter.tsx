import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Rocket, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToChapter } from "./Chrome";

const BOOT_LINES = [
  { at: 5, text: "Mounting /home/abi/heart ............ OK" },
  { at: 18, text: "Loading headphones driver ........... OK" },
  { at: 32, text: "Muting meeting notifications ........ OK" },
  { at: 46, text: "Compiling smiles (x1000) ............ OK" },
  { at: 60, text: "Injecting birthday.spec.ts .......... OK" },
  { at: 74, text: "Wrapping gifts with care ............ OK" },
  { at: 88, text: "Lighting candles .................... OK" },
  { at: 100, text: "Birthday surprise ready. ♥" },
];

export function BootChapter() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const done = progress >= 100;

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      return;
    }
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 3));
      setProgress(value);
      if (value >= 100) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [reduce]);

  const filled = Math.round(progress / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);

  return (
    <section
      id="boot"
      aria-labelledby="boot-title"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-terminal-glow px-5 py-20 text-terminal-foreground"
    >
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" aria-hidden="true" />

      <div className="relative w-full max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-center font-display text-lg italic text-code-pink sm:text-xl"
        >
          A little birthday surprise, made with all my heart.
        </motion.p>

        <div className="overflow-hidden rounded-2xl border border-terminal-line bg-terminal/80 shadow-window backdrop-blur">
          <div className="flex items-center gap-2 border-b border-terminal-line bg-terminal-raised px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-code-red" />
            <span className="h-3 w-3 rounded-full bg-code-amber" />
            <span className="h-3 w-3 rounded-full bg-code-green" />
            <span className="ml-3 font-mono text-xs text-terminal-muted">abi@workstation: ~/birthday</span>
          </div>

          <div className="p-5 font-mono text-[13px] leading-relaxed sm:p-7 sm:text-sm">
            <h1 id="boot-title" className="text-glow-green text-2xl font-bold tracking-tight text-code-green sm:text-4xl">
              ABIRAMI.EXE
            </h1>
            <p className="mt-1 text-terminal-foreground">Birthday Release 2026</p>
            <p className="mt-4 text-terminal-muted">
              <span className="text-code-cyan">$</span> Initializing birthday surprise...
            </p>

            <ul className="mt-3 space-y-0.5 text-terminal-muted" aria-hidden="true">
              {BOOT_LINES.filter((l) => progress >= l.at).map((l) => (
                <motion.li key={l.text} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="truncate">
                  <span className="text-code-green">✓</span> {l.text}
                </motion.li>
              ))}
            </ul>

            <div className="mt-5" role="progressbar" aria-label="Loading birthday surprise" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-code-green">[{bar}]</span>
                <span className="tabular-nums text-terminal-foreground">{String(progress).padStart(3, " ")}%</span>
              </div>
            </div>

            {!done && <span className="caret-blink mt-3 inline-block h-4 w-2 bg-code-green align-middle" aria-hidden="true" />}
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <p className="font-display text-2xl leading-snug text-terminal-foreground sm:text-3xl">
                Hey Abi! <Heart className="inline h-6 w-6 -translate-y-0.5 fill-code-pink text-code-pink" aria-hidden="true" />
                <br />
                <span className="text-terminal-muted">Your system has received one</span>{" "}
                <span className="text-gold-gradient italic">very special update.</span>
              </p>
              <Button variant="terminal" size="xl" className="mt-7" onClick={() => scrollToChapter("dashboard")}>
                <Rocket /> Launch Birthday Surprise
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

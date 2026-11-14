import { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Briefcase, Smile, BookOpen, Headphones, ShieldCheck, HandHeart, Mountain, Sparkles, Heart, Eye, EyeOff, ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { REASONS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { scrollToChapter } from "./Chrome";

const ICONS = [Flame, Briefcase, Smile, BookOpen, Headphones, ShieldCheck, HandHeart, Mountain, Sparkles, Heart];

function ReasonCard({ index, text, flipped, onToggle }: { index: number; text: string; flipped: boolean; onToggle: () => void }) {
  const Icon = ICONS[index];
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: (index % 5) * 0.06, duration: 0.5 }}
      className="perspective-card"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={flipped}
        aria-label={flipped ? `Reason ${index + 1}: ${text}` : `Reveal reason ${index + 1}`}
        className="group relative block aspect-[3/4] w-full rounded-2xl text-left"
      >
        <span
          className={cn(
            "preserve-3d relative block h-full w-full rounded-2xl transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
            flipped && "rotate-y-180",
          )}
        >
          {/* front */}
          <span
            aria-hidden={flipped}
            className="backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-rose/25 bg-card p-4 shadow-soft transition-shadow group-hover:shadow-glow-rose sm:p-5"
          >
            <span className="font-display text-4xl font-semibold text-rose/80 sm:text-5xl">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush text-rose-deep">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Tap to open</span>
            <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-peach/60 blur-2xl" />
          </span>
          {/* back */}
          <span
            aria-hidden={!flipped}
            className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl bg-rose-gradient p-4 text-primary-foreground shadow-glow-rose sm:p-5"
          >
            <Icon className="h-5 w-5 opacity-80" aria-hidden="true" />
            <span className="font-display text-lg font-medium italic leading-snug sm:text-xl">{text}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">Reason #{index + 1}</span>
          </span>
        </span>
      </button>
    </motion.li>
  );
}

export function ReasonsChapter() {
  const [flipped, setFlipped] = useState<boolean[]>(() => REASONS.map(() => false));
  const count = flipped.filter(Boolean).length;
  const allOpen = count === REASONS.length;

  return (
    <section id="reasons" aria-labelledby="reasons-title" className="relative overflow-hidden bg-romance px-4 py-24 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-peach/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold-soft/60 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-deep">Chapter 05 · Test results of the heart</p>
          <h2 id="reasons-title" className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            Ten Reasons Why <span className="text-rose-gradient italic">Abi</span> Is Special
          </h2>
          <p className="mt-4 text-muted-foreground">Tap each card. All ten assertions are guaranteed to pass.</p>
        </header>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {REASONS.map((r, i) => (
            <ReasonCard
              key={r}
              index={i}
              text={r}
              flipped={flipped[i]}
              onToggle={() => setFlipped((f) => f.map((v, j) => (j === i ? !v : v)))}
            />
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="font-mono text-sm text-ink" aria-live="polite">
            <span className="text-rose-deep">{count}</span>/10 reasons opened {allOpen && "· 10 passed, 0 failed ✓"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="softOutline" size="lg" onClick={() => setFlipped(REASONS.map(() => !allOpen))}>
              {allOpen ? <EyeOff /> : <Eye />} {allOpen ? "Close all" : "Open all"}
            </Button>
            <Button variant="romance" size="lg" onClick={() => scrollToChapter("letter")}>
              A letter for you <ArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

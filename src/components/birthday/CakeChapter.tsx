import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Wind, Sparkles, RotateCcw, ArrowDown, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PEOPLE } from "@/lib/content";
import garden from "@/assets/fairytale-garden.webp";
import { useExperience } from "./ExperienceProvider";
import { scrollToChapter } from "./Chrome";

const CANDLES = [0, 1, 2];
const DRIPS = [14, 22, 10, 26, 16, 12, 24, 18, 10];

function Candle({ lit, index }: { lit: boolean; index: number }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-8 w-5">
        <AnimatePresence>
          {lit && (
            <motion.div
              key="flame"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: -6, transition: { duration: 0.35, delay: index * 0.12 } }}
              className="absolute inset-x-0 bottom-0 mx-auto h-7 w-4"
            >
              <div className="flame h-full w-full" style={{ animationDelay: `${index * 0.3}s` }} />
            </motion.div>
          )}
        </AnimatePresence>
        {!lit &&
          [0, 1, 2].map((p) => (
            <motion.span
              key={p}
              aria-hidden="true"
              initial={{ opacity: 0.6, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -46 - p * 10, x: (p - 1) * 8, scale: 1.6 }}
              transition={{ duration: 1.8, delay: index * 0.12 + p * 0.25 }}
              className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-muted-foreground/40 blur-[2px]"
            />
          ))}
      </div>
      <div className="h-1.5 w-0.5 bg-ink" />
      <div className="candle-stripes h-14 w-3.5 rounded-sm shadow-soft" />
    </div>
  );
}

function Cake({ lit }: { lit: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto flex w-[min(100%,20rem)] flex-col items-center sm:w-[22rem]"
      role="img"
      aria-label={lit ? "A three-tier birthday cake with three lit candles" : "A birthday cake with the candles blown out"}
    >
      <div className="relative z-10 -mb-1 flex gap-6">
        {CANDLES.map((i) => (
          <Candle key={i} lit={lit} index={i} />
        ))}
      </div>

      {/* top tier */}
      <div className="relative h-16 w-[45%] overflow-hidden rounded-t-2xl bg-blush shadow-soft">
        <div className="absolute inset-x-0 top-0 h-4 bg-cream" />
        <div className="absolute inset-x-0 top-3 flex justify-around">
          {DRIPS.slice(0, 5).map((h, i) => (
            <span key={i} className="w-3 rounded-b-full bg-cream" style={{ height: h * 0.7 }} />
          ))}
        </div>
      </div>
      {/* middle tier */}
      <div className="sprinkles relative h-20 w-[70%] overflow-hidden rounded-t-xl bg-rose shadow-soft">
        <div className="absolute inset-x-0 top-0 h-3 bg-cream" />
        <div className="absolute inset-x-0 top-2 flex justify-around">
          {DRIPS.slice(0, 7).map((h, i) => (
            <span key={i} className="w-3.5 rounded-b-full bg-cream" style={{ height: h }} />
          ))}
        </div>
      </div>
      {/* bottom tier */}
      <div className="relative h-24 w-full overflow-hidden rounded-t-xl bg-cream shadow-soft">
        <div className="piping absolute inset-x-0 top-0 h-4 opacity-100 [--cream:var(--blush)]" />
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-gold-gradient opacity-80" />
        <div className="absolute inset-x-0 bottom-3 flex justify-around text-rose" aria-hidden="true">
          {["♥", "✿", "♥", "✿", "♥", "✿", "♥"].map((c, i) => (
            <span key={i} className="text-sm">{c}</span>
          ))}
        </div>
      </div>
      {/* plate */}
      <div className="h-4 w-[112%] rounded-[50%] bg-gold-gradient shadow-glow-gold" />
    </motion.div>
  );
}

export function CakeChapter() {
  const { celebrate } = useExperience();
  const [lit, setLit] = useState(true);
  const [round, setRound] = useState(0);

  const blow = () => {
    setLit(false);
    window.setTimeout(() => celebrate({ fireworks: true }), 450);
  };

  const relight = () => {
    setLit(true);
    setRound((r) => r + 1);
  };

  return (
    <section id="cake" aria-labelledby="cake-title" className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-8">
      <img
        src={garden}
        alt=""
        loading="lazy"
        decoding="async"
        width={1080}
        height={1350}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blush via-cream/60 to-cream/85" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-rose-deep"
        >
          Chapter 04 · Make a wish
        </motion.p>
        <motion.h2
          id="cake-title"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-rose-gradient mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl"
        >
          HAPPY BIRTHDAY ABI!
        </motion.h2>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-1.5 font-mono text-xs text-ink backdrop-blur">
          <CalendarHeart className="h-3.5 w-3.5 text-rose-deep" aria-hidden="true" /> {PEOPLE.birthdayLabel}
        </p>

        <div className="mt-14">
          <Cake key={round} lit={lit} />
        </div>

        <div className="mt-10 min-h-36" aria-live="polite">
          <AnimatePresence mode="wait">
            {lit ? (
              <motion.div key="blow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="romance" size="xl" onClick={blow}>
                  <Wind /> Blow the Candles
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">Close your eyes first. Then tap.</p>
              </motion.div>
            ) : (
              <motion.div
                key="wish"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <p className="font-display text-3xl italic text-ink sm:text-4xl">
                  <Sparkles className="mr-2 inline h-6 w-6 text-gold" aria-hidden="true" />
                  Make a beautiful wish, Abi!
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="softOutline" size="lg" onClick={relight}>
                    <RotateCcw /> Light them again
                  </Button>
                  <Button variant="gold" size="lg" onClick={() => scrollToChapter("reasons")}>
                    Next surprise <ArrowDown />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

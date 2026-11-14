import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Flower2, CheckCircle2, Sparkles, RotateCcw, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FINAL_MESSAGE, PEOPLE } from "@/lib/content";
import meadow from "@/assets/starry-meadow.webp";
import { useExperience } from "./ExperienceProvider";
import { scrollToChapter } from "./Chrome";

// Deterministic pseudo-random so server and browser render identical decorations.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function useDecor() {
  return useMemo(() => {
    const r = seeded(23112026);
    const stars = Array.from({ length: 40 }, () => ({
      left: r() * 100, top: r() * 60, size: 1 + r() * 2.5, delay: r() * 3,
    }));
    const floaters = Array.from({ length: 14 }, (_, i) => ({
      left: r() * 100, delay: r() * 10, duration: 12 + r() * 10, size: 14 + r() * 16, kind: i % 3 === 0 ? "heart" : "flower",
    }));
    return { stars, floaters };
  }, []);
}

export function FinaleChapter() {
  const reduce = useReducedMotion();
  const { celebrate } = useExperience();
  const { stars, floaters } = useDecor();
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    setRevealed(true);
    window.setTimeout(() => celebrate({ fireworks: true }), reduce ? 0 : 2600);
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.45 } } };
  const item = { hidden: { opacity: 0, y: 16, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9 } } };

  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-night-gradient px-4 py-24 text-night-foreground sm:px-8"
    >
      <img src={meadow} alt="" loading="lazy" decoding="async" width={1080} height={1350} className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/30 to-night/60" aria-hidden="true" />

      {/* stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-starlight"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      {/* floating flowers & hearts */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {floaters.map((f, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0"
              style={{ left: `${f.left}%` }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: "-110vh", opacity: [0, 0.9, 0.9, 0], rotate: [0, 40, -20, 60] }}
              transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
            >
              {f.kind === "heart" ? (
                <Heart className="fill-code-pink/60 text-code-pink/60" style={{ width: f.size, height: f.size }} />
              ) : (
                <Flower2 className="text-blush/70" style={{ width: f.size, height: f.size }} />
              )}
            </motion.span>
          ))}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-starlight/80">Chapter 07 · Final surprise</p>

        <motion.h2
          id="finale-title"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-6 font-mono text-3xl font-bold leading-tight sm:text-5xl"
        >
          <span className="text-glow-gold text-gold">404:</span> Birthday Girl Not Allowed To Work!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mt-4 font-mono text-base text-night-foreground/80 sm:text-lg"
        >
          Reason: <span className="text-code-pink">Too Special To Be Busy Today.</span>
        </motion.p>

        <div className="mt-12" aria-live="polite">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div key="cta" exit={{ opacity: 0, y: -10 }}>
                <Button variant="gold" size="xl" onClick={reveal}>
                  <Gift /> Open the final message
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="message"
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-2xl rounded-3xl border border-starlight/20 bg-night/50 px-6 py-10 backdrop-blur-md sm:px-12"
              >
                <motion.p variants={item} className="text-gold-gradient font-display text-4xl font-semibold italic sm:text-5xl">
                  Happy Birthday, {PEOPLE.name}.
                </motion.p>
                {FINAL_MESSAGE.map((line) => (
                  <motion.p key={line} variants={item} className="mt-5 font-display text-lg leading-relaxed text-night-foreground/90 sm:text-xl">
                    {line}
                  </motion.p>
                ))}
                <motion.p variants={item} className="mt-8 font-script text-xl text-blush sm:text-2xl">
                  With love, {PEOPLE.creator} ❤️
                </motion.p>
                <motion.div variants={item} className="mt-10 flex flex-col items-center gap-5">
                  <p className="inline-flex items-center gap-2 rounded-full border border-code-green/50 bg-code-green/10 px-4 py-2 font-mono text-xs text-code-green sm:text-sm">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Birthday Celebration Successfully Completed!
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="night" size="lg" onClick={() => celebrate({ fireworks: true })}>
                      <Sparkles /> More fireworks
                    </Button>
                    <Button variant="night" size="lg" onClick={() => scrollToChapter("boot")}>
                      <RotateCcw /> Replay from the start
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-16 font-mono text-[11px] text-night-foreground/50">
          Made with all my heart by {PEOPLE.creator} · {PEOPLE.birthdayLabel}
        </p>
      </div>
    </section>
  );
}

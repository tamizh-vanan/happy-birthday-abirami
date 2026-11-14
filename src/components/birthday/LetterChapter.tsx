import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, MailOpen, FastForward, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LETTER_PARAGRAPHS, PEOPLE } from "@/lib/content";
import { scrollToChapter } from "./Chrome";

type Stage = "closed" | "opening" | "open";

function Envelope({ stage, onOpen }: { stage: Stage; onOpen: () => void }) {
  const opening = stage !== "closed";
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opening}
      aria-label="Open the letter from Tamizh"
      className="group relative mx-auto block aspect-[3/2] w-[min(100%,26rem)] [perspective:900px]"
    >
      {/* letter peeking out */}
      <motion.span
        aria-hidden="true"
        className="paper-lines absolute inset-x-[7%] top-[8%] h-[85%] rounded-lg bg-paper shadow-soft"
        animate={opening ? { y: "-55%" } : { y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      >
        <span className="block px-5 pt-4 font-script text-sm text-rose-deep">Dear Abi,</span>
      </motion.span>

      {/* envelope body */}
      <span className="absolute inset-0 rounded-xl bg-peach shadow-glow-rose" aria-hidden="true" />
      <span
        className="absolute inset-0 rounded-xl bg-blush"
        style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 rounded-xl bg-blush/80"
        style={{ clipPath: "polygon(0 0, 50% 55%, 0 100%)" }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 rounded-xl bg-blush/80"
        style={{ clipPath: "polygon(100% 0, 50% 55%, 100% 100%)" }}
        aria-hidden="true"
      />

      {/* flap */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-[58%] origin-top"
        style={{ transformStyle: "preserve-3d" }}
        animate={opening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <span className="absolute inset-0 rounded-t-xl bg-rose" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
      </motion.span>

      {/* wax seal */}
      <AnimatePresence>
        {!opening && (
          <motion.span
            exit={{ scale: 0, opacity: 0 }}
            className="absolute left-1/2 top-[50%] z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-deep shadow-glow-rose transition-transform group-hover:scale-110"
            aria-hidden="true"
          >
            <Heart className="h-6 w-6 fill-blush text-blush" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function useTypewriter(total: number, active: boolean, instant: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (instant) {
      setCount(total);
      return;
    }
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          window.clearInterval(id);
          return c;
        }
        return Math.min(total, c + 2);
      });
    }, 24);
    return () => window.clearInterval(id);
  }, [active, instant, total]);
  return [count, () => setCount(total)] as const;
}

function Letter() {
  const reduce = useReducedMotion();
  const segments = useMemo(() => {
    let offset = 0;
    return LETTER_PARAGRAPHS.map((text) => {
      const s = { text, start: offset };
      offset += text.length;
      return s;
    });
  }, []);
  const total = segments.at(-1)!.start + segments.at(-1)!.text.length;
  const [count, skip] = useTypewriter(total, true, !!reduce);
  const done = count >= total;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="paper-lines relative mx-auto w-full max-w-2xl rounded-2xl bg-paper px-6 py-10 shadow-soft ring-1 ring-rose/15 sm:px-12 sm:py-14"
    >
      <span className="pointer-events-none absolute -right-3 -top-3 flex h-12 w-12 rotate-12 items-center justify-center rounded-full bg-rose-deep shadow-glow-rose" aria-hidden="true">
        <Heart className="h-5 w-5 fill-blush text-blush" />
      </span>

      {/* Screen readers get the whole letter at once */}
      <div className="sr-only">
        <p>Dear Abi,</p>
        {LETTER_PARAGRAPHS.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>With love, {PEOPLE.creator}</p>
      </div>

      <div aria-hidden="true">
        <p className="font-script text-2xl text-rose-deep sm:text-3xl">Dear Abi,</p>
        <div className="mt-5 space-y-4 font-hand text-[1.45rem] leading-[2.15rem] text-ink sm:text-[1.6rem]">
          {segments.map((s) => {
            const shown = Math.max(0, Math.min(s.text.length, count - s.start));
            if (shown === 0) return null;
            const typing = shown < s.text.length;
            return (
              <p key={s.start}>
                {s.text.slice(0, shown)}
                {typing && <span className="caret-blink ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-rose-deep" />}
              </p>
            );
          })}
        </div>
        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 text-right font-script text-xl text-rose-deep sm:text-2xl"
            >
              With love, {PEOPLE.creator} ❤️
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center">
        {done ? (
          <Button variant="romance" size="lg" onClick={() => scrollToChapter("finale")}>
            One last surprise <ArrowDown />
          </Button>
        ) : (
          <Button variant="softOutline" size="sm" onClick={skip}>
            <FastForward /> Show the whole letter
          </Button>
        )}
      </div>
    </motion.article>
  );
}

export function LetterChapter() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("closed");

  const open = () => {
    setStage("opening");
    window.setTimeout(() => setStage("open"), reduce ? 0 : 1500);
  };

  return (
    <section id="letter" aria-labelledby="letter-title" className="relative overflow-hidden bg-paper-gradient px-4 py-24 sm:px-8">
      <div className="relative mx-auto max-w-4xl">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-deep">Chapter 06 · Special delivery</p>
          <h2 id="letter-title" className="mt-4 font-display text-4xl font-semibold text-ink sm:text-6xl">
            A Letter from <span className="text-rose-gradient italic">Tamizh</span>
          </h2>
        </header>

        <div className="mt-14">
          <AnimatePresence mode="wait">
            {stage !== "open" ? (
              <motion.div key="envelope" exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.4 }} className="pt-16">
                <Envelope stage={stage} onOpen={open} />
                <div className="mt-8 text-center">
                  <Button variant="romance" size="xl" onClick={open} disabled={stage !== "closed"}>
                    <MailOpen /> {stage === "closed" ? "Open the envelope" : "Opening…"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="letter">
                <Letter />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

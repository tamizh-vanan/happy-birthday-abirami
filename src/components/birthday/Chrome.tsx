import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { CHAPTERS, type ChapterId } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useExperience } from "./ExperienceProvider";

export function scrollToChapter(id: ChapterId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useActiveChapter() {
  const [active, setActive] = useState<ChapterId>("boot");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as ChapterId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

const DARK_CHAPTERS: ChapterId[] = ["boot", "dashboard", "meeting", "finale"];

export function ProgressChrome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const active = useActiveChapter();
  const index = CHAPTERS.findIndex((c) => c.id === active);
  const dark = DARK_CHAPTERS.includes(active);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-terminal-line/40" aria-hidden="true">
        <motion.div style={{ scaleX }} className="h-full origin-left bg-gold-gradient" />
      </div>

      {/* Mobile chapter pill */}
      <div
        className={cn(
          "fixed left-3 top-3 z-50 rounded-full px-3 py-1.5 font-mono text-[11px] backdrop-blur-md md:hidden",
          dark ? "bg-terminal/70 text-terminal-foreground ring-1 ring-terminal-line" : "bg-card/80 text-ink ring-1 ring-border",
        )}
        aria-live="polite"
      >
        <span className={dark ? "text-code-green" : "text-rose-deep"}>{String(index + 1).padStart(2, "0")}</span>
        <span className="opacity-60"> / 07 · </span>
        {CHAPTERS[index]?.label}
      </div>

      {/* Desktop chapter rail */}
      <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 md:block">
        <ol className="flex flex-col gap-3">
          {CHAPTERS.map((c, i) => {
            const isActive = c.id === active;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => scrollToChapter(c.id)}
                  aria-label={`Go to chapter ${i + 1}: ${c.label}`}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                      dark ? "bg-terminal-raised text-terminal-foreground" : "bg-card text-ink shadow-soft",
                    )}
                  >
                    {c.label}
                  </span>
                  <span
                    className={cn(
                      "block rounded-full transition-all",
                      isActive ? "h-3 w-3 bg-gold shadow-glow-gold" : "h-2 w-2",
                      !isActive && (dark ? "bg-terminal-muted/60" : "bg-rose/50"),
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export function SoundToggle() {
  const { soundOn, toggleSound } = useExperience();
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn background music off" : "Turn background music on"}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center gap-2 rounded-full font-mono sm:h-12 sm:w-auto sm:px-4 text-xs backdrop-blur-md transition-all",
        soundOn
          ? "bg-gold-gradient text-ink shadow-glow-gold"
          : "bg-terminal/75 text-terminal-foreground ring-1 ring-terminal-line hover:ring-gold",
      )}
    >
      {soundOn ? <Music className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden sm:inline">{soundOn ? "Music on" : "Music off"}</span>
    </button>
  );
}

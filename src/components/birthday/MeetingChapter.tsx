import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BellRing, CalendarHeart, Check, Clock, PartyPopper, PhoneOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEETING_AGENDA, PEOPLE } from "@/lib/content";
import { scrollToChapter } from "./Chrome";

const DECLINE_REPLIES = [
  "Declining is not supported in this release. Nice try, Abi! 😄",
  "Error 418: Birthday girls cannot decline celebrations.",
  "The decline button is decorative today. Please join instead ❤️",
];

export function MeetingChapter() {
  const reduce = useReducedMotion();
  const [declines, setDeclines] = useState(0);
  const [joined, setJoined] = useState(false);

  const join = () => {
    setJoined(true);
    window.setTimeout(() => scrollToChapter("cake"), reduce ? 0 : 700);
  };

  return (
    <section
      id="meeting"
      aria-labelledby="meeting-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-dusk px-4 pb-32 pt-20 sm:px-8"
    >
      <div className="relative mx-auto w-full max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-mono text-xs uppercase tracking-[0.3em] text-code-pink"
        >
          Chapter 03 · Incoming interruption
        </motion.p>

        <motion.article
          initial={{ opacity: 0, y: -60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-terminal-line bg-terminal-raised/95 text-terminal-foreground shadow-window backdrop-blur"
        >
          {/* ringing glow */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-3xl ring-2 ring-meeting"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}

          <div className="flex items-center justify-between border-b border-terminal-line bg-meeting/20 px-5 py-3">
            <span className="flex items-center gap-2 font-mono text-xs text-meeting-foreground">
              <motion.span animate={reduce ? undefined : { rotate: [0, 15, -15, 10, 0] }} transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1 }}>
                <BellRing className="h-4 w-4" aria-hidden="true" />
              </motion.span>
              Meeting invitation
            </span>
            <span className="rounded-full bg-code-red/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-code-red">
              Urgent
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <h2 id="meeting-title" className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              URGENT: Birthday Celebration Meeting
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <dt className="sr-only">Organizer</dt>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-gradient font-semibold text-primary-foreground" aria-hidden="true">T</span>
                <dd>
                  <span className="text-terminal-muted">Organizer</span>
                  <br />
                  <span className="font-semibold">{PEOPLE.creator}</span>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="sr-only">Participant</dt>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient font-semibold text-ink" aria-hidden="true">A</span>
                <dd>
                  <span className="text-terminal-muted">Participant</span>
                  <br />
                  <span className="font-semibold">{PEOPLE.nickname}</span> <span className="text-terminal-muted">(attendance mandatory)</span>
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 font-mono text-xs text-terminal-muted">
                <span className="flex items-center gap-1.5"><CalendarHeart className="h-3.5 w-3.5" aria-hidden="true" /> {PEOPLE.birthdayLabel}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Right now</span>
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden="true" /> 2 attendees</span>
              </div>
            </dl>

            <h3 className="mt-6 font-mono text-xs uppercase tracking-widest text-terminal-muted">Agenda</h3>
            <ol className="mt-3 space-y-2">
              {MEETING_AGENDA.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="flex items-start gap-3 rounded-xl bg-terminal/60 px-3 py-2.5 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-meeting/30 font-mono text-[10px] text-meeting-foreground">{i + 1}</span>
                  {item}
                </motion.li>
              ))}
            </ol>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="meeting" size="xl" className="flex-1" onClick={join} disabled={joined}>
                {joined ? <Check /> : <PartyPopper />}
                {joined ? "Joining…" : "Join Birthday Celebration"}
              </Button>
              <Button variant="terminalGhost" size="xl" onClick={() => setDeclines((d) => d + 1)}>
                <PhoneOff /> Decline
              </Button>
            </div>

            <div aria-live="polite" className="min-h-6">
              <AnimatePresence mode="wait">
                {declines > 0 && (
                  <motion.p
                    key={declines}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center font-mono text-xs text-code-amber"
                  >
                    {DECLINE_REPLIES[(declines - 1) % DECLINE_REPLIES.length]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.article>

        <p className="mt-4 text-center font-mono text-[11px] text-night-foreground/60">
          A pretend invite made by {PEOPLE.creator}. Not a real meeting, no work apps involved.
        </p>
      </div>
    </section>
  );
}

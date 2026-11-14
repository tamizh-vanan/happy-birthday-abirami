import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  User, Drama, Headphones, Video, Activity, Siren, CheckCircle2, XCircle, Loader2, RotateCcw, ArrowDown, Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEST_SCENARIOS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { scrollToChapter } from "./Chrome";

const STATUS = [
  { icon: User, label: "Engineer", value: "Abi", tone: "text-terminal-foreground" },
  { icon: Drama, label: "Framework", value: "Playwright", tone: "text-code-green" },
  { icon: Headphones, label: "Headphones", value: "Connected", tone: "text-code-cyan", pulse: true },
  { icon: Video, label: "Meeting status", value: "In a meeting", tone: "text-code-amber", pulse: true },
  { icon: Activity, label: "Automation suite", value: "Running", tone: "text-code-green", pulse: true },
  { icon: Siren, label: "Birthday priority", value: "Critical", tone: "text-code-red", pulse: true },
];

const STEP_MS = 850;

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function DashboardChapter() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [completed, setCompleted] = useState(0);
  const [run, setRun] = useState(0);
  const finished = completed >= TEST_SCENARIOS.length;

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCompleted(TEST_SCENARIOS.length);
      return;
    }
    setCompleted(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCompleted(i);
      if (i >= TEST_SCENARIOS.length) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, run, reduce]);

  const rerun = useCallback(() => setRun((r) => r + 1), []);
  const passed = TEST_SCENARIOS.slice(0, completed).filter((t) => t.passed).length;
  const failed = completed - passed;

  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-title"
      className="relative overflow-hidden bg-terminal px-4 py-20 text-terminal-foreground sm:px-8 sm:py-28"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div ref={ref} className="relative mx-auto max-w-6xl">
        <motion.header initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-code-green">Chapter 02 · Workstation</p>
          <h2 id="dashboard-title" className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Automation Engineer <span className="italic text-code-cyan">Dashboard</span>
          </h2>
          <p className="mt-3 max-w-xl text-terminal-muted">
            A totally real, completely official, 100% made-up test report for one very busy engineer.
          </p>
        </motion.header>

        <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {STATUS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-terminal-line bg-terminal-raised/80 p-4 backdrop-blur"
            >
              <div className="flex items-center gap-2 text-terminal-muted">
                <s.icon className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider">{s.label}</span>
              </div>
              <p className={cn("mt-2 flex items-center gap-2 font-mono text-base font-semibold sm:text-lg", s.tone)}>
                {s.pulse && (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                  </span>
                )}
                {s.value}
              </p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* Test runner */}
          <div className="rounded-2xl border border-terminal-line bg-terminal-raised/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-semibold">birthday.spec.ts</h3>
              <span className="font-mono text-xs text-terminal-muted" aria-live="polite">
                {completed}/{TEST_SCENARIOS.length} run
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-terminal-line">
              <motion.div
                className="h-full bg-code-green"
                animate={{ width: `${(completed / TEST_SCENARIOS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <ol className="mt-4 space-y-2">
              {TEST_SCENARIOS.map((t, i) => {
                const state = i < completed ? (t.passed ? "pass" : "fail") : i === completed && inView ? "running" : "queued";
                return (
                  <li
                    key={t.name}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                      state === "fail" ? "border-code-red/50 bg-code-red/10" : "border-terminal-line bg-terminal/60",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5 text-sm">
                      {state === "pass" && <CheckCircle2 className="h-4 w-4 shrink-0 text-code-green" aria-hidden="true" />}
                      {state === "fail" && <XCircle className="h-4 w-4 shrink-0 text-code-red" aria-hidden="true" />}
                      {state === "running" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-code-amber" aria-hidden="true" />}
                      {state === "queued" && <span className="h-4 w-4 shrink-0 rounded-full border border-terminal-muted/50" aria-hidden="true" />}
                      <span className="truncate">{t.name}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded px-2 py-0.5 font-mono text-[11px] font-bold",
                        state === "pass" && "bg-code-green/15 text-code-green",
                        state === "fail" && "bg-code-red/20 text-code-red",
                        state === "running" && "text-code-amber",
                        state === "queued" && "text-terminal-muted",
                      )}
                    >
                      {state === "pass" ? "PASSED" : state === "fail" ? "FAILED" : state === "running" ? "RUNNING" : "QUEUED"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Terminal */}
          <div className="overflow-hidden rounded-2xl border border-terminal-line bg-terminal shadow-window lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-terminal-line bg-terminal-raised px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-code-red" />
              <span className="h-2.5 w-2.5 rounded-full bg-code-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-code-green" />
              <span className="ml-2 font-mono text-[11px] text-terminal-muted">terminal — simulated, just for fun</span>
            </div>
            <div className="min-h-[340px] overflow-x-auto p-4 font-mono text-[12px] leading-6 sm:text-[13px]" role="log" aria-label="Simulated Playwright output">
              <p><span className="text-code-cyan">abi@workstation</span><span className="text-terminal-muted">:~/birthday$</span> npx playwright test birthday.spec.ts</p>
              <p className="text-terminal-muted">Running {TEST_SCENARIOS.length} tests using 1 worker (powered by love)</p>
              <p>&nbsp;</p>
              {TEST_SCENARIOS.slice(0, completed).map((t, i) => (
                <div key={`${run}-${t.name}`}>
                  <p className="whitespace-nowrap">
                    <span className={t.passed ? "text-code-green" : "text-code-red"}>{t.passed ? "  ✓" : "  ✘"}</span>
                    <span className="text-terminal-muted"> {i + 1} [abi] › birthday.spec.ts:{(i + 1) * 7}:3 › </span>
                    {slug(t.name)} <span className="text-terminal-muted">({t.ms >= 1000 ? `${(t.ms / 1000).toFixed(1)}s` : `${t.ms}ms`})</span>
                  </p>
                  {!t.passed && (
                    <div className="ml-6 text-code-red/90">
                      <p>Error: expect(abi.breaksTaken).toBeGreaterThan(0)</p>
                      <p className="text-terminal-muted">  Expected: &gt; 0</p>
                      <p className="text-terminal-muted">  Received: 0 <span className="text-code-amber">// since forever</span></p>
                    </div>
                  )}
                </div>
              ))}
              {!finished && inView && <span className="caret-blink inline-block h-4 w-2 translate-y-0.5 bg-code-green" aria-hidden="true" />}
              {finished && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                  <p><span className="text-code-green">  {passed} passed</span>, <span className="text-code-red">{failed} failed</span> <span className="text-terminal-muted">(birthday edition)</span></p>
                  <p className="text-code-pink">  Tip: run `abi.takeBreak()` today. Doctor's orders. 🎂</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="mt-6 flex flex-col gap-4 rounded-2xl border border-code-amber/50 bg-code-amber/10 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <motion.span
                  animate={reduce ? undefined : { rotate: [0, -12, 12, -8, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-code-amber text-terminal"
                >
                  <Coffee className="h-5 w-5" aria-hidden="true" />
                </motion.span>
                <p className="font-mono text-sm text-code-amber sm:text-base">
                  <strong>Alert:</strong> Abi has been working continuously. Break reminder initiated!
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="terminalGhost" onClick={rerun}>
                  <RotateCcw /> Re-run
                </Button>
                <Button variant="terminal" onClick={() => scrollToChapter("meeting")}>
                  Continue <ArrowDown />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

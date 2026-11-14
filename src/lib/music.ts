// A tiny music-box rendition of "Happy Birthday", synthesised with the Web Audio API.
// No audio files, no network. Only starts after an explicit user tap.

type Note = [freq: number | null, beats: number];

const N = {
  C3: 130.81, F3: 174.61, G3: 196.0,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

const MELODY: Note[] = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 2],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2],
  [null, 3],
];

// One soft bass note per bar (3/4), starting on the pickup.
const BASS: Note[] = [
  [null, 1], [N.C3, 3], [N.G3, 3], [N.G3, 3], [N.C3, 3], [N.C3, 3], [N.F3, 3], [N.G3, 3], [N.C3, 3], [null, 2],
];

const BEAT = 0.58; // seconds

export class BirthdayMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  playing = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    // gentle echo for a dreamy music-box feel
    const delay = ctx.createDelay();
    delay.delayTime.value = BEAT * 0.75;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    delay.connect(feedback).connect(delay);
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    return ctx;
  }

  private tone(freq: number, start: number, length: number, volume: number, type: OscillatorType) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.connect(gain).connect(this.master!);
    osc.start(start);
    osc.stop(start + length + 0.05);
  }

  private scheduleLoop(startAt: number) {
    let t = startAt;
    for (const [freq, beats] of MELODY) {
      if (freq) {
        this.tone(freq, t, 1.6, 0.22, "sine");
        this.tone(freq * 2, t, 0.7, 0.05, "triangle");
      }
      t += beats * BEAT;
    }
    let b = startAt;
    for (const [freq, beats] of BASS) {
      if (freq) this.tone(freq, b, beats * BEAT, 0.08, "sine");
      b += beats * BEAT;
    }
    const loopLength = t - startAt;
    this.timer = window.setTimeout(
      () => {
        if (this.playing && this.ctx) this.scheduleLoop(startAt + loopLength);
      },
      Math.max(0, (startAt + loopLength - this.ctx!.currentTime - 0.5) * 1000),
    );
  }

  async start() {
    const ctx = this.ensure();
    if (ctx.state === "suspended") await ctx.resume();
    this.playing = true;
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0.9, now + 0.8);
    this.scheduleLoop(now + 0.1);
  }

  stop() {
    this.playing = false;
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.4);
    // Close the context so already-scheduled notes never play again.
    window.setTimeout(() => {
      if (!this.playing) {
        void ctx.close();
        this.ctx = null;
        this.master = null;
      }
    }, 500);
  }

  /** A short sparkly chime used for celebration moments (only when music is on). */
  chime() {
    if (!this.playing || !this.ctx) return;
    const t = this.ctx.currentTime;
    [N.C5, N.E5, N.G5, N.C5 * 2].forEach((f, i) => this.tone(f, t + i * 0.09, 1.2, 0.12, "sine"));
  }
}

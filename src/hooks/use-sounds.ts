import { useCallback, useRef, useState } from "react";

type Ctx = AudioContext | null;

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export type SoundName = "flip" | "match" | "win";

export function useSounds() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<Ctx>(null);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      try {
        if (!ctxRef.current) {
          const AudioCtor =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtor) return;
          ctxRef.current = new AudioCtor();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();

        if (name === "flip") {
          tone(ctx, 520, 0, 0.09, 0.12, "triangle");
        } else if (name === "match") {
          tone(ctx, 659, 0, 0.18, 0.14);
          tone(ctx, 988, 0.09, 0.24, 0.12);
        } else {
          [523, 659, 784, 1046].forEach((f, i) => tone(ctx, f, i * 0.12, 0.35, 0.13));
        }
      } catch {
        /* audio unavailable — game stays playable */
      }
    },
    [muted],
  );

  return { play, muted, toggleMuted: () => setMuted((m) => !m) };
}

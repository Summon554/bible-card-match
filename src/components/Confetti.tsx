import { useMemo } from "react";

const COLORS = [
  "var(--color-gold)",
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-gold-foreground)",
];

/** Purely decorative CSS confetti burst shown on the win screen. */
export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.2 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length]!,
        round: i % 3 === 0,
      })),
    [pieces],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti-bit"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size * 1.6}px`,
            background: b.color,
            borderRadius: b.round ? "9999px" : "2px",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            ["--confetti-drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

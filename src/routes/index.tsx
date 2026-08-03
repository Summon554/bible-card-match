import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GameCard } from "@/components/GameCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bible Memory Match — Card Matching Game" },
      {
        name: "description",
        content:
          "Flip and match pairs of Bible characters in this friendly memory game. Track moves and time across 4x4, 6x4 and 6x6 grids.",
      },
      { property: "og:title", content: "Bible Memory Match — Card Matching Game" },
      {
        property: "og:description",
        content:
          "A soft, friendly memory match game featuring Moses, Noah, David and more. Beat your best time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Character = { name: string; icon: string };

const CHARACTERS: Character[] = [
  { name: "Moses", icon: "📜" },
  { name: "Noah", icon: "🛶" },
  { name: "David", icon: "🎯" },
  { name: "Abraham", icon: "⭐" },
  { name: "Joseph", icon: "🧥" },
  { name: "Daniel", icon: "🦁" },
  { name: "Esther", icon: "👑" },
  { name: "Samson", icon: "💪" },
  { name: "Ruth", icon: "🌾" },
  { name: "Solomon", icon: "🏛️" },
  { name: "Elijah", icon: "🔥" },
  { name: "Deborah", icon: "🌳" },
  { name: "Jonah", icon: "🐋" },
  { name: "Joshua", icon: "📯" },
  { name: "Sarah", icon: "🌸" },
  { name: "Miriam", icon: "🥁" },
  { name: "Isaiah", icon: "🕊️" },
  { name: "Rebekah", icon: "🏺" },
];

const LEVELS = [
  { id: "4x4", label: "4 × 4", pairs: 8, cols: "grid-cols-4" },
  { id: "6x4", label: "6 × 4", pairs: 12, cols: "grid-cols-4 sm:grid-cols-6" },
  { id: "6x6", label: "6 × 6", pairs: 18, cols: "grid-cols-6" },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

type Card = { id: number; name: string; icon: string };

function buildDeck(pairs: number): Card[] {
  const deck = CHARACTERS.slice(0, pairs).flatMap((c, i) => [
    { id: i * 2, name: c.name, icon: c.icon },
    { id: i * 2 + 1, name: c.name, icon: c.icon },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Index() {
  const [levelId, setLevelId] = useState<LevelId>("4x4");
  const level = LEVELS.find((l) => l.id === levelId)!;

  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const won = deck.length > 0 && matched.length === level.pairs;

  const newGame = useCallback(
    (pairs: number) => {
      setDeck(buildDeck(pairs));
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setSeconds(0);
      setStarted(false);
    },
    [],
  );

  useEffect(() => {
    newGame(level.pairs);
  }, [level.pairs, newGame]);

  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, won]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((id) => deck.find((c) => c.id === id)!);
    if (a && b && a.name === b.name) {
      setMatched((m) => [...m, a.name]);
      setFlipped([]);
      return;
    }
    const t = setTimeout(() => setFlipped([]), 1000);
    return () => clearTimeout(t);
  }, [flipped, deck]);

  const handleFlip = (card: Card) => {
    if (won) return;
    if (flipped.length === 2) return;
    if (flipped.includes(card.id) || matched.includes(card.name)) return;
    if (!started) setStarted(true);
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  const accuracy = useMemo(
    () => (moves === 0 ? 0 : Math.round((matched.length / moves) * 100)),
    [moves, matched.length],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-12">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Match the pairs
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Bible Memory Match
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Flip two cards at a time and find every pair of Bible characters.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLevelId(l.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              l.id === levelId
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card/70 p-3 text-center shadow-[var(--shadow-card)]">
        {[
          { label: "Moves", value: String(moves) },
          { label: "Time", value: formatTime(seconds) },
          { label: "Pairs", value: `${matched.length}/${level.pairs}` },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              {stat.value}
            </div>
            <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <section className="relative mt-5">
        <div className={`grid gap-2 sm:gap-3 ${level.cols}`}>
          {deck.map((card) => (
            <GameCard
              key={card.id}
              name={card.name}
              icon={card.icon}
              flipped={flipped.includes(card.id)}
              matched={matched.includes(card.name)}
              onClick={() => handleFlip(card)}
            />
          ))}
        </div>

        {won && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/85 backdrop-blur-sm">
            <div className="animate-pop-in w-full max-w-xs rounded-3xl border border-gold bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <div className="text-4xl" aria-hidden="true">
                🎉
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">You Win!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All {level.pairs} pairs found.
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-secondary p-3 text-center">
                <div>
                  <dd className="font-display text-lg font-semibold">{moves}</dd>
                  <dt className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Moves
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-lg font-semibold">{formatTime(seconds)}</dd>
                  <dt className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Time
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-lg font-semibold">{accuracy}%</dd>
                  <dt className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Accuracy
                  </dt>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => newGame(level.pairs)}
                className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => newGame(level.pairs)}
          className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-secondary"
        >
          New Game
        </button>
      </div>
    </main>
  );
}

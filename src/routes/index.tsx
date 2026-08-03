import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { Confetti } from "@/components/Confetti";
import { CHARACTERS, FACTS } from "@/lib/characters";
import { useSounds } from "@/hooks/use-sounds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bible Memory Match — Card Matching Game" },
      {
        name: "description",
        content:
          "Flip and match illustrated Bible characters, learn a fun fact and verse with every pair, and beat your best moves and time across three grid sizes.",
      },
      { property: "og:title", content: "Bible Memory Match — Card Matching Game" },
      {
        property: "og:description",
        content:
          "A friendly memory match game with illustrated Bible characters, scripture facts, sounds, dark mode and best-score tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LEVELS = [
  { id: "4x4", label: "4 × 4", pairs: 8, cols: "grid-cols-4" },
  { id: "6x4", label: "6 × 4", pairs: 12, cols: "grid-cols-4 sm:grid-cols-6" },
  { id: "6x6", label: "6 × 6", pairs: 18, cols: "grid-cols-6" },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];
type Card = { id: number; name: string; image?: string | undefined; icon?: string | undefined };
type Best = { moves: number; seconds: number };

const STORAGE_KEY = "bible-memory-match-best";
const UNLOCK_KEY = "bible-memory-match-unlocked";
const THEME_KEY = "bible-memory-match-theme";

function loadBests(): Partial<Record<LevelId, Best>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<
      Record<LevelId, Best>
    >;
  } catch {
    return {};
  }
}

function buildDeck(pairs: number): Card[] {
  const deck = CHARACTERS.slice(0, pairs).flatMap((c, i) => [
    { id: i * 2, name: c.name, image: c.image, icon: c.icon },
    { id: i * 2 + 1, name: c.name, image: c.image, icon: c.icon },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
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
  const [fact, setFact] = useState<{ text: string; verse: string; key: number } | null>(null);
  const [bests, setBests] = useState<Partial<Record<LevelId, Best>>>({});
  const [beatRecord, setBeatRecord] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(false);

  const { play, muted, toggleMuted } = useSounds();
  const won = deck.length > 0 && matched.length === level.pairs;
  const best = bests[levelId];
  const progress = level.pairs === 0 ? 0 : Math.round((matched.length / level.pairs) * 100);

  useEffect(() => {
    setBests(loadBests());
    try {
      setUnlocked(window.localStorage.getItem(UNLOCK_KEY) === "true");
      const stored = window.localStorage.getItem(THEME_KEY);
      const prefersDark =
        stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(stored === "dark" || prefersDark);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Apply the theme class to <html> so all tokens switch at once.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }, [dark]);

  const newGame = useCallback((pairs: number) => {
    setDeck(buildDeck(pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setFact(null);
    setBeatRecord(false);
  }, []);

  useEffect(() => {
    newGame(level.pairs);
  }, [level.pairs, newGame]);

  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, won]);

  // Reveal comparison for the current pair of flipped cards.
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((id) => deck.find((c) => c.id === id));
    if (a && b && a.name === b.name) {
      const info = FACTS[a.name];
      setMatched((m) => [...m, a.name]);
      setFlipped([]);
      setFact({ text: info?.fact ?? "", verse: info?.verse ?? "", key: Date.now() });
      play("match");
      return;
    }
    const t = setTimeout(() => setFlipped([]), 1000);
    return () => clearTimeout(t);
  }, [flipped, deck, play]);

  useEffect(() => {
    if (!fact) return;
    const t = setTimeout(() => setFact(null), 2000);
    return () => clearTimeout(t);
  }, [fact]);

  // Persist a new best score for this difficulty when the board is cleared.
  useEffect(() => {
    if (!won) return;
    play("win");
    if (levelId === "4x4") {
      setUnlocked(true);
      try {
        window.localStorage.setItem(UNLOCK_KEY, "true");
      } catch {
        /* storage unavailable */
      }
    }
    setBests((prev) => {
      const current = prev[levelId];
      const improved = !current || moves < current.moves || seconds < current.seconds;
      if (!improved) return prev;
      const next = {
        ...prev,
        [levelId]: {
          moves: Math.min(moves, current?.moves ?? moves),
          seconds: Math.min(seconds, current?.seconds ?? seconds),
        },
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      setBeatRecord(true);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const handleFlip = (card: Card) => {
    if (won || flipped.length === 2) return;
    if (flipped.includes(card.id) || matched.includes(card.name)) return;
    if (!started) setStarted(true);
    play("flip");
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
      <header className="relative text-center">
        <div className="absolute right-0 top-0 flex gap-2">
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full border border-border bg-card p-2 text-muted-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-secondary hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMuted}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="rounded-full border border-border bg-card p-2 text-muted-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-secondary hover:text-foreground"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
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
        {LEVELS.map((l) => {
          const locked = l.id !== "4x4" && !unlocked;
          return (
            <button
              key={l.id}
              type="button"
              disabled={locked}
              onClick={() => setLevelId(l.id)}
              title={locked ? "Complete the 4 × 4 level to unlock" : undefined}
              aria-label={locked ? `${l.label} — locked, complete 4 × 4 to unlock` : l.label}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                l.id === levelId
                  ? "border-primary bg-primary text-primary-foreground"
                  : locked
                    ? "cursor-not-allowed border-border bg-muted text-muted-foreground/60"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              {locked && <Lock className="h-3 w-3" />}
              {l.label}
            </button>
          );
        })}
      </div>
      {!unlocked && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Finish a 4 × 4 game to unlock the bigger grids.
        </p>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-card/70 p-3 shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-3 gap-2 text-center">
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

        <div className="mt-3">
          <div
            role="progressbar"
            aria-label="Pairs found"
            aria-valuemin={0}
            aria-valuemax={level.pairs}
            aria-valuenow={matched.length}
            className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
            {progress}% complete
          </p>
        </div>

        <p className="mt-2 border-t border-border pt-2 text-center text-xs font-semibold text-primary">
          {best
            ? `Best: ${best.moves} moves / ${formatTime(best.seconds)} — ${level.label}`
            : `No best score yet for ${level.label}`}
        </p>
      </div>

      <section className="relative mt-5">
        <div className={`grid gap-2 sm:gap-3 ${level.cols}`}>
          {deck.map((card) => (
            <GameCard
              key={card.id}
              name={card.name}
              image={card.image}
              icon={card.icon}
              flipped={flipped.includes(card.id)}
              matched={matched.includes(card.name)}
              onClick={() => handleFlip(card)}
            />
          ))}
        </div>

        {fact && !won && (
          <div
            key={fact.key}
            role="status"
            className="animate-fact pointer-events-none absolute bottom-3 left-1/2 z-20 w-[min(20rem,92%)] -translate-x-1/2 rounded-2xl border border-gold bg-card px-4 py-3 text-center text-xs font-semibold leading-snug text-foreground shadow-[var(--shadow-soft)]"
          >
            {fact.text}
            {fact.verse && (
              <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
                {fact.verse}
              </span>
            )}
          </div>
        )}

        {won && (
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-2xl bg-background/85 backdrop-blur-sm">
            <Confetti />
            <div className="animate-pop-in relative z-40 w-full max-w-xs rounded-3xl border border-gold bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <div className="text-4xl" aria-hidden="true">
                🎉
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">You Win!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {beatRecord ? "New best score!" : `All ${level.pairs} pairs found.`}
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
              {best && (
                <p className="mt-3 text-xs font-semibold text-primary">
                  Best: {best.moves} moves / {formatTime(best.seconds)}
                </p>
              )}
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

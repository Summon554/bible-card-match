interface GameCardProps {
  name: string;
  icon: string;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
}

export function GameCard({ name, icon, flipped, matched, onClick }: GameCardProps) {
  const faceUp = flipped || matched;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={faceUp ? name : "Face-down card"}
      className="card-scene aspect-[3/4] w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className={`card-inner ${faceUp ? "is-flipped" : ""}`}>
        <div className="card-face card-back">
          <span className="text-xl opacity-70 sm:text-2xl">✦</span>
        </div>
        <div className={`card-face card-front ${matched ? "is-matched" : ""}`}>
          <span className="text-2xl leading-none sm:text-3xl" aria-hidden="true">
            {icon}
          </span>
          <span className="mt-1 px-0.5 text-[0.6rem] font-semibold leading-tight sm:text-xs">
            {name}
          </span>
        </div>
      </div>
    </button>
  );
}

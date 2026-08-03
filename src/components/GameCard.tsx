interface GameCardProps {
  name: string;
  image?: string;
  icon?: string;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
}

export function GameCard({ name, image, icon, flipped, matched, onClick }: GameCardProps) {
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
          <div className={`flex h-full w-full flex-col items-center justify-center overflow-hidden px-0.5 pb-1 pt-1 ${faceUp ? "animate-reveal-pop" : ""}`}>
            {image ? (
              <img
                src={image}
                alt={name}
                loading="lazy"
                width={512}
                height={640}
                className="min-h-0 w-full flex-1 object-contain"
              />
            ) : (
              <span className="flex flex-1 items-center text-2xl leading-none sm:text-3xl" aria-hidden="true">
                {icon}
              </span>
            )}
            <span className="mt-0.5 shrink-0 px-0.5 text-[0.55rem] font-semibold leading-tight sm:text-[0.7rem]">
              {name}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

# Bible Memory Match — QA audit and unlockable themes

## Goal

Run a full quality audit on the game, fix the remaining bugs and polish gaps, and add unlockable card-back and background themes that players earn by winning games.

## Verified current state

I inspected the current code and confirmed the root route still carries generic default metadata (`Lovable App` title and description). The game passes a TypeScript typecheck, and the PWA / offline fix from the previous turn is in place.

## What we'll fix

### SEO and metadata

- Replace the generic `Lovable App` metadata in `src/routes/__root.tsx` with proper Bible Memory Match defaults (title, description, Open Graph, Twitter, theme-color).
- Add a canonical link and `og:url` to `src/routes/index.tsx` pointing to the published domain.
- Generate a social sharing image for `og:image` and `twitter:image`.
- Add JSON-LD `WebSite` / `VideoGame` structured data.

### PWA and offline

- Make the update banner tolerate an offline version check so it never shows a confusing error while playing offline.
- Keep the existing warm-navigation cache for cold offline launches.

### Accessibility and UX

- Persist the mute preference across sessions.
- Respect `prefers-reduced-motion` for confetti and the card-flip animation.
- Fix any additional issues surfaced by the accessibility audit.

### Game logic

- Review best-score tracking, timer, difficulty unlock, and win-state edge cases to make sure the new theme unlocks integrate cleanly.

## What we'll add: Unlockable themes

- Earn theme tokens by completing games on each difficulty level.
- Unlockable themes, each with its own card-back gradient and background palette:
  - **Parchment** (default)
  - **Desert** (warm sand, unlocked by winning a 4x4 game)
  - **Garden** (leafy greens, unlocked by winning a 6x4 game)
  - **Night Sky** (deep blues and golds, unlocked by winning a 6x6 game)
- Theme selector in the header or a settings area.
- Persist unlocked themes and selected theme in localStorage.
- Apply the selected theme through CSS variables while keeping the existing dark mode toggle intact.

## Technical approach

- Keep all state in localStorage; no backend or database needed.
- Add theme tokens to `src/styles.css` using the existing semantic variable pattern.
- Create a `themes` module and localStorage helpers in `src/lib/`.
- Update `src/routes/index.tsx` to read/write theme state and render the selector.
- Update `GameCard` card-back styling to read the active theme token.

## Verification

- TypeScript typecheck passes.
- Production build passes.
- Playwright test covering: game completion, difficulty unlock, theme unlock, switching themes, and dark mode.

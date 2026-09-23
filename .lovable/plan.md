# Remove cross symbols + make the game fully offline

## Part 1 — Remove the cross symbols

I checked every picture in the game:

- The character illustrations (Moses, Elijah, Solomon, and the rest) have no crosses.
- The app icons and the tab icon have no crosses — they show two cards with an open book.
- The sharing preview picture (the one shown when the game link is posted or sent) **does** have small crosses on the card backs and a wooden cross on the hill.

So the one picture to change is the sharing preview. I will regenerate it in the same warm cream/teal/gold style with the same title and cards, but with the crosses replaced by the open-book emblem already used on the app icon.

I will also re-check the whole game text and icon set for any cross-like symbol so nothing is left.

## Part 2 — Fully offline, no internet needed

Right now almost everything already works offline after one visit, but two things still reach out to the internet:

1. **The fancy fonts** load from Google. Offline, the text falls back to a plain font. I will bundle both fonts (the display font and the body font) into the app itself, so they always look right with no connection.
2. **The version check** behind the "new version available" notice tries to reach the server. I will make it silently skip when there is no connection, so nothing ever errors while you play offline.

After that, the game needs the internet only for the very first visit (to download itself) and later to pick up a new version.

## Notes on testing

Offline mode cannot be tested inside the Lovable editor preview — offline caching is intentionally switched off there. It works on the published site or on the installed home-screen copy, after one online visit. I will verify on the built app that the fonts are bundled locally and that no request goes out to Google.

## Technical details

- Regenerate `public/og-image.png` (cross-free); keep the same `og:image` / `twitter:image` URLs.
- Install `@fontsource-variable/fraunces` and `@fontsource/nunito`; import them in `src/styles.css`; remove the Google Fonts `<link>`/`preconnect` entries from `src/routes/__root.tsx` and the `google-fonts` runtime cache rule from the PWA config in `vite.config.ts` (bundled `woff2` files are already covered by the precache glob patterns).
- In `src/components/PwaUpdatePrompt.tsx`, guard the `/api/public/version` fetch with an `navigator.onLine` check and keep the existing silent catch.
- Verify with a production build: no `fonts.googleapis.com` reference in the built output, fonts present in the precache manifest, typecheck clean.

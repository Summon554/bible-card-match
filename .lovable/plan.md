# Fix offline play

## What's broken

I inspected the live service worker at `https://bible-card-match.lovable.app/sw.js` and found a real bug, not a caching quirk.

The worker registers a navigation route built with `createHandlerBoundToURL("/")` (this comes from `navigateFallback: "/"` in the PWA config). That call requires `/` to exist as a precached file. This app is server-rendered, so the build produces no static `index.html` — and indeed `/` is missing from the precache list, which does contain the game code, styles and all character images.

Result: the worker throws while it evaluates, so it never finishes installing. Nothing is served from cache, and the game shows a network error offline even though the assets were downloaded.

Secondary issue: nothing stores the game's HTML page until the first successful visit is cached by the network-first rule, so the home page HTML should be warmed explicitly to make the first offline launch reliable.

## The fix

1. Remove the `navigateFallback` (and its denylist) from the PWA config in `vite.config.ts`. The existing `NetworkFirst` rule for same-origin navigations already handles page loads and falls back to the cached page when offline. Keep `/~oauth` and `/api/` excluded by scoping that navigation rule instead.
2. After the worker registers (in `src/lib/register-sw.ts`), warm the `html-navigations` cache with the home page so a cold offline launch always has HTML to render.
3. Make the version check in the update banner tolerate an offline fetch failure so it never surfaces an error while playing offline.

## Verification

- Rebuild and confirm the generated `sw.js` no longer contains `createHandlerBoundToURL`.
- Load the published app, then reload with the network disabled and confirm the board, images and sounds all work.

## Note on testing

Service workers are intentionally disabled inside the Lovable preview and editor iframe, so offline mode can only be tested on the published URL (or an installed home-screen copy) — after one online visit.

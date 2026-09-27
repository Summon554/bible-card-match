# Offline-ready status indicator

## What will change

- Add a compact green status badge beneath the game introduction so players can always see the offline state without covering the board.
- Show clear states:
  - **Ready to play offline** once the service worker controls the page and the home screen is cached.
  - **Playing offline** when the connection is lost but the cached game is available.
  - **Ready offline after publishing** inside the Lovable preview, where offline caching is intentionally disabled.
- Listen for browser online/offline changes so the label updates immediately.
- Keep the existing update and install prompts unchanged.

## Technical details

- Add a focused React status component and render it in the game header.
- Extend the service-worker registration helper with a browser event emitted only after registration and navigation-cache warm-up complete.
- Use the existing semantic colors, typography, and reduced-motion behavior, with a green success treatment.
- Verify the visible states in the browser and confirm the project build remains clean.

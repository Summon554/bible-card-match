import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/version")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          version: __APP_VERSION__,
          releaseDate: __APP_RELEASE_DATE__,
        });
      },
    },
  },
});

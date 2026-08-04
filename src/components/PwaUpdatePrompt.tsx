import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { applyServiceWorkerUpdate, registerServiceWorker } from "../lib/register-sw";

export function PwaUpdatePrompt() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    registerServiceWorker((sw) => setWaiting(sw));
  }, []);

  if (!waiting) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-2xl border border-border bg-card p-4 shadow-lg animate-pop-in">
      <div className="flex items-start gap-3">
        <RefreshCw className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-foreground">
            New version available
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Refresh to load the latest game files.
          </p>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              applyServiceWorkerUpdate(waiting);
            }}
            disabled={refreshing}
            className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh now"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setWaiting(null)}
          aria-label="Dismiss update notice"
          className="rounded-full p-1 text-muted-foreground transition hover:bg-muted"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

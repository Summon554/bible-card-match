import { useEffect, useRef, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { applyServiceWorkerUpdate, registerServiceWorker } from "../lib/register-sw";

const AUTO_REFRESH_KEY = "bible-memory-match-pwa-auto-refresh";
const AUTO_REFRESH_COUNTDOWN = 3;

export function PwaUpdatePrompt() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined" && window.localStorage.getItem(AUTO_REFRESH_KEY);
      setAutoRefresh(stored === "true");
    } catch {
      setAutoRefresh(false);
    }
  }, []);

  useEffect(() => {
    registerServiceWorker((sw) => setWaiting(sw));
  }, []);

  useEffect(() => {
    if (!waiting || refreshing || !autoRefresh) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      countdownRef.current = null;
      setCountdown(null);
      return;
    }

    if (countdownRef.current === null) {
      countdownRef.current = AUTO_REFRESH_COUNTDOWN;
      setCountdown(AUTO_REFRESH_COUNTDOWN);
      timerRef.current = setInterval(() => {
        const next = (countdownRef.current ?? 1) - 1;
        if (next <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          countdownRef.current = null;
          setCountdown(null);
          setRefreshing(true);
          applyServiceWorkerUpdate(waiting);
        } else {
          countdownRef.current = next;
          setCountdown(next);
        }
      }, 1000);
    }
  }, [autoRefresh, refreshing, waiting]);

  const handleToggleAutoRefresh = () => {
    const next = !autoRefresh;
    setAutoRefresh(next);
    try {
      window.localStorage.setItem(AUTO_REFRESH_KEY, String(next));
    } catch {
      /* storage may be restricted */
    }
  };

  const cancelAutoRefresh = () => {
    setAutoRefresh(false);
    try {
      window.localStorage.setItem(AUTO_REFRESH_KEY, "false");
    } catch {
      /* ignore */
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    countdownRef.current = null;
    setCountdown(null);
  };

  if (!waiting) return null;

  if (autoRefresh && countdown !== null) {
    return (
      <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-2xl border border-border bg-card p-4 shadow-lg animate-pop-in">
        <div className="flex items-start gap-3">
          <RefreshCw
            className="mt-0.5 size-5 shrink-0 animate-spin text-primary"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-display text-sm font-semibold text-foreground">
              New version available
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-refreshing in {countdown} second{countdown !== 1 ? "s" : ""}…
            </p>
            <button
              type="button"
              onClick={cancelAutoRefresh}
              className="mt-3 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Cancel auto-refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (refreshing) {
    return (
      <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-2xl border border-border bg-card p-4 shadow-lg animate-pop-in">
        <div className="flex items-center gap-3">
          <RefreshCw className="size-5 animate-spin text-primary" aria-hidden="true" />
          <p className="font-display text-sm font-semibold text-foreground">Refreshing…</p>
        </div>
      </div>
    );
  }

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
          <div className="mt-3 flex items-center gap-2">
            <input
              id="pwa-auto-refresh"
              type="checkbox"
              checked={autoRefresh}
              onChange={handleToggleAutoRefresh}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <label htmlFor="pwa-auto-refresh" className="text-xs text-muted-foreground">
              Auto-refresh future updates
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              applyServiceWorkerUpdate(waiting);
            }}
            disabled={refreshing}
            className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            Refresh now
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

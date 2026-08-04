import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "bible-memory-match-install-dismissed";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isStandalone()) return;

    try {
      const dismissed = window.localStorage.getItem(DISMISSED_KEY) === "true";
      if (dismissed) return;
    } catch {
      /* storage unavailable */
    }

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
      setInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    // Some browsers (e.g., Chrome on Android) may have already fired the event
    // before the listener was attached. Use a quick timeout to check if the
    // prompt is available on window, otherwise keep waiting.
    if ("deferredPrompt" in window) {
      setDeferredPrompt((window as unknown as { deferredPrompt: BeforeInstallPromptEvent }).deferredPrompt);
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      /* storage unavailable */
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    } else {
      // If the user dismissed the native prompt, keep the banner hidden but
      // remember it for a short session so it doesn't immediately reappear.
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!visible || installed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] animate-pop-in"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Install Bible Memory Match</p>
          <p className="text-xs text-muted-foreground">
            Add this game to your home screen for quick offline play.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Add to Home Screen
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

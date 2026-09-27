import { useEffect, useState } from "react";
import { Check, CloudOff, LoaderCircle } from "lucide-react";
import {
  OFFLINE_READY_EVENT,
  isServiceWorkerRegistrationBlocked,
} from "../lib/register-sw";

type OfflineState = "preview" | "preparing" | "ready" | "offline";

function initialState(): OfflineState {
  if (typeof window === "undefined") return "preparing";
  if (isServiceWorkerRegistrationBlocked()) return "preview";
  if (!window.navigator.onLine) return "offline";
  return window.navigator.serviceWorker?.controller ? "ready" : "preparing";
}

export function OfflineStatus() {
  const [state, setState] = useState<OfflineState>(initialState);

  useEffect(() => {
    if (isServiceWorkerRegistrationBlocked()) {
      setState("preview");
      return;
    }

    const handleReady = () => setState(window.navigator.onLine ? "ready" : "offline");
    const handleOnline = () =>
      setState(window.navigator.serviceWorker?.controller ? "ready" : "preparing");
    const handleOffline = () => setState("offline");

    window.addEventListener(OFFLINE_READY_EVENT, handleReady);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (window.navigator.serviceWorker?.controller) handleReady();

    return () => {
      window.removeEventListener(OFFLINE_READY_EVENT, handleReady);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const content = {
    preview: {
      label: "Ready offline after publishing",
      icon: <Check className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    preparing: {
      label: "Preparing offline play…",
      icon: <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />,
    },
    ready: {
      label: "Ready to play offline",
      icon: <Check className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    offline: {
      label: "Playing offline",
      icon: <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />,
    },
  }[state];

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto mt-3 inline-flex min-h-7 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
    >
      {content.icon}
      <span>{content.label}</span>
    </div>
  );
}
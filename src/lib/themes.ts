export type LevelId = "4x4" | "6x4" | "6x6";

export type ThemeId = "parchment" | "desert" | "garden" | "night-sky";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  unlockLevel: LevelId | null;
  cardBackGradient: string;
  gradientWarm: string;
  gradientWarmDark: string;
  background: string;
  backgroundDark: string;
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
  gold: string;
  goldDark: string;
}

export const THEMES: Theme[] = [
  {
    id: "parchment",
    label: "Parchment",
    description: "Classic cream and teal",
    unlockLevel: null,
    cardBackGradient: "linear-gradient(150deg, oklch(0.58 0.075 185), oklch(0.44 0.07 195))",
    gradientWarm: "linear-gradient(160deg, oklch(0.98 0.024 92), oklch(0.94 0.036 78))",
    gradientWarmDark: "linear-gradient(160deg, oklch(0.24 0.026 65), oklch(0.18 0.022 250))",
    background: "oklch(0.972 0.019 88)",
    backgroundDark: "oklch(0.21 0.022 62)",
    primary: "oklch(0.52 0.076 185)",
    primaryDark: "oklch(0.72 0.09 185)",
    accent: "oklch(0.9 0.055 75)",
    accentDark: "oklch(0.37 0.045 70)",
    gold: "oklch(0.78 0.12 78)",
    goldDark: "oklch(0.8 0.13 80)",
  },
  {
    id: "desert",
    label: "Desert",
    description: "Warm sand and sunset",
    unlockLevel: "4x4",
    cardBackGradient: "linear-gradient(150deg, oklch(0.65 0.085 75), oklch(0.5 0.07 55))",
    gradientWarm: "linear-gradient(160deg, oklch(0.97 0.025 82), oklch(0.92 0.04 65))",
    gradientWarmDark: "linear-gradient(160deg, oklch(0.26 0.024 55), oklch(0.18 0.02 50))",
    background: "oklch(0.96 0.024 82)",
    backgroundDark: "oklch(0.23 0.022 55)",
    primary: "oklch(0.55 0.08 65)",
    primaryDark: "oklch(0.75 0.09 70)",
    accent: "oklch(0.88 0.07 75)",
    accentDark: "oklch(0.42 0.045 65)",
    gold: "oklch(0.76 0.11 75)",
    goldDark: "oklch(0.78 0.12 78)",
  },
  {
    id: "garden",
    label: "Garden",
    description: "Leafy greens and florals",
    unlockLevel: "6x4",
    cardBackGradient: "linear-gradient(150deg, oklch(0.55 0.075 145), oklch(0.4 0.06 140))",
    gradientWarm: "linear-gradient(160deg, oklch(0.965 0.022 110), oklch(0.9 0.04 120))",
    gradientWarmDark: "linear-gradient(160deg, oklch(0.22 0.022 140), oklch(0.15 0.018 130))",
    background: "oklch(0.965 0.022 110)",
    backgroundDark: "oklch(0.22 0.022 140)",
    primary: "oklch(0.48 0.07 145)",
    primaryDark: "oklch(0.68 0.08 150)",
    accent: "oklch(0.85 0.065 120)",
    accentDark: "oklch(0.35 0.045 125)",
    gold: "oklch(0.77 0.11 80)",
    goldDark: "oklch(0.79 0.12 82)",
  },
  {
    id: "night-sky",
    label: "Night Sky",
    description: "Deep blues and golds",
    unlockLevel: "6x6",
    cardBackGradient: "linear-gradient(150deg, oklch(0.45 0.08 245), oklch(0.3 0.07 255))",
    gradientWarm: "linear-gradient(160deg, oklch(0.955 0.02 260), oklch(0.85 0.035 270))",
    gradientWarmDark: "linear-gradient(160deg, oklch(0.18 0.025 250), oklch(0.12 0.02 260))",
    background: "oklch(0.955 0.02 260)",
    backgroundDark: "oklch(0.18 0.025 250)",
    primary: "oklch(0.52 0.085 245)",
    primaryDark: "oklch(0.72 0.095 250)",
    accent: "oklch(0.82 0.06 265)",
    accentDark: "oklch(0.32 0.045 250)",
    gold: "oklch(0.78 0.12 78)",
    goldDark: "oklch(0.8 0.13 80)",
  },
];

const THEMES_STORAGE_KEY = "bible-memory-match-themes";
const ACTIVE_THEME_KEY = "bible-memory-match-active-theme";
const LEVELS_WON_KEY = "bible-memory-match-levels-won";

export type ThemeState = {
  unlocked: ThemeId[];
  active: ThemeId;
};

export function getThemeById(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]!;
}

export function loadLevelsWon(): LevelId[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LEVELS_WON_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown[]) : [];
    return parsed.filter((id): id is LevelId => ["4x4", "6x4", "6x6"].includes(id as string));
  } catch {
    return [];
  }
}

export function saveLevelsWon(levels: LevelId[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEVELS_WON_KEY, JSON.stringify(levels));
  } catch {
    /* ignore */
  }
}

export function getUnlockedThemeIds(wonLevels: LevelId[]): ThemeId[] {
  const unlocked = new Set<ThemeId>(["parchment"]);
  for (const level of wonLevels) {
    const theme = THEMES.find((t) => t.unlockLevel === level);
    if (theme) unlocked.add(theme.id);
  }
  return Array.from(unlocked);
}

export function loadThemeState(): ThemeState {
  if (typeof window === "undefined") {
    return { unlocked: ["parchment"], active: "parchment" };
  }
  try {
    const wonLevels = loadLevelsWon();
    const unlocked = getUnlockedThemeIds(wonLevels);
    const storedActive = window.localStorage.getItem(ACTIVE_THEME_KEY);
    const active: ThemeId =
      storedActive && THEMES.some((t) => t.id === storedActive) ? (storedActive as ThemeId) : "parchment";
    const available = unlocked.includes(active) ? active : "parchment";
    return { unlocked, active: available };
  } catch {
    return { unlocked: ["parchment"], active: "parchment" };
  }
}

export function saveThemeState(state: ThemeState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(state.unlocked));
    window.localStorage.setItem(ACTIVE_THEME_KEY, state.active);
  } catch {
    /* ignore */
  }
}

export function applyThemeCSS(theme: Theme, dark: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--background", dark ? theme.backgroundDark : theme.background);
  root.style.setProperty("--primary", dark ? theme.primaryDark : theme.primary);
  root.style.setProperty("--accent", dark ? theme.accentDark : theme.accent);
  root.style.setProperty("--gold", dark ? theme.goldDark : theme.gold);
  root.style.setProperty("--gradient-card-back", theme.cardBackGradient);
  root.style.setProperty("--gradient-warm", dark ? theme.gradientWarmDark : theme.gradientWarm);
}

export function clearThemeCSS(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.removeProperty("--background");
  root.style.removeProperty("--primary");
  root.style.removeProperty("--accent");
  root.style.removeProperty("--gold");
  root.style.removeProperty("--gradient-card-back");
  root.style.removeProperty("--gradient-warm");
}

export function themeUnlockForLevel(level: LevelId): ThemeId | null {
  const theme = THEMES.find((t) => t.unlockLevel === level);
  return theme ? theme.id : null;
}

import { useLocalStorage } from "./useLocalStorage";

export const PROGRESS_KEY = "wayfinder.progress.v1";

/** Journey progress: journey id → list of finished step numbers. Bad saved data is ignored. */
export function sanitizeProgress(raw: unknown): Record<string, number[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const clean: Record<string, number[]> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (!Array.isArray(value)) continue;
    clean[key] = Array.from(
      new Set(value.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 100)),
    ).sort((a, b) => a - b);
  }
  return clean;
}

export function useProgress() {
  const [stored, setStored] = useLocalStorage<Record<string, number[]>>(PROGRESS_KEY, {});
  return [sanitizeProgress(stored), setStored] as const;
}

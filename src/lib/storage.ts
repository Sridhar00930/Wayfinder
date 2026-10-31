/**
 * Small helpers for reading and updating localStorage outside React state.
 * Every call is wrapped: private browsing or full storage must never crash the app.
 */

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed === null || typeof parsed !== typeof fallback ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: the feature still works for this visit.
  }
}

export const QUEST_KEY = "wayfinder.quests.v1";

export interface QuestState {
  manual: Record<string, boolean>;
  flags: Record<string, boolean>;
}

export const emptyQuests: QuestState = { manual: {}, flags: {} };

export function readQuests(): QuestState {
  const value = readJson<QuestState>(QUEST_KEY, emptyQuests);
  return {
    manual: value.manual && typeof value.manual === "object" ? value.manual : {},
    flags: value.flags && typeof value.flags === "object" ? value.flags : {},
  };
}

/** Record that something happened (for example, "tried Care Relay"). */
export function markQuestFlag(flag: string): void {
  const state = readQuests();
  if (state.flags[flag]) return;
  writeJson(QUEST_KEY, { ...state, flags: { ...state.flags, [flag]: true } });
}

/** Local calendar date, so "today" matches the user's clock. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

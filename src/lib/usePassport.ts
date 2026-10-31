import { emptyPassport, sanitizePassport, type PassportData } from "../data/passport";
import { useLocalStorage } from "./useLocalStorage";

export const PASSPORT_KEY = "wayfinder.passport.v1";

/** The user's passport, stored only in this browser and re-checked every time it is read. */
export function usePassport() {
  const [stored, setStored] = useLocalStorage<PassportData>(PASSPORT_KEY, emptyPassport);
  const data: PassportData = sanitizePassport(stored);
  return [data, setStored] as const;
}

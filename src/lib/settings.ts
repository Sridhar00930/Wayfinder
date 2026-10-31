export interface Settings {
  scale: number;
  contrast: boolean;
  reading: boolean;
  reduceMotion: boolean;
}

export const defaultSettings: Settings = {
  scale: 100,
  contrast: false,
  reading: false,
  reduceMotion: false,
};

/** Rebuild settings from storage so a bad saved value can never break the app. */
export function sanitizeSettings(raw: unknown): Settings {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const scale = [100, 115, 130, 150].includes(r.scale as number) ? (r.scale as number) : 100;
  return {
    scale,
    contrast: r.contrast === true,
    reading: r.reading === true,
    reduceMotion: r.reduceMotion === true,
  };
}

export const textSizes = [
  { value: 100, label: "Default" },
  { value: 115, label: "Larger" },
  { value: 130, label: "Largest" },
  { value: 150, label: "Extra large" },
] as const;

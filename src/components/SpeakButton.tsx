import { useSpeech } from "../lib/speech";
import { Icon } from "./Icon";

export function SpeakButton({
  id,
  text,
  label = "Read aloud",
  context,
}: {
  id: string;
  text: string;
  label?: string;
  /** Extra words for screen readers, so many "Read" buttons can be told apart. */
  context?: string;
}) {
  const { supported, speakingId, speak, stop } = useSpeech();

  if (!supported) return null;

  const active = speakingId === id;

  return (
    <button
      type="button"
      className="speak-button"
      aria-label={active ? `Stop reading${context ? `: ${context}` : " aloud"}` : context ? `${label}: ${context}` : label}
      onClick={() => (active ? stop() : speak(id, text))}
    >
      <Icon name={active ? "stop" : "speaker"} size={16} />
      <span>{active ? "Stop" : label}</span>
    </button>
  );
}

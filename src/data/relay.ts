import type { IconName } from "../components/Icon";

export interface RelayPhrase {
  id: string;
  text: string;
}

export interface RelayGroup {
  id: string;
  title: string;
  icon: IconName;
  phrases: RelayPhrase[];
}

/**
 * Short, patient-controlled phrases for the exam room. Tapping one shows it
 * in large type and, if the browser supports it, says it out loud.
 * This is a convenience, not a replacement for a qualified interpreter.
 */
export const relayGroups: RelayGroup[] = [
  {
    id: "answer",
    title: "Quick answers",
    icon: "check",
    phrases: [
      { id: "yes", text: "Yes." },
      { id: "no", text: "No." },
      { id: "unsure", text: "I’m not sure." },
      { id: "stop", text: "Please stop." },
      { id: "again", text: "Please say that again." },
      { id: "wait", text: "I need a minute." },
      { id: "yesno", text: "Please ask me yes-or-no questions." },
    ],
  },
  {
    id: "talk",
    title: "Help me understand",
    icon: "chat",
    phrases: [
      { id: "plain", text: "Please explain that in plain language." },
      { id: "slow", text: "Please slow down." },
      { id: "write", text: "Please write that down for me." },
      { id: "me", text: "Please talk to me, not my companion." },
      { id: "interp", text: "I need an interpreter." },
      { id: "understand", text: "I don’t understand yet." },
      { id: "hear", text: "I can hear you, but I can’t talk right now." },
      { id: "next", text: "What happens next?" },
      { id: "call", text: "Please call my support person." },
    ],
  },
  {
    id: "body",
    title: "My body right now",
    icon: "access",
    phrases: [
      { id: "lift", text: "I need a transfer lift." },
      { id: "table", text: "Please lower the exam table." },
      { id: "sit", text: "I need to sit or lie down." },
      { id: "bath", text: "I need to use the bathroom." },
      { id: "touch", text: "Please tell me before you touch me." },
      { id: "quiet", text: "It’s too loud or bright in here." },
      { id: "sick", text: "I feel sick or dizzy." },
      { id: "water", text: "I need water." },
      { id: "scared", text: "I’m scared." },
    ],
  },
];

/** Plain bands for the common 0–10 pain scale. */
export const painWords = [
  "no pain",
  "mild",
  "mild",
  "mild",
  "medium",
  "medium",
  "medium",
  "bad",
  "bad",
  "very bad",
  "the worst pain I can imagine",
];

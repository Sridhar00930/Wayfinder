export type View =
  | "home"
  | "today"
  | "navigator"
  | "glossary"
  | "care"
  | "scripts"
  | "practice"
  | "passport"
  | "relay";

export const navItems: { view: View; label: string }[] = [
  { view: "home", label: "Start" },
  { view: "today", label: "Today" },
  { view: "navigator", label: "Care journeys" },
  { view: "glossary", label: "Plain language" },
  { view: "care", label: "Find care" },
  { view: "scripts", label: "Call scripts" },
  { view: "practice", label: "Practice" },
  { view: "passport", label: "Access Passport" },
  { view: "relay", label: "Care Relay" },
];

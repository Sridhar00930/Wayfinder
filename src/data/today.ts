/**
 * Spoon planning. "Spoon theory" is a metaphor for limited daily energy,
 * written by Christine Miserandino and widely used in disability and
 * chronic illness communities. Costs below are rough starting points;
 * everyone's are different, and you can change them.
 */

export interface Activity {
  id: string;
  label: string;
  cost: number;
  swap?: string;
}

export const activities: Activity[] = [
  { id: "shower", label: "Shower and get dressed", cost: 2, swap: "Use a shower chair, or skip the shower and freshen up." },
  { id: "transit", label: "Travel to an appointment", cost: 2, swap: "Ask whether the visit can be done by phone or video." },
  { id: "wait", label: "Waiting room time", cost: 2, swap: "Ask to wait somewhere quiet, or wait in the car until they text you." },
  { id: "appt", label: "The appointment itself", cost: 3, swap: "Bring your Access Passport so you don’t have to explain everything." },
  { id: "pharmacy", label: "Pick up medicine", cost: 2, swap: "Ask about pharmacy delivery or mail-order." },
  { id: "call", label: "A phone call with insurance", cost: 2, swap: "Practice first in the Rehearsal Room, or ask someone to sit with you." },
  { id: "forms", label: "Paperwork or forms", cost: 1, swap: "Do one page now and one page tomorrow." },
  { id: "cook", label: "Make a meal", cost: 2, swap: "Plan something simple, frozen, or delivered today." },
  { id: "errand", label: "Groceries or errands", cost: 3, swap: "Try pickup or delivery, or ask someone in your circle." },
  { id: "social", label: "See friends or family", cost: 2, swap: "A short call can count. People who care will understand." },
];

export const MIN_SPOONS = 1;
export const MAX_SPOONS = 12;

export interface Quest {
  id: string;
  title: string;
  detail: string;
  /** Auto-completed quests are detected from what you've done in the app. */
  auto: boolean;
}

export const quests: Quest[] = [
  { id: "passport", title: "Make your Access Passport", detail: "Explain your needs once, then hand over a code.", auto: true },
  { id: "rehearse", title: "Practice one call", detail: "Finish any call in the Rehearsal Room.", auto: true },
  { id: "words", title: "Learn five words", detail: "Get five words right in Word Spells.", auto: true },
  { id: "plan", title: "Plan a day with your spoons", detail: "Add at least one thing to today’s plan.", auto: true },
  { id: "journey", title: "Start a care journey", detail: "Check off any step in a care journey.", auto: true },
  { id: "relay", title: "Try Care Relay", detail: "Open the communication board once, just to see it.", auto: true },
  { id: "memberid", title: "Find your insurance card", detail: "Know where your member ID is. Don’t type it into any app, including this one.", auto: false },
  { id: "number", title: "Save your plan’s phone number", detail: "Put member services in your phone contacts.", auto: false },
];

import type { IconName } from "../components/Icon";

/**
 * Access Passport: functional needs, not diagnoses.
 * Every need has a short code so the whole profile fits inside a small QR.
 * `self` is how the patient picks it; `staff` is what the clinician reads.
 */

export type NeedGroupId = "moving" | "talking" | "senses" | "info" | "support";

export interface NeedGroup {
  id: NeedGroupId;
  title: string;
  staffTitle: string;
  icon: IconName;
}

export interface Need {
  code: string;
  group: NeedGroupId;
  self: string;
  staff: string;
}

export interface Avoid {
  code: string;
  self: string;
  staff: string;
}

export const needGroups: NeedGroup[] = [
  { id: "moving", title: "Moving and positioning", staffTitle: "Moving and positioning", icon: "access" },
  { id: "talking", title: "Talking and understanding", staffTitle: "Communication", icon: "chat" },
  { id: "senses", title: "Sound, light, and touch", staffTitle: "Sensory environment", icon: "moon" },
  { id: "info", title: "Reading and taking things in", staffTitle: "Information and paperwork", icon: "book" },
  { id: "support", title: "Who and what comes with me", staffTitle: "Support", icon: "heart" },
];

export const needs: Need[] = [
  { code: "wc", group: "moving", self: "I use a wheelchair", staff: "Keep a clear path. Ask before you touch or move my chair." },
  { code: "tl", group: "moving", self: "I need a transfer lift", staff: "Use a mechanical lift to move me to the exam table." },
  { code: "ht", group: "moving", self: "I need a lower exam table", staff: "Lower the height-adjustable table before I transfer." },
  { code: "ss", group: "moving", self: "I can’t stand on a scale", staff: "Weigh me on a wheelchair or seated scale." },
  { code: "xt", group: "moving", self: "I need extra time to move", staff: "Give me extra time to change position or get undressed." },

  { code: "asl", group: "talking", self: "I need an ASL interpreter", staff: "Book a qualified ASL interpreter. Don’t use family to interpret." },
  { code: "wr", group: "talking", self: "Please write important things down", staff: "Write down key information and instructions." },
  { code: "dt", group: "talking", self: "Talk to me, not my companion", staff: "Speak directly to me, even if someone is with me." },
  { code: "aac", group: "talking", self: "I use a device or board to communicate", staff: "Wait while I type or point. Don’t finish my sentences." },
  { code: "lr", group: "talking", self: "I lip-read", staff: "Face me, speak clearly, and use a clear mask if you can." },
  { code: "pt", group: "talking", self: "I need time to answer", staff: "Give me time to respond. Silence doesn’t mean I didn’t hear." },

  { code: "qr", group: "senses", self: "I need a quiet place to wait", staff: "Let me wait somewhere quiet, away from the main waiting room." },
  { code: "dl", group: "senses", self: "Bright lights are hard for me", staff: "Dim or turn off overhead lights if you can." },
  { code: "tw", group: "senses", self: "Tell me before you touch me", staff: "Say what you’re about to do before you touch me." },
  { code: "ff", group: "senses", self: "Strong smells are hard for me", staff: "Avoid scented products near me where possible." },

  { code: "pl", group: "info", self: "Plain language, please", staff: "Use plain words. Explain any medical terms or abbreviations." },
  { code: "one", group: "info", self: "One thing at a time", staff: "Give me one instruction at a time, then check in." },
  { code: "lp", group: "info", self: "I need large print", staff: "Give me paperwork in large print (18 point or bigger)." },
  { code: "el", group: "info", self: "Send documents I can use with a screen reader", staff: "Send forms and results electronically in an accessible format." },
  { code: "sg", group: "info", self: "Guide me and describe what’s around me", staff: "Offer your arm to guide me. Tell me where things are." },

  { code: "sa", group: "support", self: "I have a service animal", staff: "My service animal stays with me." },
  { code: "sp", group: "support", self: "My support person can stay with me", staff: "My support person may stay — but check with me first." },
];

export const avoids: Avoid[] = [
  { code: "mv", self: "Don’t move my mobility aids without asking", staff: "Don’t move or push my wheelchair, cane, or walker without asking." },
  { code: "rs", self: "Don’t rush me", staff: "Don’t rush me through questions or transfers." },
  { code: "pet", self: "Don’t pet or distract my service animal", staff: "Don’t pet, feed, or distract my service animal." },
  { code: "lo", self: "Don’t talk louder or slower unless I ask", staff: "Don’t raise your voice or slow your speech unless I ask." },
  { code: "su", self: "Don’t surprise me with touch or noise", staff: "No sudden touch or loud noises without warning." },
];

export const needByCode = new Map(needs.map((need) => [need.code, need]));
export const avoidByCode = new Map(avoids.map((avoid) => [avoid.code, avoid]));

export const LIMITS = { name: 40, pronouns: 24, note: 160, contactName: 40, phone: 24, address: 120 };

/** Everything the user enters. Only part of it ever goes into the QR. */
export interface PassportData {
  name: string;
  pronouns: string;
  needs: string[];
  avoids: string[];
  note: string;
  contactName: string;
  contactPhone: string;
  shareContact: boolean;
  rideName: string;
  ridePhone: string;
  homeAddress: string;
}

export const emptyPassport: PassportData = {
  name: "",
  pronouns: "",
  needs: [],
  avoids: [],
  note: "",
  contactName: "",
  contactPhone: "",
  shareContact: false,
  rideName: "",
  ridePhone: "",
  homeAddress: "",
};

/** The subset that travels in the QR code. Home and ride details never do. */
export interface SharedPassport {
  name: string;
  pronouns: string;
  needs: string[];
  avoids: string[];
  note: string;
  contactName?: string;
  contactPhone?: string;
}

export function hasContent(p: SharedPassport): boolean {
  return Boolean(p.name || p.needs.length || p.avoids.length || p.note);
}

export function toShared(p: PassportData): SharedPassport {
  const phone = cleanText(p.contactPhone, LIMITS.phone);
  return {
    name: cleanText(p.name, LIMITS.name),
    pronouns: cleanText(p.pronouns, LIMITS.pronouns),
    needs: uniqueCodes(p.needs, needByCode),
    avoids: uniqueCodes(p.avoids, avoidByCode),
    note: cleanText(p.note, LIMITS.note),
    ...(p.shareContact && phone
      ? { contactName: cleanText(p.contactName, LIMITS.contactName), contactPhone: phone }
      : {}),
  };
}

/** Current link format: short, readable, and percent-encoded. */
const PREFIX = "#w=";
/** Older links (base64 JSON) still open. */
const LEGACY_PREFIX = "#p=";

export function isPassportHash(hash: string): boolean {
  return hash.startsWith(PREFIX) || hash.startsWith(LEGACY_PREFIX);
}

// Fields are separated by "~", which browsers never rewrite inside a link.
// Any "~" a person types is escaped to %7E, so splitting is always safe.
// Spaces become "+" to keep codes small.
const SEP = "~";
const enc = (value: string) => encodeURIComponent(value).replace(/%20/g, "+").replace(/~/g, "%7E");
const dec = (value: string) => decodeURIComponent(value.replace(/\+/g, "%20"));

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64 + "===".slice((b64.length + 3) % 4));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * The passport lives in the URL fragment (after #). Browsers never send the
 * fragment to the server, so the hosting site never sees the profile.
 */
export function encodePassport(p: SharedPassport): string {
  const fields = [
    "2",
    p.name,
    p.pronouns,
    p.needs.join("."),
    p.avoids.join("."),
    p.note,
    p.contactName ?? "",
    p.contactPhone ?? "",
  ];
  while (fields.length > 1 && fields[fields.length - 1] === "") fields.pop();
  return PREFIX + fields.map(enc).join(SEP);
}

/** Kept so tests and older tools can still make legacy links. */
export function encodePassportLegacy(p: SharedPassport): string {
  const compact: Record<string, unknown> = { v: 1 };
  if (p.name) compact.n = p.name;
  if (p.pronouns) compact.p = p.pronouns;
  if (p.needs.length) compact.i = p.needs.join(".");
  if (p.avoids.length) compact.x = p.avoids.join(".");
  if (p.note) compact.t = p.note;
  if (p.contactPhone) compact.c = [p.contactName ?? "", p.contactPhone];
  return LEGACY_PREFIX + toBase64Url(JSON.stringify(compact));
}

export function shareUrl(p: SharedPassport): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${encodePassport(p)}`;
}

/**
 * Remove characters that can disguise text: control characters, zero-width
 * characters, and bidirectional overrides (which can make a phone number
 * display differently from what it dials).
 */
// eslint-disable-next-line no-control-regex
const HIDDEN_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u00AD\u061C\u180E\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g;

export function stripHidden(value: string): string {
  return value.replace(HIDDEN_CHARS, "");
}

/** Full clean-up for anything shown to staff or put in a link. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return stripHidden(value.normalize("NFKC")).replace(/\s+/g, " ").trim().slice(0, max);
}

const clip = cleanText;

const uniqueCodes = (codes: unknown, known: Map<string, unknown>): string[] =>
  Array.isArray(codes)
    ? Array.from(new Set(codes.filter((c): c is string => typeof c === "string" && known.has(c))))
    : [];

/** Rebuild a passport from storage, dropping anything with the wrong shape. */
export function sanitizePassport(raw: unknown): PassportData {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const text = (key: string, max: number) =>
    typeof r[key] === "string" ? stripHidden(r[key] as string).slice(0, max) : "";
  return {
    name: text("name", LIMITS.name),
    pronouns: text("pronouns", LIMITS.pronouns),
    needs: uniqueCodes(r.needs, needByCode),
    avoids: uniqueCodes(r.avoids, avoidByCode),
    note: text("note", LIMITS.note),
    contactName: text("contactName", LIMITS.contactName),
    contactPhone: text("contactPhone", LIMITS.phone),
    shareContact: r.shareContact === true,
    rideName: text("rideName", LIMITS.contactName),
    ridePhone: text("ridePhone", LIMITS.phone),
    homeAddress: text("homeAddress", LIMITS.address),
  };
}

export function hasAnyData(p: PassportData): boolean {
  return Object.entries(p).some(([key, value]) =>
    key === "shareContact" ? false : Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
}

/** Parse an untrusted fragment. Unknown codes and oversized text are dropped. */
export function decodePassport(hash: string): SharedPassport | null {
  if (hash.startsWith(PREFIX)) {
    try {
      let body = hash.slice(PREFIX.length);
      // Some apps percent-encode the whole link; undo that once if needed.
      if (!body.includes(SEP) && /%7E/i.test(body)) body = body.replace(/%7E/gi, SEP);
      const parts = body.split(SEP).slice(0, 8).map(dec);
      if (parts[0] !== "2") return null;
      const codes = (value = "") => Array.from(new Set(value.split(".").slice(0, 40)));
      const shared: SharedPassport = {
        name: clip(parts[1], LIMITS.name),
        pronouns: clip(parts[2], LIMITS.pronouns),
        needs: codes(parts[3]).filter((code) => needByCode.has(code)),
        avoids: codes(parts[4]).filter((code) => avoidByCode.has(code)),
        note: clip(parts[5], LIMITS.note),
      };
      const phone = clip(parts[7], LIMITS.phone);
      if (phone) {
        shared.contactName = clip(parts[6], LIMITS.contactName);
        shared.contactPhone = phone;
      }
      return shared;
    } catch {
      return null;
    }
  }
  if (!hash.startsWith(LEGACY_PREFIX)) return null;
  try {
    const raw = JSON.parse(fromBase64Url(hash.slice(LEGACY_PREFIX.length))) as Record<string, unknown>;
    if (!raw || typeof raw !== "object" || raw.v !== 1) return null;
    const codes = (value: unknown) =>
      typeof value === "string" ? Array.from(new Set(value.split(".").slice(0, 40))) : [];
    const contact = Array.isArray(raw.c) ? raw.c : [];
    const shared: SharedPassport = {
      name: clip(raw.n, LIMITS.name),
      pronouns: clip(raw.p, LIMITS.pronouns),
      needs: codes(raw.i).filter((code) => needByCode.has(code)),
      avoids: codes(raw.x).filter((code) => avoidByCode.has(code)),
      note: clip(raw.t, LIMITS.note),
    };
    const phone = clip(contact[1], LIMITS.phone);
    if (phone) {
      shared.contactName = clip(contact[0], LIMITS.contactName);
      shared.contactPhone = phone;
    }
    return shared;
  } catch {
    return null;
  }
}

/** Phone numbers become tel: links only if they look like phone numbers. */
export function telHref(phone: string): string | null {
  if (typeof phone !== "string") return null;
  const digits = stripHidden(phone.normalize("NFKC")).replace(/[^\d+]/g, "");
  return /^\+?\d{3,15}$/.test(digits) ? `tel:${digits}` : null;
}

/** Format the digits a tel: link will dial, so what people see is what gets called. */
export function formatDialed(href: string): string {
  const digits = href.replace(/^tel:/, "");
  const us = digits.replace(/^\+?1(?=\d{10}$)/, "");
  return /^\d{10}$/.test(us) ? `(${us.slice(0, 3)}) ${us.slice(3, 6)}-${us.slice(6)}` : digits;
}

/** The phone number exactly as it will be dialed, for display next to a call link. */
export function displayPhone(phone: string): string {
  return cleanText(phone, LIMITS.phone);
}

/** Plain-text version for read-aloud and copy. */
export function passportSpeech(p: SharedPassport): string {
  const lines: string[] = [];
  lines.push(
    p.name
      ? `These are the access needs for ${p.name}${p.pronouns ? `, who uses ${p.pronouns} pronouns` : ""}.`
      : "These are my access needs.",
  );
  p.needs.forEach((code) => {
    const need = needByCode.get(code);
    if (need) lines.push(need.staff);
  });
  if (p.avoids.length) {
    lines.push("Please don’t:");
    p.avoids.forEach((code) => {
      const avoid = avoidByCode.get(code);
      if (avoid) lines.push(avoid.staff);
    });
  }
  if (p.note) lines.push(p.note);
  lines.push("Thank you.");
  return lines.join(" ");
}

/** A tiny sample so judges can see the clinician view without filling the form. */
export const samplePassport: PassportData = {
  ...emptyPassport,
  name: "J. Rivera (sample)",
  pronouns: "they/them",
  needs: ["wc", "tl", "ht", "wr", "dt", "qr", "dl", "tw", "pl"],
  avoids: ["mv", "rs"],
  note: "Morning appointments are easiest for me. I may need a break halfway through.",
  contactName: "Sam (sister)",
  contactPhone: "(404) 555-0134",
  shareContact: false,
  rideName: "Paratransit (sample)",
  ridePhone: "(770) 555-0199",
  homeAddress: "123 Example Lane, Anytown (sample)",
};

# Wayfinder

Accessible healthcare navigation for disabled people. Built at HackGwinnett 2026.

Healthcare is confusing on purpose. Wayfinder turns insurance letters, discharge
papers, and appointment calls into plain-language next steps — with read-aloud,
keyboard-first navigation, and no account required.

## What it does

- **Care journeys** — six ordered, checkable walkthroughs: insurance denials,
  hospital discharge, requesting accessible care, medication coverage, a new
  diagnosis, and affording care. Progress is saved locally.
- **Plain language** — 54 medical, insurance, medication, and disability-rights
  terms, each with what it means, why it matters, and what to ask.
- **Find care** — a filterable sample directory (wheelchair access, exam tables,
  transfer lifts, ASL, sensory-friendly, sliding scale, home visits) plus the
  exact questions to ask before booking.
- **Call scripts** — seven fill-in scripts for interpreters, accessible exam
  tables, appeals, low-sensory visits, plain-language instructions, prior
  authorizations, and accessible prescription labels. Copy or read aloud.
- **Access Passport**: pick functional needs (not diagnoses) and get a QR code.
  Staff scan it with any phone camera and see a large-type "Please do / Please
  don't" page. The profile travels in the URL fragment (`#p=…`), which browsers
  never send to a server: no account, no database. It also includes a "show this
  screen" fallback, a printable wallet card, and one-tap delete. The QR encoder
  is written in-house (`src/lib/qr.ts`), so nothing leaves the device.
- **Bare Minimum**: the "Having a bad day?" button collapses the app to four
  giant actions: explain my needs, call my person, get me home, and I need a
  minute. Emergency numbers stay on screen. Ride and home address are stored on
  the device only and never go into the QR.
- **Today**: a gentle daily check-in. Pick your energy in "spoons" (credit:
  Christine Miserandino's spoon theory), plan around it, and get kind
  suggestions when the plan is too heavy. Optional quests, with no streaks.
- **Practice**: the *Rehearsal Room* lets you try three realistic phone calls
  (insurance denial, booking an accessible visit, the pharmacy counter) and
  collect "keys" (a reference number, the reason in writing, the deadline).
  *Word Spells* is a five-word quiz built from the glossary.
- **Care Relay**: a tap-to-show, tap-to-say communication board for the exam
  room, with a plain 0–10 pain scale, typed messages, arrow-key navigation, and
  a full-screen hand-over mode. Nothing is saved.
- **Here be dragons theme**: an old cartographer's map, with original line-art
  dragons in the margins. The art is hidden from screen readers, and switched
  off on small screens, in high contrast, in reading mode, and in print.
- **Accessibility settings** — 100–150% text scaling, high contrast, extra
  letter/word/line spacing, and reduced motion. Saved in the browser.

### Accessibility notes

- Keyboard-first: skip link, visible focus rings, semantic landmarks, native
  controls, live result counts, and focus moved to the page heading on navigation.
- Read-aloud uses the browser's Web Speech API; it is hidden automatically when
  the browser does not support it.
- Reduced motion is respected both from the OS setting and from the in-app toggle.
- All body text uses Atkinson Hyperlegible, designed by the Braille Institute for
  low-vision readers.

## How it was tested

- Five testing agents: one red team trying to break in, and four role-playing
  disabled users (screen reader, keyboard/motor, low vision, and cognitive and
  fatigue). Every Blocker and Major finding was fixed and re-tested. These were
  AI simulations: please also test with disabled people before you call it done.
- Automated Playwright runs on every page at 1280px, 390px, and 320px with 150%
  text, in both themes, with zero console errors and no horizontal overflow.
- The QR encoder was checked against OpenCV's decoder for versions 1–40.

## Security and privacy

- No backend, no accounts, no analytics. Data lives in `localStorage`.
- The Access Passport lives in the link fragment (`#w=…`), which browsers never
  send to a server. Shared text is cleaned of hidden characters (for example,
  right-to-left overrides that could disguise a phone number). The clinician
  page always says it was written by the patient.
- Corrupted saved data is ignored instead of crashing the app, and an error
  screen offers a one-tap reset.
- `public/_headers` has a tested Content-Security-Policy and related headers
  for Netlify or Cloudflare Pages. On other hosts, set the same headers there.
- The only outside request is Google Fonts. Self-host the fonts to remove it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## Honest limits

- Not legal, medical, or insurance advice. Content uses "generally" where rules
  vary by plan, state, and provider.
- Wayfinder isn't affiliated with any clinic, insurer, or agency. See
  `THIRD_PARTY_NOTICES.md` for licenses and credits.


Wayfinder is a demo, not a medical, legal, or insurance service. Clinic data is
fictional and labeled as such. There is no backend: settings and progress stay in
`localStorage`, and typed script details are never saved. External resources named
in the journeys (SHIP, 211, state ombudsman, HHS OCR) are real programs, but
Wayfinder does not link to or verify them.

## Stack

React 19, TypeScript, Vite. Hand-written CSS with design tokens so high contrast,
text scaling, and reading spacing can all be applied from one place.

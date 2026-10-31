export const accessTags = [
  { id: "wheelchair", label: "Wheelchair accessible" },
  { id: "exam-table", label: "Accessible exam table" },
  { id: "lift", label: "Transfer lift" },
  { id: "asl", label: "ASL interpreters" },
  { id: "sensory", label: "Sensory-friendly" },
  { id: "parking", label: "Accessible parking" },
  { id: "telehealth", label: "Captioned telehealth" },
  { id: "sliding", label: "Sliding-scale fees" },
  { id: "home", label: "Home visits" },
  { id: "service-animal", label: "Service animals welcome" },
] as const;

export type AccessTagId = (typeof accessTags)[number]["id"];

export interface Provider {
  id: string;
  name: string;
  kind: string;
  area: string;
  distance: string;
  tags: AccessTagId[];
  note: string;
  ask: string;
  verified: string;
}

/**
 * Fictional demo clinics in Gwinnett County, GA, built to show how the
 * filters behave. Not a real directory.
 */
export const providers: Provider[] = [
  {
    id: "riverbend",
    name: "Riverbend Family Health",
    kind: "Primary care",
    area: "Duluth",
    distance: "1.2 mi",
    tags: ["wheelchair", "exam-table", "lift", "asl", "parking", "service-animal"],
    note: "Ground-floor entrance with automatic doors. Two exam rooms have height-adjustable tables; one has a ceiling lift. Staff will do a transfer check with you before the visit.",
    ask: "Which exam room has the ceiling lift, and can I be scheduled in it?",
    verified: "August 2026",
  },
  {
    id: "open-door",
    name: "Open Door Community Clinic",
    kind: "Primary care · sliding scale",
    area: "Lawrenceville",
    distance: "3.4 mi",
    tags: ["wheelchair", "sliding", "asl", "parking", "telehealth", "service-animal"],
    note: "Sliding fee based on income, no one turned away for inability to pay. ASL interpreters booked at least 72 hours ahead. Captions on all telehealth visits.",
    ask: "What documents do I need for the sliding fee, and can I do the intake by phone?",
    verified: "July 2026",
  },
  {
    id: "northline",
    name: "Northline Imaging",
    kind: "Imaging · MRI, CT, ultrasound",
    area: "Norcross",
    distance: "4.1 mi",
    tags: ["wheelchair", "lift", "asl", "parking", "sensory"],
    note: "MRI table has a transfer lift, and the scanner is wide-bore. Offers quiet hours on Tuesday mornings, noise-canceling headphones, and a companion in the room.",
    ask: "Can I book the wide-bore scanner during quiet hours, and can someone stay with me?",
    verified: "June 2026",
  },
  {
    id: "cedar-park",
    name: "Cedar Park Physical Therapy",
    kind: "Physical therapy",
    area: "Snellville",
    distance: "5.8 mi",
    tags: ["wheelchair", "exam-table", "lift", "parking", "home"],
    note: "Equipment includes a powered standing frame and accessible gym equipment. Home visits within 15 miles for people who cannot travel.",
    ask: "Do you have a therapist who works with my condition, and is home PT available?",
    verified: "August 2026",
  },
  {
    id: "bright-path",
    name: "Bright Path Behavioral Health",
    kind: "Therapy · counseling",
    area: "Lawrenceville",
    distance: "3.9 mi",
    tags: ["telehealth", "sensory", "asl", "sliding", "wheelchair"],
    note: "All therapists offer video or phone sessions with captions. Quiet, low-light waiting area. Sliding scale for uninsured clients; ASL-fluent therapist on staff.",
    ask: "Do you have a therapist who signs or works with autistic adults?",
    verified: "July 2026",
  },
  {
    id: "gateway-dental",
    name: "Gateway Dental",
    kind: "Dentistry",
    area: "Buford",
    distance: "7.2 mi",
    tags: ["wheelchair", "parking", "sensory", "service-animal"],
    note: "Ground-floor office with a reclining chair that can be raised for a standing transfer. Offers a quiet room, breaks during cleanings, and a no-fragrance policy.",
    ask: "Can I stay in my wheelchair for the exam, and can we schedule a shorter first visit?",
    verified: "May 2026",
  },
  {
    id: "lakeside",
    name: "Lakeside Women's Health",
    kind: "OB/GYN",
    area: "Duluth",
    distance: "2.7 mi",
    tags: ["wheelchair", "exam-table", "lift", "asl", "parking"],
    note: "Height-adjustable exam tables in every room and a ceiling lift in two. Longer appointments available for people who need extra time or a supported exam.",
    ask: "Can I book a longer appointment with the accessible table, and can my support person stay?",
    verified: "August 2026",
  },
  {
    id: "summit",
    name: "Summit Rheumatology",
    kind: "Specialty care · rheumatology",
    area: "Lilburn",
    distance: "6.3 mi",
    tags: ["wheelchair", "exam-table", "asl", "telehealth", "parking"],
    note: "Infusion suite has recliners and accessible restrooms. Offers telehealth follow-ups for established patients. Written visit summaries available in large print.",
    ask: "Can my infusion be scheduled with extra time and a recliner near the restroom?",
    verified: "June 2026",
  },
  {
    id: "nightingale",
    name: "Nightingale Home Care",
    kind: "Home health · nursing and therapy",
    area: "Gwinnett County",
    distance: "Countywide",
    tags: ["home", "asl", "sliding", "telehealth"],
    note: "Nurses and therapists come to you. ASL-fluent staff available with notice. Accepts Medicaid and offers a sliding scale for private-pay clients.",
    ask: "What is the waitlist for a nurse who signs, and do you bill Medicaid directly?",
    verified: "July 2026",
  },
];

export function tagLabel(id: AccessTagId): string {
  return accessTags.find((tag) => tag.id === id)?.label ?? id;
}

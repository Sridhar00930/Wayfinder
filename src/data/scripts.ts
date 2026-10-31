export interface ScriptField {
  key: string;
  label: string;
  placeholder: string;
  optional?: boolean;
}

export interface ScriptTemplate {
  id: string;
  title: string;
  when: string;
  tip: string;
  fields: ScriptField[];
  build: (values: Record<string, string>) => string[];
}

function fill(values: Record<string, string>, key: string, fallback: string): string {
  const value = values[key]?.trim();
  return value && value.length > 0 ? value : `[${fallback}]`;
}

export const scripts: ScriptTemplate[] = [
  {
    id: "interpreter",
    title: "Ask for an ASL interpreter",
    when: "Use this when you book an appointment, or if a clinic tells you to bring a family member to interpret.",
    tip: "Under the ADA, clinics generally must provide effective communication at no cost to you. They shouldn’t ask you to bring your own interpreter, and they can’t rely on family or friends to interpret except in an emergency or if you ask for that.",
    fields: [
      { key: "name", label: "Your name", placeholder: "Jordan Ellis" },
      { key: "clinic", label: "Clinic or hospital", placeholder: "Riverbend Family Health" },
      { key: "date", label: "Appointment date", placeholder: "November 12" },
      { key: "time", label: "Appointment time", placeholder: "2:30 p.m." },
      { key: "phone", label: "Best callback number", placeholder: "(770) 555-0142" },
    ],
    build: (values) => [
      `Hi, my name is ${fill(values, "name", "your name")}. I have an appointment at ${fill(values, "clinic", "clinic name")} on ${fill(values, "date", "date")} at ${fill(values, "time", "time")}, and I need an American Sign Language interpreter for the visit.`,
      "Please arrange a qualified ASL interpreter — not a family member or a staff member who happens to know some signs. I would like written confirmation that the interpreter is booked, including the name of the person who arranged it.",
      "If you cannot arrange an interpreter, please tell me now so I can find another provider. You can reach me at " + fill(values, "phone", "callback number") + ". Thank you.",
    ],
  },
  {
    id: "exam-table",
    title: "Request an accessible exam table or transfer help",
    when: "Use this before a physical exam, imaging visit, or any appointment where you will need to get onto a table.",
    tip: "Ask for this to be noted in your appointment record so you do not have to explain it again at every visit.",
    fields: [
      { key: "name", label: "Your name", placeholder: "Sam Rivera" },
      { key: "clinic", label: "Clinic or hospital", placeholder: "Lakeside Women's Health" },
      { key: "provider", label: "Provider you are seeing", placeholder: "Dr. Chen" },
      { key: "date", label: "Appointment date", placeholder: "December 3" },
      { key: "needs", label: "What help do you need?", placeholder: "A ceiling lift and two staff members trained to help me transfer", optional: true },
    ],
    build: (values) => [
      `Hi, I'm ${fill(values, "name", "your name")}. I have an appointment with ${fill(values, "provider", "provider")} at ${fill(values, "clinic", "clinic")} on ${fill(values, "date", "date")}.`,
      `I use a wheelchair and I need an accessible exam room with a height-adjustable exam table and a transfer lift.${values.needs?.trim() ? ` Here is what I need specifically: ${values.needs.trim()}.` : ""}`,
      "Can you confirm these are available at this location before my visit? If they are not, please tell me which of your locations has them, or how you plan to accommodate me. Please note this in my appointment record so it is ready when I arrive.",
    ],
  },
  {
    id: "denial",
    title: "Appeal a denied claim",
    when: "Use this as the opening of a call, or as the first paragraph of a written internal appeal.",
    tip: "Ask for the appeal deadline, the clinical criteria used, and a reference number for the call. Keep a copy of everything you send.",
    fields: [
      { key: "insurer", label: "Insurance company", placeholder: "Peach State Health Plan" },
      { key: "memberId", label: "Member ID", placeholder: "ABC12345678" },
      { key: "claim", label: "Claim or reference number", placeholder: "CLM-889201" },
      { key: "service", label: "Service that was denied", placeholder: "power wheelchair evaluation" },
      { key: "deniedOn", label: "Date of the denial", placeholder: "October 18" },
      { key: "reason", label: "Reason in the denial letter", placeholder: "not medically necessary", optional: true },
    ],
    build: (values) => [
      `To whom it may concern: I am appealing the denial dated ${fill(values, "deniedOn", "date")} for ${fill(values, "service", "service")}, claim number ${fill(values, "claim", "claim number")}, member ID ${fill(values, "memberId", "member ID")}.`,
      `The denial says: ${fill(values, "reason", "reason in the denial letter")}. I am requesting a full copy of the plan's clinical criteria for this service and the specific reason it was denied.`,
      "My provider is submitting a letter of medical necessity that addresses the plan's criteria. Please treat this as a formal internal appeal. I am requesting an expedited review if waiting could harm my health.",
      "Please confirm in writing that you received this appeal, give me the reference number, and tell me the date by which you will respond. Thank you.",
    ],
  },
  {
    id: "sensory",
    title: "Ask for a quiet, low-sensory visit",
    when: "Use this for autism, migraine, PTSD, chronic pain, or any sensory need that makes a busy clinic hard.",
    tip: "Being specific helps staff act: quiet room, dim lights, text notification, first appointment of the day.",
    fields: [
      { key: "name", label: "Your name", placeholder: "Alex Morgan" },
      { key: "clinic", label: "Clinic", placeholder: "Bright Path Behavioral Health" },
      { key: "date", label: "Appointment date", placeholder: "November 20" },
      { key: "needs", label: "What helps you?", placeholder: "A quiet waiting area, lights dimmed, and a text when you're ready for me", optional: true },
    ],
    build: (values) => [
      `Hi, I'm ${fill(values, "name", "your name")}. I have an appointment at ${fill(values, "clinic", "clinic")} on ${fill(values, "date", "date")}. I have sensory sensitivities and I would like to request a low-sensory visit.`,
      `Specifically, I would like: ${fill(values, "needs", "quiet waiting area, dimmed lights, and a text notification instead of my name being called")}.`,
      "Please add this to my chart so it is ready when I arrive. If any of this is not possible, please tell me what you can do so I can plan ahead. Thank you.",
    ],
  },
  {
    id: "plain-language",
    title: "Ask for written instructions in plain language",
    when: "Use this after a visit, when you are leaving the hospital, or when instructions were spoken too fast to remember.",
    tip: "You can ask for large print, audio, or a translated version at the same time.",
    fields: [
      { key: "name", label: "Your name", placeholder: "Jordan Ellis" },
      { key: "clinic", label: "Clinic or hospital", placeholder: "Northline Imaging" },
      { key: "provider", label: "Provider you saw", placeholder: "Dr. Patel" },
      { key: "date", label: "Visit date", placeholder: "October 28" },
      { key: "format", label: "Format you prefer", placeholder: "email and large print", optional: true },
    ],
    build: (values) => [
      `Hi, I'm ${fill(values, "name", "your name")}. I saw ${fill(values, "provider", "provider")} at ${fill(values, "clinic", "clinic")} on ${fill(values, "date", "date")}.`,
      "I would like my visit summary and care instructions in plain language, in writing. Please include what I should do each day, what to watch for, and when to call you.",
      `Please send it in this format: ${fill(values, "format", "large print or email")}. If the information is available in audio, please include that too. Thank you.`,
    ],
  },
  {
    id: "prior-auth",
    title: "Check on a prior authorization",
    when: "Use this when a test, procedure, drug, or piece of equipment is waiting on insurance approval.",
    tip: "Write down the reference number and the date the request was received. Those two facts make it much harder to lose your request.",
    fields: [
      { key: "insurer", label: "Insurance company", placeholder: "Peach State Health Plan" },
      { key: "service", label: "Service or drug", placeholder: "MRI of the lumbar spine" },
      { key: "provider", label: "Ordering provider", placeholder: "Dr. Okafor" },
      { key: "requested", label: "Date requested", placeholder: "October 22" },
      { key: "memberId", label: "Member ID", placeholder: "ABC12345678" },
    ],
    build: (values) => [
      `Hello, I'm calling about a prior authorization for ${fill(values, "service", "service")} requested by ${fill(values, "provider", "provider")} on ${fill(values, "requested", "date requested")}. My member ID is ${fill(values, "memberId", "member ID")}.`,
      "Can you confirm you received it, tell me the current status, and give me the date it was received? If it is pending, what specifically are you waiting for, and who needs to send it?",
      "If it was denied, please send the denial in writing with the reason and the appeal instructions. Please also give me a reference number for this call. Thank you.",
    ],
  },
  {
    id: "pharmacy-label",
    title: "Ask for an accessible prescription label",
    when: "Use this at any pharmacy if standard labels are hard to read or open.",
    tip: "Many pharmacies can add large print, braille, or audio labels, and non-child-resistant caps. Ask them to save the preference on your profile.",
    fields: [
      { key: "name", label: "Your name", placeholder: "Sam Rivera" },
      { key: "pharmacy", label: "Pharmacy", placeholder: "Gateway Pharmacy" },
      { key: "medication", label: "Medication", placeholder: "metformin 500 mg" },
      { key: "format", label: "Label format", placeholder: "large print and a non-child-resistant cap", optional: true },
    ],
    build: (values) => [
      `Hi, I'm ${fill(values, "name", "your name")}. I would like my prescription for ${fill(values, "medication", "medication")} at ${fill(values, "pharmacy", "pharmacy")} to have ${fill(values, "format", "a large-print label and a non-child-resistant cap")}.`,
      "Please also add this preference to my profile so future prescriptions use it automatically. If there is a cost or a form I need to sign, please let me know. Thank you.",
    ],
  },
];

export function scriptById(id: string): ScriptTemplate {
  return scripts.find((script) => script.id === id) ?? scripts[0];
}

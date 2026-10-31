/**
 * Rehearsal Room: practice phone calls before you make them.
 * Each scenario is a small branching script. Good choices earn "keys":
 * the real-world things that make a call count (a reference number,
 * a name, something in writing, a deadline, a next step).
 * Scenarios are fictional practice, not legal or insurance advice.
 */

export interface RehearsalChoice {
  text: string;
  next: string;
  feedback: string;
  good: boolean;
  key?: string;
}

export interface RehearsalNode {
  id: string;
  line: string;
  choices: RehearsalChoice[];
}

export interface RehearsalKey {
  id: string;
  label: string;
  why: string;
}

export interface Scenario {
  id: string;
  title: string;
  gatekeeper: string;
  role: string;
  setup: string;
  start: string;
  keys: RehearsalKey[];
  nodes: RehearsalNode[];
  debrief: string;
}

export const END = "end";

export const scenarios: Scenario[] = [
  {
    id: "denial-call",
    title: "The denial call",
    gatekeeper: "Dana",
    role: "insurance member services",
    setup:
      "Your plan denied a power wheelchair as “not medically necessary.” You’re calling member services to find out what to do next.",
    start: "d1",
    keys: [
      { id: "ref", label: "A reference number for the call", why: "It proves the call happened and lets the next person find it." },
      { id: "writing", label: "The criteria, in writing", why: "You can’t answer a reason you’ve never seen." },
      { id: "deadline", label: "The appeal deadline", why: "Missing it can end your appeal. Check it against your letter." },
      { id: "name", label: "The rep’s name or ID", why: "It goes in your call log, next to the reference number." },
      { id: "p2p", label: "A next step: peer-to-peer review", why: "Your doctor may be able to talk directly with the plan’s reviewer." },
    ],
    nodes: [
      {
        id: "d1",
        line: "Thanks for calling member services. This is Dana. How can I help you today?",
        choices: [
          {
            text: "Hi Dana. Before we start, can I get a reference number for this call?",
            next: "d2",
            good: true,
            key: "ref",
            feedback: "Strong opening. Asking first means you won’t forget at the end.",
          },
          {
            text: "Your company denied my wheelchair and I’m really upset.",
            next: "d2",
            good: false,
            feedback:
              "That feeling is completely fair. It usually goes better if you lead with a clear request, so try asking for a reference number first.",
          },
        ],
      },
      {
        id: "d2",
        line: "I see the claim. The power wheelchair was denied as not medically necessary.",
        choices: [
          {
            text: "Can you send me the exact criteria you used to decide that, in writing?",
            next: "d3",
            good: true,
            key: "writing",
            feedback: "That’s the key ask. Your doctor’s letter can then answer the plan’s exact reason.",
          },
          {
            text: "So there’s nothing I can do?",
            next: "d3",
            good: false,
            feedback: "A denial is a decision, not the end. Ask for the criteria they used, in writing.",
          },
          {
            text: "Why?",
            next: "d3",
            good: false,
            feedback: "Good instinct, but “why” tends to get a vague answer. Ask for the specific criteria, in writing.",
          },
        ],
      },
      {
        id: "d3",
        line: "I can send the criteria by mail. Is there anything else?",
        choices: [
          {
            text: "Yes. What’s the deadline to appeal, and where do I send it?",
            next: "d4",
            good: true,
            key: "deadline",
            feedback: "Exactly right. Write the deadline down, then check it against your letter.",
          },
          {
            text: "No, that’s all, thanks.",
            next: "d4",
            good: false,
            feedback: "Before you hang up, ask: “What is the deadline to appeal?”",
          },
        ],
      },
      {
        id: "d4",
        line: "In this practice call, you have 180 days from the date on your letter. The address is on page two.",
        choices: [
          {
            text: "Thank you. Can I have your name or rep ID for my notes?",
            next: "d5",
            good: true,
            key: "name",
            feedback: "Perfect. Your call log now has a name and a reference number.",
          },
          {
            text: "Okay, bye.",
            next: END,
            good: false,
            feedback: "You got useful information! Next time, ask for the rep’s name or ID before you hang up.",
          },
        ],
      },
      {
        id: "d5",
        line: "I’m Dana, ID 4471. Anything else I can help with?",
        choices: [
          {
            text: "Can my doctor ask for a peer-to-peer review with your medical reviewer?",
            next: END,
            good: true,
            key: "p2p",
            feedback: "Great follow-up. A conversation between doctors can sometimes resolve a denial faster.",
          },
          {
            text: "That’s everything. Thank you, Dana.",
            next: END,
            good: true,
            feedback: "A solid call. One more idea for next time: ask whether a peer-to-peer review is available.",
          },
        ],
      },
    ],
    debrief:
      "This is practice. Real appeal deadlines and steps depend on your plan and state. Always check the letter you received, and keep a call log.",
  },
  {
    id: "booking",
    title: "Booking an accessible visit",
    gatekeeper: "Marcus",
    role: "clinic front desk",
    setup:
      "You use a wheelchair and need a height-adjustable exam table and a transfer lift. You’re calling a clinic to book a check-up.",
    start: "b1",
    keys: [
      { id: "early", label: "Access needs mentioned up front", why: "The clinic can plan a room and time before booking." },
      { id: "specific", label: "Equipment named specifically", why: "“Accessible” means different things to different people." },
      { id: "safe", label: "An unsafe transfer turned down", why: "You can say no to being lifted by hand." },
      { id: "confirm", label: "Confirmation in writing", why: "The next person at the desk will know too." },
    ],
    nodes: [
      {
        id: "b1",
        line: "Good morning, Riverbend Family Health. This is Marcus. How can I help?",
        choices: [
          {
            text: "Hi Marcus. I’d like to book a check-up, and I have a few access needs to arrange.",
            next: "b2",
            good: true,
            key: "early",
            feedback: "Nice. Saying it up front gives them time to plan.",
          },
          {
            text: "Um, can I get an appointment?",
            next: "b2",
            good: false,
            feedback: "This is okay. Next time, say your access needs first, so they can pick the right room.",
          },
        ],
      },
      {
        id: "b2",
        line: "Sure. We have Tuesday at 10 a.m. Will that work?",
        choices: [
          {
            text: "Tuesday works. I need a height-adjustable exam table and a transfer lift. Can you confirm you have both?",
            next: "b3",
            good: true,
            key: "specific",
            feedback: "Specific and clear. Naming the equipment avoids surprises on the day.",
          },
          {
            text: "Sure, that’s fine.",
            next: "b3",
            good: false,
            feedback: "It’s easy to skip when you’re tired. Name the exact equipment you need.",
          },
        ],
      },
      {
        id: "b3",
        line: "Hmm. We don’t usually use a lift. A couple of our staff can help lift you onto the table.",
        choices: [
          {
            text: "I’d rather not be lifted by hand, because it isn’t safe for me or your staff. Is there a room with a lift, or another option?",
            next: "b4",
            good: true,
            key: "safe",
            feedback: "Calm and firm. You named the safety issue and asked for a solution.",
          },
          {
            text: "Okay, I guess that’s fine.",
            next: "b4",
            good: false,
            feedback: "You’re allowed to say no to an unsafe transfer. Ask whether a lift or another room is available.",
          },
        ],
      },
      {
        id: "b4",
        line: "Let me check… Suite B has a lift and a lower table. I’ll book you there.",
        choices: [
          {
            text: "Thank you! Could you note that on my appointment and send me a confirmation in writing?",
            next: END,
            good: true,
            key: "confirm",
            feedback: "Excellent. A written note travels with your appointment.",
          },
          {
            text: "Great, thanks so much!",
            next: END,
            good: true,
            feedback: "You did it! Next time, ask for written confirmation so the note follows your booking.",
          },
        ],
      },
    ],
    debrief:
      "Disability rights laws like the ADA and Section 504 generally require health care providers to make their services accessible. What that requires for specific equipment can vary, so a disability rights organization can help if a clinic says no.",
  },
  {
    id: "pharmacy",
    title: "The pharmacy counter",
    gatekeeper: "Priya",
    role: "pharmacist",
    setup: "You’re picking up a new medicine, and the pharmacist says your insurance won’t cover it yet.",
    start: "p1",
    keys: [
      { id: "who", label: "Who starts the prior authorization", why: "Otherwise each office may think the other one is handling it." },
      { id: "bridge", label: "A question about a short supply while you wait", why: "Some plans and pharmacies can help with a few days’ supply." },
      { id: "options", label: "The cash price and covered alternatives", why: "It gives you a backup if the approval is slow." },
    ],
    nodes: [
      {
        id: "p1",
        line: "Your insurance needs a prior authorization for this one, so I can’t fill it today.",
        choices: [
          {
            text: "Okay. Who sends the prior authorization request: you, or my doctor’s office?",
            next: "p2",
            good: true,
            key: "who",
            feedback: "Exactly the right question. Now you know who will send it.",
          },
          {
            text: "So I just can’t get my medicine?",
            next: "p2",
            good: false,
            feedback: "That’s a scary thing to hear. Asking who starts the request is the first step to fixing it.",
          },
        ],
      },
      {
        id: "p2",
        line: "Your doctor’s office has to submit it. It can take a few days.",
        choices: [
          {
            text: "Could you let them know today? And is a short supply possible while I wait?",
            next: "p3",
            good: true,
            key: "bridge",
            feedback: "Smart. Whether a short supply is possible depends on your plan and the medicine, but it’s always worth asking.",
          },
          {
            text: "Okay, I’ll wait.",
            next: "p3",
            good: false,
            feedback: "Waiting is okay, but it’s worth asking whether a short supply is possible in the meantime.",
          },
        ],
      },
      {
        id: "p3",
        line: "I’ll send them a note now, and I’ll check what we can do in the meantime.",
        choices: [
          {
            text: "Thank you. What’s the cash price, and is there a similar medicine my plan does cover?",
            next: END,
            good: true,
            key: "options",
            feedback: "Great backup plan. Ask your prescriber before switching anything.",
          },
          {
            text: "Thanks, Priya.",
            next: END,
            good: true,
            feedback: "Nicely done. Next time, also ask about the cash price and covered alternatives.",
          },
        ],
      },
    ],
    debrief:
      "Practice only. Rules for prior authorization and short supplies depend on your plan, your state, and the medicine. Never change or stop a medicine without talking to your prescriber.",
  },
];

export function scenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

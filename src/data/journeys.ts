export interface Step {
  title: string;
  detail: string;
  say?: string;
}

export interface Journey {
  id: string;
  title: string;
  blurb: string;
  icon: "shield" | "home" | "door" | "pill" | "compass" | "wallet";
  time: string;
  steps: Step[];
}

export const journeys: Journey[] = [
  {
    id: "denial",
    title: "My insurance said no",
    blurb:
      "A denial is a decision, not a final answer. This is the path from reading the letter to asking for an independent review.",
    icon: "shield",
    time: "About 30 minutes to start",
    steps: [
      {
        title: "Find the three facts in the letter",
        detail:
          "Denial letters are dense on purpose. Look for the service that was denied, the exact reason (often a code or a phrase like “not medically necessary”), and the deadline and instructions for appealing. Write all three down before you call anyone.",
        say: "Can you point me to the page that explains how to appeal and the deadline?",
      },
      {
        title: "Start a call log",
        detail:
          "Every time you call, note the date, the representative's name or ID, the reference number, and what they promised. This log is often what moves a stalled appeal forward.",
      },
      {
        title: "Call member services and ask for the criteria",
        detail:
          "Ask for the specific clinical criteria used in the decision, in writing. Ask whether your provider can request a peer-to-peer review — a conversation between your doctor and the plan's doctor. Get a reference number for the call.",
        say: "Please send me the clinical criteria used to deny this, in writing, and tell me whether a peer-to-peer review is available.",
      },
      {
        title: "Ask your provider for a letter of medical necessity",
        detail:
          "Ask them to address the insurer's exact reason, explain what you have already tried, and describe what happens without the service. Disability-related needs and functional impact belong in the letter too.",
        say: "Can you write a letter of medical necessity that addresses the insurer's exact reason for denial?",
      },
      {
        title: "File the internal appeal and keep proof",
        detail:
          "Include the denial letter, your provider's letter, and relevant records. Submit through the portal or by certified mail, and save the confirmation. If waiting could harm your health, ask for an expedited appeal.",
        say: "I'd like to file an internal appeal and request expedited review. What is your fax number and reference process?",
      },
      {
        title: "Ask for free help",
        detail:
          "Your state's insurance consumer assistance program or ombudsman, a Center for Independent Living, a hospital patient navigator, or your HR benefits team can help you file — usually at no cost. You do not have to do this alone.",
      },
      {
        title: "Request an external review if the appeal fails",
        detail:
          "If your internal appeal is denied, you usually have about four months to request an independent external review. A reviewer outside the insurance company makes the final decision.",
        say: "I'd like to request an external review. Please send the instructions and the deadline in writing.",
      },
      {
        title: "Check the rules for your kind of plan",
        detail:
          "Medicare and Medicaid have different appeal paths, including Medicare reconsideration and Medicaid fair hearings. SHIP counselors give free Medicare help, and your state Medicaid office can explain hearings.",
      },
    ],
  },
  {
    id: "discharge",
    title: "I'm leaving the hospital",
    blurb:
      "Discharge is where people fall through the cracks. These are the questions that get equipment, medications, and follow-up care in place before you leave.",
    icon: "home",
    time: "About 45 minutes",
    steps: [
      {
        title: "Ask for discharge planning on day one",
        detail:
          "Do not wait until the last hour. Ask to speak with a discharge planner or social worker as soon as you are admitted. Planning early is especially important if you need equipment, home care, or a facility.",
        say: "I'd like to start discharge planning now. Can I meet the discharge planner or social worker?",
      },
      {
        title: "Get instructions in plain language, in writing",
        detail:
          "Ask for your diagnoses, medication changes, activity limits, wound care, warning signs, and who to call — written down, not just spoken. Ask them to use plain words and large print if that helps.",
        say: "Can I have the discharge instructions in writing, in plain language and large print?",
      },
      {
        title: "Review every medication before you leave",
        detail:
          "Go through each medicine: what it is for, the dose, when to take it, and which ones are new or stopped. Ask for a pill card or updated medication list. Pharmacies can also do a free review.",
        say: "Which medicines are new, which ones stopped, and can I have an updated list?",
      },
      {
        title: "Confirm equipment arrives before you do",
        detail:
          "Wheelchairs, walkers, commodes, hospital beds, and oxygen can take days. Ask who is delivering what, when, and who to call if it is late. Do not leave without a plan for the equipment you need.",
        say: "Has the equipment been ordered, who is delivering it, and on what date?",
      },
      {
        title: "Get follow-up appointments booked, not suggested",
        detail:
          "Ask the hospital to schedule the follow-up while you are still there. If they cannot, ask for the exact provider, phone number, and how soon. Ask whether the visit needs a referral or prior authorization.",
        say: "Can you book my follow-up appointment before I leave, and is a referral needed?",
      },
      {
        title: "Ask about home care and therapy",
        detail:
          "Ask whether you qualify for home health nursing, physical therapy, occupational therapy, or speech therapy, and confirm the first visit date. Ask what is covered and what you will owe.",
        say: "Do I qualify for home health or therapy, and when will the first visit be?",
      },
      {
        title: "Arrange transportation now",
        detail:
          "Ask how you are getting home and how you will get to follow-up visits. Medicaid may cover non-emergency medical transportation; paratransit and disability transit services may need advance booking.",
        say: "Can you help arrange a ride home and for follow-up appointments?",
      },
      {
        title: "Know the warning signs and the 24/7 number",
        detail:
          "Ask: what would make you tell me to come back? Get the specific number to call after hours. Ask for your discharge summary and confirm it was sent to your primary care doctor.",
        say: "What symptoms mean I should call you, and what number do I call at night or on weekends?",
      },
    ],
  },
  {
    id: "access",
    title: "I need accessible care",
    blurb:
      "Access is more than a ramp. Use these steps to ask specific questions, book communication access, and advocate for yourself if you are refused.",
    icon: "door",
    time: "About 20 minutes",
    steps: [
      {
        title: "Filter, then verify by phone",
        detail:
          "Accessibility information online is often outdated. Make a short list, then call and ask about the specific things you need. Write down who confirmed it and the date.",
        say: "I'm calling to check accessibility before I book. Can you confirm the details I need?",
      },
      {
        title: "Ask about the physical space specifically",
        detail:
          "Ask about the entrance, door widths, elevator, accessible restroom, exam table height, transfer lift, accessible parking, and whether staff can help with a transfer. “Wheelchair accessible” alone does not answer these.",
        say: "Do you have a height-adjustable exam table and a transfer lift? Can staff help me transfer safely?",
      },
      {
        title: "Book communication access",
        detail:
          "Request a qualified ASL interpreter or CART at the time you book. Under the ADA, providers generally must arrange effective communication at no cost to you, and they shouldn't rely on a family member to interpret except in an emergency or if you ask. You can ask for the interpreter's name in advance.",
        say: "I need a qualified ASL interpreter for this appointment. Please confirm it is booked and note it in my chart.",
      },
      {
        title: "Ask for a sensory plan",
        detail:
          "Ask for a quiet waiting space away from the main lobby, dimmed lights where possible, a text notification instead of a name called out, and a first or last appointment of the day. Explain what helps you.",
        say: "I'm autistic and need a low-sensory visit. Can I wait somewhere quiet and be notified by text?",
      },
      {
        title: "Ask for more time",
        detail:
          "Transferring, communicating, and being examined can take longer. Ask for a longer slot or the last appointment of the day so you are not rushed. This is a reasonable modification.",
        say: "I need extra time for communication and transfer. Can we book a longer appointment?",
      },
      {
        title: "Bring support and a backup plan",
        detail:
          "Bring an advocate if that helps, a one-page summary of your needs and medications, and a phone charger. If you use a power chair, ask about accessible transport and backup charging.",
      },
      {
        title: "Know what to do if you're refused",
        detail:
          "You do not have to accept a refusal. Ask for the ADA or Section 504 coordinator, put the request in writing, and ask for the denial in writing. You can file a complaint with the U.S. Department of Justice or, for health care, the Department of Health and Human Services Office for Civil Rights.",
        say: "I'm requesting an accommodation under the ADA. Please connect me with your ADA coordinator and confirm my request in writing.",
      },
    ],
  },
  {
    id: "medication",
    title: "My prescription isn't covered",
    blurb:
      "There are usually several paths: a different drug, an exception, a cash price, or manufacturer help. Work through them in order.",
    icon: "pill",
    time: "About 25 minutes",
    steps: [
      {
        title: "Get the exact reason",
        detail:
          "Ask your pharmacy or plan why it was rejected. Common reasons are: not on the formulary, prior authorization required, step therapy, a quantity limit, or the pharmacy is not in network. The reason determines your next move.",
        say: "Can you tell me the exact rejection reason and the code on the claim?",
      },
      {
        title: "Ask for covered alternatives",
        detail:
          "Ask for two or three covered drugs in the same class, including generics, and share the list with your prescriber. Ask whether the alternative has the same effect for your condition.",
        say: "What covered alternatives are on my formulary at the lowest tier?",
      },
      {
        title: "Request an exception or prior authorization",
        detail:
          "Your prescriber submits a prior authorization or formulary exception. Ask them to include why this specific drug is necessary for you and why alternatives are not appropriate.",
        say: "Can you submit a formulary exception explaining why the alternatives don't work for me?",
      },
      {
        title: "Challenge step therapy if it applies",
        detail:
          "If the plan requires a cheaper drug first, you can request an exception when you have already tried it, when it is contraindicated, or when switching would be risky. Your prescriber documents the history.",
        say: "I've already tried the required drug. Can we request a step therapy exception?",
      },
      {
        title: "Compare cash prices",
        detail:
          "Sometimes a cash price is lower than your insurance copay. Check discount programs, pharmacy direct prices, warehouse pharmacies, and independent pharmacies. Ask your plan whether the purchase can still count toward your deductible.",
        say: "What is the cash price without insurance, and is there a discount program?",
      },
      {
        title: "Ask for manufacturer or patient assistance",
        detail:
          "Drug companies may have coupons or help programs for people with low income. A hospital financial counselor or a nonprofit for your condition can help you apply.",
        say: "Is there a manufacturer assistance program for this drug, and how do I apply?",
      },
      {
        title: "Make refills easier",
        detail:
          "Ask for a 90-day supply, mail order, automatic refills, or blister packaging. If you have trouble getting to the pharmacy, ask about delivery. These are practical accommodations, not special favors.",
        say: "Can I get a 90-day supply with automatic refills and delivery?",
      },
    ],
  },
  {
    id: "diagnosis",
    title: "I was just diagnosed",
    blurb:
      "You do not have to absorb everything in one appointment. These questions help you leave with a plan you can actually follow.",
    icon: "compass",
    time: "About 20 minutes",
    steps: [
      {
        title: "Ask for plain words and written information",
        detail:
          "Ask the clinician to explain the diagnosis as if you have never heard of it, and to write down the name, the plan, and where to read more. Ask for large print or an audio version if that helps.",
        say: "Can you explain that again in plain language, and write down the key points for me?",
      },
      {
        title: "Ask what is known and what is not",
        detail:
          "Ask what caused it, whether it is likely to change, what can be treated, and what is still uncertain. It is okay to ask the same question more than once.",
        say: "What don't we know yet, and what would help us find out?",
      },
      {
        title: "Bring someone or record the visit",
        detail:
          "Ask if you can record the conversation or bring a second person to take notes. If you have trouble processing speech, ask for the key points in writing before you leave.",
        say: "I'd like to record this so I can listen again. Is that okay?",
      },
      {
        title: "Ask about function, not just diagnosis",
        detail:
          "Ask how this may affect walking, lifting, eating, sleeping, work, school, driving, and energy. Ask about physical therapy, occupational therapy, equipment, and home changes.",
        say: "How might this affect my daily function, and what therapy or equipment could help?",
      },
      {
        title: "Book follow-up and tests before you leave",
        detail:
          "Ask what tests are next and why, when results will be ready, and who will explain them. Book the follow-up before you leave rather than calling later.",
        say: "What tests are next, when will results be back, and who will call me?",
      },
      {
        title: "Find your people",
        detail:
          "Condition-specific organizations, peer support groups, and Centers for Independent Living can explain practical help and benefits. Ask your care team for recommendations you can trust.",
      },
      {
        title: "Ask about mental health support",
        detail:
          "A new diagnosis can bring grief, anxiety, or exhaustion. Ask for a referral to a therapist or social worker who works with chronic illness and disability. This is part of care, not an afterthought.",
        say: "Can you refer me to someone who supports people adjusting to a new diagnosis?",
      },
    ],
  },
  {
    id: "cost",
    title: "I can't afford care",
    blurb:
      "There are more options than most people are told about. Start with coverage and sliding-scale care, then work through bills and prescriptions.",
    icon: "wallet",
    time: "About 30 minutes",
    steps: [
      {
        title: "Check Medicaid and CHIP eligibility",
        detail:
          "Coverage rules change, and disability can open pathways that income alone does not. Apply through your state Medicaid agency or HealthCare.gov. Free enrollment navigators can help with the application.",
        say: "Can you help me check whether I qualify for Medicaid or a Medicaid buy-in?",
      },
      {
        title: "Find a sliding-scale clinic",
        detail:
          "Federally Qualified Health Centers provide care on a sliding fee based on income, regardless of ability to pay. Look for an FQHC near you and ask what the visit will cost before you go.",
        say: "Do you offer a sliding fee scale, and what will I pay at my income?",
      },
      {
        title: "Ask the hospital for financial assistance",
        detail:
          "Many nonprofit hospitals must offer financial assistance or charity care. Ask for the policy in writing and for an application. Ask before or shortly after the bill arrives.",
        say: "Please send me your financial assistance policy and application.",
      },
      {
        title: "Get an itemized bill and look for errors",
        detail:
          "Ask for an itemized bill, not just a summary. Check dates, duplicate charges, and services you did not receive. Ask for the medical records if you need to compare.",
        say: "Please send an itemized bill and a copy of the medical records for this date.",
      },
      {
        title: "Ask for a payment plan",
        detail:
          "Many hospitals and clinics offer payment plans, often without interest. Ask for the smallest monthly payment they allow and get the terms in writing. Think twice before moving medical debt to a high-interest credit card.",
        say: "I can pay this amount each month. Can we set up an interest-free payment plan?",
      },
      {
        title: "Get help with prescriptions",
        detail:
          "Ask about patient assistance programs, copay cards, $4 generic lists, 340B pharmacies, and manufacturer programs. Your prescriber's office can often submit the paperwork.",
        say: "Are there patient assistance programs for this medication that I qualify for?",
      },
      {
        title: "Call 211 and ask for a navigator",
        detail:
          "211 connects you to local help with food, transportation, utilities, and health coverage. Ask for a benefits navigator or community health worker who can work through applications with you.",
        say: "I'd like to speak with a benefits navigator about health coverage and medical bills.",
      },
    ],
  },
];

export function journeyById(id: string): Journey | undefined {
  return journeys.find((journey) => journey.id === id);
}

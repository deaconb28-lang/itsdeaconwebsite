/**
 * The small-business pitch's own words. Same reasoning as the restaurant
 * page's copy.ts — the shared components stay honest about being shared, and
 * page.tsx stays readable as the section order.
 */

import type { ContactCopy } from "@/components/Contact";
import type { ProcessStep } from "@/components/Process";
import type { PricingFeatures } from "@/components/Pricing";

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    timing: "Free · step one",
    title: "The mockup",
    body: "I design a real homepage for your business and send it over. No invoice, no meeting needed.",
  },
  {
    timing: "Right now",
    title: "Your notes",
    body: "Tell me what's wrong with it — the colors, the wording, what you actually call the work. I'll change it while you watch.",
  },
  {
    timing: "About a week",
    title: "Build",
    body: "Say “build it” and I turn that one page into the whole site — services, service area, reviews, and a way to book you.",
  },
  {
    timing: "I handle it",
    title: "Launch",
    body: "I put it live, set up Google, and hand you every file. The domain stays in your name.",
  },
];

export const PROCESS_NOTE =
  "Tell me your business and I’ll spend an evening on it and send back a " +
  "finished homepage. Turn me down and the page is still yours to use.";

export const PRICING: PricingFeatures = {
  redesign: [
    "A whole new site — home, what you do, your story, contact",
    "One-tap calls, directions, quotes or booking",
    "Google Search & Maps done right — you own every file",
  ],
  care: [
    "Changes and new work — text me, done same-day",
    "Services, hours, and prices kept current",
  ],
  hosting: ["Quote forms, booking, and map connections kept running"],
};

export const NAPKIN_LEDE =
  "This is what happens when two people who were comparing three names on a " +
  "screen pick yours.";

export const CONTACT: ContactCopy = {
  heading: "Send me your business.",
  lede:
    "Tell me what you do and I’ll build the homepage first, free, before you " +
    "decide anything.",
  confirmation:
    "I’ll look you up tonight and come back with a homepage you can keep " +
    "either way.",
};

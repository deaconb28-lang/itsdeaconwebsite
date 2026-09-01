/**
 * The restaurant pitch's own words.
 *
 * These live beside the page rather than in the components that render them,
 * so the components stay honest about being shared and page.tsx stays readable
 * as what it is: the section order, which is the argument.
 */

import type { ContactCopy } from "@/components/Contact";
import type { ProcessStep } from "@/components/Process";
import type { PricingFeatures } from "@/components/Pricing";

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    timing: "Free · step one",
    title: "The mockup",
    body: "I design a real homepage for your place and send it over. No invoice, no meeting needed.",
  },
  {
    timing: "Right now",
    title: "Your notes",
    body: "Tell me what's wrong with it — the colors, the photos, your name for a dish. I'll change it while you watch.",
  },
  {
    timing: "About a week",
    title: "Build",
    body: "Say “build it” and I turn that one page into the whole site — menu, story, contact, booking.",
  },
  {
    timing: "I handle it",
    title: "Launch",
    body: "I put it live, set up Google, and hand you every file. The domain stays in your name.",
  },
];

export const PROCESS_NOTE =
  "Tell me your restaurant and I’ll spend an evening on it and send back a " +
  "finished homepage. Turn me down and the page is still yours to use.";

export const PRICING: PricingFeatures = {
  redesign: [
    "A whole new site — home, menu, your story, contact",
    "One-tap calls, directions, booking or ordering",
    "Google Search & Maps done right — you own every file",
  ],
  care: [
    "Changes and specials — text me, done same-day",
    "Menu, hours, and photos kept current",
  ],
  hosting: ["Booking, ordering, and map connections kept running"],
};

export const NAPKIN_LEDE =
  "This is what happens when two Friday walk-ins find your menu on their " +
  "phone and decide to come in.";

export const CONTACT: ContactCopy = {
  heading: "Send me your restaurant.",
  lede:
    "Tell me the restaurant and I’ll build the homepage first, free, before " +
    "you decide anything.",
  confirmation:
    "I’ll look your place up tonight and come back with a homepage you can " +
    "keep either way.",
};

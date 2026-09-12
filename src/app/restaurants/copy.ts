/**
 * The restaurant pitch's own words.
 *
 * These live beside the page rather than in the components that render them,
 * so the components stay honest about being shared and page.tsx stays readable
 * as what it is: the section order, which is the argument.
 */

import type { ContactCopy } from "@/components/Contact";
import type { ProcessStep } from "@/components/Process";
import {
  BUILD_OPTIONS,
  money,
  offeringsFor,
  optionById,
  type Offerings,
} from "@/lib/offerings";

/** Named rather than written out, so the credit can never outlive the price. */
const REPORT_PRICE = money(optionById(BUILD_OPTIONS, "report").amount);

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

export const OFFERINGS: Offerings = offeringsFor({
  report: {
    tagline: "You want to know what's wrong before you spend real money.",
    blurb:
      "A full walkthrough of the site you have now, page by page, on a " +
      "laptop and on a phone. You get a written report back: what's costing " +
      "you customers, what to fix first, what's worth building, and what " +
      "that should cost.",
    features: [
      "Page-by-page review on desktop and mobile",
      "Load speed, search visibility, and mobile checks, with the actual numbers",
      "A prioritized list of fixes, ranked by what each one will do for you",
      "A recommendation for what to build next, with realistic pricing",
      "Back to you in about a week",
    ],
    notes: [
      "Yours to keep either way. Build it yourself, hand it to whoever runs " +
        "your site, or hire anyone you like.",
      `If you decide to build with me within 30 days, the ${REPORT_PRICE} comes off the price.`,
    ],
  },
  redesign: {
    tagline: "The site, done right.",
    blurb:
      "A new website, built from scratch, launched and working. You see the " +
      "finished homepage before you pay a dollar.",
    features: [
      "Every page rebuilt: menu, hours, story, contact, whatever else you need",
      "Fast on a phone, because that's where almost everyone will see it",
      "Menu, hours, and photos loaded and correct on day one",
      "Online ordering, reservations, and map links wired up",
      "Your domain stays in your name",
      "Two rounds of changes after you see it, then we launch",
      "About two weeks start to finish",
    ],
    notes: [
      "Nothing due until you've looked at the finished site and told me it's good.",
    ],
  },
  refresh: {
    tagline:
      "The site, plus the photos to fill it, plus everywhere else people find you.",
    leadIn: "Everything in The Redesign",
    features: [
      "A photo shoot at your place: the room, the counter, the plates",
      "Edited photos, yours to keep and use anywhere, on the site, on Instagram, on printed menus",
      "Your Google Business Profile rebuilt: hours, categories, photos, menu link",
      "Maps, Yelp, and your Instagram bio all pointing at the same correct information",
      "Search setup so you turn up when someone nearby is looking, and when they ask an AI assistant where to eat",
    ],
  },
  care: {
    features: [
      "Text or email me a change and it's live the same day",
      "Menu, prices, hours, holiday closures, new photos",
      "Small additions as you think of them",
      "Cancel whenever, no notice",
    ],
  },
  careHosting: {
    leadIn: "Everything in Care",
    features: [
      "Hosting and the SSL certificate, handled",
      "Security monitoring, backups, and updates",
      "Ongoing search work: Google, Maps, and the AI assistants people now ask for recommendations",
      "A short monthly note on what people did on your site",
      "Cancel whenever, no notice",
    ],
  },
  plansNote: "More than one location? Those get quoted on their own. Just ask.",
});

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

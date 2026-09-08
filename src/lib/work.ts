import type { StaticImageData } from "next/image";

import glacier from "../../public/assets/glacier-house.png";
import kylani from "../../public/assets/kylani.png";
import supercruise from "../../public/assets/supercruise.png";

export type WorkItem = {
  index: string;
  kind: string;
  title: string;
  body: string;
  /** What the browser chrome shows. Must be where `href` actually goes. */
  url: string;
  href: string;
  image: StaticImageData;
  alt: string;
  /** Paid work, versus something built for its own sake. */
  status: "client" | "live";
  /** Source crops badly on cover and has to be letterboxed instead. */
  contain?: boolean;
};

/**
 * The three sites, in one place.
 *
 * This lives here rather than inside Work.tsx because the front page shows the
 * same three at a smaller size, and one list is the only way the two stay in
 * agreement.
 *
 * Two rules. `url` is what `href` actually opens — the chrome bar is a promise
 * about where a click goes, so it cannot show a prettier domain than the real
 * one. Card 03 used to display supercruise.app while linking at that
 * deployment's Vercel preview URL; both serve the same site, so the fix was to
 * point the link at the real domain rather than to demote the label.
 *
 * And `status` is stated, not derived. It used to be inferred from whether
 * `href` was set, which meant the one real paying client read as "Client" only
 * because it was the one card nobody had linked.
 */
export const WORK: readonly WorkItem[] = [
  {
    index: "01",
    kind: "Restaurant & pizzeria",
    title: "Glacier House",
    body: "A Mt. Hood room whose whole menu used to be a PDF. Now the site takes orders and holds the kitchen hours.",
    url: "glacierpublichouse.com",
    href: "https://glacierpublichouse.com",
    image: glacier,
    alt: "The Glacier House homepage",
    status: "client",
  },
  {
    index: "02",
    kind: "Product site",
    title: "Kylani",
    body: "One claim, one input, one thing to do next.",
    url: "kylani.app",
    href: "https://kylani.app",
    image: kylani,
    alt: "The Kylani product site",
    status: "live",
  },
  {
    index: "03",
    kind: "App landing",
    title: "Supercruise",
    body: "A dense financial product made legible for a general audience.",
    url: "supercruise.app",
    href: "https://supercruise.app",
    image: supercruise,
    alt: "The Supercruise app landing page",
    status: "live",
    contain: true,
  },
];

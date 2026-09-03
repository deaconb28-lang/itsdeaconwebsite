import type { Viewport } from "next";
import { Archivo } from "next/font/google";
import Link from "next/link";

import { metadataFor, StructuredData, type PageMeta } from "@/lib/page-meta";
import styles from "./page.module.css";

/**
 * Loaded here rather than in the root layout so only this route pays for it.
 * The two pitch pages keep the shopfront's signage gothic; the door has its
 * own voice, and its own weight budget.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-door",
  display: "swap",
});

const META: PageMeta = {
  path: "/",
  title: "Deacon — websites for local businesses",
  description:
    "I design and build websites for local businesses — by hand, one at a time. Free homepage first, before you owe me a cent.",
  keywords: [
    "small business website design",
    "restaurant website design",
    "local business web designer",
    "Deacon",
  ],
  serviceType: "Website design and development for local businesses",
};

export const metadata = metadataFor(META);

/**
 * The root layout paints the browser chrome in the shopfront's green, which is
 * right above a painted page and wrong above this one. Next merges a route's
 * viewport over the layout's, so only the door goes black.
 */
export const viewport: Viewport = { themeColor: "#000000" };

/**
 * The door. Black, white, and one moving thing.
 *
 * The moving thing is not decoration and it is not a background: it is the
 * company. Deacon is one person who takes three projects a month, so his
 * attention is a single volume that cannot be in two places. It is drawn as a
 * mass of mercury sitting behind the two trades, and when you reach for one
 * the whole mass flows over and pools under it. Reach for the other and it
 * leaves. That is the argument the page exists to make, made physical.
 *
 * The merging is an SVG goo filter — blur the drops, then crank alpha
 * contrast so their soft edges snap back into one surface with a liquid neck
 * between them. No library, no canvas, no JavaScript: the pooling is driven by
 * :has() on the stage, so this page stays a server component.
 */
export default function Chooser() {
  return (
    <main className={`${archivo.variable} ${styles.page}`}>
      <StructuredData meta={META} />
      <GooFilter />

      <header className={styles.head}>
        <span className={styles.brand}>Deacon</span>
        <span className={styles.status}>
          Open &middot; three projects a month
        </span>
      </header>

      <div className={styles.stage}>
        <h1 className={styles.headline}>
          I build websites for local businesses, by hand, one at a time.
        </h1>

        <div className={styles.choice}>
          {/* Decorative: the trades below carry the meaning. */}
          <div className={styles.mercury} aria-hidden="true">
            <span className={`${styles.drop} ${styles.d1}`} />
            <span className={`${styles.drop} ${styles.d2}`} />
            <span className={`${styles.drop} ${styles.d3}`} />
            <span className={`${styles.drop} ${styles.d4}`} />
            <span className={`${styles.drop} ${styles.d5}`} />
          </div>

          <nav className={styles.trades} aria-label="Choose your trade">
            <Link href="/restaurants" className={styles.tradeLeft}>
              Restaurants
            </Link>
            <span className={styles.slash} aria-hidden="true">
              /
            </span>
            <Link href="/small-business" className={styles.tradeRight}>
              Small business
            </Link>
          </nav>
        </div>

        <p className={styles.lede}>
          Free homepage first, before you owe me a cent.
        </p>
      </div>

      <footer className={styles.foot}>
        <a href="mailto:hello@itsdeacon.com" className={styles.email}>
          hello@itsdeacon.com
        </a>
        <span>Salem, Oregon</span>
      </footer>
    </main>
  );
}

/**
 * Blur the drops, then push alpha through a steep curve. Soft overlapping
 * edges land back above the cutoff together, which is what makes two circles
 * read as one surface joined by a neck rather than two circles touching.
 */
function GooFilter() {
  return (
    <svg className={styles.defs} aria-hidden="true" focusable="false">
      <defs>
        <filter id="mercury">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
          />
        </filter>
      </defs>
    </svg>
  );
}

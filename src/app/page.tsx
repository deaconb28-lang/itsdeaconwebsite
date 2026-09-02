import Link from "next/link";

import { metadataFor, StructuredData, type PageMeta } from "@/lib/page-meta";
import styles from "./page.module.css";

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

const TRADES = [
  {
    href: "/restaurants",
    label: "Restaurants",
    detail: "Menus, hours, bookings, and the phone that never stops",
  },
  {
    href: "/small-business",
    label: "Small businesses",
    detail: "Trades, shops, studios, services — anywhere people search first",
  },
] as const;

/**
 * A fascia, not a page.
 *
 * This was two cards side by side, which is the pattern Upwork, PayPal, Loom,
 * Sketch and — fatally — Wix all use to segment a signup. A shop that letters
 * by hand cannot open on the same screen as the website builder it is arguing
 * against.
 *
 * So the trades are ruled rows on a painted directory board instead: label,
 * rule, what's behind the door. That device comes from the subject's own world
 * — a price list, a door plate, a board outside a shop — rather than from a
 * SaaS onboarding flow. The numbering went with the cards; 01/02 implied a
 * sequence, and these are alternatives, so the digits encoded nothing.
 */
export default function Chooser() {
  return (
    <main className={styles.page}>
      <StructuredData meta={META} />

      <header className={styles.head}>
        <span className={styles.brand}>
          <span className={styles.mark}>
            <Cloche />
          </span>
          Deacon
        </span>
        <span className={styles.availability}>
          <span className={styles.dot} aria-hidden="true" />
          Open for new projects
        </span>
      </header>

      <div className={styles.middle}>
        <h1 className={styles.headline}>
          I build websites for{" "}
          <span className={styles.accent}>local businesses.</span>
        </h1>
        <p className={styles.lede}>
          By hand, one at a time. Which are you?
        </p>

        <nav className={styles.board} aria-label="Choose your trade">
          {TRADES.map((trade) => (
            <Link key={trade.href} href={trade.href} className={styles.row}>
              <span className={styles.rowLabel}>{trade.label}</span>
              <span className={styles.rowRule} aria-hidden="true" />
              <span className={styles.rowDetail}>{trade.detail}</span>
              <span className={styles.rowArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <footer className={styles.foot}>
        <span>Three projects a month — that&rsquo;s the whole company</span>
        <a href="mailto:hello@itsdeacon.com" className={styles.email}>
          hello@itsdeacon.com
        </a>
      </footer>
    </main>
  );
}

/** The brand mark: a domed serving cover. */
function Cloche() {
  return (
    <svg viewBox="0 0 24 24" className={styles.clocheIcon} aria-hidden="true">
      <circle cx="12" cy="4.6" r="1.5" fill="currentColor" />
      <path d="M2.8 16.4a9.2 9.2 0 0 1 18.4 0Z" fill="currentColor" />
      <rect x="1" y="18" width="22" height="2.6" rx="1.3" fill="currentColor" />
    </svg>
  );
}

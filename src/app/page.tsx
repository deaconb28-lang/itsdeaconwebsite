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

const PATHS = [
  {
    href: "/restaurants",
    kicker: "01",
    label: "I run a restaurant",
    detail: "Menus, hours, bookings, and the phone that never stops.",
  },
  {
    href: "/small-business",
    kicker: "02",
    label: "I run a small business",
    detail: "Trades, shops, studios, services — anywhere people search first.",
  },
] as const;

/**
 * A door, not a page.
 *
 * Both pitches are long and specific, and neither works for the other reader.
 * Rather than water one down, this asks the only question that matters and
 * gets out of the way — one viewport, nothing to scroll.
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

        <nav className={styles.paths} aria-label="Choose your pitch">
          {PATHS.map((path) => (
            <Link key={path.href} href={path.href} className={styles.path}>
              <span className={styles.pathKicker}>{path.kicker}</span>
              <span className={styles.pathLabel}>{path.label}</span>
              <span className={styles.pathDetail}>{path.detail}</span>
              <span className={styles.pathArrow} aria-hidden="true">
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

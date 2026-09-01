import styles from "./SiteFooter.module.css";

/**
 * The marquee quotes the page above it — the first phrase is the hero's
 * headline — so a page with a different headline passes its own. This is the
 * restaurant page's, which is also the fallback.
 */
const PHRASES = [
  "Hungry before they walk in",
  "Free mockup first",
  "Live in two weeks",
  "No hostages",
];

export type FooterLink = { href: string; label: string };

/**
 * Route-safe as it stands: the three section links are fragment-only, so they
 * resolve against whichever document rendered them rather than against the
 * site root. Only the marquee and the cross-link know which pitch they are under.
 */
export function SiteFooter({
  phrases = PHRASES,
  crossLink = null,
}: {
  phrases?: readonly string[];
  /** The other pitch, for a visitor who took the wrong door at `/`. */
  crossLink?: FooterLink | null;
} = {}) {
  return (
    <>
      <div className={styles.marqueeBar}>
        <div className={styles.marquee}>
          <Phrases phrases={phrases} />
          {/* A second copy makes the -50% loop seamless. */}
          <Phrases phrases={phrases} aria-hidden="true" />
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Deacon — itsdeacon.com</span>
        <div className={styles.links}>
          <a href="#work" className={styles.link}>
            Work
          </a>
          <a href="#pricing" className={styles.link}>
            Pricing
          </a>
          <a href="#contact" className={styles.link}>
            Contact
          </a>
          {crossLink ? (
            <a href={crossLink.href} className={styles.crossLink}>
              {crossLink.label} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
        <span>© 2026</span>
      </footer>
    </>
  );
}

function Phrases({
  phrases,
  ...props
}: {
  phrases: readonly string[];
  "aria-hidden"?: "true";
}) {
  return (
    <span className={styles.phrases} {...props}>
      {phrases.map((phrase) => (
        <span key={phrase} className={styles.phraseGroup}>
          <span>{phrase}</span>
          <span className={styles.bullet} aria-hidden="true">
            ●
          </span>
        </span>
      ))}
    </span>
  );
}

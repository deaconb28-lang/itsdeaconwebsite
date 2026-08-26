import styles from "./SiteFooter.module.css";

const PHRASES = [
  "Your hardest-working employee",
  "Free mockup first",
  "Live in two weeks",
  "No hostages",
];

export function SiteFooter() {
  return (
    <>
      <div className={styles.marqueeBar}>
        <div className={styles.marquee}>
          <Phrases />
          {/* A second copy makes the -50% loop seamless. */}
          <Phrases aria-hidden="true" />
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
        </div>
        <span>© 2026</span>
      </footer>
    </>
  );
}

function Phrases(props: { "aria-hidden"?: "true" }) {
  return (
    <span className={styles.phrases} {...props}>
      {PHRASES.map((phrase) => (
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

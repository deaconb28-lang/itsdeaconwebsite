import styles from "./Nav.module.css";

const LINKS = [
  { href: "#why", label: "Why" },
  { href: "#difference", label: "Before/after" },
  { href: "#work", label: "Work" },
  { href: "#lookup", label: "Check yours" },
  { href: "#pricing", label: "Pricing" },
  { href: "#math", label: "The math" },
];

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.capsule}>
        <a href="#top" className={styles.brand}>
          <span className={styles.mark}>
            <Cloche />
          </span>
          <span className={styles.brandName}>Deacon</span>
        </a>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="#contact" className={styles.cta}>
            Get your mockup <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className={styles.track}>
        <div data-progress="" className={styles.bar} />
      </div>
    </nav>
  );
}

/** A domed serving cover — knob, dome, tray. */
function Cloche() {
  return (
    <svg viewBox="0 0 24 24" className={styles.clocheIcon} aria-hidden="true">
      <circle cx="12" cy="4.6" r="1.5" fill="currentColor" />
      <path d="M2.8 16.4a9.2 9.2 0 0 1 18.4 0Z" fill="currentColor" />
      <rect x="1" y="18" width="22" height="2.6" rx="1.3" fill="currentColor" />
    </svg>
  );
}

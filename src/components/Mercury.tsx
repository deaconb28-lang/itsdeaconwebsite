import styles from "./Mercury.module.css";

/**
 * The company, drawn.
 *
 * Deacon is one person taking three projects a month, so his attention is a
 * single volume that cannot be in two places. The homepage makes that argument
 * by putting a mass of mercury under the two trades and letting it flow to
 * whichever one you reach for; the About section makes the same argument in
 * words.
 *
 * It appears on the homepage and nowhere else. It was tried behind About's
 * "It's just me. On purpose." — the same argument in words — and cut: it sat
 * over the lede and made the page harder to read, and repeating the one thing
 * the site is remembered for is how a signature turns into wallpaper.
 *
 * The caller owns position and size — this is just the liquid.
 */
export function MercuryMass() {
  return (
    <div className={styles.mass} aria-hidden="true">
      <span className={`${styles.drop} ${styles.d1}`} />
      <span className={`${styles.drop} ${styles.d2}`} />
      <span className={`${styles.drop} ${styles.d3}`} />
      <span className={`${styles.drop} ${styles.d4}`} />
      <span className={`${styles.drop} ${styles.d5}`} />
    </div>
  );
}

/**
 * Blur the drops, then push alpha through a steep curve. Soft overlapping
 * edges land back above the cutoff together, which is what makes two circles
 * read as one surface joined by a neck rather than two circles touching.
 *
 * Render once per page — the mass references it by id.
 */
export function GooFilter() {
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

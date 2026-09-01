"use client";

import { useSiteState } from "./SiteState";
import styles from "./NapkinMath.module.css";

/**
 * The arithmetic is the same for everyone; only the noun it is counted in and
 * the story behind the two extra a week change, so the lede is passed in and
 * everything else comes off the audience's units.
 */
export function NapkinMath({ lede }: { lede: string }) {
  const { spend, setSpend, figures, audience } = useSiteState();
  const { units } = audience;

  return (
    <section id="math" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>The back of the napkin</p>
          <h2 className={styles.heading}>
            {units.cadence} covers the whole thing.
          </h2>
          <p className={styles.lede}>{lede}</p>
          <p className={styles.hint}>
            <span aria-hidden="true">✎</span>${units.defaultSpend} is a guess —
            type your own {units.one} price and every line below moves.
          </p>
        </div>

        <div className={styles.napkin}>
          <div className={styles.rows}>
            <div className={styles.inputRow}>
              <span>{units.cadenceLower} ×</span>

              <span className={styles.field}>
                <label htmlFor="napkin-spend" className={styles.fieldLabel}>
                  Your {units.one} — edit me
                </label>
                <span className={styles.currency} aria-hidden="true">
                  $
                </span>
                <input
                  id="napkin-spend"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={spend}
                  onChange={(event) => setSpend(event.target.value)}
                  title={`Type your average ${units.one} spend`}
                  className={styles.input}
                />
                <span className={styles.pencil} aria-hidden="true">
                  ✎
                </span>
              </span>

              <span>
                ≈ <b className={styles.figure}>{figures.monthly}</b> a month
              </span>
            </div>

            <div className={styles.row}>
              the site: <b className={styles.figure}>$1,200</b> once, then{" "}
              <b className={styles.figure}>$75</b> a month
            </div>

            <div className={styles.row}>
              → the whole thing clears by{" "}
              <b className={`${styles.figure} ${styles.figureAccent}`}>
                {figures.payback}
              </b>
            </div>

            <div className={styles.row}>
              every month after that:{" "}
              <b className={styles.figure}>{figures.surplus}</b>, yours
            </div>

            <div className={styles.row}>
              the care plan ≈ <b className={styles.figure}>{figures.care}</b>
            </div>

            <p className={styles.stamp}>
              the cheapest employee you&rsquo;ll ever hire
            </p>

            <a href="#contact" className={styles.cta}>
              Email me this <span aria-hidden="true">→</span>
            </a>
            <p className={styles.ctaNote}>
              your figures come with you — no retyping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

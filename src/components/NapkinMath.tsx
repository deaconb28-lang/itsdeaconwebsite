"use client";

import { useSiteState } from "./SiteState";
import styles from "./NapkinMath.module.css";

export function NapkinMath() {
  const { table, setTable, figures } = useSiteState();

  return (
    <section id="math" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>The back of the napkin</p>
          <h2 className={styles.heading}>
            Two extra tables a week covers the whole thing.
          </h2>
          <p className={styles.lede}>
            This is what happens when two Friday walk-ins find your menu on
            their phone and decide to come in.
          </p>
          <p className={styles.hint}>
            <span aria-hidden="true">✎</span>$70 is a guess — type your own
            table price and every line below moves.
          </p>
        </div>

        <div className={styles.napkin}>
          <div className={styles.rows}>
            <div className={styles.inputRow}>
              <span>two extra tables a week ×</span>

              <span className={styles.field}>
                <label htmlFor="napkin-table" className={styles.fieldLabel}>
                  Your table — edit me
                </label>
                <span className={styles.currency} aria-hidden="true">
                  $
                </span>
                <input
                  id="napkin-table"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={table}
                  onChange={(event) => setTable(event.target.value)}
                  title="Type your average table spend"
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
              the care plan ≈ <b className={styles.figure}>{figures.careTables}</b>
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

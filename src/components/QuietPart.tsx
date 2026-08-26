import { DinerFigure } from "./DinerFigure";
import styles from "./QuietPart.module.css";

const TALKED_OUT = 68;
const TOTAL = 100;

export function QuietPart() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>The quiet part</p>
          <p className={styles.bigStat}>
            <span data-count-to={String(TALKED_OUT)}>{TALKED_OUT}</span>
            <span className={styles.percent}>%</span>
          </p>
          <h2 className={styles.heading}>
            of diners say a restaurant&rsquo;s website has{" "}
            <span className={styles.highlight}>talked them out of going.</span>
          </h2>
          <p className={styles.source}>MGH survey of 1,101 U.S. diners</p>
          <p className={styles.closer}>
            so go ahead — look yourself up. I&rsquo;ll wait.
          </p>
        </div>

        <div>
          <div
            data-diner-grid=""
            className={styles.dinerGrid}
            role="img"
            aria-label={`${TALKED_OUT} of every ${TOTAL} diners have been talked out of going by a restaurant's website`}
          >
            {Array.from({ length: TOTAL }, (_, index) => {
              const talkedOut = index < TALKED_OUT;
              return (
                <div
                  key={index}
                  data-diner=""
                  className={talkedOut ? styles.diner : styles.dinerFaded}
                >
                  <DinerFigure
                    variant={talkedOut ? "solid" : "outline"}
                    color="var(--ink)"
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendIcon}>
                <DinerFigure variant="solid" color="var(--ink)" />
              </span>
              Talked out of going
            </span>
            <span className={`${styles.legendItem} ${styles.legendFaded}`}>
              <span className={styles.legendIcon}>
                <DinerFigure variant="outline" color="var(--ink)" />
              </span>
              Still came in
            </span>
            <span className={styles.legendFaded}>Of every 100 diners asked</span>
          </div>
        </div>
      </div>
    </section>
  );
}

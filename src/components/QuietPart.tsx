import { DinerFigure } from "./DinerFigure";
import styles from "./QuietPart.module.css";

const TALKED_OUT = 68;
const TOTAL = 100;

/**
 * The emotional peak, and now the only place the case gets argued.
 *
 * Three sourced statistics used to live in their own section above this one,
 * each as a card with a kicker, a giant number, a visualiser and a source —
 * making the same point this section makes in one number. They are kept, and
 * still attributed, as a single ruled strip underneath.
 */
const SUPPORTING = [
  { stat: "0.05s", claim: "to form an impression of a site", source: "Google" },
  { stat: "75%", claim: "judge a business by how its site looks", source: "Stanford" },
  { stat: "57%", claim: "won't recommend a clumsy phone site", source: "Google" },
];

export function QuietPart() {
  return (
    <section id="why" data-ground="dark" className={styles.section}>
      <div className={styles.grid}>
        <div>
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
                    color="currentColor"
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendIcon}>
                <DinerFigure variant="solid" color="currentColor" />
              </span>
              Talked out of going
            </span>
            <span className={`${styles.legendItem} ${styles.legendFaded}`}>
              <span className={styles.legendIcon}>
                <DinerFigure variant="outline" color="currentColor" />
              </span>
              Still came in
            </span>
          </div>
        </div>
      </div>

      <div className={styles.supporting}>
        {SUPPORTING.map((item) => (
          <div key={item.stat} className={styles.support}>
            <span className={styles.supportStat}>{item.stat}</span>
            <span className={styles.supportClaim}>{item.claim}</span>
            <span className={styles.supportSource}>{item.source}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

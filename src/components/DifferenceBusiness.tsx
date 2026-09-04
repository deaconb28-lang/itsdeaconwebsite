import { ComparisonFrame } from "./ComparisonFrame";
import { RidgelineAfter } from "./RidgelineAfter";
import { RidgelineBefore } from "./RidgelineBefore";
import styles from "./Difference.module.css";

/** Same section, same frame, a different made-up business either side of it. */
export function DifferenceBusiness() {
  return (
    <>
      <section id="difference" className={styles.intro}>
        <h2 className={styles.heading}>
          Same business.
          <br />
          <span className={styles.accent}>Different website.</span>
        </h2>
        <p className={styles.lede}>
          I made up a plumber called Ridgeline to show you what I mean. The left
          side is a template somebody set up in 2016 and nobody has opened
          since. Drag the handle — the right side is what I build.
        </p>
      </section>

      <ComparisonFrame
        before={<RidgelineBefore />}
        after={<RidgelineAfter />}
        address="ridgelineplumbing.com"
      />
    </>
  );
}

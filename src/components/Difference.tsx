import { AfterPane } from "./AfterPane";
import { BeforePane } from "./BeforePane";
import { ComparisonFrame } from "./ComparisonFrame";
import styles from "./Difference.module.css";

export function Difference() {
  return (
    <>
      <section id="difference" className={styles.intro}>
        <p className={styles.eyebrow}>The difference</p>
        <h2 className={styles.heading}>
          Same restaurant.
          <br />
          <span className={styles.accent}>Different website.</span>
        </h2>
        <p className={styles.lede}>
          I made up a little spot called Harbor &amp; Vine to show you what I
          mean. The left side is where a lot of local sites are stuck. Drag the
          handle — the right side is what I build.
        </p>
      </section>

      <ComparisonFrame before={<BeforePane />} after={<AfterPane />} />
    </>
  );
}

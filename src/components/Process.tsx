import styles from "./Process.module.css";

/**
 * The whole engagement, once.
 *
 * "How I start" ran directly above this with its own headline, lede, button
 * and three numbered rows, describing the same free-homepage-first sequence
 * these four steps describe. The offer keeps the headline it earned; the steps
 * carry the detail.
 */
export type ProcessStep = {
  timing: string;
  title: string;
  body: string;
};

export function Process({
  steps,
  note,
}: {
  steps: readonly ProcessStep[];
  /** The paragraph beside the heading — the offer, in this audience's words. */
  note: string;
}) {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>How it goes</p>
          <h2 className={styles.heading}>
            <span className={styles.accent}>Your homepage first.</span>
            <br />
            Before you owe me a cent.
          </h2>
        </div>

        <div className={styles.headerSide}>
          <p className={styles.note}>{note}</p>
          <a href="#contact" className={styles.button}>
            Get your free homepage <span aria-hidden="true">→</span>
          </a>
          <p className={styles.aside}>no deposit, no contract, no call required</p>
        </div>
      </div>

      <div className={styles.grid}>
        {steps.map((step) => (
          <div key={step.title} data-reveal="" className={styles.step}>
            <p className={styles.timing}>{step.timing}</p>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

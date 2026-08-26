import styles from "./HowIStart.module.css";

const STEPS = [
  {
    number: "01",
    title: "Built before you commit",
    body: "Your name, your dishes, your prices — pulled from your menu and your reviews, not a template.",
  },
  {
    number: "02",
    title: "A working page, not a picture",
    body: "Scroll it, tap the buttons, pull it up on your own phone.",
  },
  {
    number: "03",
    title: "Yours either way",
    body: "Turn me down and the page is still yours to use or hand to anyone else. Fair trade for your time.",
  },
];

export function HowIStart() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>How I start</p>
          <h2 className={styles.heading}>
            <span className={styles.accent}>Your homepage first.</span>
            <br />
            Before you owe me a cent.
          </h2>
          <p className={styles.lede}>
            Tell me your restaurant and I&rsquo;ll spend an evening on it and
            send back a finished homepage. If you like it, we build the rest. If
            you don&rsquo;t, we&rsquo;re done and it&rsquo;s still yours.
          </p>
          <a href="#contact" className={styles.button}>
            Get your free homepage <span aria-hidden="true">→</span>
          </a>
          <p className={styles.note}>no deposit, no contract, no call required</p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              data-reveal=""
              className={
                index === STEPS.length - 1
                  ? `${styles.step} ${styles.stepLast}`
                  : styles.step
              }
            >
              <span className={styles.number}>{step.number}</span>
              <div>
                <b className={styles.stepTitle}>{step.title}</b>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import styles from "./Process.module.css";

/**
 * The whole engagement, once.
 *
 * "How I start" ran directly above this with its own headline, lede, button
 * and three numbered rows, describing the same free-homepage-first sequence
 * these four steps describe. The offer keeps the headline it earned; the steps
 * carry the detail.
 */
const STEPS = [
  {
    timing: "Free · step one",
    title: "The mockup",
    body: "I design a real homepage for your place and send it over. No invoice, no meeting needed.",
  },
  {
    timing: "Right now",
    title: "Your notes",
    body: "Tell me what's wrong with it — the colors, the photos, your name for a dish. I'll change it while you watch.",
  },
  {
    timing: "About a week",
    title: "Build",
    body: "Say “build it” and I turn that one page into the whole site — menu, story, contact, booking.",
  },
  {
    timing: "I handle it",
    title: "Launch",
    body: "I put it live, set up Google, and hand you every file. The domain stays in your name.",
  },
];

export function Process() {
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
          <p className={styles.note}>
            Tell me your restaurant and I&rsquo;ll spend an evening on it and
            send back a finished homepage. Turn me down and the page is still
            yours to use.
          </p>
          <a href="#contact" className={styles.button}>
            Get your free homepage <span aria-hidden="true">→</span>
          </a>
          <p className={styles.aside}>no deposit, no contract, no call required</p>
        </div>
      </div>

      <div className={styles.grid}>
        {STEPS.map((step) => (
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

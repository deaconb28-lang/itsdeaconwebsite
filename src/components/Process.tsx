import styles from "./Process.module.css";

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
      <p className={styles.eyebrow}>How it goes</p>

      <div className={styles.header}>
        <h2 className={styles.heading}>
          From mockup
          <br />
          to launch.
        </h2>
        <div className={styles.headerNote}>
          <p className={styles.note}>
            Step one is free and comes first — I build the homepage before you
            decide anything. You only pay if you want the rest of it.
          </p>
          <p className={styles.kicker}>About two weeks, start to launch</p>
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

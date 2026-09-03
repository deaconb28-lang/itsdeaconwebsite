import Image from "next/image";

import portrait from "../../public/assets/deacon.jpg";
import styles from "./About.module.css";

const PITCH = [
  {
    title: "You've seen my work",
    body: "Kylani and Supercruise are live — designed, built and shipped by me, end to end. Open them on your phone; I'll wait.",
  },
  {
    title: "Two weeks, start to finish",
    body: "You already have the homepage. Give me the go-ahead and the whole site is live in about two weeks.",
  },
  {
    title: "No hostages",
    body: "Your site, your domain, your files — yours from day one. If we ever part ways, everything comes with you.",
  },
];

export function About() {
  return (
    <section id="about" data-ground="dark" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>Who you&rsquo;re hiring</p>

          <h2 className={styles.heading}>
            It&rsquo;s just me. <span className={styles.accent}>On purpose.</span>
          </h2>
          <p className={styles.lede}>
            A Lakeside student who will care more about your website than any
            agency ever would. My whole pitch:
          </p>

          <div className={styles.pitch}>
            {PITCH.map((item, index) => (
              <div
                key={item.title}
                data-reveal=""
                className={
                  index === PITCH.length - 1
                    ? `${styles.row} ${styles.rowLast}`
                    : styles.row
                }
              >
                <h3 className={styles.rowTitle}>{item.title}</h3>
                <p className={styles.rowBody}>{item.body}</p>
              </div>
            ))}
          </div>

          <p className={styles.capacity}>
            I take three projects a month — that&rsquo;s the whole company.
          </p>
        </div>

        <div className={styles.side}>
          <div>
            <div className={styles.portrait}>
              <Image
                src={portrait}
                alt="Deacon"
                fill
                /* The column is two-up with a 64px gap inside clamped padding,
                   which lands at ~45vw — not the 40vw declared here before.
                   Under-declaring makes next/image pick a candidate narrower
                   than the box and upscale it. */
                sizes="(max-width: 900px) 100vw, 45vw"
                className={styles.portraitImage}
                placeholder="blur"
              />
            </div>
            <p className={styles.name}>Deacon</p>
            <a href="mailto:hello@itsdeacon.com" className={styles.email}>
              hello@itsdeacon.com
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

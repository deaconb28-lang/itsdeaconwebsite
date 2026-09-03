import Image from "next/image";

import glacier from "../../public/assets/glacier-house.png";
import kylani from "../../public/assets/kylani.png";
import supercruise from "../../public/assets/supercruise.png";
import styles from "./Work.module.css";

/**
 * Three equal cards.
 *
 * Glacier House used to run full width with a second column of spec rows,
 * making this the tallest section on the page for the sake of one project.
 * Same three pieces of work, one shape, a third of the height.
 */
const WORK = [
  {
    index: "01",
    kind: "Restaurant & pizzeria",
    title: "Glacier House",
    body: "A Mt. Hood room whose whole menu used to be a PDF. Now the site takes orders and holds the kitchen hours.",
    url: "glacierpublichouse.com",
    href: null,
    image: glacier,
    alt: "The Glacier House homepage",
    contain: false,
  },
  {
    index: "02",
    kind: "Product site",
    title: "Kylani",
    body: "One claim, one input, one thing to do next.",
    url: "kylani.app",
    href: "https://kylani.app",
    image: kylani,
    alt: "The Kylani product site",
    contain: false,
  },
  {
    index: "03",
    kind: "App landing",
    title: "Supercruise",
    body: "A dense financial product made legible for a general audience.",
    url: "supercruise.app",
    href: "https://bagcheck-oev7.vercel.app",
    image: supercruise,
    alt: "The Supercruise app landing page",
    // Source is 1895x998 and crops badly on cover.
    contain: true,
  },
];

export function Work() {
  return (
    <section id="work" data-ground="dark" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>You&rsquo;ve seen my work</p>
          <h2 className={styles.heading}>Examples</h2>
        </div>
        <p className={styles.note}>
          Designed, built and launched end to end — no agency, no template.
        </p>
      </div>

      <div className={styles.grid}>
        {WORK.map((item) => {
          const inner = (
            <>
              <div className={styles.chrome}>
                <div className={styles.chromeDots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.chromeUrl}>{item.url}</div>
                <span
                  className={item.href ? styles.statusLive : styles.statusClient}
                >
                  {item.href ? "● Live" : "Client"}
                </span>
              </div>

              <div className={styles.shot}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className={item.contain ? styles.imageContain : styles.image}
                  placeholder="blur"
                />
              </div>

              <div className={styles.foot}>
                <div>
                  <div className={styles.meta}>
                    <span className={styles.index}>{item.index}</span>
                    <span className={styles.kind}>{item.kind}</span>
                  </div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.body}>{item.body}</p>
                </div>
                {item.href && (
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                )}
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal=""
              className={styles.card}
            >
              {inner}
            </a>
          ) : (
            <div key={item.index} data-reveal="" className={styles.card}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

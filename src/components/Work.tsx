import Image from "next/image";

import { WORK } from "@/lib/work";
import styles from "./Work.module.css";

/**
 * Three equal cards.
 *
 * Glacier House used to run full width with a second column of spec rows,
 * making this the tallest section on the page for the sake of one project.
 * Same three pieces of work, one shape, a third of the height.
 *
 * The list itself is in src/lib/work.ts — the front page shows the same three
 * smaller, and one list is the only way the two stay in agreement.
 */
export function Work() {
  return (
    <section id="work" data-ground="dark" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>You&rsquo;ve seen my work.</h2>
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
                  className={
                    item.status === "client"
                      ? styles.statusClient
                      : styles.statusLive
                  }
                >
                  {item.status === "client" ? "● Client" : "● Live"}
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
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </>
          );

          return (
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
          );
        })}
      </div>
    </section>
  );
}

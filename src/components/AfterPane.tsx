import Image from "next/image";

import hvHero from "../../public/assets/hv-hero.png";
import styles from "./AfterPane.module.css";

const LANDED = [
  { dish: "Winter Point oysters", price: "4" },
  { dish: "Scallop crudo", price: "19" },
  { dish: "Whole monkfish", price: "46" },
  { dish: "Hake over embers", price: "34" },
];

/** Harbor & Vine rebuilt. Its own palette, so it never reads as Deacon's brand. */
export function AfterPane() {
  return (
    <div className={styles.pane} aria-label="The rebuilt website">
      <div className={styles.topBar}>
        <div className={styles.topNav}>
          <span>Raw bar</span>
          <span>Kitchen</span>
          <span>Private</span>
          <span>Visit</span>
        </div>
        <span className={styles.wordmark}>
          Harbor <span className={styles.amp}>&amp;</span> Vine
        </span>
        <span className={styles.bookPill}>Book a table</span>
      </div>

      <div className={styles.stage}>
        <Image
          src={hvHero}
          alt="Clams with tomatoes and herbs"
          fill
          sizes="(max-width: 900px) 100vw, 60vw"
          className={styles.heroImage}
          placeholder="blur"
        />
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.menuColumn}>
          <div>
            <p className={styles.menuLabel}>Landed this morning</p>
            <div className={styles.menuRows}>
              {LANDED.map((item) => (
                <div key={item.dish} className={styles.menuRow}>
                  <span>{item.dish}</span>
                  <span className={styles.menuPrice}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.menuNote}>
            Written at four,
            <br />
            when the boats are in.
          </p>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.cardMeta}>
              <span className={styles.cardMetaText}>Pier 9 &middot; Portland, Maine</span>
              <span className={styles.cardRule} aria-hidden="true" />
            </div>
            <p className={styles.cardWordmark}>
              Harbor <span className={styles.amp}>&amp;</span> Vine
            </p>
          </div>

          <div>
            <p className={styles.cardHeadline}>
              Off the
              <br />
              boats,
            </p>
            <p className={styles.cardHeadlineItalic}>on the fire.</p>
            <p className={styles.cardBody}>
              Twenty-eight seats, one wood fire, and whatever came in that
              morning.
            </p>
          </div>

          <div className={styles.cardButtons}>
            <span className={styles.reserve}>Reserve tonight</span>
            <span className={styles.menuButton}>The menu</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>Tues &ndash; Sun from 5 p.m.</span>
        <span>Raw bar until midnight</span>
        <span className={styles.phone}>(207) 555&ndash;0119</span>
      </div>
    </div>
  );
}

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <header id="top" className={styles.hero}>
      <div>
        <div className={styles.availability}>
          <span className={styles.pill}>
            <span className={styles.dot} aria-hidden="true" />
            Open for new projects
          </span>
          <span className={styles.aside}>(as of this morning, anyway)</span>
        </div>

        <p className={styles.greeting}>hi — I&rsquo;m Deacon.</p>

        <h1 className={styles.headline}>
          Your website should be your{" "}
          {/* Non-breaking hyphen: this phrase must never break badly. */}
          <span className={styles.accent}>hardest&#8209;working employee.</span>
        </h1>

        <p className={styles.lede}>
          I design and build websites for local restaurants — by hand, one at a
          time. The kind of website that greets people, fills tables, and never
          calls in sick.
        </p>

        <div className={styles.buttons}>
          <a href="#contact" className={styles.primary}>
            Get a free mockup <span aria-hidden="true">↗</span>
          </a>
          <a href="#difference" className={styles.secondary}>
            See the difference
          </a>
        </div>

        <p className={styles.kicker}>
          Three projects a month — that&rsquo;s the whole company
        </p>
      </div>

      <div className={styles.cardColumn}>
        <EmployeeCard />
        <p className={styles.cardAside}>it never calls in sick, either</p>
      </div>
    </header>
  );
}

/** The page's signature object — a phone showing a real client's homepage. */
function EmployeeCard() {
  return (
    <div className={styles.card}>
      <div className={styles.star} aria-hidden="true">
        ★
      </div>
      <p className={styles.cardLabel}>Employee of the Month</p>

      <div className={styles.phone}>
        <div className={styles.screen}>
          <div className={styles.statusRow}>
            <span>9:41</span>
            <span aria-hidden="true">●●●</span>
          </div>

          <div className={styles.appBar}>
            Glacier Public House
            <span className={styles.burger} aria-hidden="true">
              ☰
            </span>
          </div>

          <div className={styles.screenBody}>
            <p className={styles.restaurantName}>
              Glacier
              <br />
              House
            </p>
            <p className={styles.place}>Mt. Hood, Ore.</p>

            <div className={styles.orderButton}>Order online</div>

            <div className={styles.rows}>
              <div className={styles.row}>
                <span>Pizza served</span>
                <span className={styles.rowValue}>11:30–5</span>
              </div>
              <div className={styles.row}>
                <span>Oyster Fest</span>
                <span className={styles.rowValue}>Labor Day</span>
              </div>
              <div className={`${styles.row} ${styles.rowLast}`}>
                <span>Walk-ins</span>
                <span className={styles.rowValue}>Welcome</span>
              </div>
            </div>

            <div className={styles.chips}>
              <span className={styles.chip}>Call</span>
              <span className={styles.chip}>Directions</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <p className={styles.cardFooterTitle}>Your website</p>
        <p className={styles.cardFooterBody}>
          took{" "}
          <b>
            <span data-count-to="41">41</span> bookings
          </b>{" "}
          this month. asked for nothing.
        </p>
      </div>
    </div>
  );
}

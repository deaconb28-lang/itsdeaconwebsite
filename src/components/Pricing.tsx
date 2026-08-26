import styles from "./Pricing.module.css";

export function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>What it costs.</h2>

        <div className={styles.anchor}>
          <div>
            <p className={styles.anchorLabel}>An agency quotes this site at</p>
            <p className={styles.anchorStruck}>$6,000–15,000</p>
          </div>
          <span className={styles.anchorArrow} aria-hidden="true">
            →
          </span>
          <div>
            <p className={styles.anchorLabelAccent}>You pay</p>
            <p className={styles.anchorPrice}>$1,200</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* 01 — outlined on cream */}
        <div data-reveal="" className={`${styles.card} ${styles.plain}`}>
          <h3 className={styles.planName}>The Full Redesign</h3>
          <p className={styles.price}>$1,200</p>
          <p className={styles.cadence}>One time</p>
          <p className={styles.subtitle}>the site, done right</p>
          <div className={styles.features}>
            <Feature>A whole new site — home, menu, your story, contact</Feature>
            <Feature>One-tap calls, directions, booking or ordering</Feature>
            <Feature>
              Google Search &amp; Maps done right — you own every file
            </Feature>
          </div>
          <a href="#contact" className={styles.ctaOutline}>
            Start here
          </a>
        </div>

        {/* 02 — solid ink, the one most people take */}
        <div data-reveal="" className={`${styles.card} ${styles.solid}`}>
          <span className={styles.badgeSolid}>Most folks pick this one</span>
          <h3 className={styles.planName}>Redesign + Care</h3>
          <div className={styles.priceRow}>
            <span className={styles.price}>$1,200</span>
            <span className={styles.monthly}>
              + $75<span className={styles.per}>/mo</span>
            </span>
          </div>
          <p className={styles.cadenceOnInk}>Cancel the monthly anytime</p>
          <p className={styles.subtitleOnInk}>the site, plus us on call</p>
          <div className={`${styles.features} ${styles.featuresOnInk}`}>
            <Feature>Everything in the Full Redesign</Feature>
            <Feature>Changes and specials — text me, done same-day</Feature>
            <Feature>Menu, hours, and photos kept current</Feature>
          </div>
          <a href="#contact" className={styles.ctaAccentToCream}>
            Get your mockup
          </a>
        </div>

        {/* 03 — accent border and tint */}
        <div data-reveal="" className={`${styles.card} ${styles.tinted}`}>
          <span className={styles.badgeOutline}>Hands off entirely</span>
          <h3 className={styles.planName}>Redesign + Care + Hosting</h3>
          <div className={styles.priceRow}>
            <span className={styles.price}>$1,200</span>
            <span className={styles.monthly}>
              + $200<span className={styles.per}>/mo</span>
            </span>
          </div>
          <p className={styles.cadence}>Cancel the monthly anytime</p>
          <p className={styles.subtitle}>never think about your website again</p>
          <div className={styles.features}>
            <Feature>Everything in Redesign + Care</Feature>
            <Feature>Hosting, SSL, and security patches — on me</Feature>
            <Feature>Booking, ordering, and map connections kept running</Feature>
          </div>
          <p className={styles.valueNote}>
            Hosting, domain and SSL alone run <b>$30–50 a month</b> if you buy
            them yourself — and then you&rsquo;re the one renewing them.
          </p>
          <a href="#contact" className={styles.ctaAccentToInk}>
            Hand it all over
          </a>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          <b>The mockup is free and yours to keep</b> — even if you tell me no
          today.
        </span>
        <span className={styles.footerAside}>
          you talk, I type — no homework
        </span>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.feature}>
      <span className={styles.check} aria-hidden="true">
        ✓
      </span>
      {children}
    </div>
  );
}

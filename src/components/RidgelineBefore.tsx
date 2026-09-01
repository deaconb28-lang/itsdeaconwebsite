import styles from "./RidgelineBefore.module.css";

/**
 * Ridgeline Plumbing & Heating as a template left them in 2016.
 *
 * The joke here is deliberately not Harbor & Vine's. That pane is funny about
 * *age* — marquees, WebRings, hit counters. This one is about *neglect*, which
 * is the failure a trades business actually has: a drag-and-drop template that
 * looked fine the week it went up and has not been touched since 2019. It
 * should look perfectly acceptable at a glance and fall apart the moment you
 * read it. Beige competence is a harder joke than Comic Sans.
 *
 * The stock photograph is a grey box with its filename showing, which is both
 * a better joke than owning one and the reason this pane needs no asset.
 *
 * The phone number is plain text rather than a tel: link on purpose — it is
 * the same `no-tap-call` finding the audit reports two sections further down,
 * so the demo and the audit argue the case with one piece of evidence.
 */
export function RidgelineBefore() {
  return (
    <div className={styles.pane} aria-label="The old website">
      <div className={styles.topBar}>
        <div className={styles.brandBlock}>
          <span className={styles.logo}>Ridgeline Plumbing &amp; Heating</span>
          <span className={styles.tagline}>Serving the Mid-Valley since 2003</span>
          {/* The mobile menu icon nobody noticed sits on top of the logo. */}
          <span className={styles.burger} aria-hidden="true">
            ☰
          </span>
        </div>
        <div className={styles.nav}>
          <span className={styles.navItem}>Home</span>
          <span className={styles.navItem}>About</span>
          <span className={styles.navItem}>Services</span>
          <span className={styles.navItem}>Gallery</span>
          <span className={styles.navItem}>Contact</span>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.brokenImage}>
          <span className={styles.brokenGlyph} aria-hidden="true">
            ⛰
          </span>
          shutterstock_284419_plumber-smiling.jpg
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.heroTitle}>QUALITY YOU CAN TRUST</p>
          <p className={styles.heroSub}>
            Welcome to our website! Ridgeline Plumbing &amp; Heating is a
            full-service plumbing contractor serving residential and commercial
            customers throughout the area. Please browse our site to learn more
            about the services we offer.
          </p>
          <div className={styles.quoteRow}>
            <span className={styles.quoteButton}>Get A Free Quote!</span>
            <span className={styles.quoteNote}>(form not connected)</span>
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Repairs</p>
          <p className={styles.cardBody}>
            We fix leaks, clogs, and burst pipes. Call today for more
            information about our repair services.
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Water Heaters</p>
          <p className={styles.cardBody}>
            Installation and replacement of water heaters. Call today for more
            information about our water heater services.
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Your Service Here</p>
          <p className={styles.cardBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </p>
        </div>
      </div>

      <div className={styles.hours}>
        <span className={styles.hoursTitle}>Business Hours</span>
        <span>Mon&ndash;Fri 8:00 AM &ndash; 5:00 PM</span>
        <span className={styles.hoursNote}>Please call for current hours.</span>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerPhone}>Call us: 503-555-0148</span>
        <span className={styles.social} aria-hidden="true">
          f
        </span>
        <span className={styles.footerLine}>
          © 2019 Ridgeline Plumbing &amp; Heating. All Rights Reserved. Website
          by TemplateWorks · Powered by SiteBuilder Pro
        </span>
      </div>

      {/* The two overlays that cover the only things worth reading. */}
      <div className={styles.cookies}>
        This website uses cookies to ensure you get the best experience.
        <span className={styles.cookieButton}>Got it!</span>
      </div>

      <div className={styles.chat}>
        <span aria-hidden="true">💬</span> Chat with us!
      </div>
    </div>
  );
}

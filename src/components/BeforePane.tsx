import styles from "./BeforePane.module.css";

/**
 * Harbor & Vine as it was in 2004. Every detail here is doing persuasive work
 * — the 14 MB PDF menu, the hours nobody updated, "Ask 4 Linda" — so it stays
 * specific rather than becoming generic retro decoration.
 */
export function BeforePane() {
  return (
    <div className={styles.pane} aria-label="The old website">
      <div className={styles.banner}>~*~ WELCOME 2 HARBOR &amp; VINE ~*~</div>

      <div className={styles.strip}>
        *** Maine&apos;s BEST kept secret since 2004!!! ***{" "}
        <span className={styles.blink}>(UPDATED WEEKLY!)</span>
      </div>

      <div className={styles.marqueeBar}>
        <span className={styles.marquee}>
          !!! WELCOME TO OUR OFFICIAL WEB SITE ON THE WORLD WIDE WEB !!! CALL 4
          RESERVATIONS 2DAY !!! TRY R WORLD FAMOUS CRAB ROLL !!!
        </span>
      </div>

      <div className={styles.nav}>
        <span className={styles.navButton}>HOME</span>
        <span className={styles.navButton}>ABOUT US</span>
        <span className={styles.navButton}>MENU (PDF, 14MB)</span>
        <span className={styles.navButton}>PHOTO&apos;S!!</span>
        <span className={styles.navButton}>GUESTBOOK</span>
        <span className={styles.navButton}>E-MAIL US</span>
      </div>

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.construction}>UNDER CONSTRUCTION</div>
          <div className={styles.brokenImage}>
            photo1.jpg (12 MB)
            <br />
            our chef Gary
          </div>
          <div className={styles.counter}>
            0042187
            <div className={styles.counterCaption}>visitors since 1999!!</div>
          </div>
          <div className={styles.badges}>
            <span className={styles.badge}>Best viewed in IE 5.5</span>
            <span className={styles.badge}>800×600</span>
            <span className={styles.badge}>Netscape NOW!</span>
          </div>
        </div>

        <div className={styles.copy}>
          <span className={styles.newFlag}>NEW!!</span> Welcome to Harbor &amp;
          Vine!! We are a <span className={styles.familyOwned}>FAMILY OWNED</span>{" "}
          restaurant in beautiful Portland, Maine, U.S.A., Earth!! Please{" "}
          <span className={styles.fakeLink}>CLICK HERE</span> to download our menu{" "}
          <span className={styles.magenta}>
            (PDF, 14 MB, takes a while, be patient!!)
          </span>
          . Our hours changed in 2019 &amp; also 2021, please call to confirm (do
          NOT e-mail, Gary doesn&apos;t check it). Reservations by phone 2pm–4pm
          weekdays ONLY.{" "}
          <span className={styles.red}>Do not use the online form, it is broken.</span>{" "}
          Ask 4 Linda!!
          <div className={styles.hours}>
            <span>Mon–Thu</span>
            <span>11am to 9pm*</span>
            <span>Fri–Sat</span>
            <span>11am to ?? (depends)</span>
            <span>Sunday</span>
            <span>see our Facebook (link broken)</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        Portland Eats WebRing: [&lt;&lt; prev] [random] [next &gt;&gt;] &nbsp;·&nbsp;{" "}
        <span className={styles.underline}>Sign our GUESTBOOK</span> &nbsp;·&nbsp;
        harborvine2004@aol.com &nbsp;·&nbsp; © 2004 web design by Gary&apos;s
        nephew Kyle
      </div>

      <div className={styles.dialog}>
        <div className={styles.dialogBar}>
          Congratulations!!!<span aria-hidden="true">✕</span>
        </div>
        <div className={styles.dialogBody}>
          <b className={styles.blink}>YOU ARE OUR 1,000,000th VISITOR!!!</b>
          <br />
          You have won a FREE appetizer*
          <div className={styles.dialogButton}>CLAIM NOW</div>
        </div>
      </div>
    </div>
  );
}

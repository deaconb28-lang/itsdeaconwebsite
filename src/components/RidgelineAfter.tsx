import styles from "./RidgelineAfter.module.css";

const SERVICES = [
  { name: "Burst pipes", note: "Same day, every day" },
  { name: "Water heaters", note: "Repair or replace" },
  { name: "Old-house repipes", note: "Free walkthrough" },
];

/**
 * Ridgeline rebuilt — and deliberately photo-free.
 *
 * A restaurant's rebuild can put the food on screen. A plumber has no
 * equivalent hero shot, and a stock photograph of a smiling tradesperson would
 * be *less* honest than none — it is the exact cliché the pane opposite is
 * making fun of. So the argument is carried by type, by hi-vis, and by the one
 * thing this trade actually competes on.
 *
 * That thing is the phone number, and it is the hero at display size. The
 * earlier version led with a booking widget, which made a plumber's website
 * look like a SaaS dashboard; when your heating fails at 2am you do not want
 * an availability picker, you want somebody to pick up. The booking panel
 * stays, demoted to what it is: the polite option for people who are not
 * standing in water.
 *
 * Every line is specific for the same reason Harbor & Vine's are — a licence
 * number and a named slot do persuasive work that decoration cannot.
 */
export function RidgelineAfter() {
  return (
    <div className={styles.pane} aria-label="The rebuilt website">
      {/* The strip every trade wears on the van, in the colour they wear it. */}
      <div className={styles.strip}>
        <span>24-hour emergency line</span>
        <span>Salem &amp; Keizer</span>
        <span>Licensed &middot; Bonded &middot; CCB #201884</span>
      </div>

      <div className={styles.topBar}>
        <span className={styles.wordmark}>
          Ridgeline
          <span className={styles.wordmarkThin}>Plumbing &amp; Heating</span>
        </span>
        <div className={styles.topNav}>
          <span>Services</span>
          <span>Areas</span>
          <span>Reviews</span>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.lockup}>
          <p className={styles.headline}>
            No hot water?
            <br />
            We answer.
          </p>

          <a className={styles.phone} href="tel:+15035550148">
            (503) 555&ndash;0148
          </a>
          <p className={styles.sub}>
            Licensed plumbers in Salem since 2003. A real person on the line at
            2am, not a machine.
          </p>

          {/* Every trades site worth anything says where it will actually
              drive to. It is also the query people search. */}
          <p className={styles.area}>
            Salem &middot; Keizer &middot; Turner &middot; Independence &middot;
            Dallas &middot; Aumsville
          </p>
        </div>

        <div className={styles.booking}>
          <p className={styles.bookingLabel}>Or book a visit</p>
          <p className={styles.bookingSlot}>Thursday, 8–10am</p>
          <span className={styles.book}>Take this slot</span>
          <p className={styles.bookingNote}>No card. We confirm by text.</p>
        </div>
      </div>

      <div className={styles.band}>
        {SERVICES.map((service) => (
          <div key={service.name} className={styles.cell}>
            <span className={styles.cellName}>{service.name}</span>
            <span className={styles.cellNote}>{service.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import styles from "./RidgelineAfter.module.css";

const SERVICES = [
  { n: "01", name: "Burst pipes", note: "Same day, every day" },
  { n: "02", name: "Water heaters", note: "Repair or replace" },
  { n: "03", name: "Old-house repipes", note: "Free walkthrough" },
];

const SLOTS = [
  { day: "Thu", time: "8–10am", open: true },
  { day: "Thu", time: "1–3pm", open: true },
  { day: "Fri", time: "8–10am", open: false },
];

/**
 * Ridgeline rebuilt — and deliberately photo-free.
 *
 * A restaurant's rebuild can put the food on screen. A plumber has no
 * equivalent hero shot, and a stock photograph of a smiling tradesperson would
 * be *less* honest than none — it is the exact cliché the pane opposite is
 * making fun of. So the argument is carried by type and by one working object.
 *
 * That object is the booking panel, and it is the whole point: the old pane
 * shows a quote button that was never wired up. This one shows the same
 * promise, kept. The rebuild is not prettier, it does the thing.
 *
 * Every line is specific for the same reason Harbor & Vine's are — a licence
 * number and a named slot do persuasive work that decoration cannot.
 */
export function RidgelineAfter() {
  return (
    <div className={styles.pane} aria-label="The rebuilt website">
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
        <span className={styles.phonePill}>(503) 555&ndash;0148</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.lockup}>
          <p className={styles.headline}>
            No hot water?
            <br />
            <span className={styles.headlineSignal}>We answer the phone.</span>
          </p>
          <p className={styles.sub}>
            Licensed plumbers in Salem since 2003. Same-week appointments, and a
            real person on the line at 2am.
          </p>
        </div>

        <div className={styles.booking}>
          <p className={styles.bookingLabel}>Next available</p>
          <p className={styles.bookingSlot}>Thursday, 8–10am</p>
          <div className={styles.slots}>
            {SLOTS.map((slot) => (
              <span
                key={`${slot.day}-${slot.time}`}
                className={slot.open ? styles.slot : styles.slotTaken}
              >
                <b>{slot.day}</b> {slot.time}
              </span>
            ))}
          </div>
          <span className={styles.book}>Book this slot</span>
          <p className={styles.bookingNote}>
            No card, no call. We confirm by text.
          </p>
        </div>
      </div>

      {/* Three flat colour cells where a photograph would have gone. They
          double as the services list, which is how they earn the space. */}
      <div className={styles.band}>
        {SERVICES.map((service) => (
          <div key={service.n} className={styles.cell}>
            <span className={styles.cellNumber}>{service.n}</span>
            <span className={styles.cellName}>{service.name}</span>
            <span className={styles.cellNote}>{service.note}</span>
          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <span className={styles.bigPhone}>
          <span className={styles.phoneGlyph} aria-hidden="true">
            ✆
          </span>
          (503) 555&ndash;0148
        </span>
        <span className={styles.emergency}>24-hour emergency line</span>
        <span className={styles.licence}>Licensed · Bonded · CCB #201884</span>
      </div>
    </div>
  );
}

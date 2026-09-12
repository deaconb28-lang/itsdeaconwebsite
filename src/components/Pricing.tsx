import { AGENCY_ANCHOR, type Offering, type Offerings } from "@/lib/offerings";
import styles from "./Pricing.module.css";

/**
 * Two rows, not one row of three.
 *
 * The old section was three cards that were all the same $1,200 build and
 * differed only by the monthly attached, which made a monthly plan look like
 * something you picked *instead of* a cheaper build. It is two independent
 * choices: a build, then a plan or no plan. The layout has to say that before
 * anyone reads a word, so the builds are one row and the plans are a quieter
 * row beneath them.
 *
 * Everything here is rendered from `Offerings`. Nothing is hardcoded, because
 * the last version had the prices written into the JSX three times and the two
 * pitch pages could disagree about what was on sale.
 */
export function Pricing({ offerings }: { offerings: Offerings }) {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>What it costs</h2>
        <p className={styles.sub}>
          Pick a build. Add a monthly plan if you want me to keep it current,
          or don&rsquo;t.
        </p>
      </div>

      <div className={styles.builds}>
        {offerings.builds.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.plansHeader}>
        <h3 className={styles.plansHeading}>Then, if you want it looked after</h3>
        <p className={styles.sub}>Add either one to any build. Cancel whenever.</p>
      </div>

      <div className={styles.plans}>
        {offerings.plans.map((item) => (
          <Card key={item.id} item={item} plan />
        ))}
      </div>

      <p className={styles.plansNote}>{offerings.plansNote}</p>

      <div className={styles.footer}>
        <span>
          <b>The mockup is free and yours to keep</b> &mdash; even if you tell
          me no today.
        </span>
        <span className={styles.footerAside}>
          you talk, I type &mdash; no homework
        </span>
      </div>
    </section>
  );
}

/**
 * One card, build or plan.
 *
 * The featured card declares `data-ground="dark"` rather than hand-flipping
 * each colour: that is the site's documented mechanism and it carries --ac,
 * --ground and all three greys at once. The old version needed a parallel
 * `OnInk` class for every text style because it only set the accent.
 */
function Card({ item, plan = false }: { item: Offering; plan?: boolean }) {
  const tone = item.featured ? styles.solid : plan ? styles.plan : styles.plain;

  return (
    <article
      data-reveal=""
      {...(item.featured ? { "data-ground": "dark" } : {})}
      className={`${styles.card} ${tone}`}
    >
      {item.featured && (
        <span className={styles.badge}>Most folks pick this one</span>
      )}

      <h4 className={styles.planName}>{item.name}</h4>

      <p className={styles.priceRow}>
        <span className={styles.price}>{item.price}</span>
        <span className={styles.cadence}>{item.priceNote}</span>
      </p>

      {/* The anchor belongs to this build and to no other, which is why it is
          inside the card now rather than over the whole section. */}
      {item.id === "redesign" && (
        <p className={styles.anchor}>
          An agency quotes this build at{" "}
          <span className={styles.anchorStruck}>{AGENCY_ANCHOR}</span>.
        </p>
      )}

      {item.tagline && <p className={styles.tagline}>{item.tagline}</p>}
      {item.blurb && <p className={styles.blurb}>{item.blurb}</p>}

      {/* Set above the list, not inside it: it points at the card next door
          rather than naming another thing you get. */}
      {item.leadIn && <p className={styles.leadIn}>{item.leadIn}</p>}

      <ul className={styles.features}>
        {item.features.map((line) => (
          <li key={line} className={styles.feature}>
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
            {line}
          </li>
        ))}
      </ul>

      {item.notes?.map((note) => (
        <p key={note} className={styles.note}>
          {note}
        </p>
      ))}

      {/* data-tier rather than an onClick, so this file stays a server
          component. Contact picks it up and the enquiry email names the tier —
          three buttons reading "Start a build" are otherwise identical in the
          inbox and to a screen reader. It carries the id and not the name, so
          what reaches the inbox is a value the server can check against the
          menu rather than a string a visitor could have posted. */}
      <a
        href="#contact"
        data-tier={item.id}
        aria-label={`${item.ctaLabel}: ${item.name}`}
        className={item.featured ? styles.ctaSolid : styles.cta}
      >
        {item.ctaLabel}
      </a>
    </article>
  );
}

import { DinerFigure } from "./DinerFigure";
import styles from "./WhyItMatters.module.css";

const CHIPS = [
  "Found on Google",
  "Trusted at a glance",
  "Right on every phone",
  "Booking one tap away",
];

export function WhyItMatters() {
  return (
    <section id="why" className={styles.section}>
      <p className={styles.eyebrow}>Why it matters</p>
      <h2 className={styles.heading}>
        People meet your website
        <br />
        before they meet you.
      </h2>
      <p className={styles.lede}>
        Somebody hears about you from a friend, pulls out their phone, and
        looks. That look happens hours before they ever walk in — and it usually
        decides whether they do.
      </p>

      <div className={styles.cards}>
        <StatCard
          kicker="Faster than a blink"
          stat="0.05"
          unit="s"
          body="for someone to form a first impression of a website. They decide before they finish reading a word."
          source="Google research"
        >
          <div className={styles.thinTrack}>
            <div data-grow="" className={styles.fill} style={{ width: "5%" }} />
          </div>
          <div className={styles.captions}>
            <span className={styles.captionAccent}>↑ their decision</span>
            <span>one full second</span>
          </div>
        </StatCard>

        <StatCard
          kicker="Judged on looks"
          stat="75"
          unit="%"
          body="of people judge how trustworthy a business is by how its website looks."
          source="Stanford University"
        >
          <div className={styles.figures}>
            <span className={styles.figure}>
              <DinerFigure variant="solid" />
            </span>
            <span className={styles.figure}>
              <DinerFigure variant="solid" />
            </span>
            <span className={styles.figure}>
              <DinerFigure variant="solid" />
            </span>
            <span className={`${styles.figure} ${styles.figureFaded}`}>
              <DinerFigure variant="outline" color="var(--cream)" />
            </span>
          </div>
          <div className={styles.captionSingle}>Three in every four</div>
        </StatCard>

        <StatCard
          kicker="Word of mouth"
          stat="57"
          unit="%"
          body="won't recommend a business whose site is a pain to use on a phone."
          source="Google research"
        >
          <div className={styles.thickTrack}>
            <div className={styles.halfMark} aria-hidden="true" />
            <div data-grow="" className={styles.fill} style={{ width: "57%" }} />
          </div>
          <div className={styles.captions}>
            <span className={styles.captionAccent}>Stay quiet about you</span>
            <span>Half</span>
          </div>
        </StatCard>
      </div>

      <div className={styles.chipRow}>
        <span className={styles.chipIntro}>so a clean site earns you:</span>
        {CHIPS.map((chip) => (
          <span key={chip} className={styles.chip}>
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatCard({
  kicker,
  stat,
  unit,
  body,
  source,
  children,
}: {
  kicker: string;
  stat: string;
  unit: string;
  body: string;
  source: string;
  /** The card's visualiser. */
  children: React.ReactNode;
}) {
  return (
    <div data-reveal="" className={styles.card}>
      <p className={styles.kicker}>{kicker}</p>
      <p className={styles.stat}>
        {stat}
        <span className={styles.unit}>{unit}</span>
      </p>
      <p className={styles.body}>{body}</p>
      <div className={styles.visualiser}>{children}</div>
      <p className={styles.source}>{source}</p>
    </div>
  );
}

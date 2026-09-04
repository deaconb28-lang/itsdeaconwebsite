import styles from "./FiveSeconds.module.css";

/**
 * The peak of the small-business pitch — and deliberately not a big number.
 *
 * The restaurant page opens on 68%, which works because it is one number about
 * one behaviour of one audience: diners talked out of going. That statistic is
 * about diners and cannot move here, and nothing honest replaces it — any
 * single figure broad enough for every local business softens into an attitude
 * claim that is true of everyone everywhere, which is exactly why it would not
 * sting.
 *
 * So this section's peak is a sequence rather than a quantity: what actually
 * happens in the first few seconds of someone's visit, carrying all three
 * statistics the site already cites in the order they occur. Nothing here is
 * invented, nothing is dropped, and every attribution is kept — the same three
 * figures, and the same sources, that the restaurant page carries in its strip.
 *
 * Each bar is the number, drawn. The growth animation is the [data-grow] rule
 * that has been sitting unused in globals.css: it scales from the left on
 * reveal, is already inside the dc-js gate so no-JS renders it full, and is
 * already neutralised under prefers-reduced-motion.
 */
const MOMENTS = [
  {
    stat: "0.05s",
    claim: "is all it takes to form an impression of your website.",
    // 5% of one second — the track is the second, not a percentage.
    fill: 5,
    left: "↑ their decision",
    right: "one full second",
    source: "Google research",
  },
  {
    stat: "75%",
    claim:
      "judge how trustworthy a business is by how its website looks.",
    fill: 75,
    left: "three in every four",
    right: "everyone who lands",
    source: "Stanford University",
  },
  {
    stat: "57%",
    claim:
      "won't recommend a business whose site is a pain to use on a phone.",
    fill: 57,
    left: "stay quiet about you",
    right: "half",
    source: "Google research",
  },
];

export function FiveSeconds() {
  return (
    <section id="why" data-ground="dark" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.heading}>
          They have already decided.{" "}
          <span className={styles.highlight}>You just weren&rsquo;t there.</span>
        </h2>
        <p className={styles.lede}>
          Nobody reads your website. They glance at it, feel something, and go
          back to the other two tabs. Here is how quickly, and how much of it
          you never see.
        </p>
      </div>

      <div className={styles.moments}>
        {MOMENTS.map((moment) => (
          <div key={moment.stat} data-reveal="" className={styles.moment}>
            <div className={styles.statBlock}>
              <span className={styles.stat}>{moment.stat}</span>
              <span className={styles.source}>{moment.source}</span>
            </div>

            <div className={styles.body}>
              <p className={styles.claim}>{moment.claim}</p>

              <div
                className={styles.track}
                role="img"
                aria-label={`${moment.stat} — ${moment.claim}`}
              >
                {moment.fill === 57 && (
                  <span className={styles.half} aria-hidden="true" />
                )}
                <span
                  data-grow=""
                  className={styles.fill}
                  style={{ width: `${moment.fill}%` }}
                />
              </div>

              <div className={styles.captions}>
                <span>{moment.left}</span>
                <span>{moment.right}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.closer}>
        so go ahead — look yourself up. I&rsquo;ll wait.
      </p>
    </section>
  );
}

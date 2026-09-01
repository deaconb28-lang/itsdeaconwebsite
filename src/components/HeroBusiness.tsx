import hero from "./Hero.module.css";
import styles from "./HeroBusiness.module.css";

/**
 * The small-business hero.
 *
 * It shares the restaurant hero's left column wholesale — the availability
 * pill, the greeting, the headline scale, the buttons, the kicker — by
 * importing Hero.module.css, the same way ComparisonFrame imports
 * Difference.module.css. Only the signature object beside it is new.
 *
 * That object is a search-results fragment, and it is a different story from
 * the restaurant page's phone card on purpose. A restaurant is recommended and
 * then looked up; a trades business is *found* — someone searches a category
 * and compares three names side by side. Two of them look alive. The third is
 * the one that has a website nobody has touched.
 */
export function HeroBusiness() {
  return (
    <header id="top" className={hero.hero}>
      <div>
        <div className={hero.availability}>
          <span className={hero.pill}>
            <span className={hero.dot} aria-hidden="true" />
            Open for new projects
          </span>
          <span className={hero.aside}>(as of this morning, anyway)</span>
        </div>

        <p className={hero.greeting}>hi — I&rsquo;m Deacon.</p>

        <h1 className={hero.headline}>
          You&rsquo;re one of{" "}
          <span className={hero.accent}>three names on a screen.</span>
        </h1>

        <p className={hero.lede}>
          Trades, shops, studios, services — whoever needs you is comparing you
          to two other people before you get to say a word. I build the website
          that wins that ten seconds. By hand, one at a time.
        </p>

        <div className={hero.buttons}>
          <a href="#contact" className={hero.primary}>
            Get a free mockup <span aria-hidden="true">↗</span>
          </a>
          <a href="#difference" className={hero.secondary}>
            See the difference
          </a>
        </div>

        <p className={hero.kicker}>
          Three projects a month — that&rsquo;s the whole company
        </p>
      </div>

      <div className={hero.cardColumn}>
        <SearchResults />
        <p className={hero.cardAside}>this is the whole shortlist</p>
      </div>
    </header>
  );
}

/** Three local results, as somebody looking for you actually sees them. */
function SearchResults() {
  return (
    <div className={styles.card}>
      <div className={styles.searchBar}>
        <span className={styles.glass} aria-hidden="true">
          ⌕
        </span>
        plumber near me
      </div>

      <p className={styles.count}>About 41 results</p>

      <div className={styles.results}>
        <Result
          name="Cascade Plumbing Co."
          url="cascadeplumbing.com"
          rating="4.8"
          reviews="212"
          snippet="Emergency plumbing in Salem, 24/7. Book online in under a minute — no card needed."
          chips={["Open now", "Book online"]}
        />
        <Result
          name="Meridian Home Services"
          url="meridianhome.com"
          rating="4.6"
          reviews="158"
          snippet="Licensed plumbers, same-week appointments. Upfront pricing on every job."
          chips={["Open now", "Free quote"]}
        />
        <Result
          yours
          name="Ridgeline Plumbing & Heating"
          url="ridgelineplumbing.com"
          snippet="Home - Welcome to our website! Please browse our site to learn more about the services we offer."
        />
      </div>
    </div>
  );
}

function Result({
  name,
  url,
  rating,
  reviews,
  snippet,
  chips = [],
  yours = false,
}: {
  name: string;
  url: string;
  rating?: string;
  reviews?: string;
  snippet: string;
  chips?: readonly string[];
  /** The bare one. Marked so the point does not rely on noticing it. */
  yours?: boolean;
}) {
  return (
    <div className={yours ? styles.resultYours : styles.result}>
      {yours && <span className={styles.youBadge}>you</span>}
      <p className={styles.resultUrl}>{url}</p>
      <p className={yours ? styles.resultNameYours : styles.resultName}>
        {name}
      </p>

      {rating ? (
        <p className={styles.rating}>
          <span className={styles.stars} aria-hidden="true">
            ★★★★★
          </span>
          {rating} · {reviews} reviews
        </p>
      ) : (
        <p className={styles.noRating}>No reviews · No hours listed</p>
      )}

      <p className={yours ? styles.snippetYours : styles.snippet}>{snippet}</p>

      {chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

import { metadataFor, StructuredData, type PageMeta } from "@/lib/page-meta";
import { WORK } from "@/lib/work";
import portrait from "../../public/assets/deacon.jpg";
import styles from "./page.module.css";

const META: PageMeta = {
  path: "/",
  title: "Deacon — websites for local businesses in Salem, Oregon",
  description:
    "I design and build websites for local businesses in Salem — by hand, one at a time. Free homepage first, before you owe me a cent.",
  keywords: [
    "Salem Oregon web designer",
    "small business website design",
    "restaurant website design",
    "local business web designer",
    "Deacon",
  ],
  serviceType: "Website design and development for local businesses",
};

export const metadata = metadataFor(META);

/**
 * The front page.
 *
 * It used to be a chooser: two trade names at 96px with a drifting mass of
 * liquid behind them and nothing else on the page. That was a segmentation
 * gate, and it read like a developer tool — one diffuse organic shape over a
 * bare ground with tracked-uppercase-mono chrome is the house style of every
 * infrastructure company's landing page. The headline underneath it was
 * clamp(21px, 2.2vw, 32px): smaller than the scale this site reserves for
 * calculators. The page shouted about which funnel you belonged to and
 * mumbled about what Deacon does.
 *
 * So the sizes are the other way round now. The sentence about the work is the
 * biggest thing here, the two pitch pages are links inside a sentence, and the
 * page carries what a person would actually want to see before calling
 * somebody: his face, his town, and three sites he really built that you can
 * open in a new tab and judge for yourself.
 *
 * Still a server component, still no JavaScript.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <StructuredData meta={META} />

      <header className={styles.head}>
        <span className={styles.brand}>Deacon</span>
        <span className={styles.status}>Open — three projects a month</span>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          {/* Small on purpose: the source is 481x640, and a modest photograph
              beside a greeting is friendlier than a face at hero scale. */}
          <div className={styles.portrait}>
            <Image
              src={portrait}
              alt="Deacon"
              fill
              sizes="200px"
              className={styles.portraitImage}
              placeholder="blur"
            />
          </div>

          <div className={styles.introText}>
            <p className={styles.hi}>hi &mdash; I&rsquo;m Deacon.</p>

            <h1 className={styles.headline}>
              I build websites for local businesses in{" "}
              <span className={styles.place}>Salem</span>, by hand, one at a
              time.
            </h1>

            <p className={styles.offer}>
              Free homepage first, before you owe me a cent. I&rsquo;ve written
              the whole thing up{" "}
              <Link href="/restaurants" className={styles.inline}>
                for restaurants
              </Link>
              , or{" "}
              <Link href="/small-business" className={styles.inline}>
                for everything else
              </Link>
              .
            </p>
          </div>
        </section>

        <section className={styles.work}>
          <h2 className={styles.workHeading}>Some of what I&rsquo;ve built.</h2>

          <ul className={styles.workList}>
            {WORK.map((item) => (
              <li key={item.index}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.workLink}
                >
                  <span className={styles.shot}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 30vw"
                      className={
                        item.contain ? styles.shotContain : styles.shotImage
                      }
                      placeholder="blur"
                    />
                  </span>
                  <span className={styles.workName}>
                    {item.title}
                    <span className={styles.workArrow} aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <span className={styles.workNote}>{item.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.capacity}>
          I take three projects a month &mdash; that&rsquo;s the whole company.{" "}
          <a href="mailto:hello@itsdeacon.com" className={styles.inline}>
            Email me
          </a>{" "}
          &mdash; I answer.
        </p>
      </main>

      <footer className={styles.foot}>
        <a href="mailto:hello@itsdeacon.com" className={styles.email}>
          hello@itsdeacon.com
        </a>
        <span>Salem, Oregon</span>
      </footer>
    </div>
  );
}

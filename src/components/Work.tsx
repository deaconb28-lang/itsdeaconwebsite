import Image from "next/image";

import glacier from "../../public/assets/glacier-house.png";
import kylani from "../../public/assets/kylani.png";
import supercruise from "../../public/assets/supercruise.png";
import styles from "./Work.module.css";

export function Work() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>You&rsquo;ve seen my work</p>
          <h2 className={styles.heading}>Examples</h2>
        </div>
        <p className={styles.note}>
          Designed, built and launched end to end — no agency, no template. Open
          them on your phone; I&rsquo;ll wait.
        </p>
      </div>

      <div className={styles.grid}>
        <div data-reveal="" className={`${styles.card} ${styles.wide}`}>
          <div className={styles.shotColumn}>
            <Chrome url="glacierpublichouse.com" status="client" />
            <div className={styles.wideShot}>
              <Image
                src={glacier}
                alt="The Glacier House homepage"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                className={styles.image}
                placeholder="blur"
              />
            </div>
          </div>

          <div className={styles.detail}>
            <div>
              <div className={styles.meta}>
                <span className={styles.index}>01</span>
                <span className={styles.kind}>Restaurant &amp; pizzeria</span>
              </div>
              <h3 className={styles.wideTitle}>Glacier House</h3>
              <p className={styles.wideBody}>
                A Mt. Hood room whose whole menu used to be a PDF. Now the site
                takes orders, holds the kitchen hours, and looks like the place
                feels.
              </p>
            </div>
            <div className={styles.specs}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Built</span>
                <span>Identity, ordering, hours</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Live in</span>
                <span>18 days</span>
              </div>
            </div>
          </div>
        </div>

        <SmallCard
          href="https://kylani.app"
          url="kylani.app"
          index="02"
          kind="Product site"
          title="Kylani"
          body="One claim, one input, one thing to do next."
          image={kylani}
          alt="The Kylani product site"
        />

        <SmallCard
          href="https://bagcheck-oev7.vercel.app"
          url="supercruise.app"
          index="03"
          kind="App landing"
          title="Supercruise"
          body="A dense financial product made legible for a general audience."
          image={supercruise}
          alt="The Supercruise app landing page"
          /* Source is 1895×998 and crops badly on cover. */
          contain
        />
      </div>
    </section>
  );
}

function SmallCard({
  href,
  url,
  index,
  kind,
  title,
  body,
  image,
  alt,
  contain = false,
}: {
  href: string;
  url: string;
  index: string;
  kind: string;
  title: string;
  body: string;
  image: React.ComponentProps<typeof Image>["src"];
  alt: string;
  contain?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-reveal=""
      className={styles.card}
    >
      <Chrome url={url} status="live" />
      <div className={styles.shot}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          className={contain ? styles.imageContain : styles.image}
          placeholder="blur"
        />
      </div>
      <div className={styles.foot}>
        <div>
          <div className={styles.meta}>
            <span className={styles.index}>{index}</span>
            <span className={styles.kind}>{kind}</span>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.body}>{body}</p>
        </div>
        <span className={styles.arrow} aria-hidden="true">
          ↗
        </span>
      </div>
    </a>
  );
}

function Chrome({ url, status }: { url: string; status: "live" | "client" }) {
  return (
    <div className={styles.chrome}>
      <div className={styles.chromeDots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.chromeUrl}>{url}</div>
      <span className={status === "live" ? styles.statusLive : styles.statusClient}>
        {status === "live" ? "● Live" : "Client"}
      </span>
    </div>
  );
}

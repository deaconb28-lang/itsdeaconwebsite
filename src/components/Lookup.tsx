"use client";

import { useCallback, useEffect, useState } from "react";

import type { Finding } from "@/lib/audit";
import type { Audience } from "@/lib/audience";
import type { PreviewResult } from "@/lib/preview";
import { normaliseUrl } from "@/lib/url";
import { useSiteState } from "./SiteState";
import styles from "./Lookup.module.css";

type Phase = "idle" | "checking" | "ready" | "error";

/**
 * The eleven things /api/analyze actually measures, in the order it reports
 * them. This is the section's resting state: a tool should show you its gauge
 * face before you pull the lever, and every line here is a check that exists
 * in src/lib/audit.ts — not a list of things a website could theoretically
 * have wrong. If a check is added or dropped there, it changes here.
 */
function checksFor(audience: Audience): readonly string[] {
  const restaurants = audience.id === "restaurants";
  return [
    "Whether it was built for phones",
    restaurants
      ? "A menu that is really a PDF"
      : "A main link that is really a PDF",
    "A padlock in the address bar",
    "How long it takes to appear",
    "Whether the phone number is tappable",
    "A copyright year gone stale",
    restaurants
      ? "Somewhere to book or order"
      : "A way to actually hire you",
    "How heavy the page is",
    "Table layouts and long-dead tags",
    "A title and description for Google",
    "How many images load before it settles",
  ];
}

type Audit = {
  findings: Finding[];
  summary: string;
  /** The host served a bot check instead of the page; nothing was read. */
  blocked?: boolean;
};

export function Lookup() {
  const { audience } = useSiteState();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [auditing, setAuditing] = useState(false);

  const run = useCallback(async () => {
    const normalised = normaliseUrl(url);
    if (!normalised) {
      setPhase("error");
      setPreview(null);
      setAudit(null);
      setError(
        `That doesn't look like a web address. Try ${audience.lookupPlaceholder}.`,
      );
      return;
    }

    setPhase("checking");
    setError("");
    setPreview(null);
    setAudit(null);
    setAuditing(true);

    // The audit runs alongside the captures — it reads the page itself and
    // does not wait on a screenshot.
    void fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalised, audience: audience.id }),
    })
      .then(async (response) => {
        const data = (await response.json()) as
          | { ok: true; findings: Finding[]; summary: string; blocked?: boolean }
          | { ok: false; error: string };
        if (data.ok) {
          setAudit({
            findings: data.findings,
            summary: data.summary,
            blocked: data.blocked,
          });
        }
      })
      .catch(() => {})
      .finally(() => setAuditing(false));

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalised, audience: audience.id }),
      });
      const data = (await response.json()) as
        | { ok: true; result: PreviewResult }
        | { ok: false; error: string };

      if (!data.ok) {
        setPhase("error");
        setError(data.error);
        return;
      }

      setPreview(data.result);
      setPhase("ready");
    } catch {
      setPhase("error");
      setError("That didn't load. Try again in a moment.");
    }
  }, [url, audience.id, audience.lookupPlaceholder]);

  /* A frame drawn around nothing is not an empty state, it is a hole: the
     section used to reserve 800px for a screenshot that had not been asked
     for yet. Nothing is drawn until there is something to draw, and until
     then the space says what the check actually looks at. */
  const showStage = phase === "checking" || phase === "ready";
  const showReport = showStage || auditing || audit !== null;

  return (
    <section id="lookup" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h3 className={styles.heading}>
            See your own site
            <br />
            the way a {audience.reader} does.
          </h3>

          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void run();
            }}
          >
            <label htmlFor="lookup-url" className="srOnly">
              Your website address
            </label>
            <input
              id="lookup-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={audience.lookupPlaceholder}
              className={styles.input}
            />
            <button
              type="submit"
              className={styles.submit}
              disabled={phase === "checking"}
            >
              {phase === "checking" ? "Looking…" : "Show me"}
            </button>
            {phase === "error" && <p className={styles.error}>{error}</p>}
          </form>
        </div>

        {showReport ? (
          <div className={showStage ? styles.body : styles.bodyReportOnly}>
            {showStage && <Stage phase={phase} preview={preview} />}
            <Report auditing={auditing} audit={audit} />
          </div>
        ) : (
          <Checklist audience={audience} />
        )}
      </div>
    </section>
  );
}

/**
 * The resting state. Eleven short lines in three columns read as an
 * instrument's face — nothing here pretends to be a screenshot, and the
 * section is a third of the height it was when it framed one.
 */
function Checklist({ audience }: { audience: Audience }) {
  const checks = checksFor(audience);

  return (
    <div className={styles.checklist}>
      <p className={styles.checklistLede}>
        I read the page the way a phone does and look for eleven things.
      </p>
      <ul className={styles.checks}>
        {checks.map((check, index) => (
          <li key={check} className={styles.check}>
            <span className={styles.checkNum} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {check}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * What is actually wrong with the site.
 *
 * Every finding here was measured on the page by /api/analyze — a missing
 * viewport tag, a PDF where a page should be, a load time, a stale copyright.
 * Claude rewrites
 * the wording when a key is configured but can never add a finding, so
 * nothing on this list is a guess about someone's business.
 */
function Report({
  auditing,
  audit,
}: {
  auditing: boolean;
  audit: Audit | null;
}) {
  if (auditing || !audit) {
    return (
      <div className={styles.report}>
        <p className={styles.reportLabel}>Reading your site…</p>
        <ul className={styles.findings}>
          {[0, 1, 2].map((i) => (
            <li key={i} className={styles.finding}>
              <span className={`${styles.skelLine} ${styles.skelTitle}`} />
              <span className={`${styles.skelLine} ${styles.skelBody}`} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const clean = audit.findings.length === 0;

  return (
    <div className={styles.report}>
      <p className={styles.reportLabel}>
        {audit.blocked
          ? "Couldn\u2019t read it"
          : clean
            ? "Nothing to fix"
            : `What I\u2019d fix \u2014 ${audit.findings.length}`}
      </p>

      {!clean && (
        <ul className={styles.findings}>
          {audit.findings.map((finding) => (
            <li key={finding.id} className={styles.finding}>
              <span
                className={`${styles.dot} ${
                  finding.severity === "high"
                    ? styles.dotHigh
                    : finding.severity === "medium"
                      ? styles.dotMed
                      : styles.dotLow
                }`}
                aria-label={`${finding.severity} priority`}
              />
              <div className={styles.findingBody}>
                <h4 className={styles.findingTitle}>{finding.title}</h4>
                <p className={styles.findingDetail}>{finding.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className={clean ? styles.summaryClean : styles.summary}>
        {audit.summary}
      </p>

      <a href="#contact" className={styles.fix}>
        {clean || audit.blocked ? "Get a free mockup" : "Fix it for $1,200"}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/**
 * A laptop with a phone leaning on it. Showing both at once answers the
 * question the section actually asks — what a visitor sees, on either thing —
 * without a toggle to operate, and the phone simply drops out when it can't
 * be rendered truthfully rather than being faked from a desktop capture.
 */
function Stage({
  phase,
  preview,
}: {
  phase: Phase;
  preview: PreviewResult | null;
}) {
  const showPhone = phase === "ready" && preview?.phoneCapable === true;

  return (
    <div className={styles.stage}>
      <div className={styles.laptop}>
        <div className={styles.chrome} aria-hidden="true">
          <span />
          <span />
          <span />
          <div className={styles.chromeUrl}>{preview?.pretty ?? ""}</div>
        </div>
        <div className={styles.laptopScreen}>
          {phase === "ready" && preview ? (
            <Capture url={preview.url} pretty={preview.pretty} device="desktop" />
          ) : (
            <Skeleton />
          )}
        </div>
      </div>

      {showPhone && preview && (
        <div className={styles.phone}>
          <div className={styles.phoneScreen}>
            {preview.embeddable ? (
              <iframe
                src={preview.url}
                title="Your site at phone width"
                sandbox="allow-scripts allow-forms allow-popups"
                referrerPolicy="no-referrer"
                className={styles.frame}
              />
            ) : (
              <Capture url={preview.url} pretty={preview.pretty} device="phone" />
            )}
          </div>
        </div>
      )}

      <p className={styles.caption}>
        {phase === "ready" && preview
          ? showPhone
            ? `${preview.pretty} — 1280px and 375px`
            : `${preview.pretty} — 1280px`
          : "Reading the page"}
      </p>
    </div>
  );
}

/**
 * A page loading, rather than a spinner in an empty rectangle. A capture can
 * take several seconds, and a shape that looks like a website arriving reads
 * as progress instead of as something broken.
 */
function Skeleton() {
  return (
    <div className={styles.skeleton} aria-label="Loading" role="status">
      <div className={styles.skelBar}>
        <span className={`${styles.skelLine} ${styles.skelLogo}`} />
        <span className={`${styles.skelLine} ${styles.skelNav}`} />
      </div>
      <span className={styles.skelHero} />
      <div className={styles.skelText}>
        <span className={`${styles.skelLine} ${styles.skelWide}`} />
        <span className={`${styles.skelLine} ${styles.skelMid}`} />
        <span className={`${styles.skelLine} ${styles.skelNarrow}`} />
      </div>
    </div>
  );
}

/**
 * Fetches the capture rather than pointing an <img> at the endpoint: it can
 * take several seconds and deserves a real loading state, and a failure is
 * worth saying rather than showing as a broken image.
 */
function Capture({
  url,
  pretty,
  device,
}: {
  url: string;
  pretty: string;
  device: "phone" | "desktop";
}) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    setState("loading");
    setSrc("");

    fetch(`/api/screenshot?url=${encodeURIComponent(url)}&device=${device}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("no capture");
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, device]);

  if (state === "loading") return <Skeleton />;

  if (state === "failed") {
    return (
      <div className={styles.placeholder}>
        <p className={styles.placeholderText}>No capture.</p>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       a blob of a third-party capture; nothing for next/image to optimise. */
    <img src={src} alt={`${pretty} as a visitor sees it`} className={styles.shot} />
  );
}

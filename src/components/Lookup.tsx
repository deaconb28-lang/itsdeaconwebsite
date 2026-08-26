"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PreviewResult } from "@/lib/preview";
import { normaliseUrl } from "@/lib/url";
import styles from "./Lookup.module.css";

const CHECKS = [
  { key: "A", label: "Our menu is a PDF, or a photo of a menu" },
  { key: "B", label: "Buttons are fiddly to tap on a phone" },
  { key: "C", label: "It takes a moment to load" },
  { key: "D", label: "The hours or phone number are out of date" },
] as const;

/**
 * Keyed by how many are true. The 0 case is what makes the other four
 * credible — it stays as written.
 */
const VERDICTS = [
  "Nothing to fix from here. Genuinely — keep it and spend the money on the room.",
  "One thing, and it's the cheap kind. Worth an email even if you never hire me.",
  "That's two of the reasons the 68% gave. Both are a week's work, not a rebuild.",
  "Three of four. A diner deciding between you and the next place is not getting past this.",
  "All four. You are losing tables you never hear about, every week, quietly.",
];

type CheckKey = (typeof CHECKS)[number]["key"];
type Phase = "idle" | "checking" | "ready" | "error";

export function Lookup() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState("");
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    A: false,
    B: false,
    C: false,
    D: false,
  });

  const hits = useMemo(
    () => CHECKS.filter((check) => checks[check.key]).length,
    [checks],
  );

  const run = useCallback(async () => {
    const normalised = normaliseUrl(url);
    if (!normalised) {
      setPhase("error");
      setPreview(null);
      setError("That doesn't look like a web address. Try yourrestaurant.com.");
      return;
    }

    setPhase("checking");
    setError("");
    setPreview(null);

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalised }),
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
  }, [url]);

  const toggle = useCallback((key: CheckKey) => {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  return (
    <section id="lookup" className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Look yourself up</p>

        <div className={styles.head}>
          <h3 className={styles.heading}>
            See your own site
            <br />
            the way a diner does.
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
              placeholder="yourrestaurant.com"
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

        <div className={styles.body}>
          <Stage phase={phase} preview={preview} />

          <div className={styles.assess}>
            <p className={styles.assessLabel}>
              Be honest — tap any that are true
            </p>

            <ul className={styles.checks}>
              {CHECKS.map((check) => {
                const on = checks[check.key];
                return (
                  <li key={check.key}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(check.key)}
                      className={on ? `${styles.check} ${styles.checkOn}` : styles.check}
                    >
                      <span className={styles.box} aria-hidden="true">
                        {on ? "✓" : ""}
                      </span>
                      <span className={styles.checkLabel}>{check.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={styles.verdict} aria-live="polite">
              <p className={styles.score}>
                <span className={styles.scoreNum}>{hits}</span>
                <span className={styles.scoreOf}>
                  of
                  <br />
                  four
                </span>
              </p>
              <p className={styles.verdictText}>{VERDICTS[hits]}</p>
            </div>

            <a href="#contact" className={styles.fix}>
              {hits === 0 ? "Get a free mockup" : "Fix it for $1,200"}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A laptop with a phone leaning on it. Showing both at once answers the
 * question the section actually asks — what a diner sees, on either thing —
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
            <Placeholder phase={phase} />
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
          : "A laptop and a phone, side by side"}
      </p>
    </div>
  );
}

function Placeholder({ phase }: { phase: Phase }) {
  return (
    <div className={styles.placeholder}>
      {phase === "checking" ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <p className={styles.placeholderText}>Paste your address above.</p>
      )}
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

  if (state !== "ready") {
    return (
      <div className={styles.placeholder}>
        {state === "loading" ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <p className={styles.placeholderText}>No capture.</p>
        )}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       a blob of a third-party capture; nothing for next/image to optimise. */
    <img src={src} alt={`${pretty} as a visitor sees it`} className={styles.shot} />
  );
}

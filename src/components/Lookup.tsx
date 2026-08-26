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
      // The check itself failed, not the site. Show it anyway and let the
      // iframe try — a blank panel is still informative.
      setPreview({
        url: normalised,
        pretty: normalised.replace(/^https?:\/\//, ""),
        reachable: true,
        embeddable: true,
        blockedBy: null,
        title: null,
        status: null,
        renderer: "mshots",
        phoneWidth: false,
      });
      setPhase("ready");
    }
  }, [url]);

  const toggle = useCallback((key: CheckKey) => {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  return (
    <section id="lookup" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Look yourself up</p>
            <h3 className={styles.heading}>
              See your own site the way a diner does.
            </h3>
          </div>
          <p className={styles.note}>
            Paste your address. It loads at phone width, unchanged. Most owners
            haven&rsquo;t looked at it this way in years.
          </p>
        </div>

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
            {phase === "checking" ? "Looking…" : "Show me on a phone"}
          </button>
        </form>

        {phase === "error" && <p className={styles.error}>{error}</p>}

        {phase === "checking" && (
          <div className={styles.panel}>
            <div className={styles.phoneShell}>
              <div className={styles.phoneScreen}>
                <div className={styles.loading}>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>Loading your site…</span>
                </div>
              </div>
            </div>
            <div className={styles.copy}>
              <p className={styles.copyLabel}>Checking</p>
              <p>Pulling it up at phone width. This takes a few seconds.</p>
            </div>
          </div>
        )}

        {phase === "ready" && preview && <Preview preview={preview} />}

        <div className={styles.assessment}>
          <p className={styles.copyLabel}>Then be honest — tap any that are true</p>

          <div className={styles.toggles}>
            {CHECKS.map((check) => {
              const on = checks[check.key];
              return (
                <button
                  key={check.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(check.key)}
                  className={on ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle}
                >
                  <span className={styles.box} aria-hidden="true">
                    {on ? "✓" : ""}
                  </span>
                  {check.label}
                </button>
              );
            })}
          </div>

          <div className={styles.verdict} aria-live="polite">
            <span className={styles.score}>{hits} of 4</span>
            <span className={styles.verdictText}>{VERDICTS[hits]}</span>
            <a href="#contact" className={styles.fix}>
              Fix it for $1,200
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Shows the site live when it allows embedding, and a server-rendered
 * screenshot when it doesn't — which is most sites, since almost everything
 * sets X-Frame-Options or a frame-ancestors policy.
 */
function Preview({ preview }: { preview: PreviewResult }) {
  if (!preview.reachable) {
    return (
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.copyLabel}>Showing {preview.pretty}</p>
          <p>
            Nothing came back from that address — it may be down, or spelled a
            little differently. Send it to me and I&rsquo;ll dig into it.
          </p>
        </div>
      </div>
    );
  }

  if (preview.embeddable) {
    return (
      <div className={styles.panel}>
        <div className={styles.phoneShell}>
          <div className={styles.phoneScreen}>
            <iframe
              src={preview.url}
              title="Your site at phone width"
              sandbox="allow-scripts allow-forms allow-popups"
              referrerPolicy="no-referrer"
              className={styles.frame}
            />
          </div>
        </div>
        <div className={styles.copy}>
          <p className={styles.copyLabel}>Showing {preview.pretty}</p>
          {preview.title && <p className={styles.title}>{preview.title}</p>}
          <p>
            This is your live site at 375 pixels wide — the width of most phones
            in your dining room. Nothing has been altered.
          </p>
          <p>
            If the panel stayed blank, your site blocks being embedded.
            That&rsquo;s normal and not a fault — send me the address and
            I&rsquo;ll run it properly.
          </p>
        </div>
      </div>
    );
  }

  return <Screenshot preview={preview} />;
}

/**
 * Fetches the capture rather than pointing an <img> at the endpoint, for two
 * reasons: a capture can take several seconds and deserves a real loading
 * state, and the response header says which renderer actually ran. The
 * preview only predicts that, and a prediction is not good enough to base
 * "taken at phone width" on — the fallback may quietly have been used.
 */
function Screenshot({ preview }: { preview: PreviewResult }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [src, setSrc] = useState("");
  const [phoneWidth, setPhoneWidth] = useState(preview.phoneWidth);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    setState("loading");
    setSrc("");

    fetch(`/api/screenshot?url=${encodeURIComponent(preview.url)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("no capture");
        const renderer = response.headers.get("X-Deacon-Renderer");
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPhoneWidth(renderer !== null && renderer !== "mshots");
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
  }, [preview.url]);

  return (
    <div className={styles.panel}>
      <div className={styles.phoneShell}>
        <div className={styles.phoneScreen}>
          {state === "loading" && (
            <div className={styles.loading}>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Taking a picture of your site…</span>
            </div>
          )}
          {state === "failed" && (
            <div className={styles.loading}>
              <span>Couldn&rsquo;t get a picture of this one.</span>
            </div>
          )}
          {state === "ready" && (
            /* eslint-disable-next-line @next/next/no-img-element --
               a blob of a third-party capture; there is nothing for
               next/image to optimise. */
            <img
              src={src}
              alt={`${preview.pretty} as it looks to a visitor`}
              className={styles.shot}
            />
          )}
        </div>
      </div>

      <div className={styles.copy}>
        <p className={styles.copyLabel}>Showing {preview.pretty}</p>
        {preview.title && <p className={styles.title}>{preview.title}</p>}

        {state === "failed" ? (
          <p>
            Your site blocks being loaded inside another page — normal, and not
            a fault — and the picture didn&rsquo;t come back either. Send me the
            address and I&rsquo;ll run it properly.
          </p>
        ) : (
          <>
            <p>
              Your site blocks being loaded inside another page — normal, and
              not a fault — so this is a picture of it instead
              {phoneWidth
                ? ", taken at 375 pixels wide, the width of most phones in your dining room."
                : ", taken at desktop width. It isn't quite what a phone shows — send me the address and I'll run it properly."}{" "}
              Nothing has been altered.
            </p>
            <p>
              A capture can take a few seconds the first time, and it
              won&rsquo;t show anything that only appears after you tap. The
              first impression is the point.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

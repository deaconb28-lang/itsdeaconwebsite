"use client";

import { useCallback, useMemo, useState } from "react";

import { useSiteState } from "./SiteState";
import styles from "./Contact.module.css";

const INBOX = "hello@itsdeacon.com";

type Fields = {
  restaurant: string;
  email: string;
  currentSite: string;
  notes: string;
};

const EMPTY: Fields = { restaurant: "", email: "", currentSite: "", notes: "" };

type Status = "idle" | "sending" | "sent" | "failed";

export function Contact() {
  const { table, setTable, figures } = useSiteState();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const set = useCallback(
    <K extends keyof Fields>(key: K, value: Fields[K]) => {
      setFields((current) => ({ ...current, [key]: value }));
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    },
    [],
  );

  /** Where the message goes if the API can't deliver it. */
  const mailtoHref = useMemo(() => {
    const body = [
      `Restaurant: ${fields.restaurant || "—"}`,
      `Reach me at: ${fields.email || "—"}`,
      `Current site: ${fields.currentSite || "—"}`,
      `Average table: $${table || figures.price}`,
      "",
      fields.notes,
    ].join("\n");

    const subject = fields.restaurant
      ? `Free mockup — ${fields.restaurant}`
      : "Free mockup";

    return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [fields, table, figures.price]);

  const submit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (status === "sending") return;

      setStatus("sending");
      setError("");
      setFieldErrors({});

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fields, table, company: honeypot }),
        });
        const data = (await response.json()) as {
          ok: boolean;
          error?: string;
          fieldErrors?: Partial<Record<keyof Fields, string>>;
        };

        if (data.ok) {
          setStatus("sent");
          return;
        }

        setStatus("failed");
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setError(
          data.error ??
            "That didn't go through. Email me directly and it'll reach me.",
        );
      } catch {
        setStatus("failed");
        setError(
          "That didn't go through — the connection dropped. Email me directly and it'll reach me.",
        );
      }
    },
    [fields, honeypot, status, table],
  );

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>Next step</p>
          <h2 className={styles.heading}>Send me your restaurant.</h2>
          <p className={styles.lede}>
            Tell me the restaurant and I&rsquo;ll build the homepage first,
            free, before you decide anything.
          </p>

          <div className={styles.contactRows}>
            <a href={`mailto:${INBOX}`} className={styles.contactRow}>
              <b className={styles.contactName}>Deacon</b>
              <span className={styles.contactEmail}>{INBOX}</span>
            </a>
          </div>
        </div>

        {status === "sent" ? (
          <div className={styles.confirmation} role="status">
            <p className={styles.confirmationTitle}>Got it.</p>
            <p className={styles.confirmationBody}>
              I&rsquo;ll look your place up tonight and come back with a
              homepage you can keep either way.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate>
            <p className={styles.formLabel}>Get a free mockup</p>

            <div className={styles.fields}>
              <Field
                id="restaurant"
                label="Restaurant name"
                placeholder="Harbor & Vine"
                value={fields.restaurant}
                onChange={(value) => set("restaurant", value)}
                error={fieldErrors.restaurant}
                required
              />

              <Field
                id="email"
                type="email"
                label="Where to reach you"
                placeholder="you@restaurant.com"
                autoComplete="email"
                value={fields.email}
                onChange={(value) => set("email", value)}
                error={fieldErrors.email}
                required
              />

              <Field
                id="currentSite"
                label="Current site, if any"
                placeholder="or paste your Instagram"
                value={fields.currentSite}
                onChange={(value) => set("currentSite", value)}
              />

              <div className={styles.field}>
                <label htmlFor="table" className={styles.label}>
                  What an average table spends
                </label>
                <div className={styles.moneyField}>
                  <span className={styles.currency} aria-hidden="true">
                    $
                  </span>
                  <input
                    id="table"
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={table}
                    onChange={(event) => setTable(event.target.value)}
                    className={styles.moneyInput}
                  />
                </div>
              </div>

              <div className={styles.carryOver}>
                <span className={styles.carryOverLabel}>
                  Carried over from your napkin math
                </span>
                <span>
                  Two extra tables a week at that price is{" "}
                  <b>{figures.monthly}</b> a month. The build clears by{" "}
                  <b>{figures.payback}</b>, then it&rsquo;s{" "}
                  <b>{figures.surplus}</b> a month, yours.
                </span>
              </div>

              <div className={styles.field}>
                <label htmlFor="notes" className={styles.label}>
                  Anything I should know
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Nobody can find our menu on a phone."
                  value={fields.notes}
                  onChange={(event) => set("notes", event.target.value)}
                  className={styles.textarea}
                />
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {status === "failed" && error && (
                <p className={styles.error} role="alert">
                  {error}{" "}
                  <a href={mailtoHref} className={styles.errorLink}>
                    Open it in your email app →
                  </a>
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send it over"}
              </button>

              <p className={styles.formNote}>
                No forms is fine too — just email me. I answer.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
  required = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={error ? `${styles.input} ${styles.inputError}` : styles.input}
      />
      {error && (
        <p id={`${id}-error`} className={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}

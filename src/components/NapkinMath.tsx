"use client";

import {
  BUILD_OPTIONS,
  PLAN_OPTIONS,
  type PriceOption,
} from "@/lib/offerings";
import { useSiteState } from "./SiteState";
import styles from "./NapkinMath.module.css";

/**
 * The arithmetic is the same for everyone; only the noun it is counted in and
 * the story behind the two extra a week change, so the lede is passed in and
 * everything else comes off the audience's units.
 *
 * The build and the monthly used to be written into the sentence, which meant
 * the napkin only ever answered the question for one of the five things on
 * sale. They are dropdowns now, and they sit inside the sentence rather than
 * above it as a control panel: this section is already a thing you type into,
 * so a second place to fiddle would have read as a form.
 */
export function NapkinMath({ lede }: { lede: string }) {
  const { spend, setSpend, buildId, setBuildId, planId, setPlanId, figures, audience } =
    useSiteState();
  const { units } = audience;

  return (
    <section id="math" data-ground="dark" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <h2 className={styles.heading}>
            {units.cadence} covers the whole thing.
          </h2>
          <p className={styles.lede}>{lede}</p>
          <p className={styles.hint}>
            <span aria-hidden="true">✎</span>${units.defaultSpend} is a guess —
            type your own {units.one} price and every line below moves.
          </p>
        </div>

        <div data-ground="light" className={styles.napkin}>
          <div className={styles.rows}>
            <div className={styles.inputRow}>
              <span>{units.cadenceLower} ×</span>

              <span className={styles.field}>
                <label htmlFor="napkin-spend" className={styles.fieldLabel}>
                  Your {units.one} — edit me
                </label>
                <span className={styles.currency} aria-hidden="true">
                  $
                </span>
                <input
                  id="napkin-spend"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={spend}
                  onChange={(event) => setSpend(event.target.value)}
                  title={`Type your average ${units.one} spend`}
                  className={styles.input}
                />
                <span className={styles.pencil} aria-hidden="true">
                  ✎
                </span>
              </span>

              <span>
                ≈ <b className={styles.figure}>{figures.monthly}</b> a month
              </span>
            </div>

            <div className={styles.row}>
              <Choice
                id="napkin-build"
                label="Which build"
                value={buildId}
                onChange={setBuildId}
                options={BUILD_OPTIONS}
              />{" "}
              <b className={styles.figure}>{figures.build}</b> once, then{" "}
              <Choice
                id="napkin-plan"
                label="Which monthly plan"
                value={planId}
                onChange={setPlanId}
                options={PLAN_OPTIONS}
              />
              {figures.plan && (
                <>
                  {" "}
                  <b className={styles.figure}>{figures.plan}</b> a month
                </>
              )}
            </div>

            <div className={styles.row}>
              → the whole thing clears by{" "}
              <b className={`${styles.figure} ${styles.figureAccent}`}>
                {figures.payback}
              </b>
            </div>

            <div className={styles.row}>
              every month after that:{" "}
              <b className={styles.figure}>{figures.surplus}</b>, yours
            </div>

            {/* Nothing to count when there is no plan, and "zero tables a
                month" is not a line worth printing. */}
            {figures.care && (
              <div className={styles.row}>
                the plan ≈ <b className={styles.figure}>{figures.care}</b>
              </div>
            )}

            <p className={styles.stamp}>
              the cheapest employee you&rsquo;ll ever hire
            </p>

            <a href="#contact" className={styles.cta}>
              Email me this <span aria-hidden="true">→</span>
            </a>
            <p className={styles.ctaNote}>
              your figures come with you — no retyping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A dropdown that reads as a word in the sentence rather than as a form field.
 *
 * The word you see is a span and the <select> is invisible on top of it. That
 * looks like a trick and it is fixing a real problem: a select is always as
 * wide as its longest option, so "Care" sat in a box the width of "The
 * Redesign + Refresh" with its caret stranded an inch away and the underline
 * running out under nothing. Sizing it to the chosen word is the whole point
 * of putting it in a sentence.
 *
 * The control underneath is a real native select, so it is still a proper
 * picker on a phone and with a keyboard. The visible word is aria-hidden,
 * because the select already announces both the label and what is chosen.
 */
function Choice({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly PriceOption[];
}) {
  const chosen = options.find((option) => option.id === value) ?? options[0];

  return (
    <span className={styles.choice}>
      <label htmlFor={id} className="srOnly">
        {label}
      </label>
      <span className={styles.chosen} aria-hidden="true">
        {chosen.label}
      </span>
      <span className={styles.caret} aria-hidden="true">
        ▾
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.select}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}

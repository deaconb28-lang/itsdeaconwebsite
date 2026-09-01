"use client";

import { useCallback, useRef, useState } from "react";

import styles from "./Difference.module.css";

const MIN = 2;
const MAX = 98;
const START = 50;
const KEY_STEP = 4;

/**
 * The draggable before/after wipe.
 *
 * Deliberately pointer-driven rather than scroll-linked — a scroll-scrub
 * version was tried and rejected. The panes are passed in as children so they
 * can stay server-rendered.
 */
export function ComparisonFrame({
  before,
  after,
  address,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  /** Shown in the browser bar. Required: a wrong one mislabels the demo. */
  address: string;
}) {
  const [position, setPosition] = useState(START);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromPointer = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(MAX, Math.max(MIN, pct)));
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      dragging.current = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setFromPointer(event.clientX);
      event.preventDefault();
    },
    [setFromPointer],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (dragging.current) setFromPointer(event.clientX);
    },
    [setFromPointer],
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowLeft" ? -KEY_STEP : event.key === "ArrowRight" ? KEY_STEP : 0;
    if (delta === 0) {
      if (event.key === "Home") setPosition(MIN);
      else if (event.key === "End") setPosition(MAX);
      else return;
    } else {
      setPosition((current) => Math.min(MAX, Math.max(MIN, current + delta)));
    }
    event.preventDefault();
  }, []);

  const showingAfter = position < START;

  return (
    <div className={styles.frameWrap}>
      <div className={styles.frameInner}>
        <div className={styles.labels}>
          <span className={showingAfter ? styles.labelOff : styles.labelOn}>
            ◀ Before — the site they had
          </span>
          <span className={styles.labelHint}>drag the handle</span>
          <span className={showingAfter ? styles.labelOn : styles.labelOff}>
            After — the site I build ▶
          </span>
        </div>

        <div className={styles.frame}>
          <div className={styles.browserBar}>
            <div className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={styles.address}>{address}</div>
            <div className={styles.barSpacer} />
          </div>

          <div ref={boxRef} className={styles.stage}>
            {before}

            <div
              className={styles.afterLayer}
              style={{ clipPath: `inset(0 0 0 ${position.toFixed(2)}%)` }}
            >
              {after}
            </div>

            <div
              role="slider"
              tabIndex={0}
              aria-label="Reveal the rebuilt site"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)}% of the old site showing`}
              className={styles.handle}
              style={{ left: `${position.toFixed(2)}%` }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onKeyDown}
            >
              <div className={styles.handlePill} aria-hidden="true">
                ◀ Drag ▶
              </div>
            </div>

            {/* Lets the drag start anywhere on the comparison, not just the bar. */}
            <div
              className={styles.grab}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

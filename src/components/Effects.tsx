"use client";

import { useEffect } from "react";

/**
 * One place for the page's scroll-driven behaviour, so every other section can
 * stay a server component and simply mark itself up with data attributes:
 *
 *   data-reveal     fade and rise into view
 *   data-count-to   animate 0 → N when first seen
 *   data-diner-grid stagger the 100 figures in the 68% band
 *   data-progress   the nav's scroll-progress bar
 */
export function Effects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const teardown: Array<() => void> = [];

    teardown.push(setupReveal(reduced));
    teardown.push(setupCounters(reduced));
    teardown.push(setupDinerGrid(reduced));
    teardown.push(setupScrollProgress());

    return () => teardown.forEach((fn) => fn());
  }, []);

  return null;
}

function setupReveal(reduced: boolean): () => void {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  if (nodes.length === 0) return noop;

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("dc-in"));
    return noop;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${Number(el.dataset.d ?? 0) * 80}ms`;
        el.classList.add("dc-in");
        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
  );

  nodes.forEach((node, index) => {
    node.dataset.d = String(index % 3);
    observer.observe(node);
  });

  return () => observer.disconnect();
}

function setupCounters(reduced: boolean): () => void {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-count-to]"),
  );
  if (nodes.length === 0) return noop;

  const settle = (el: HTMLElement) => {
    el.textContent = el.getAttribute("data-count-to") ?? el.textContent;
  };

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach(settle);
    return noop;
  }

  const frames = new Set<number>();

  const run = (el: HTMLElement) => {
    const target = Number.parseInt(el.getAttribute("data-count-to") ?? "0", 10) || 0;
    const duration = 1500;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) frames.add(requestAnimationFrame(step));
    };

    el.textContent = "0";
    frames.add(requestAnimationFrame(step));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target as HTMLElement);
      });
    },
    { threshold: 0.3 },
  );

  nodes.forEach((node) => observer.observe(node));

  return () => {
    observer.disconnect();
    frames.forEach(cancelAnimationFrame);
  };
}

function setupDinerGrid(reduced: boolean): () => void {
  const grid = document.querySelector<HTMLElement>("[data-diner-grid]");
  if (!grid) return noop;

  const figures = Array.from(
    grid.querySelectorAll<HTMLElement>("[data-diner]"),
  );
  if (figures.length === 0) return noop;

  if (reduced || !("IntersectionObserver" in window)) {
    figures.forEach((figure) => {
      figure.style.opacity = "";
    });
    return noop;
  }

  // Hidden only now that we know the wave can actually run.
  figures.forEach((figure) => {
    figure.style.opacity = "0";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        figures.forEach((figure, index) => {
          figure.style.animation = `dc-dot .45s cubic-bezier(.16,.8,.24,1) ${
            240 + index * 14
          }ms both`;
        });
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(grid);
  return () => observer.disconnect();
}

function setupScrollProgress(): () => void {
  const bar = document.querySelector<HTMLElement>("[data-progress]");
  if (!bar) return noop;

  let frame: number | null = null;

  const tick = () => {
    frame = null;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = `${(progress * 100).toFixed(2)}%`;
  };

  const onScroll = () => {
    if (frame === null) frame = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  tick();

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame !== null) cancelAnimationFrame(frame);
  };
}

function noop() {}

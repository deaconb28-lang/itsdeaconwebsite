import type { Renderer } from "./renderer";

/** The shape the lookup UI gets back from /api/preview. */
export type PreviewResult = {
  url: string;
  /** The host as a diner would read it: no scheme, no trailing slash. */
  pretty: string;
  /** Did the site answer at all? */
  reachable: boolean;
  /** Can it be shown live in an iframe, or does it need a screenshot? */
  embeddable: boolean;
  /** Why embedding was refused, for the copy shown alongside the frame. */
  blockedBy: "x-frame-options" | "frame-ancestors" | null;
  title: string | null;
  status: number | null;
  /**
   * Which service would render a screenshot for this site. Only some render
   * at a true phone width, and the copy alongside the frame says so.
   */
  renderer: Renderer;
  /** Whether `renderer` lays the page out at 375px. */
  phoneWidth: boolean;
};

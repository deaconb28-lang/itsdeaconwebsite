import type { Renderer } from "./renderer";

/**
 * The two viewports the lookup can show a site at. The frames in the UI use
 * these exact aspect ratios, so a capture fills its shell with no letterbox.
 */
export const VIEWPORTS = {
  phone: { width: 375, height: 667 },
  desktop: { width: 1280, height: 800 },
} as const;

export type Device = keyof typeof VIEWPORTS;

/** The shape the lookup UI gets back from /api/preview. */
export type PreviewResult = {
  url: string;
  /** The host as a diner would read it: no scheme, no trailing slash. */
  pretty: string;
  /** Did the site answer at all? */
  reachable: boolean;
  /** Can it be shown live in an iframe, or does it need a screenshot? */
  embeddable: boolean;
  /** Why embedding was refused, for the note shown under the frame. */
  blockedBy: "x-frame-options" | "frame-ancestors" | null;
  title: string | null;
  status: number | null;
  /** Which service would render a screenshot for this site. */
  renderer: Renderer;
  /**
   * Whether a true 375px phone view is possible — either the site allows live
   * embedding, or a renderer that lays pages out at phone width is configured.
   * When false the UI opens on desktop rather than faking a phone.
   */
  phoneCapable: boolean;
};

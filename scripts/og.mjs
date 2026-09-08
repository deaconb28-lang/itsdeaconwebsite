/* Renders the three OG cards at 1200x630.
 *
 * It navigates to the real site first and then replaces the body, so the
 * composition inherits the site's own loaded Archivo and its custom
 * properties. That is why there is no font fetch here: next/font has already
 * put the exact faces on the page.
 *
 * Regenerate after a palette or headline change:
 *   npm run build && npx next start &
 *   OG_BASE=http://localhost:3000 node scripts/og.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.OG_BASE ?? "http://localhost:3000";
const OUT = new URL("../src/app", import.meta.url).pathname;

const CARDS = [
  { route: "/", file: `${OUT}/opengraph-image.png`,
    lead: "hi — I’m Deacon.",
    head: ["Websites for local businesses in ", "Salem"], hi: 1 },
  { route: "/restaurants", file: `${OUT}/restaurants/opengraph-image.png`,
    lead: "For restaurants",
    head: ["Make customers ", "hungry", " before they ever walk in the door."], hi: 1 },
  { route: "/small-business", file: `${OUT}/small-business/opengraph-image.png`,
    lead: "For small business",
    head: ["Your website should be your ", "hardest-working employee."], hi: 1 },
];

const b = await chromium.launch();

for (const card of CARDS) {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto(BASE + card.route, { waitUntil: "networkidle" });
  await p.evaluate((c) => {
    const words = c.head.map((w, i) =>
      i === c.hi
        ? `<span style="background:var(--brand);color:var(--on-brand);padding:0 .1em">${w}</span>`
        : w
    ).join("");
    document.body.innerHTML = `
      <div style="
        width:1200px;height:630px;box-sizing:border-box;
        padding:74px 78px;display:flex;flex-direction:column;
        justify-content:space-between;
        background:var(--cream);color:var(--ink);
        font-family:var(--font-display)">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-weight:800;font-size:30px;letter-spacing:-.01em">Deacon</span>
          <span style="font-family:var(--font-body);font-size:22px;color:var(--muted-2)">${c.lead}</span>
        </div>
        <div style="font-weight:800;font-size:76px;line-height:1.1;letter-spacing:-.035em;max-width:22ch">${words}</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;
                    font-family:var(--font-body);font-size:23px;color:var(--muted)">
          <span>itsdeacon.com</span><span>Salem, Oregon</span>
        </div>
      </div>`;
    document.body.style.cssText = "margin:0;padding:0;overflow:hidden";
    document.documentElement.style.background = getComputedStyle(document.documentElement).getPropertyValue("--cream");
  }, card);
  await p.waitForTimeout(500);
  await p.screenshot({ path: card.file });
  console.log("wrote", card.file);
  await p.close();
}
await b.close();

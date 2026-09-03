import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Difference } from "@/components/Difference";
import { Effects } from "@/components/Effects";
import { Hero } from "@/components/Hero";
import { Lookup } from "@/components/Lookup";
import { NapkinMath } from "@/components/NapkinMath";
import { Nav } from "@/components/Nav";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { QuietPart } from "@/components/QuietPart";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteStateProvider } from "@/components/SiteState";
import { Work } from "@/components/Work";
import { RESTAURANTS } from "@/lib/audience";
import { metadataFor, StructuredData, type PageMeta } from "@/lib/page-meta";
import {
  CONTACT,
  NAPKIN_LEDE,
  PRICING,
  PROCESS_NOTE,
  PROCESS_STEPS,
} from "./copy";

const META: PageMeta = {
  path: "/restaurants",
  title: "Deacon — websites for local restaurants",
  description:
    "I design and build websites for local restaurants — by hand, one at a time. Free homepage first, before you owe me a cent.",
  keywords: [
    "restaurant website design",
    "restaurant web designer",
    "local restaurant website",
    "menu website",
    "Deacon",
  ],
  serviceType: "Restaurant website design and development",
};

export const metadata = metadataFor(META);

/**
 * One page, one argument. The section order *is* the pitch — the visitor sees
 * the price before they are invited to look up their own site, and the napkin
 * math before the form that inherits its figures. Don't reorder these.
 */
export default function Restaurants() {
  return (
    <SiteStateProvider audience={RESTAURANTS}>
      {/* The room, and therefore the colour. */}
      <div data-brand="restaurants">
      <StructuredData meta={META} />
      <Effects />
      <Nav />
      <main>
        <Hero />
        <QuietPart />
        <Difference />
        <Work />
        <Process steps={PROCESS_STEPS} note={PROCESS_NOTE} />
        <Pricing features={PRICING} />
        <Lookup />
        <NapkinMath lede={NAPKIN_LEDE} />
        <About />
        <Contact copy={CONTACT} />
      </main>
      <SiteFooter
        crossLink={{ href: "/small-business", label: "Not a restaurant?" }}
      />
      </div>
    </SiteStateProvider>
  );
}

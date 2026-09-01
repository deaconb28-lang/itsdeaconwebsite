import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { DifferenceBusiness } from "@/components/DifferenceBusiness";
import { Effects } from "@/components/Effects";
import { FiveSeconds } from "@/components/FiveSeconds";
import { HeroBusiness } from "@/components/HeroBusiness";
import { Lookup } from "@/components/Lookup";
import { NapkinMath } from "@/components/NapkinMath";
import { Nav } from "@/components/Nav";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteStateProvider } from "@/components/SiteState";
import { Work } from "@/components/Work";
import { SMALL_BUSINESS } from "@/lib/audience";
import { metadataFor, StructuredData, type PageMeta } from "@/lib/page-meta";
import {
  CONTACT,
  NAPKIN_LEDE,
  PRICING,
  PROCESS_NOTE,
  PROCESS_STEPS,
} from "./copy";

const META: PageMeta = {
  path: "/small-business",
  title: "Deacon — websites for local small businesses",
  description:
    "I design and build websites for local small businesses — trades, shops, studios, services. By hand, one at a time. Free homepage first, before you owe me a cent.",
  keywords: [
    "small business website design",
    "local business web designer",
    "website for tradespeople",
    "contractor website design",
    "Deacon",
  ],
  serviceType: "Small business website design and development",
};

export const metadata = metadataFor(META);

/**
 * The same argument as /restaurants, made to someone who gets found rather
 * than recommended — so the section order matches it exactly, and for the same
 * reason: the price lands before the invitation to look yourself up, and the
 * napkin math before the form that inherits its figures. Don't reorder these.
 *
 * The marquee phrases differ from the restaurant page's because its first
 * phrase quotes that page's headline, and this page's headline is not that.
 */
const MARQUEE = [
  "You're one of three names",
  "Free mockup first",
  "Live in two weeks",
  "No hostages",
];

export default function SmallBusiness() {
  return (
    <SiteStateProvider audience={SMALL_BUSINESS}>
      <StructuredData meta={META} />
      <Effects />
      <Nav />
      <main>
        <HeroBusiness />
        <FiveSeconds />
        <DifferenceBusiness />
        <Work />
        <Process steps={PROCESS_STEPS} note={PROCESS_NOTE} />
        <Pricing features={PRICING} />
        <Lookup />
        <NapkinMath lede={NAPKIN_LEDE} />
        <About />
        <Contact copy={CONTACT} />
      </main>
      <SiteFooter
        phrases={MARQUEE}
        crossLink={{ href: "/restaurants", label: "Run a restaurant?" }}
      />
    </SiteStateProvider>
  );
}

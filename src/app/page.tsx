import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Difference } from "@/components/Difference";
import { Effects } from "@/components/Effects";
import { Hero } from "@/components/Hero";
import { HowIStart } from "@/components/HowIStart";
import { Lookup } from "@/components/Lookup";
import { NapkinMath } from "@/components/NapkinMath";
import { Nav } from "@/components/Nav";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { QuietPart } from "@/components/QuietPart";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteStateProvider } from "@/components/SiteState";
import { WhyItMatters } from "@/components/WhyItMatters";
import { Work } from "@/components/Work";

/**
 * One page, one argument. The section order *is* the pitch — the visitor sees
 * the price before they are invited to look up their own site, and the napkin
 * math before the form that inherits its figures. Don't reorder these.
 */
export default function Home() {
  return (
    <SiteStateProvider>
      <Effects />
      <Nav />
      <main>
        <Hero />
        <WhyItMatters />
        <QuietPart />
        <Difference />
        <HowIStart />
        <Work />
        <Process />
        <Pricing />
        <Lookup />
        <NapkinMath />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </SiteStateProvider>
  );
}

import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { PainSection } from "@/components/landing/pain-section";
import { ConsequenceSection } from "@/components/landing/consequence-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { BonusGuaranteeSection } from "@/components/landing/bonus-guarantee-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <LandingNav />
      <HeroSection />
      {/* id wrappers cho anchor nav - khong dung vao file section */}
      <div id="features" className="scroll-mt-20">
        <PainSection />
      </div>
      <ConsequenceSection />
      <div id="pricing" className="scroll-mt-20">
        <PricingSection />
      </div>
      <div id="bonus" className="scroll-mt-20">
        <BonusGuaranteeSection />
      </div>
      <FinalCtaSection />
      <Footer />
    </main>
  );
}

import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustSection } from "@/components/landing/trust-section";
import { PainSection } from "@/components/landing/pain-section";
import { ConsequenceSection } from "@/components/landing/consequence-section";
import { SamplesSection } from "@/components/landing/samples-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { BonusGuaranteeSection } from "@/components/landing/bonus-guarantee-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <LandingNav />
      <HeroSection />
      <TrustSection />
      {/* id wrappers cho anchor nav - khong dung vao file section */}
      <div id="features" className="scroll-mt-20">
        <PainSection />
      </div>
      <ConsequenceSection />
      {/* SamplesSection tu mang id="samples" + scroll-mt-20 */}
      <SamplesSection />
      <div id="pricing" className="scroll-mt-20">
        <PricingSection />
      </div>
      <div id="bonus" className="scroll-mt-20">
        <BonusGuaranteeSection />
      </div>
      {/* FAQSection tu mang id="faq" + scroll-mt-20 */}
      <FAQSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}

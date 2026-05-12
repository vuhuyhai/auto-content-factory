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
      <HeroSection />
      <PainSection />
      <ConsequenceSection />
      <PricingSection />
      <BonusGuaranteeSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}

import { HeroSection } from "@/components/landing/hero-section";
import { PainSection } from "@/components/landing/pain-section";
import { ConsequenceSection } from "@/components/landing/consequence-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection />
      <PainSection />
      <ConsequenceSection />
    </main>
  );
}

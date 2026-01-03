import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero";
import { MetricsSection } from "@/components/sections/metrics";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { FeaturesSection } from "@/components/sections/features";
import { ImpactSection } from "@/components/sections/impact";
import { TechStackSection } from "@/components/sections/tech-stack";
import { CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <HeroSection />
      <MetricsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ImpactSection />
      <TechStackSection />
      <CTASection />
    </main>
  );
}

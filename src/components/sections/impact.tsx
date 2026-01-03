"use client";

import { GlowingCard } from "@/components/ui/glowing-card";
import { Users, ShieldCheck, Scale, TrendingUp } from "lucide-react";

const impacts = [
  {
    icon: Users,
    title: "Financial Inclusion",
    description:
      "Individuals can prove financial credibility securely, even without deep formal banking history.",
  },
  {
    icon: ShieldCheck,
    title: "Elimination of Identity Theft",
    description:
      "By removing the need for physical or digital photocopies of IDs, we drastically reduce fraud risk.",
  },
  {
    icon: Scale,
    title: "Regulatory Efficiency",
    description:
      "Helps institutions comply with India's DPDP Act by following data minimization principles.",
  },
  {
    icon: TrendingUp,
    title: "Economic Value",
    description:
      "User-centric digital identities can unlock up to 6% of GDP in emerging markets.",
  },
];

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 bg-dark-900 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-green-400 text-sm font-medium mb-3">Impact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Impact on Society
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AkshayaVault is not just a product — it is a movement towards
            privacy-first financial inclusion for over a billion Indians.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {impacts.map((impact, index) => (
            <GlowingCard key={index} className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <impact.icon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {impact.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{impact.description}</p>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

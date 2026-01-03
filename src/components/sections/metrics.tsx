"use client";

import { GlowingCard } from "@/components/ui/glowing-card";

const metrics = [
  {
    value: "100%",
    label: "Privacy",
    description: "Zero raw data exposure. Your documents never leave your device.",
  },
  {
    value: "7 Days",
    label: "Auto-Expiry",
    description: "Self-destructing proofs prevent long-term tracking of your identity.",
  },
  {
    value: "< 3s",
    label: "Proof Speed",
    description: "Lightning-fast ZK proof generation directly in your browser.",
  },
  {
    value: "6%",
    label: "GDP Unlock",
    description: "Digital identity can unlock up to 6% GDP in emerging markets.",
  },
];

export function MetricsSection() {
  return (
    <section className="py-24 bg-dark-950 relative">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Privacy Metrics
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            At AkshayaVault, we harness the power of ZK to redefine financial identity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, index) => (
            <GlowingCard key={index} className="min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-1">
                  {metric.value}
                </div>
                <div className="font-semibold text-white">
                  {metric.label}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">{metric.description}</p>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

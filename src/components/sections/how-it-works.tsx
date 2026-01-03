"use client";

import { GlowingCard } from "@/components/ui/glowing-card";
import { QrCode, Cpu, Database, CheckCircle, FileText } from "lucide-react";

const steps = [
  {
    step: "Step 1",
    icon: QrCode,
    title: "Scan Document",
    description: "Tell us about your document — just a few quick answers to guide the ZK.",
  },
  {
    step: "Step 2",
    icon: Cpu,
    title: "Generate Proof",
    description: "AkshayaVault instantly builds a ready-to-use proof tailored to your needs.",
  },
  {
    step: "Step 3",
    icon: CheckCircle,
    title: "Verify & Share",
    description: "Fine-tune and share your proof with verifiers effortlessly.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-dark-900 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Start to Finish, Made Easy
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A streamlined process designed for speed and clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <GlowingCard key={index} className="text-center">
              {/* Preview mockup */}
              <div className="bg-dark-900/80 rounded-xl p-4 mb-6 border border-green-500/10">
                <div className="aspect-video bg-dark-950 rounded-lg flex items-center justify-center">
                  <item.icon className="w-12 h-12 text-green-500/50" />
                </div>
              </div>
              
              <div className="text-green-400 font-medium mb-2">{item.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

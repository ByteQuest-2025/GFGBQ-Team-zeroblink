"use client";

import { GlowingCard } from "@/components/ui/glowing-card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Globe,
  Clock,
  Smartphone,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Collaborate in Real-Time",
    description: "Work together seamlessly on one codebase — see edits, comments, and updates live.",
    size: "large",
  },
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Get your verification running in minutes with ready-to-use templates.",
    size: "large",
    hasVisual: true,
  },
  {
    icon: Eye,
    title: "SEO Optimization",
    description: "Smarter rankings with zero extra effort guaranteed.",
    size: "small",
  },
  {
    icon: Sparkles,
    title: "ZK Generate",
    description: "Generate proofs, content, and visuals instantly.",
    size: "small",
    hasButton: true,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-dark-950 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Power Features, Simple Control
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to build smarter verifications — without the hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Large card with code preview */}
          <GlowingCard className="lg:col-span-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Collaborate in Real-Time</h3>
                <p className="text-sm text-gray-400">Work together seamlessly on one codebase — see edits, comments, and updates live.</p>
              </div>
            </div>
            
            {/* Code preview */}
            <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm border border-green-500/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-1 text-xs">
                <div><span className="text-purple-400">import</span> <span className="text-gray-300">{"{ Layout, Sidebar }"}</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@akshaya/ui&apos;</span></div>
                <div><span className="text-purple-400">import</span> <span className="text-gray-300">{"{ ZKProvider }"}</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@akshaya/zk&apos;</span></div>
                <div className="text-gray-500">{"// Generate proof"}</div>
                <div><span className="text-blue-400">const</span> <span className="text-gray-300">proof</span> = <span className="text-yellow-400">await</span> <span className="text-gray-300">generateProof(data)</span></div>
              </div>
            </div>
          </GlowingCard>

          {/* Lightning visual card */}
          <GlowingCard className="relative overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast Setup</h3>
            <p className="text-sm text-gray-400 mb-4">Get your verification running in minutes with ready-to-use templates.</p>
            <div className="absolute bottom-0 right-0 w-32 h-32 text-green-500/20">
              <Zap className="w-full h-full" />
            </div>
          </GlowingCard>

          {/* SEO card */}
          <GlowingCard>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
            <p className="text-sm text-gray-400 mb-4">Zero data exposure with zero extra effort guaranteed.</p>
            <div className="text-6xl font-bold text-green-500/20">ZK</div>
          </GlowingCard>

          {/* Generate card */}
          <GlowingCard>
            <h3 className="text-lg font-semibold text-white mb-2">ZK Generate</h3>
            <p className="text-sm text-gray-400 mb-4">Generate proofs, content, and visuals instantly.</p>
            <Button variant="secondary" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Proof
            </Button>
          </GlowingCard>

          {/* Integration card */}
          <GlowingCard>
            <h3 className="text-lg font-semibold text-white mb-2">India Stack Ready</h3>
            <p className="text-sm text-gray-400 mb-4">Native integration with Aadhaar, PAN, and more.</p>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-dark-700/50 rounded text-xs text-gray-400">UIDAI</div>
              <div className="px-3 py-1 bg-dark-700/50 rounded text-xs text-gray-400">PAN</div>
              <div className="px-3 py-1 bg-dark-700/50 rounded text-xs text-gray-400">DigiLocker</div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </section>
  );
}

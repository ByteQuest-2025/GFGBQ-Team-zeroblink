"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow opacity-50" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Build Without Limits with AkshayaVault
        </h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          From document scans to verified proofs, let ZK do the heavy lifting — focus on privacy, not complexity.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/generate">
            <Button size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Proof
            </Button>
          </Link>
          <Link href="/vault">
            <Button variant="outline" size="lg">
              View Vault
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

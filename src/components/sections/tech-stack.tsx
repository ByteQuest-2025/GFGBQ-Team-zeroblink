"use client";

import { Code, FileCode, Lock, Shield, Fingerprint, Database, Hexagon, Palette } from "lucide-react";

const techStack = [
  { name: "Next.js 15", icon: Code },
  { name: "TypeScript", icon: FileCode },
  { name: "Circom 2", icon: Lock },
  { name: "SnarkJS", icon: Shield },
  { name: "Anon Aadhaar", icon: Fingerprint },
  { name: "Supabase", icon: Database },
  { name: "Polygon", icon: Hexagon },
  { name: "Tailwind", icon: Palette },
];

export function TechStackSection() {
  return (
    <section id="tech" className="py-24 bg-dark-950 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Plug in & Power Up
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Built with modern technologies optimized for the Indian market.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-dark-800/60 border border-green-500/20 rounded-full hover:border-green-500/40 transition-colors"
            >
              <tech.icon className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

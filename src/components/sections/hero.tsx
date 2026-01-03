"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Fingerprint, Sparkles, FileCheck, Layers, Code } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-dark-950">
      <div className="absolute inset-0 grid-pattern" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" className="mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              ZK Proofs for India
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Zero-Knowledge Identity
            <br />
            <span className="text-gradient">for Modern India</span>
          </motion.h1>

          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8 text-base md:text-lg px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Accelerate your verification with ZK that understands privacy and delivers
            cryptographic proofs in seconds.
          </motion.p>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/generate">
              <Button size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Proof
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Desktop - Energy Orb with organic flowing paths */}
        <div className="hidden md:block relative mt-4">
          <div className="relative w-full max-w-4xl mx-auto" style={{ height: "500px" }}>
            
            {/* SVG Organic flowing connection paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="pathGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#4ade80" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="pathGradient2" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#4ade80" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Top left - organic curve */}
              <motion.path
                d="M 160 100 C 200 140, 280 160, 320 200 S 360 240, 380 250"
                stroke="url(#pathGradient1)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              />
              
              {/* Top right - organic curve */}
              <motion.path
                d="M 640 100 C 600 140, 520 160, 480 200 S 440 240, 420 250"
                stroke="url(#pathGradient2)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              />
              
              {/* Bottom left - flowing S curve */}
              <motion.path
                d="M 160 400 C 220 380, 260 340, 300 300 S 360 270, 380 260"
                stroke="url(#pathGradient1)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
              />
              
              {/* Bottom right - flowing S curve */}
              <motion.path
                d="M 640 400 C 580 380, 540 340, 500 300 S 440 270, 420 260"
                stroke="url(#pathGradient2)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
              />

              {/* Animated dots traveling along paths */}
              <motion.circle
                r="3"
                fill="#4ade80"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                style={{ offsetPath: "path('M 160 100 C 200 140, 280 160, 320 200 S 360 240, 380 250')" }}
              />
              <motion.circle
                r="3"
                fill="#4ade80"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                style={{ offsetPath: "path('M 640 100 C 600 140, 520 160, 480 200 S 440 240, 420 250')" }}
              />
            </svg>

            {/* Central Energy Orb - Plasma/Nebula style like Layrinth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 2 }}>
              {/* Outer ambient glow */}
              <div className="absolute -inset-32 rounded-full bg-green-500/10 blur-3xl" />
              <div className="absolute -inset-20 rounded-full bg-green-400/15 blur-2xl" />
              
              <div className="relative w-52 h-52 lg:w-60 lg:h-60">
                {/* Plasma tendrils - outer layer */}
                <motion.div 
                  className="absolute -inset-4 rounded-full overflow-hidden"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse 120% 40% at 20% 50%, rgba(34, 197, 94, 0.6) 0%, transparent 50%),
                      radial-gradient(ellipse 40% 120% at 80% 50%, rgba(74, 222, 128, 0.5) 0%, transparent 50%),
                      radial-gradient(ellipse 100% 60% at 50% 20%, rgba(34, 197, 94, 0.4) 0%, transparent 40%)
                    `,
                  }} />
                </motion.div>

                {/* Second plasma layer - counter rotation */}
                <motion.div 
                  className="absolute -inset-2 rounded-full overflow-hidden"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse 60% 140% at 30% 60%, rgba(74, 222, 128, 0.7) 0%, transparent 45%),
                      radial-gradient(ellipse 140% 60% at 70% 40%, rgba(34, 197, 94, 0.6) 0%, transparent 45%)
                    `,
                  }} />
                </motion.div>

                {/* Inner swirling energy */}
                <motion.div 
                  className="absolute inset-2 rounded-full overflow-hidden"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse 80% 50% at 25% 35%, rgba(134, 239, 172, 0.8) 0%, transparent 40%),
                      radial-gradient(ellipse 50% 80% at 75% 65%, rgba(74, 222, 128, 0.7) 0%, transparent 40%),
                      radial-gradient(ellipse 70% 70% at 50% 50%, rgba(34, 197, 94, 0.5) 0%, transparent 50%)
                    `,
                  }} />
                </motion.div>

                {/* Faster inner swirl */}
                <motion.div 
                  className="absolute inset-6 rounded-full overflow-hidden"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse 90% 40% at 35% 30%, rgba(187, 247, 208, 0.9) 0%, transparent 35%),
                      radial-gradient(ellipse 40% 90% at 65% 70%, rgba(134, 239, 172, 0.8) 0%, transparent 35%)
                    `,
                  }} />
                </motion.div>

                {/* Core energy - brightest center */}
                <motion.div 
                  className="absolute inset-10 rounded-full overflow-hidden"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse 100% 60% at 40% 40%, rgba(220, 252, 231, 0.95) 0%, transparent 40%),
                      radial-gradient(ellipse 60% 100% at 60% 60%, rgba(187, 247, 208, 0.9) 0%, transparent 40%)
                    `,
                  }} />
                </motion.div>

                {/* Bright white core */}
                <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-white/80 via-green-100/70 to-green-200/60 blur-sm" />
                <div className="absolute inset-[40%] rounded-full bg-white/60" />
                
                {/* Pulsing outer glow */}
                <motion.div 
                  className="absolute -inset-8 rounded-full pointer-events-none"
                  animate={{ 
                    boxShadow: [
                      "0 0 40px 15px rgba(34, 197, 94, 0.3), 0 0 80px 30px rgba(34, 197, 94, 0.15), 0 0 120px 50px rgba(34, 197, 94, 0.08)",
                      "0 0 60px 25px rgba(74, 222, 128, 0.4), 0 0 100px 40px rgba(34, 197, 94, 0.2), 0 0 140px 60px rgba(34, 197, 94, 0.1)",
                      "0 0 40px 15px rgba(34, 197, 94, 0.3), 0 0 80px 30px rgba(34, 197, 94, 0.15), 0 0 120px 50px rgba(34, 197, 94, 0.08)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Floating cards - positioned closer */}
            <motion.div 
              className="absolute top-[6%] left-[8%] glass-card p-3 max-w-[175px]"
              style={{ zIndex: 3 }}
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -30, y: -20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-sm font-medium text-white">Upload Files</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Drag & Drop or choose files</p>
              <div className="px-2 py-1.5 bg-dark-900/80 rounded text-xs text-green-400 inline-flex items-center gap-1.5 border border-green-500/20">
                <FileCheck className="w-3 h-3" />
                document.pdf
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-[6%] right-[8%] glass-card p-3 max-w-[175px]"
              style={{ zIndex: 3 }}
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 30, y: -20 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <Fingerprint className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-sm font-medium text-white">Smart Proofs</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Auto-verify with ZK</p>
              <div className="space-y-1.5">
                <div className="h-1.5 bg-green-500/50 rounded-full w-full" />
                <div className="h-1.5 bg-green-500/30 rounded-full w-4/5" />
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-[8%] left-[8%] glass-card p-3 max-w-[175px]"
              style={{ zIndex: 3 }}
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -30, y: 20 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-3.5 h-3.5 text-green-400" />
                <span className="text-sm font-medium text-white">Code Generation</span>
              </div>
              <div className="font-mono text-xs bg-dark-900/80 rounded p-2 border border-green-500/20">
                <div><span className="text-purple-400">const</span> <span className="text-blue-400">proof</span> =</div>
                <div className="pl-3 text-green-400">zkVerify(data)</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-[8%] right-[8%] glass-card p-3 max-w-[160px]"
              style={{ zIndex: 3 }}
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 30, y: 20 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3.5 h-3.5 text-green-400" />
                <span className="text-sm font-medium text-white">Multiple Stacks</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="w-8 h-8 bg-dark-900/80 rounded-lg flex items-center justify-center border border-green-500/20">
                  <Lock className="w-4 h-4 text-green-400" />
                </div>
                <div className="w-8 h-8 bg-dark-900/80 rounded-lg flex items-center justify-center border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="w-8 h-8 bg-dark-900/80 rounded-lg flex items-center justify-center border border-green-500/20">
                  <Fingerprint className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile - Clean card grid with glowing accent */}
        <div className="md:hidden relative mt-8 px-2">
          {/* Ambient glow behind */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-500/20 rounded-full blur-3xl" />
          
          {/* Central icon */}
          <motion.div 
            className="relative w-20 h-20 mx-auto mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400 to-green-600"
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(34, 197, 94, 0.5)",
                  "0 0 50px rgba(34, 197, 94, 0.7)",
                  "0 0 30px rgba(34, 197, 94, 0.5)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 mb-3">
                <Lock className="w-4.5 h-4.5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Local Processing</p>
              <p className="text-xs text-gray-500">Data stays on device</p>
            </motion.div>

            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 mb-3">
                <Fingerprint className="w-4.5 h-4.5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1">ZK Proofs</p>
              <p className="text-xs text-gray-500">Cryptographic privacy</p>
            </motion.div>

            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 mb-3">
                <FileCheck className="w-4.5 h-4.5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Auto Verify</p>
              <p className="text-xs text-gray-500">Instant validation</p>
            </motion.div>

            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 mb-3">
                <Layers className="w-4.5 h-4.5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1">India Stack</p>
              <p className="text-xs text-gray-500">Aadhaar compatible</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

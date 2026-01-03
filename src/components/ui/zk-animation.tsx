"use client";

import { useEffect, useState } from "react";
import { Shield, Lock, Fingerprint } from "lucide-react";

interface ZKAnimationProps {
  progress: number;
  status: string;
}

export function ZKAnimation({ progress }: ZKAnimationProps) {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(s => s === 1 ? 1.05 : 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, rgba(34, 197, 94, ${0.1 + progress / 300}) 0%, transparent 70%)`,
        }}
      />

      {/* Outer rotating ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-green-500/20"
        style={{
          animation: 'spin 8s linear infinite',
        }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateY(-110px) translateX(-50%)`,
              opacity: progress > deg / 4 ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }}
          />
        ))}
      </div>

      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        {/* Background track */}
        <circle
          cx="112"
          cy="112"
          r="90"
          fill="none"
          stroke="rgba(34, 197, 94, 0.1)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx="112"
          cy="112"
          r="90"
          fill="none"
          stroke="url(#zkGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
        {/* Glow effect */}
        <circle
          cx="112"
          cy="112"
          r="90"
          fill="none"
          stroke="url(#zkGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          opacity="0.3"
          filter="blur(4px)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
        <defs>
          <linearGradient id="zkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner circle with icon */}
      <div 
        className="absolute inset-8 rounded-full bg-dark-900 border border-green-500/30 flex items-center justify-center overflow-hidden"
        style={{
          transform: `scale(${pulseScale})`,
          transition: 'transform 0.5s ease-in-out',
          boxShadow: `0 0 ${20 + progress / 3}px rgba(34, 197, 94, ${0.2 + progress / 400})`,
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(34, 197, 94, 0.1) 50%, transparent 60%),
                linear-gradient(-45deg, transparent 40%, rgba(34, 197, 94, 0.1) 50%, transparent 60%)
              `,
              backgroundSize: '20px 20px',
              animation: 'movePattern 2s linear infinite',
            }}
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center">
          {progress < 30 && (
            <Fingerprint 
              className="w-12 h-12 text-green-400 mx-auto animate-pulse" 
            />
          )}
          {progress >= 30 && progress < 70 && (
            <Lock 
              className="w-12 h-12 text-green-400 mx-auto"
              style={{ animation: 'bounce 1s ease-in-out infinite' }}
            />
          )}
          {progress >= 70 && (
            <Shield 
              className="w-12 h-12 text-green-400 mx-auto"
              style={{ 
                animation: progress === 100 ? 'none' : 'pulse 1.5s ease-in-out infinite',
                filter: progress === 100 ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' : 'none'
              }}
            />
          )}
          <div className="mt-2 text-2xl font-bold text-green-400">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {progress > 10 && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-green-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 45}deg) translateY(-${70 + Math.sin(i) * 20}px)`,
                opacity: progress > i * 12 ? 0.6 : 0,
                animation: `float ${2 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Success burst effect */}
      {progress === 100 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-full h-full rounded-full border-2 border-green-400"
            style={{
              animation: 'ripple 1s ease-out forwards',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes movePattern {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }
        @keyframes float {
          0%, 100% { transform: rotate(var(--rotation)) translateY(-70px) scale(1); }
          50% { transform: rotate(var(--rotation)) translateY(-80px) scale(1.2); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

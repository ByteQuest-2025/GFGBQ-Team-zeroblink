"use client";

import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlowingCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function GlowingCard({ children, className, ...props }: GlowingCardProps) {
  return (
    <div
      className={cn(
        "relative group rounded-2xl bg-dark-800/60 border border-green-500/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-green-500/40",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

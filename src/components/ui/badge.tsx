"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
          {
            "bg-dark-700/50 text-gray-300 border-gray-700": variant === "default",
            "bg-green-500/10 text-green-400 border-green-500/30": variant === "primary",
            "bg-green-500/20 text-green-300 border-green-500/40": variant === "success",
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/30": variant === "warning",
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };

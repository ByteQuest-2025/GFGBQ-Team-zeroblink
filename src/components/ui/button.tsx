"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full",
          {
            "bg-white text-dark-900 hover:bg-gray-100 shadow-lg shadow-white/10":
              variant === "primary",
            "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30":
              variant === "secondary",
            "border border-green-500/30 bg-transparent text-green-400 hover:bg-green-500/10":
              variant === "outline",
            "bg-transparent text-gray-300 hover:text-white hover:bg-white/5":
              variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-2.5 text-sm": size === "md",
            "px-8 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

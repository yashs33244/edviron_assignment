"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: "text-white",
        secondary: "text-slate-900 dark:text-white",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
);

interface HoverBorderGradientProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  gradientClassName?: string;
}

export const HoverBorderGradient = React.forwardRef<
  HTMLButtonElement,
  HoverBorderGradientProps
>(
  (
    { className, variant, size, gradientClassName, children, ...props },
    ref
  ) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span
          className={cn(
            "absolute inset-0 -z-10 transform-gpu overflow-hidden rounded-md blur-md transition-all duration-500 group-hover:blur-lg",
            gradientClassName
          )}
          style={{
            background: `radial-gradient(200px circle at ${position.x}px ${position.y}px, var(--gradient-color, rgba(155, 228, 155, 0.3)), transparent)`,
          }}
        />
        <span
          className={cn(
            "absolute inset-0 -z-10 transform-gpu overflow-hidden rounded-md opacity-0 transition duration-500 group-hover:opacity-100",
            gradientClassName
          )}
          style={{
            background: `radial-gradient(100px circle at ${position.x}px ${position.y}px, var(--gradient-color, rgba(43, 232, 42, 0.8)), transparent)`,
          }}
        />
        <span className="absolute inset-px -z-10 rounded-md bg-background transition duration-500" />
      </button>
    );
  }
);

HoverBorderGradient.displayName = "HoverBorderGradient";

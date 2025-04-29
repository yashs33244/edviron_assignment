"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HoverBorderGradientProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientClassName?: string;
}

export function HoverBorderGradient({
  children,
  className,
  containerClassName,
  gradientClassName,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={cn("relative group", containerClassName)}>
      <div
        className={cn(
          "absolute -inset-[2px] rounded-full bg-gradient-to-r from-[#2BE82A] to-[#9BE49B] opacity-70 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:blur-md",
          hovered ? "opacity-100" : "opacity-70",
          gradientClassName
        )}
      />
      <button
        className={cn(
          "relative px-7 py-3 bg-[#202020] rounded-full text-white font-medium transition-all duration-200 z-10",
          className
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value?: string | number;
  subtext?: string;
  description?: string;
  icon?: React.ReactNode;
  growth?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
  valueClassName?: string;
  isGreen?: boolean;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtext,
  description,
  icon,
  growth,
  className,
  valueClassName,
  isGreen = false,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg",
        isGreen
          ? "bg-[#2BE82A] text-black"
          : "bg-zinc-900 text-white border border-zinc-800",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div
            className={`p-2 rounded-full ${
              isGreen ? "bg-black/10" : "bg-zinc-800"
            }`}
          >
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      <div className="flex flex-col">
        {value && (
          <span className={cn("text-4xl font-bold", valueClassName)}>
            {value}
          </span>
        )}

        {description && (
          <p className={isGreen ? "text-black/70 my-2" : "text-zinc-400 my-2"}>
            {description}
          </p>
        )}

        {growth && (
          <div className="mt-2 flex items-center">
            <span
              className={
                growth.isPositive !== false ? "text-[#2BE82A]" : "text-red-500"
              }
            >
              {growth.isPositive !== false ? "+" : ""}
              {growth.value}
            </span>
            {growth.isPositive !== false ? (
              <svg
                className="w-4 h-4 ml-1 text-[#2BE82A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 ml-1 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
          </div>
        )}

        {subtext && (
          <p className={isGreen ? "text-black/70" : "text-zinc-400"}>
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const CircularProgress = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  icon,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  icon?: React.ReactNode;
  label?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value, max) / max;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2BE82A"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
        />
      </svg>
      {icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      )}
      {label && (
        <div className="mt-2 text-center text-zinc-300 text-sm">{label}</div>
      )}
    </div>
  );
};

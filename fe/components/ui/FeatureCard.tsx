"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FeatureCard = ({
  title,
  description,
  icon,
  className,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="inline-flex rounded-lg bg-[#2BE82A]/10 p-3 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </motion.div>
  );
};

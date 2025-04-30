"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GraphCardProps {
  title: string;
  subtitle: string;
  value: string;
  className?: string;
  ageGroups?: { label: string; color: string }[];
}

export const GraphCard = ({
  title,
  subtitle,
  value,
  className,
  ageGroups = [
    { label: "Age 32", color: "#ffffff" },
    { label: "Age 42", color: "#ffffff" },
    { label: "Age 52", color: "#2BE82A" },
    { label: "Age 62", color: "#2BE82A" },
  ],
}: GraphCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl p-6 bg-zinc-900 text-white border border-zinc-800 shadow-md",
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-zinc-400">{subtitle}</p>
      </div>

      <div className="mb-8">
        <span className="text-6xl font-bold">{value}</span>
      </div>

      <div className="relative h-40 mb-6">
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
          >
            {/* Gradient for the graph fill */}
            <defs>
              <linearGradient
                id="graphGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2BE82A" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#2BE82A" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#2BE82A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Background grid lines */}
            <g className="grid-lines">
              <line
                x1="0"
                y1="40"
                x2="400"
                y2="40"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="80"
                x2="400"
                y2="80"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="120"
                x2="400"
                y2="120"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
            </g>

            {/* Y-axis labels */}
            <text x="370" y="40" fontSize="12" textAnchor="end" fill="#666">
              $3M
            </text>
            <text x="370" y="80" fontSize="12" textAnchor="end" fill="#666">
              $2M
            </text>
            <text x="370" y="120" fontSize="12" textAnchor="end" fill="#666">
              $1M
            </text>
            <text x="370" y="155" fontSize="12" textAnchor="end" fill="#666">
              $0
            </text>

            {/* Multi-layered area graphs */}
            <g>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d="M0,160 L50,150 L100,130 L150,100 L200,60 L250,30 L300,10 L400,0 L400,160 L0,160 Z"
                fill="url(#graphGradient)"
                stroke="#2BE82A"
                strokeWidth="2"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
                d="M0,160 L50,152 L100,135 L150,110 L200,80 L250,60 L300,45 L400,40 L400,160 L0,160 Z"
                fill="url(#graphGradient)"
                stroke="#9BE49B"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                d="M0,160 L50,154 L100,140 L150,130 L200,110 L250,90 L300,80 L400,70 L400,160 L0,160 Z"
                fill="url(#graphGradient)"
                stroke="#D1F5D1"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
            </g>
          </svg>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-4">
        {ageGroups.map((age, index) => (
          <div key={index} className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: age.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            />
            <span className="text-sm text-zinc-400">{age.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-4">Recommendations</h4>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#2BE82A] rounded-xl p-4 text-black"
          >
            <div className="text-3xl font-bold">$125.43</div>
            <div className="flex items-center text-black/70">
              +$8.92
              <svg
                className="w-4 h-4 ml-1"
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
            </div>
            <div className="mt-2 text-sm">Share's price rising</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-4 text-black"
          >
            <div className="text-3xl font-bold">567</div>
            <div className="flex items-center text-[#2BE82A]">
              +5.237%
              <svg
                className="w-4 h-4 ml-1"
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
            </div>
            <div className="mt-2 text-sm text-zinc-600">Points changes</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

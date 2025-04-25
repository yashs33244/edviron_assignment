"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  icon?: React.ReactNode
  label?: string
  sublabel?: string
  animate?: boolean
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = "#2BE82A",
  bgColor = "rgba(43, 232, 42, 0.2)",
  icon,
  label,
  sublabel,
  animate = true,
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setProgress(value)
    }
  }, [value, animate])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={bgColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="absolute flex flex-col items-center justify-center"
      >
        {icon && <div className="mb-1">{icon}</div>}
        {label && <div className="text-xl font-bold">{label}</div>}
        {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
      </motion.div>
    </div>
  )
}

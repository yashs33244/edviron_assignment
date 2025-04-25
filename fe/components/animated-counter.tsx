"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface AnimatedCounterProps {
  value: number | string
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1,
  delay = 0,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0")
  const controls = useAnimation()

  useEffect(() => {
    let targetValue: number

    if (typeof value === "string") {
      // Remove any non-numeric characters except decimal points
      const numericValue = value.replace(/[^0-9.]/g, "")
      targetValue = Number.parseFloat(numericValue)
    } else {
      targetValue = value
    }

    if (isNaN(targetValue)) {
      setDisplayValue(value.toString())
      return
    }

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)

      const currentValue = Math.floor(progress * targetValue)

      // Format with commas for thousands
      setDisplayValue(currentValue.toLocaleString())

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        // Ensure we end with the exact target value
        setDisplayValue(targetValue.toLocaleString())
      }
    }

    const startAnimation = () => {
      window.requestAnimationFrame(step)
    }

    const timer = setTimeout(startAnimation, delay * 1000)
    controls.start({ opacity: 1, y: 0 })

    return () => clearTimeout(timer)
  }, [value, duration, delay, controls])

  return (
    <motion.span initial={{ opacity: 0, y: 20 }} animate={controls} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  )
}

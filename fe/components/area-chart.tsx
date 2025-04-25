"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

interface AreaChartProps {
  data: any[]
  dataKey: string
  xAxisDataKey?: string
  height?: number
  color?: string
  gradientFrom?: string
  gradientTo?: string
  animated?: boolean
}

export function CustomAreaChart({
  data,
  dataKey,
  xAxisDataKey = "name",
  height = 300,
  color = "#2BE82A",
  gradientFrom = "rgba(43, 232, 42, 0.8)",
  gradientTo = "rgba(43, 232, 42, 0)",
  animated = true,
}: AreaChartProps) {
  const [chartData, setChartData] = useState(data.map((item) => ({ ...item, [dataKey]: 0 })))

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setChartData(data)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setChartData(data)
    }
  }, [data, animated])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={xAxisDataKey} tick={{ fill: "#FFFFFF", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#FFFFFF", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#202020",
              borderColor: "#2BE82A",
              borderRadius: "0.5rem",
              color: "#FFFFFF",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

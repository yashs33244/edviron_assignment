"use client"

import { TrendingUp } from "lucide-react"
import { CustomAreaChart } from "@/components/area-chart"
import { CircularProgress } from "@/components/circular-progress"

// Mock data
const investmentData = {
  total: "$179,918,000",
  target: "Target: $200,500,000",
  growth: "+28%",
}

const creditData = {
  amount: "-$500,000",
  remaining: "$999,980 Remaining",
}

const portfolioData = {
  amount: "710,520",
  currency: "USD",
}

// Chart data
const monthlyData = [
  { month: "Jan", value: 300000 },
  { month: "Feb", value: 450000 },
  { month: "Mar", value: 320000 },
  { month: "Apr", value: 580000 },
  { month: "May", value: 490000 },
  { month: "Jun", value: 710000 },
]

export default function InvestmentsPage() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-black">
      <h1 className="text-2xl font-bold mb-6">Investments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Investment Card */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-4">
            <CircularProgress value={65} size={60} strokeWidth={6} />
            <div className="ml-4">
              <div className="text-sm font-medium">Investments</div>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{investmentData.total}</div>
          <div className="text-sm text-gray-400">{investmentData.target}</div>
        </div>

        {/* Credit Card */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-4">
            <CircularProgress value={40} size={60} strokeWidth={6} color="#FF4D4F" bgColor="rgba(255, 77, 79, 0.2)" />
            <div className="ml-4">
              <div className="text-sm font-medium">Credit</div>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{creditData.amount}</div>
          <div className="text-sm text-gray-400">{creditData.remaining}</div>
        </div>
      </div>

      {/* Portfolio Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white text-black">
          <div className="text-sm font-medium mb-4">Investments</div>
          <div className="text-3xl font-bold mb-2">
            {portfolioData.amount} <span className="text-sm">{portfolioData.currency}</span>
          </div>
          <div className="text-3xl font-bold text-primary">{investmentData.growth}</div>
        </div>

        <div className="p-6 rounded-3xl bg-card">
          <div className="text-sm font-medium mb-2">Last 6 month</div>
          <div className="h-48">
            <CustomAreaChart data={monthlyData} dataKey="value" xAxisDataKey="month" height={180} />
          </div>
        </div>
      </div>

      {/* Return Rate Card */}
      <div className="p-6 rounded-3xl bg-card">
        <div className="text-xl font-bold mb-4">Increase your relative return by</div>
        <div className="text-5xl font-bold mb-6">3.5%</div>

        <div className="h-48 mb-6">
          <CustomAreaChart
            data={[
              { name: "$0", value: 0 },
              { name: "$1M", value: 1000000 },
              { name: "$2M", value: 2000000 },
              { name: "$3M", value: 3000000 },
              { name: "$4M", value: 4000000 },
            ]}
            dataKey="value"
            height={180}
          />
        </div>

        {/* Age indicators */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-white mr-2"></div>
            <span className="text-sm">Age 32</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm">Age 42</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm">Age 52</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm">Age 62</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Recommendations</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Share Card */}
            <div className="p-4 rounded-3xl bg-primary text-black">
              <div className="text-3xl font-bold">$125.43</div>
              <div className="flex items-center text-sm">
                +$8.92 <TrendingUp className="ml-1 h-3 w-3" />
              </div>
              <div className="text-sm mt-2">Share's price rising</div>
            </div>

            {/* Points Card */}
            <div className="p-4 rounded-3xl bg-white text-black">
              <div className="text-3xl font-bold">567</div>
              <div className="flex items-center text-sm text-primary">
                +5.237% <TrendingUp className="ml-1 h-3 w-3" />
              </div>
              <div className="text-sm mt-2">Points changes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

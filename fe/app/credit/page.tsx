"use client"

import { CircularProgress } from "@/components/circular-progress"

// Mock data
const creditData = {
  amount: "-$500,000",
  remaining: "$999,980 Remaining",
}

export default function CreditPage() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-black">
      <h1 className="text-2xl font-bold mb-6">Credit</h1>

      <div className="p-6 rounded-3xl bg-card mb-6">
        <div className="flex items-center mb-4">
          <CircularProgress value={40} size={80} strokeWidth={8} color="#FF4D4F" bgColor="rgba(255, 77, 79, 0.2)" />
          <div className="ml-6">
            <div className="text-xl font-medium">Credit</div>
            <div className="text-4xl font-bold mt-2">{creditData.amount}</div>
            <div className="text-sm text-gray-400 mt-1">{creditData.remaining}</div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Credit History</h3>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-black">
                <div>
                  <div className="font-medium">Credit Payment #{i + 1}</div>
                  <div className="text-sm text-gray-400">{`2023-${(i + 1).toString().padStart(2, "0")}-15`}</div>
                </div>
                <div className="text-xl font-bold text-red-500">{`-$${(i + 1) * 100},000`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-card">
        <h3 className="text-xl font-bold mb-4">Credit Limit</h3>
        <div className="text-4xl font-bold mb-2">$1,500,000</div>
        <div className="w-full bg-gray-700 h-3 rounded-full mb-4">
          <div className="bg-primary h-3 rounded-full" style={{ width: "33%" }}></div>
        </div>
        <div className="text-sm text-gray-400">33% of credit limit used</div>
      </div>
    </div>
  )
}

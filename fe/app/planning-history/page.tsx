"use client"

import { Calendar, Clock } from "lucide-react"

// Mock data
const planningHistory = [
  {
    id: 1,
    title: "Investment Plan A",
    date: "2023-04-15",
    time: "14:30",
    amount: "$250,000",
    status: "Completed",
  },
  {
    id: 2,
    title: "Savings Goal",
    date: "2023-03-22",
    time: "10:15",
    amount: "$100,000",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Retirement Plan",
    date: "2023-02-18",
    time: "09:45",
    amount: "$500,000",
    status: "Scheduled",
  },
  {
    id: 4,
    title: "Education Fund",
    date: "2023-01-05",
    time: "11:30",
    amount: "$150,000",
    status: "Completed",
  },
  {
    id: 5,
    title: "Property Investment",
    date: "2022-12-12",
    time: "16:00",
    amount: "$750,000",
    status: "In Progress",
  },
]

export default function PlanningHistoryPage() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-black">
      <h1 className="text-2xl font-bold mb-6">Planning History</h1>

      <div className="p-6 rounded-3xl bg-card">
        <h3 className="text-xl font-bold mb-6">Your Financial Plans</h3>

        <div className="space-y-4">
          {planningHistory.map((plan) => (
            <div
              key={plan.id}
              className="p-4 rounded-xl bg-black flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-bold">{plan.title}</div>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {plan.date}
                  <Clock className="h-4 w-4 ml-3 mr-1" />
                  {plan.time}
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center">
                <div className="text-xl font-bold mr-4">{plan.amount}</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    plan.status === "Completed"
                      ? "bg-primary text-black"
                      : plan.status === "In Progress"
                        ? "bg-yellow-500 text-black"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  {plan.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 bg-primary text-black rounded-full font-medium">Create New Plan</button>
        </div>
      </div>
    </div>
  )
}

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data
    const statuses = ["completed", "pending", "failed"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    const transaction = {
      id: `TR-${Math.floor(Math.random() * 10000)}`,
      custom_order_id: id,
      school_name: ["Lincoln High School", "Washington Elementary", "Jefferson Middle School"][
        Math.floor(Math.random() * 3)
      ],
      amount: `$${(Math.random() * 2000 + 100).toFixed(2)}`,
      status: randomStatus,
      date: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction status:", error)
    return NextResponse.json({ error: "Failed to fetch transaction status" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"

// Mock data for transactions
const mockTransactions = Array.from({ length: 50 }).map((_, i) => ({
  id: `TR-${1000 + i}`,
  school_id: String(Math.floor(Math.random() * 8) + 1),
  school_name: [
    "Lincoln High School",
    "Washington Elementary",
    "Jefferson Middle School",
    "Roosevelt Academy",
    "Kennedy High School",
  ][Math.floor(Math.random() * 5)],
  amount: (Math.random() * 2000 + 100).toFixed(2),
  status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)],
  date: new Date(new Date().getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  custom_order_id: `ORDER-${2000 + i}`,
}))

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const schoolId = searchParams.get("school_id")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const date = searchParams.get("date")

    // Apply filters
    let filteredData = [...mockTransactions]

    if (schoolId) {
      filteredData = filteredData.filter((t) => t.school_id === schoolId)
    }

    if (status) {
      filteredData = filteredData.filter((t) => t.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(
        (t) =>
          t.id.toLowerCase().includes(searchLower) ||
          t.school_name.toLowerCase().includes(searchLower) ||
          t.custom_order_id.toLowerCase().includes(searchLower),
      )
    }

    if (date) {
      filteredData = filteredData.filter((t) => t.date === date)
    }

    // Calculate pagination
    const totalCount = filteredData.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      data: paginatedData,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

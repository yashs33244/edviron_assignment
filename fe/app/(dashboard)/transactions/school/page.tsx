"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTransactionsBySchool } from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Search } from "lucide-react"

export default function SchoolTransactionsPage() {
  const [schoolId, setSchoolId] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    search: "",
  })
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isSearching, setIsSearching] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["school-transactions", schoolId, page, limit, filters],
    queryFn: async () => {
      if (!schoolId) return { data: { transactions: [], pagination: { total: 0, page: 1, pages: 1 } } }
      const apiFilters: any = { ...filters }
      if (filters.search) {
        apiFilters.search = filters.search
      }
      const response = await getTransactionsBySchool(schoolId, page, limit, apiFilters)
      return response.data
    },
    enabled: !!schoolId && isSearching,
  })

  const transactions = data?.transactions || []
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from) {
      setFilters({
        ...filters,
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
      })
    } else {
      setFilters({
        ...filters,
        startDate: "",
        endDate: "",
      })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (schoolId) {
      setIsSearching(true)
      refetch()
    }
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      search: "",
    })
    setDateRange(undefined)
    setPage(1)
  }

  const columns = [
    {
      accessorKey: "collect_id",
      header: "Transaction ID",
      cell: ({ row }: any) => {
        const id = row.getValue("collect_id")
        return <div className="font-medium">{id.substring(0, 8)}...</div>
      },
    },
    {
      accessorKey: "custom_order_id",
      header: "Order ID",
    },
    {
      accessorKey: "student_info.name",
      header: "Student Name",
      cell: ({ row }: any) => {
        const studentInfo = row.original.student_info
        return <div>{studentInfo?.name || "N/A"}</div>
      },
    },
    {
      accessorKey: "gateway",
      header: "Gateway",
    },
    {
      accessorKey: "order_amount",
      header: "Amount",
      cell: ({ row }: any) => {
        const amount = Number.parseFloat(row.getValue("order_amount"))
        return <div className="text-right">₹{amount.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return <StatusBadge status={row.getValue("status")} />
      },
    },
    {
      accessorKey: "payment_time",
      header: "Date",
      cell: ({ row }: any) => {
        const date = row.getValue("payment_time")
        if (!date) return <div>-</div>
        return <div>{new Date(date).toLocaleDateString()}</div>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Transactions</h1>
        <p className="text-muted-foreground">View transactions for a specific school</p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>School Selection</CardTitle>
          <CardDescription>Enter a school ID to view its transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="schoolId" className="sr-only">
                  School ID
                </Label>
                <Input
                  id="schoolId"
                  placeholder="Enter school ID"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="bg-muted text-white"
                  required
                />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isSearching && (
        <>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter transactions by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger id="status" className="bg-muted text-white">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        placeholder="Order ID, Student name..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="bg-muted text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit">Apply Filters</Button>
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button type="button" variant="outline" className="ml-auto" onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button type="button" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>School Transactions</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading transactions..."
                  : `Showing ${transactions.length} of ${pagination.total} transactions for school ID: ${schoolId}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <p>Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24">
                  <p>No transactions found for this school.</p>
                  <p className="text-sm text-muted-foreground">Try a different school ID or adjust your filters</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={transactions}
                  pagination={{
                    pageCount: pagination.pages,
                    page,
                    onPageChange: setPage,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

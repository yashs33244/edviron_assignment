"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for schools
const schools = [
  { id: "1", name: "Lincoln High School" },
  { id: "2", name: "Washington Elementary" },
  { id: "3", name: "Jefferson Middle School" },
  { id: "4", name: "Roosevelt Academy" },
  { id: "5", name: "Kennedy High School" },
]

// Mock data for transactions
const mockTransactions = Array.from({ length: 50 }).map((_, i) => ({
  id: `TR-${1000 + i}`,
  school_id: schools[Math.floor(Math.random() * schools.length)].id,
  school_name: schools[Math.floor(Math.random() * schools.length)].name,
  amount: `$${(Math.random() * 2000 + 100).toFixed(2)}`,
  status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)],
  date: format(new Date(new Date().getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  custom_order_id: `ORDER-${2000 + i}`,
}))

// Mock API function to fetch transactions
const fetchTransactions = async (page: number, pageSize: number, filters: any) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredData = [...mockTransactions]

  // Apply filters
  if (filters.school_id) {
    filteredData = filteredData.filter((t) => t.school_id === filters.school_id)
  }

  if (filters.status && filters.status.length > 0) {
    filteredData = filteredData.filter((t) => filters.status.includes(t.status))
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredData = filteredData.filter(
      (t) =>
        t.id.toLowerCase().includes(searchLower) ||
        t.school_name.toLowerCase().includes(searchLower) ||
        t.custom_order_id.toLowerCase().includes(searchLower),
    )
  }

  if (filters.date) {
    filteredData = filteredData.filter((t) => t.date === filters.date)
  }

  // Calculate pagination
  const totalCount = filteredData.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)

  return {
    data: paginatedData,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      pageSize,
    },
  }
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState({
    school_id: "",
    status: [],
    search: "",
    date: "",
  })

  // Use TanStack Query to fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", page, pageSize, filters],
    queryFn: () => fetchTransactions(page, pageSize, filters),
  })

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (data && page < data.meta.totalPages) {
      setPage(page + 1)
    }
  }

  // Handle filter changes
  const handleSchoolChange = (value: string) => {
    setFilters({ ...filters, school_id: value })
    setPage(1) // Reset to first page when filter changes
  }

  const handleStatusChange = (value: string[]) => {
    setFilters({ ...filters, status: value })
    setPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
    setPage(1)
  }

  const handleDateChange = (date: Date | undefined) => {
    setFilters({
      ...filters,
      date: date ? format(date, "yyyy-MM-dd") : "",
    })
    setPage(1)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions Overview</CardTitle>
          <CardDescription>View and manage all school payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="w-full md:w-[200px]">
                <Select value={filters.school_id} onValueChange={handleSchoolChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Schools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Schools</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[150px]">
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes("completed")}
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...filters.status, "completed"]
                        : filters.status.filter((s) => s !== "completed")
                      handleStatusChange(newStatus)
                    }}
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes("pending")}
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...filters.status, "pending"]
                        : filters.status.filter((s) => s !== "pending")
                      handleStatusChange(newStatus)
                    }}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes("failed")}
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...filters.status, "failed"]
                        : filters.status.filter((s) => s !== "failed")
                      handleStatusChange(newStatus)
                    }}
                  >
                    Failed
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-[180px] justify-start text-left font-normal",
                      !filters.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date ? filters.date : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.date ? new Date(filters.date) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Error loading data</h3>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.school_name}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                            className={transaction.status === "completed" ? "bg-primary text-primary-foreground" : ""}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.custom_order_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, data?.meta.totalCount || 0)}</span> of{" "}
                  <span className="font-medium">{data?.meta.totalCount}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!data || page >= data.meta.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

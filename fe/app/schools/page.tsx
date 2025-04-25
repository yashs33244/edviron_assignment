"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Mock data for schools
const mockSchools = [
  {
    id: "1",
    name: "Lincoln High School",
    total_transactions: 245,
    total_amount: "$125,750.00",
    active_students: 1250,
    last_transaction: "2023-04-15",
  },
  {
    id: "2",
    name: "Washington Elementary",
    total_transactions: 186,
    total_amount: "$98,450.00",
    active_students: 850,
    last_transaction: "2023-04-14",
  },
  {
    id: "3",
    name: "Jefferson Middle School",
    total_transactions: 132,
    total_amount: "$76,200.00",
    active_students: 620,
    last_transaction: "2023-04-13",
  },
  {
    id: "4",
    name: "Roosevelt Academy",
    total_transactions: 97,
    total_amount: "$54,300.00",
    active_students: 450,
    last_transaction: "2023-04-12",
  },
  {
    id: "5",
    name: "Kennedy High School",
    total_transactions: 65,
    total_amount: "$32,150.00",
    active_students: 320,
    last_transaction: "2023-04-11",
  },
  {
    id: "6",
    name: "Adams Elementary",
    total_transactions: 54,
    total_amount: "$28,750.00",
    active_students: 280,
    last_transaction: "2023-04-10",
  },
  {
    id: "7",
    name: "Madison Middle School",
    total_transactions: 43,
    total_amount: "$21,500.00",
    active_students: 210,
    last_transaction: "2023-04-09",
  },
  {
    id: "8",
    name: "Monroe Academy",
    total_transactions: 32,
    total_amount: "$16,000.00",
    active_students: 150,
    last_transaction: "2023-04-08",
  },
]

// Mock API function to fetch schools
const fetchSchools = async (search: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredData = [...mockSchools]

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredData = filteredData.filter((school) => school.name.toLowerCase().includes(searchLower))
  }

  return filteredData
}

export default function SchoolsPage() {
  const [search, setSearch] = useState("")

  // Use TanStack Query to fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["schools", search],
    queryFn: () => fetchSchools(search),
  })

  // Calculate max transactions for progress bar
  const maxTransactions = Math.max(...(data?.map((school) => school.total_transactions) || [0]))

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schools</h2>
        <Button>Add School</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schools Overview</CardTitle>
          <CardDescription>View and manage all schools in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          ) : data?.length === 0 ? (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No schools found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Active Students</TableHead>
                    <TableHead>Last Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px]">
                            <Progress value={(school.total_transactions / maxTransactions) * 100} className="h-2" />
                          </div>
                          <span>{school.total_transactions}</span>
                        </div>
                      </TableCell>
                      <TableCell>{school.total_amount}</TableCell>
                      <TableCell>{school.active_students}</TableCell>
                      <TableCell>{school.last_transaction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

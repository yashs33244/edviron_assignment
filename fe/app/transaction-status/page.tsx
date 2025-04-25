"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Form schema
const formSchema = z.object({
  customOrderId: z.string().min(1, {
    message: "Custom order ID is required",
  }),
})

// Mock API function to fetch transaction status
const fetchTransactionStatus = async (customOrderId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data
  const statuses = ["completed", "pending", "failed"]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id: `TR-${Math.floor(Math.random() * 10000)}`,
    custom_order_id: customOrderId,
    school_name: ["Lincoln High School", "Washington Elementary", "Jefferson Middle School"][
      Math.floor(Math.random() * 3)
    ],
    amount: `$${(Math.random() * 2000 + 100).toFixed(2)}`,
    status: randomStatus,
    date: new Date().toISOString().split("T")[0],
  }
}

export default function TransactionStatusPage() {
  const [customOrderId, setCustomOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customOrderId: "",
    },
  })

  // Use TanStack Query to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["transactionStatus", customOrderId],
    queryFn: () => (customOrderId ? fetchTransactionStatus(customOrderId) : null),
    enabled: !!customOrderId,
  })

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    setCustomOrderId(values.customOrderId)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transaction Status Check</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Check Transaction Status</CardTitle>
            <CardDescription>Enter the custom order ID to check the status of a transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customOrderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Order ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter order ID..." className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Check Status
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>View the details of the transaction</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ) : isError ? (
              <div className="rounded-md bg-destructive/15 p-4">
                <div className="text-sm font-medium text-destructive">
                  Error: {(error as Error)?.message || "Failed to fetch transaction status"}
                </div>
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                    <p className="text-lg font-semibold">{data.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custom Order ID</p>
                    <p className="text-lg font-semibold">{data.custom_order_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">School</p>
                    <p className="text-lg font-semibold">{data.school_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">{data.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="text-lg font-semibold">{data.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        data.status === "completed" ? "default" : data.status === "pending" ? "outline" : "destructive"
                      }
                      className={data.status === "completed" ? "bg-primary text-primary-foreground mt-1" : "mt-1"}
                    >
                      {data.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">No transaction found</h3>
                  <p className="text-sm text-muted-foreground">Enter a custom order ID to check status</p>
                </div>
              </div>
            )}
          </CardContent>
          {data && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Receipt generated",
                    description: "Transaction receipt has been generated",
                  })
                }}
              >
                Generate Receipt
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentTransactions() {
  const transactions = [
    {
      id: "TR-1234",
      school: "Lincoln High School",
      amount: "$1,250.00",
      status: "completed",
      date: "2023-04-15",
    },
    {
      id: "TR-1235",
      school: "Washington Elementary",
      amount: "$750.00",
      status: "pending",
      date: "2023-04-14",
    },
    {
      id: "TR-1236",
      school: "Jefferson Middle School",
      amount: "$2,100.00",
      status: "completed",
      date: "2023-04-13",
    },
    {
      id: "TR-1237",
      school: "Roosevelt Academy",
      amount: "$950.00",
      status: "failed",
      date: "2023-04-12",
    },
    {
      id: "TR-1238",
      school: "Kennedy High School",
      amount: "$1,800.00",
      status: "completed",
      date: "2023-04-11",
    },
  ]

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={transaction.school} />
            <AvatarFallback>
              {transaction.school
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.school}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
          <div className="ml-auto font-medium">{transaction.amount}</div>
          <div className="ml-2">
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
          </div>
        </div>
      ))}
    </div>
  )
}

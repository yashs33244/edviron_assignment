import { Progress } from "@/components/ui/progress"

export function SchoolStats() {
  const schools = [
    {
      name: "Lincoln High School",
      transactions: 245,
      percentage: 85,
    },
    {
      name: "Washington Elementary",
      transactions: 186,
      percentage: 65,
    },
    {
      name: "Jefferson Middle School",
      transactions: 132,
      percentage: 45,
    },
    {
      name: "Roosevelt Academy",
      transactions: 97,
      percentage: 35,
    },
    {
      name: "Kennedy High School",
      transactions: 65,
      percentage: 25,
    },
  ]

  return (
    <div className="space-y-8">
      {schools.map((school) => (
        <div key={school.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{school.name}</p>
              <p className="text-sm text-muted-foreground">{school.transactions} transactions</p>
            </div>
            <div className="font-medium">{school.percentage}%</div>
          </div>
          <Progress value={school.percentage} className="h-2 bg-secondary" />
        </div>
      ))}
    </div>
  )
}

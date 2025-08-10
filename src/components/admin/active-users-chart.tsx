
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dailyData = [
  { date: "Mon", users: 123 },
  { date: "Tue", users: 154 },
  { date: "Wed", users: 137 },
  { date: "Thu", users: 186 },
  { date: "Fri", users: 165 },
  { date: "Sat", users: 140 },
  { date: "Sun", users: 192 },
]

const weeklyData = [
  { week: "Week 1", users: 890 },
  { week: "Week 2", users: 950 },
  { week: "Week 3", users: 1100 },
  { week: "Week 4", users: 1050 },
]

const monthlyData = [
  { month: "Jan", users: 3200 },
  { month: "Feb", users: 3800 },
  { month: "Mar", users: 4100 },
  { month: "Apr", users: 3900 },
  { month: "May", users: 4500 },
  { month: "Jun", users: 4300 },
]

const chartConfig = {
  users: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ActiveUsersChart() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        <CardDescription>
          Daily, weekly, and monthly active users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="pt-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={dailyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="weekly" className="pt-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={weeklyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="monthly" className="pt-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={monthlyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

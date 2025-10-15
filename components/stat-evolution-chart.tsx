"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface StatEvolutionChartProps {
  title: string
  data: Array<{ date: string; value: number }>
  color?: string
}

export function StatEvolutionChart({ title, data, color = "hsl(var(--primary))" }: StatEvolutionChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

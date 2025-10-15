import { cn } from "@/lib/utils"

interface StatBarProps {
  label: string
  value: number
  maxValue: number
  color?: string
  showValue?: boolean
  className?: string
}

export function StatBar({ label, value, maxValue, color = "bg-primary", showValue = true, className }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        {showValue && (
          <span className="text-muted-foreground">
            {value} / {maxValue}
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full transition-all duration-500 ease-out", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

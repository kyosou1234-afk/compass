import { cn } from '@/lib/utils'

export function ScoreRing({
  value,
  size = 84,
  label,
  className,
}: {
  value: number
  size?: number
  label?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  const tone =
    clamped >= 75
      ? 'text-primary'
      : clamped >= 50
        ? 'text-highlight'
        : 'text-destructive'

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="text-border"
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-700 ease-out', tone)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold leading-none">
          {clamped}
        </span>
        {label ? (
          <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function LevelBar({
  current,
  required,
}: {
  current: number
  required: number
}) {
  return (
    <div className="relative h-2 w-full rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
        style={{ width: `${Math.max(0, Math.min(100, current))}%` }}
      />
      <div
        className="absolute inset-y-[-3px] w-0.5 rounded bg-highlight"
        style={{ left: `calc(${Math.max(0, Math.min(100, required))}% - 1px)` }}
        title={`Target: ${required}`}
      />
    </div>
  )
}

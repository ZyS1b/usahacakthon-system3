export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const variants = {
    primary: 'bg-primary',
    success: 'bg-success',
    danger: 'bg-danger',
    muted: 'bg-muted',
  }

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${sizes[size]} rounded-full bg-white/5 overflow-hidden`}>
        <div
          className={`h-full rounded-full ${variants[variant]} ${animated ? 'transition-all duration-700 ease-smooth' : ''}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted mt-1 text-right tabular-nums">{Math.round(pct)}%</p>
      )}
    </div>
  )
}

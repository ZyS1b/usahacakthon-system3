export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-danger',
    muted: 'badge-muted',
    violet: 'badge-violet',
  }

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

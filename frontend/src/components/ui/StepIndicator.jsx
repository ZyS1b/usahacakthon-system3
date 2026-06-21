import { motion } from 'framer-motion'

export default function StepIndicator({ steps, current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full transition-all duration-500"
          style={{
            width: i === current ? '28px' : '8px',
            background: i <= current
              ? 'linear-gradient(90deg, #007AFF, #5856D6)'
              : 'rgba(0,0,0,0.08)',
          }}
        />
      ))}
    </div>
  )
}

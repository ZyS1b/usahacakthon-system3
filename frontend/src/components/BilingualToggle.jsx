import { motion } from 'framer-motion'

export default function BilingualToggle({ language, onChange }) {
  const isFil = language === 'fil'

  return (
    <button
      type="button"
      onClick={() => onChange(isFil ? 'en' : 'fil')}
      className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-200 focus:outline-none"
      style={{
        background: 'rgba(0,0,0,0.04)',
        minWidth: '72px',
        minHeight: '34px',
      }}
      aria-label={`Switch to ${isFil ? 'English' : 'Filipino'}`}
    >
      {/* Sliding indicator */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute rounded-full bg-white shadow-sm"
        style={{
          width: 'calc(50% - 2px)',
          height: 'calc(100% - 4px)',
          top: '2px',
          left: isFil ? 'calc(50% + 1px)' : '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      />

      <span
        className="relative z-10 text-[11px] font-bold transition-colors duration-200"
        style={{
          width: '32px',
          textAlign: 'center',
          color: isFil ? '#86868B' : '#1D1D1F',
        }}
      >
        EN
      </span>
      <span
        className="relative z-10 text-[11px] font-bold transition-colors duration-200"
        style={{
          width: '32px',
          textAlign: 'center',
          color: isFil ? '#1D1D1F' : '#86868B',
        }}
      >
        FIL
      </span>
    </button>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ReasoningTrace({ trace }) {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [expanded, setExpanded] = useState(false)

  if (!trace?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="card overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 sm:p-6 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain size={18} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-ink text-base">
              {fil ? 'Paano namin ito kinakalkula' : 'How We Calculated This'}
            </p>
            <p className="text-xs text-secondary">
              {fil ? 'Tingnan ang aming pagsusuri' : 'View our analysis'}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 space-y-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {trace.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.02)' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5"
                    style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

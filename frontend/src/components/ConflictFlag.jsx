import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ConflictFlag({ conflict }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="card p-5 sm:p-6"
      style={{ borderLeft: '4px solid #FF9500' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink text-sm mb-1">
            {conflict.title || (fil ? 'Posibleng Salungatan' : 'Potential Conflict')}
          </p>
          <p className="text-sm text-secondary leading-relaxed">
            {conflict.description || conflict.message || conflict}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

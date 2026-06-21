import { motion } from 'framer-motion'
import { MapPin, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PathToEligibility({ recommendedPath }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  if (!recommendedPath?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="card p-6 sm:p-7"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
          <MapPin size={18} className="text-violet" />
        </div>
        <div>
          <p className="font-bold text-ink text-base">
            {fil ? 'Inirerekomendang Daan' : 'Recommended Path'}
          </p>
          <p className="text-xs text-secondary">
            {fil ? 'Mga hakbang para maging karapat-dapat' : 'Steps to become eligible'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendedPath.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ background: 'rgba(88,86,214,0.1)', color: '#5856D6' }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-secondary leading-relaxed">{step}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { FileText, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function DocumentChecklist({ documents }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  if (!documents?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="card p-6 sm:p-7"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-bold text-ink text-base">
            {fil ? 'Mga Dokumentong Kailangan' : 'Documents You May Need'}
          </p>
          <p className="text-xs text-secondary">
            {fil ? 'Ihanda ang mga ito para sa aplikasyon' : 'Prepare these for your application'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.02)' }}
          >
            <CheckCircle size={14} className="text-success flex-shrink-0" />
            <span className="text-sm text-secondary leading-relaxed">{doc}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

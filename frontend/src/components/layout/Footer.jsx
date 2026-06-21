import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const { language } = useLanguage()
  const fil = language === 'fil'

  return (
    <footer className="py-12 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(15,23,42,0.06)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-sm"
            >
              <span className="text-white font-black text-xs">T</span>
            </div>
            <div>
              <span className="text-sm font-bold text-ink">TulongAI</span>
              <p className="text-xs text-secondary">Eligibility Checker</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary">
            <span>{fil ? 'Gawa gamit ang' : 'Made with'}</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={12} className="text-red-400 fill-red-400" />
            </motion.div>
            <span>{fil ? 'para sa Pilipinas' : 'for the Philippines'}</span>
          </div>

          <p className="text-xs text-secondary text-center">
            {fil
              ? 'Libre at kumpidensyal. Hindi namin iniimbak ang iyong data.'
              : 'Free & confidential. We never store your personal data.'}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} TulongAI. {fil ? 'Lahat ng karapatan ay nakalaan.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">🇵🇭 {fil ? 'Para sa mga Pilipino' : 'Made for Filipino citizens'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

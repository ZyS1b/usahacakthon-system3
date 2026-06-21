import { motion } from 'framer-motion'
import { Heart, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function NGOFallback({ ngos }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  if (!ngos?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="card p-6 sm:p-7"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
          <Heart size={18} className="text-danger" />
        </div>
        <div>
          <p className="font-bold text-ink text-base">
            {fil ? 'Mga NGO na Maaaring Makatulong' : 'NGOs That Can Help'}
          </p>
          <p className="text-xs text-secondary">
            {fil ? 'Mga organisasyong handang tumulong' : 'Organizations ready to assist'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {ngos.map((ngo, i) => (
          <motion.div
            key={ngo.name || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.02)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ background: 'rgba(255,59,48,0.08)' }}
            >
              🤝
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-sm">{ngo.name}</p>
              {ngo.description && (
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">{ngo.description}</p>
              )}
              {ngo.contact && (
                <p className="text-xs text-primary mt-1.5 font-medium">{ngo.contact}</p>
              )}
            </div>
            {ngo.website && (
              <a
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-black/5 transition-colors"
                aria-label={`Visit ${ngo.name} website`}
              >
                <ExternalLink size={14} className="text-secondary" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

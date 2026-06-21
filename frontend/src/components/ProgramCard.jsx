import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const PROGRAM_META = {
  '4ps': { color: '#F59E0B', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', icon: '👨‍👩‍👧‍👦' },
  'philhealth': { color: '#10B981', bg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', icon: '❤️' },
  'tupad': { color: '#8B5CF6', bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', icon: '💼' },
  'sss': { color: '#2563EB', bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', icon: '🛡️' },
}

export default function ProgramCard({ program, index = 0 }) {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [expanded, setExpanded] = useState(false)

  const { program_id, program_name, eligible, confidence_score, reason, gaps, requirements, how_to_apply } = program

  const meta = PROGRAM_META[program_id?.toLowerCase()] || {
    color: '#64748B',
    bg: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
    icon: '📋',
  }

  const pct = confidence_score != null ? Math.round(confidence_score * 100) : null
  const hasDetails = (gaps?.length > 0) || (requirements?.length > 0) || how_to_apply

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card overflow-hidden"
    >
      {/* Card top */}
      <div className="p-5 sm:p-6" style={{ background: meta.bg }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.6)' }}
            >
              {meta.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color, opacity: 0.7 }}>
                {fil ? 'Programa' : 'Program'}
              </p>
              <h3 className="font-bold text-ink text-base leading-tight truncate">{program_name}</h3>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0">
            {eligible ? (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                <span className="text-[11px] font-bold" style={{ color: '#10B981' }}>
                  {fil ? 'Karapat-dapat' : 'Qualified'}
                </span>
              </div>
            ) : gaps?.length > 0 ? (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <AlertCircle size={12} style={{ color: '#F59E0B' }} />
                <span className="text-[11px] font-bold" style={{ color: '#F59E0B' }}>
                  {fil ? 'May Kondisyon' : 'Conditional'}
                </span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <XCircle size={12} style={{ color: '#EF4444' }} />
                <span className="text-[11px] font-bold" style={{ color: '#EF4444' }}>
                  {fil ? 'Hindi' : 'Not Eligible'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Score bar */}
        {pct != null && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium" style={{ color: meta.color, opacity: 0.7 }}>
                {fil ? 'Antas ng Pagiging Karapat-dapat' : 'Eligibility Score'}
              </span>
              <span className="text-sm font-black" style={{ color: meta.color }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: pct + '%' }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: meta.color }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Reason */}
      {reason && (
        <div className="px-5 sm:px-6 py-4" style={{ borderBottom: hasDetails ? '1px solid rgba(15,23,42,0.06)' : 'none' }}>
          <p className="text-sm text-secondary leading-relaxed">{reason}</p>
        </div>
      )}

      {/* Expandable details */}
      {hasDetails && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 sm:px-6 py-3 text-sm font-semibold text-secondary hover:text-ink transition-colors focus:outline-none"
          >
            <span>
              {expanded
                ? (fil ? 'Itago' : 'Hide Details')
                : (fil ? 'Tingnan ang Detalye' : 'View Details')}
            </span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-5 space-y-4" style={{ borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                  {gaps?.length > 0 && (
                    <div className="pt-4">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                        {fil ? 'Mga Kailangan' : 'Requirements to Qualify'}
                      </p>
                      <ul className="space-y-2">
                        {gaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <AlertCircle size={13} className="text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-secondary leading-relaxed">{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {requirements?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                        {fil ? 'Mga Dokumento' : 'Documents Needed'}
                      </p>
                      <ul className="space-y-1.5">
                        {requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 flex-shrink-0 mt-2" />
                            <span className="text-sm text-secondary">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {how_to_apply && (
                    <div
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.06)' }}
                    >
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                        {fil ? 'Paano Mag-apply' : 'How to Apply'}
                      </p>
                      <p className="text-sm text-secondary leading-relaxed">{how_to_apply}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

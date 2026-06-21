import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Info, Sparkles } from 'lucide-react'
import ProgramCard from '../components/ProgramCard'
import ConflictFlag from '../components/ConflictFlag'
import DocumentChecklist from '../components/DocumentChecklist'
import NGOFallback from '../components/NGOFallback'
import PathToEligibility from '../components/PathToEligibility'
import ReasoningTrace from '../components/ReasoningTrace'
import { useLanguage } from '../context/LanguageContext'

const DISCLAIMER_EN = 'Results are based on your answers. For official confirmation, contact your local government office.'
const DISCLAIMER_FIL = 'Ang mga resulta ay batay sa iyong mga sagot. Para sa opisyal na kumpirmasyon, makipag-ugnayan sa iyong lokal na opisina.'

export default function Results({ data, form, onBack }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  if (!data) return null

  const { programs = [], conflicts = [], reasoning_trace, recommended_path, documents_needed, explanation } = data
  const eligibleCount = programs.filter((p) => p.eligible).length
  const totalCount = programs.length
  const hasEligible = eligibleCount > 0

  const allNgos = []
  const seenNgos = new Set()
  for (const program of programs) {
    if (!program.eligible && program.ngo_alternatives) {
      for (const ngo of program.ngo_alternatives) {
        if (!seenNgos.has(ngo.name)) {
          seenNgos.add(ngo.name)
          allNgos.push(ngo)
        }
      }
    }
  }

  const summaryText = hasEligible
    ? (fil
        ? 'Karapat-dapat ka sa ' + eligibleCount + ' sa ' + totalCount + ' programa.'
        : 'You qualify for ' + eligibleCount + ' out of ' + totalCount + ' programs checked.')
    : (fil
        ? 'Hindi ka karapat-dapat sa mga programa ngayon, ngunit may iba pang tulong.'
        : "You don't qualify right now, but other help is available.")

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-ink transition-colors min-h-[44px] mb-8 focus:outline-none"
        >
          <ArrowLeft size={16} />
          {fil ? 'Bagong Pagsusuri' : 'New Check'}
        </motion.button>

        {/* Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div
            className="rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{
              background: hasEligible
                ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 60%, #6EE7B7 100%)'
                : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
              boxShadow: hasEligible
                ? '0 4px 6px rgba(16,185,129,0.15), 0 2px 4px rgba(16,185,129,0.1)'
                : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.55)' }}
              >
                {hasEligible
                  ? <Trophy size={26} style={{ color: '#10B981' }} />
                  : <Info size={26} className="text-secondary" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className="font-black text-ink mb-2 tracking-tight"
                  style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', letterSpacing: '-0.02em' }}
                >
                  {hasEligible
                    ? (fil ? 'Magandang Balita!' : 'Great News!')
                    : (fil ? 'Tapos na ang Pagsusuri' : 'Assessment Complete')}
                </h1>
                <p className="text-secondary text-sm sm:text-base leading-relaxed">{summaryText}</p>
                {totalCount > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {Array.from({ length: totalCount }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: i < eligibleCount ? '24px' : '12px',
                          background: i < eligibleCount ? '#10B981' : 'rgba(15,23,42,0.15)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Explanation */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="card p-5 sm:p-6 mb-6"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.1)' }}
              >
                <Sparkles size={14} style={{ color: '#F59E0B' }} />
              </div>
              <p className="text-sm font-bold text-ink">
                {fil ? 'Buod ng Pagsusuri' : 'Assessment Summary'}
              </p>
            </div>
            <p className="text-sm text-secondary leading-relaxed">{explanation}</p>
          </motion.div>
        )}

        {/* Recommended Path */}
        {recommended_path && recommended_path.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <PathToEligibility recommendedPath={recommended_path} language={language} />
          </motion.div>
        )}

        {/* Programs */}
        {programs.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <p className="eyebrow">{fil ? 'Mga Programa' : 'Programs'}</p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}
              >
                {programs.length}
              </span>
            </div>
            <div className="space-y-4">
              {programs.map((program, i) => (
                <ProgramCard key={program.program_id} program={program} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Conflicts */}
        {conflicts && conflicts.length > 0 && (
          <section className="mb-8">
            <p className="eyebrow mb-4">{fil ? 'Mga Salungatan' : 'Conflicts'}</p>
            <div className="space-y-3">
              {conflicts.map((conflict, i) => (
                <ConflictFlag key={i} conflict={conflict} />
              ))}
            </div>
          </section>
        )}

        {/* Documents & NGO & Reasoning */}
        <div className="space-y-5">
          {documents_needed && documents_needed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <DocumentChecklist documents={documents_needed} />
            </motion.div>
          )}

          {allNgos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <NGOFallback ngos={allNgos} />
            </motion.div>
          )}

          {reasoning_trace && reasoning_trace.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ReasoningTrace trace={reasoning_trace} />
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <button onClick={onBack} className="btn-secondary inline-flex px-8">
            <ArrowLeft size={16} />
            {fil ? 'Bagong Pagsusuri' : 'Start New Check'}
          </button>
          <p className="text-xs text-secondary mt-5 max-w-sm mx-auto leading-relaxed">
            {fil ? DISCLAIMER_FIL : DISCLAIMER_EN}
          </p>
        </div>
      </div>
    </div>
  )
}

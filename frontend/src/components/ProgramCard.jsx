import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ClipboardList,
  FileCheck2, MapPin, ExternalLink, ShieldCheck
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const PROGRAM_META = {
  '4ps': { color: '#D97706', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', icon: '👨‍👩‍👧‍👦', agency: 'DSWD' },
  'philhealth': { color: '#059669', bg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', icon: '❤️', agency: 'PhilHealth' },
  'tupad': { color: '#7C3AED', bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', icon: '💼', agency: 'DOLE' },
  'sss': { color: '#1D4ED8', bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', icon: '🛡️', agency: 'SSS' },
}

const DEFAULT_DOCS = {
  '4ps': ['Valid government ID', 'Barangay certificate or proof of residence', 'Birth certificates of children', 'School enrollment or attendance proof'],
  'philhealth': ['Valid government ID', 'PhilHealth Member Registration Form', 'Proof of income or indigency certificate when applicable'],
  'tupad': ['Valid government ID', 'Barangay certification', 'Proof of displacement, informal work, or underemployment'],
  'sss': ['Valid government ID', 'SSS number or E-1/E-4 record', 'Employment or contribution records when available'],
}

const DEFAULT_STEPS = {
  '4ps': ['Prepare household documents and child school records.', 'Visit your barangay or city/municipal social welfare office for assessment.', 'Ask for the official DSWD intake or validation schedule.'],
  'philhealth': ['Prepare a valid ID and member registration form.', 'Visit PhilHealth or a Local Health Insurance Office for verification.', 'Ask whether you qualify as direct, indirect, sponsored, or indigent member.'],
  'tupad': ['Prepare proof of displacement or informal work status.', 'Visit your barangay, PESO, or DOLE regional office.', 'Ask for current TUPAD availability and required orientation schedule.'],
  'sss': ['Confirm your SSS number and contribution history.', 'Prepare employment, separation, or contribution documents.', 'Visit an SSS branch or use My.SSS to verify benefits and claims.'],
}

function normalizeProgramId(program) {
  return String(program?.program_id || program?.id || program?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function ProgramCard({ program, index = 0 }) {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [expanded, setExpanded] = useState(index === 0)

  const normalizedId = normalizeProgramId(program)
  const metaKey = Object.keys(PROGRAM_META).find((key) => normalizedId.includes(key)) || normalizedId
  const meta = PROGRAM_META[metaKey] || {
    color: '#475569',
    bg: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
    icon: '📋',
    agency: program?.agency || 'Agency',
  }

  const programName = program?.program_name || program?.name || 'Government Program'
  const agency = program?.agency || meta.agency
  const eligible = Boolean(program?.eligible)
  const confidenceRaw = program?.confidence_score ?? program?.confidence
  const pct = confidenceRaw != null ? Math.round(Number(confidenceRaw) * 100) : null
  const reason = program?.reason || program?.description || program?.benefits || ''
  const gaps = Array.isArray(program?.gaps) ? program.gaps : []
  const nextSteps = Array.isArray(program?.next_steps) && program.next_steps.length > 0
    ? program.next_steps
    : (DEFAULT_STEPS[metaKey] || ['Confirm your situation with the official agency before applying.'])
  const documents = Array.isArray(program?.requirements) && program.requirements.length > 0
    ? program.requirements
    : (DEFAULT_DOCS[metaKey] || ['Valid government ID', 'Proof of residence', 'Documents that support your household, work, or income situation'])
  const office = program?.office
  const source = program?.source
  const benefits = program?.benefits

  const status = eligible
    ? { icon: CheckCircle2, label: fil ? 'May Qualify' : 'May Qualify', tone: '#059669', bg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.25)' }
    : gaps.length > 0
      ? { icon: AlertCircle, label: fil ? 'Needs Review' : 'Needs Review', tone: '#D97706', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.25)' }
      : { icon: XCircle, label: fil ? 'Not a clear match' : 'Not a clear match', tone: '#DC2626', bg: 'rgba(220,38,38,0.10)', border: 'rgba(220,38,38,0.22)' }
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card overflow-hidden border border-slate-200/80 shadow-lg shadow-slate-950/5"
    >
      <div className="p-5 sm:p-6" style={{ background: meta.bg }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-white/70 shadow-sm">
              {meta.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: meta.color, opacity: 0.85 }}>
                {agency}
              </p>
              <h3 className="font-black text-ink text-lg leading-tight">{programName}</h3>
              {benefits && <p className="mt-1 text-xs text-slate-700/80 line-clamp-2">{benefits}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: status.bg, borderColor: status.border }}>
              <StatusIcon size={13} style={{ color: status.tone }} />
              <span className="text-[11px] font-extrabold" style={{ color: status.tone }}>{status.label}</span>
            </div>
          </div>
        </div>

        {pct != null && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: meta.color, opacity: 0.75 }}>
                {fil ? 'Match Score' : 'Match Score'}
              </span>
              <span className="text-sm font-black" style={{ color: meta.color }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(8, Math.min(100, pct))}%` }}
                transition={{ delay: 0.25 + index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: meta.color }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <p className="text-sm text-secondary leading-relaxed">
          {reason || (eligible
            ? (fil ? 'Batay sa mga sagot mo, maaaring tugma ang programang ito. Kailangan pa ring i-verify ng opisyal na ahensya.' : 'Based on your answers, this program may be a match. Official agency verification is still required.')
            : (fil ? 'Hindi pa malinaw ang tugma para sa programang ito. Tingnan ang gaps at susunod na hakbang sa ibaba.' : 'This program is not yet a clear match. Review the gaps and next steps below.'))}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/40 transition-colors focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <ClipboardList size={15} />
          {expanded ? (fil ? 'Itago ang detalye' : 'Hide details') : (fil ? 'Tingnan ang detalye' : 'View details')}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={17} />
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
            <div className="px-5 sm:px-6 pb-6 pt-1 grid gap-4 md:grid-cols-2 border-t border-slate-100">
              {gaps.length > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 md:col-span-2">
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2">
                    {fil ? 'Ano ang kulang' : 'What may be missing'}
                  </p>
                  <ul className="space-y-2">
                    {gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 leading-relaxed">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                  <FileCheck2 size={14} className="text-blue-700" />
                  {fil ? 'Mga dokumento' : 'Documents to prepare'}
                </p>
                <ul className="space-y-2">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary leading-relaxed">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-blue-50 border border-blue-200/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black text-blue-800 uppercase tracking-wider mb-3">
                  <ShieldCheck size={14} />
                  {fil ? 'Susunod na hakbang' : 'Next steps'}
                </p>
                <ol className="space-y-2">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-[10px] font-black text-white">{i + 1}</span>
                      <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {(office || source) && (
                <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider">{fil ? 'Verification' : 'Official verification'}</p>
                      <p className="text-sm text-slate-700 mt-1">{office || agency}</p>
                    </div>
                  </div>
                  {source && (
                    <a href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800">
                      {fil ? 'Source' : 'Source'} <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

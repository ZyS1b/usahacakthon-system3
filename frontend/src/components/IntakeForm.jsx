import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Lock, Sparkles } from 'lucide-react'
import { checkEligibility } from '../utils/api'
import { useLanguage } from '../context/LanguageContext'

const STEPS = [
  {
    id: 'age',
    question: { en: 'How old are you?', fil: 'Ilang taon ka na?' },
    hint: { en: 'Enter your age in years', fil: 'Ilagay ang iyong edad' },
    type: 'number',
    field: 'age',
    min: 1, max: 120,
    placeholder: { en: '35', fil: '35' },
  },
  {
    id: 'income',
    question: { en: 'What is your monthly household income?', fil: 'Magkano ang buwanang kita ng inyong pamilya?' },
    hint: { en: 'Combined income of all household members (PHP)', fil: 'Pinagsama-samang kita ng lahat sa bahay (PHP)' },
    type: 'number',
    field: 'monthly_income',
    min: 0,
    placeholder: { en: '8000', fil: '8000' },
    prefix: '₱',
  },
  {
    id: 'household',
    question: { en: 'How many people live in your household?', fil: 'Ilang tao ang nakatira sa inyong tahanan?' },
    hint: { en: 'Include yourself and all dependents', fil: 'Isama ang iyong sarili at lahat ng dependyente' },
    type: 'number',
    field: 'household_size',
    min: 1, max: 30,
    placeholder: { en: '5', fil: '5' },
  },
  {
    id: 'employment',
    question: { en: 'What is your employment status?', fil: 'Ano ang iyong katayuan sa trabaho?' },
    type: 'options',
    field: 'employment_status',
    options: [
      { value: 'unemployed', label: { en: 'Unemployed', fil: 'Walang Trabaho' }, desc: { en: 'Currently looking for work', fil: 'Naghahanap ng trabaho' } },
      { value: 'informal', label: { en: 'Informal Worker', fil: 'Impormal na Manggagawa' }, desc: { en: 'Vendor, driver, freelancer', fil: 'Tindera, driver, freelancer' } },
      { value: 'employed', label: { en: 'Formally Employed', fil: 'May Regular na Trabaho' }, desc: { en: 'With employer and payslip', fil: 'May employer at payslip' } },
      { value: 'self_employed', label: { en: 'Self-Employed', fil: 'Sariling Negosyo' }, desc: { en: 'Business owner', fil: 'May sariling negosyo' } },
    ],
  },
  {
    id: 'location',
    question: { en: 'Where do you live?', fil: 'Saan ka nakatira?' },
    type: 'options',
    field: 'location_type',
    options: [
      { value: 'urban', label: { en: 'Urban / City', fil: 'Lungsod / Siyudad' }, desc: { en: 'City or highly urbanized area', fil: 'Lungsod o mataong lugar' } },
      { value: 'rural', label: { en: 'Rural / Province', fil: 'Probinsya / Lalawigan' }, desc: { en: 'Rural or agricultural area', fil: 'Bukid o probinsya' } },
    ],
  },
]

export default function IntakeForm({ onResults, onBack }) {
  const { language } = useLanguage()
  const fil = language === 'fil'

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    age: '',
    monthly_income: '',
    household_size: '',
    employment_status: '',
    location_type: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[step]
  const totalSteps = STEPS.length
  const isLast = step === totalSteps - 1
  const progress = ((step) / totalSteps) * 100

  const isStepValid = () => {
    const val = form[currentStep.field]
    if (!val && val !== 0) return false
    if (currentStep.type === 'number') {
      const n = Number(val)
      if (isNaN(n)) return false
      if (currentStep.min !== undefined && n < currentStep.min) return false
      if (currentStep.max !== undefined && n > currentStep.max) return false
    }
    return true
  }

  const handleNext = async () => {
    if (!isStepValid()) return
    if (!isLast) {
      setStep((s) => s + 1)
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        age: Number(form.age),
        monthly_income: Number(form.monthly_income),
        household_size: Number(form.household_size),
        employment_status: form.employment_status,
        location_type: form.location_type,
        language,
      }
      const data = await checkEligibility(payload)
      onResults(data, { ...payload, language })
    } catch (err) {
      setError(fil ? 'May nangyaring mali. Subukan muli.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 0) onBack()
    else setStep((s) => s - 1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isStepValid()) handleNext()
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-black/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6]"
          initial={{ width: 0 }}
          animate={{ width: progress + '%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12">
        <div className="w-full max-w-lg">

          {/* Step counter */}
          <motion.div
            key={'counter-' + step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-10"
          >
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/5 focus:outline-none active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="text-secondary" />
            </button>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === step ? '28px' : '8px',
                    background: i <= step
                      ? 'linear-gradient(90deg, #007AFF, #5856D6)'
                      : 'rgba(0,0,0,0.08)',
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-secondary ml-auto">
              {step + 1} / {totalSteps}
            </span>
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2
                className="font-black text-ink mb-3 tracking-tight"
                style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                {currentStep.question[language] || currentStep.question.en}
              </h2>
              {currentStep.hint && (
                <p className="text-secondary text-base sm:text-lg mb-8 leading-relaxed">
                  {currentStep.hint[language] || currentStep.hint.en}
                </p>
              )}

              {/* Number input */}
              {currentStep.type === 'number' && (
                <div className="relative mb-6">
                  {currentStep.prefix && (
                    <span
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold pointer-events-none"
                      style={{ color: 'rgba(0,0,0,0.25)' }}
                    >
                      {currentStep.prefix}
                    </span>
                  )}
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form[currentStep.field]}
                    onChange={(e) => setForm((f) => ({ ...f, [currentStep.field]: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStep.placeholder?.[language] || ''}
                    min={currentStep.min}
                    max={currentStep.max}
                    className="input-apple"
                    style={{ paddingLeft: currentStep.prefix ? '48px' : '20px' }}
                    autoFocus
                    aria-label={currentStep.question[language] || currentStep.question.en}
                  />
                </div>
              )}

              {/* Options */}
              {currentStep.type === 'options' && (
                <div className="space-y-3 mb-6" role="radiogroup">
                  {currentStep.options.map((opt) => {
                    const selected = form[currentStep.field] === opt.value
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setForm((f) => ({ ...f, [currentStep.field]: opt.value }))}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 focus:outline-none"
                        style={{
                          background: selected ? 'rgba(0,122,255,0.06)' : 'rgba(255,255,255,0.9)',
                          border: selected
                            ? '1.5px solid rgba(0,122,255,0.3)'
                            : '1.5px solid rgba(0,0,0,0.06)',
                          boxShadow: selected
                            ? '0 0 0 4px rgba(0,122,255,0.08), 0 1px 3px rgba(0,0,0,0.04)'
                            : '0 1px 2px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-semibold text-base sm:text-lg"
                            style={{ color: selected ? '#007AFF' : '#1D1D1F' }}
                          >
                            {opt.label[language] || opt.label.en}
                          </p>
                          {opt.desc && (
                            <p className="text-sm text-secondary mt-1">
                              {opt.desc[language] || opt.desc.en}
                            </p>
                          )}
                        </div>
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={{
                            borderColor: selected ? '#007AFF' : 'rgba(0,0,0,0.15)',
                            background: selected ? '#007AFF' : 'transparent',
                          }}
                        >
                          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl text-sm font-medium"
                  style={{ background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', color: '#FF3B30' }}
                >
                  {error}
                </motion.div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="btn-primary w-full text-[17px] min-h-[56px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {fil ? 'Sinusuri...' : 'Checking...'}
                  </>
                ) : isLast ? (
                  <>
                    {fil ? 'Tingnan ang Resulta' : 'See My Results'}
                    <ArrowRight size={20} />
                  </>
                ) : (
                  <>
                    {fil ? 'Magpatuloy' : 'Continue'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Lock size={13} className="text-secondary" />
                <p className="text-xs text-secondary font-medium">
                  {fil ? 'Ligtas at kumpidensyal' : 'Secure and confidential'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

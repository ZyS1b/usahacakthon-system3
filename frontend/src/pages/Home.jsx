import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Shield, Zap, Users, CheckCircle, Sparkles,
  ChevronRight, Heart, Globe, Clock, BarChart3, Star,
  Quote, Award, TrendingUp, Activity
} from 'lucide-react'
import IntakeForm from '../components/IntakeForm'
import { useLanguage } from '../context/LanguageContext'

const TRUST_FEATURES = [
  { icon: Shield, en: 'Secure & Private', fil: 'Ligtas at Pribado' },
  { icon: Zap, en: 'Instant Results', fil: 'Agad na Resulta' },
  { icon: Users, en: 'No Signup Required', fil: 'Hindi Kailangan ng Signup' },
  { icon: CheckCircle, en: 'Made for Filipinos', fil: 'Para sa mga Pilipino' },
]

const PROGRAMS = [
  { icon: '👨‍👩‍👧‍👦', name: '4Ps', desc: 'Pantawid Pamilyang Pilipino', color: '#FF9500', bg: 'rgba(255,149,0,0.1)', gradient: 'from-amber-500 to-orange-500' },
  { icon: '❤️', name: 'PhilHealth', desc: 'Health Insurance', color: '#34C759', bg: 'rgba(52,199,89,0.1)', gradient: 'from-emerald-500 to-green-500' },
  { icon: '💼', name: 'TUPAD', desc: 'Emergency Employment', color: '#5856D6', bg: 'rgba(88,86,214,0.1)', gradient: 'from-violet-500 to-purple-500' },
  { icon: '🛡️', name: 'SSS', desc: 'Social Security', color: '#007AFF', bg: 'rgba(0,122,255,0.1)', gradient: 'from-blue-500 to-indigo-500' },
]

const FEATURES = [
  {
    icon: Zap,
    title: { en: 'AI-Powered Analysis', fil: 'Pagsusuri gamit ang AI' },
    desc: { en: 'Get instant eligibility results across major Philippine social programs in seconds.', fil: 'Alamin agad ang iyong kwalipikasyon sa mga pangunahing programa ng gobyerno.' },
    color: '#007AFF',
    stats: '< 30s',
    statLabel: { en: 'Average time', fil: 'Karaniwang oras' },
  },
  {
    icon: Users,
    title: { en: 'NGO Referrals', fil: 'Tulong mula sa NGO' },
    desc: { en: 'Automatically matched with community organizations when government programs are unavailable.', fil: 'Awtomatikong referral sa mga organisasyon ng komunidad.' },
    color: '#5856D6',
    stats: '500+',
    statLabel: { en: 'Partner NGOs', fil: 'Katuwang na NGO' },
  },
  {
    icon: Shield,
    title: { en: '100% Confidential', fil: '100% Kumpidensyal' },
    desc: { en: 'Your data is never stored. Results are private, secure, and deleted after your session.', fil: 'Hindi namin iniimbak ang iyong data. Ligtas at pribado ang lahat.' },
    color: '#34C759',
    stats: 'Zero',
    statLabel: { en: 'Data stored', fil: 'Data na iniimbak' },
  },
]

const TESTIMONIALS = [
  {
    quote: { en: 'I found out I was eligible for 4Ps and PhilHealth in just 20 seconds. This is amazing!', fil: 'Nalaman kong kwalipikado ako sa 4Ps at PhilHealth sa loob lang ng 20 segundo. Ang galing!' },
    author: 'Maria S.',
    role: { en: 'Beneficiary', fil: 'Benepisyaryo' },
    rating: 5,
  },
  {
    quote: { en: 'The NGO referral feature connected me with a local organization that helped my family.', fil: 'Ang NGO referral ay nag-ugnay sa akin sa isang organisasyon na tumulong sa aking pamilya.' },
    author: 'Juan D.',
    role: { en: 'Community Member', fil: 'Miyembro ng Komunidad' },
    rating: 5,
  },
  {
    quote: { en: 'Simple, fast, and private. Exactly what we need for social services in the Philippines.', fil: 'Simple, mabilis, at pribado. Eksakto sa kailangan natin para sa serbisyong panlipunan sa Pilipinas.' },
    author: 'Ana L.',
    role: { en: 'Social Worker', fil: 'Social Worker' },
    rating: 5,
  },
]

const STATS = [
  { icon: Activity, value: '10K+', label: { en: 'Eligibility Checks', fil: 'Pagsusuri ng Eligibilidad' } },
  { icon: Heart, value: '98%', label: { en: 'Satisfaction Rate', fil: 'Antas ng Kasiyahan' } },
  { icon: Globe, value: '4', label: { en: 'Government Programs', fil: 'Programa ng Gobyerno' } },
  { icon: Award, value: '100%', label: { en: 'Free Service', fil: 'Libreng Serbisyo' } },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            background: `rgba(0,122,255,${Math.random() * 0.08 + 0.02})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

function AnimatedCounter({ value, duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isNumber = !isNaN(parseInt(value))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isNumber) {
          const numValue = parseInt(value.replace(/[^0-9]/g, ''))
          let start = 0
          const increment = numValue / (duration * 60)
          const timer = setInterval(() => {
            start += increment
            if (start >= numValue) {
              setCount(numValue)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          return () => clearInterval(timer)
        } else if (entry.isIntersecting) {
          setCount(value)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration, isNumber])

  return <span ref={ref}>{isNumber ? count + (value.includes('+') ? '+' : value.includes('%') ? '%' : '') : value}</span>
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  )
}

export default function Home({ onResults, scrollTarget, onScrollTargetHandled }) {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('eligibility-scroll')
    return () => document.documentElement.classList.remove('eligibility-scroll')
  }, [])

  useEffect(() => {
    if (!scrollTarget) return
    setShowForm(false)

    const scrollToTarget = () => {
      if (scrollTarget === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(scrollTarget)
        if (el) {
          const navOffset = 64
          const top = el.getBoundingClientRect().top + window.scrollY - navOffset
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }
      onScrollTargetHandled?.()
    }

    const timer = window.setTimeout(scrollToTarget, 160)
    return () => window.clearTimeout(timer)
  }, [scrollTarget, onScrollTargetHandled])
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.92])
  const heroScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.99])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {showForm ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <IntakeForm onResults={onResults} onBack={() => setShowForm(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ════════════════════════════════════════ */}
          {/* HERO SECTION — Modern, Dynamic */}
          {/* ════════════════════════════════════════ */}
          <motion.section
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="snap-section relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden"
          >
            {/* Animated background */}
            <FloatingParticles />
            <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden="true" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-hero-glow pointer-events-none" aria-hidden="true" />

            {/* Gradient orb */}
            <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-violet-400/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
              {/* ── Pill Badge ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,122,255,0.08), rgba(88,86,214,0.08))',
                  border: '1px solid rgba(0,122,255,0.15)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={14} className="text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide">
                  {fil ? 'Libreng Serbisyo para sa Lahat' : 'Free for All Filipinos'}
                </span>
              </motion.div>

              {/* ── Headline ── */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-black tracking-tight text-ink leading-tight mb-6 text-balance mx-auto"
                style={{ fontSize: 'clamp(40px, 6vw, 76px)', letterSpacing: '-0.04em', lineHeight: 1.05, maxWidth: '900px' }}
              >
                {fil ? (
                  <span>
                    Hanapin ang{' '}
                    <span className="text-gradient-blue">Tulong</span>
                    {' '}na Tama Para sa Iyo
                  </span>
                ) : (
                  <span>
                    Find Government Benefits{' '}
                    <span className="text-gradient-blue">That Match</span>
                    {' '}Your Life
                  </span>
                )}
              </motion.h1>

              {/* ── Subtitle ── */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-secondary text-lg sm:text-xl leading-relaxed mb-10 mx-auto text-balance"
                style={{ maxWidth: '640px', lineHeight: 1.65 }}
              >
                {fil
                  ? 'Sagutin ang ilang tanong at agad na malaman kung anong mga programa ng gobyerno ang maaari mong makuha. Libre, mabilis, at pribado.'
                  : 'Answer a few questions and instantly discover which government programs and benefits are available to you. Free, fast, and private.'}
              </motion.p>

              {/* ── CTA Buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-[17px] px-10 min-h-[58px] group w-full sm:w-auto relative overflow-hidden ripple-effect"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {fil ? 'Simulan ang Pagsusuri' : 'Check My Eligibility'}
                    <ArrowRight size={20} className="transition-all duration-300 group-hover:translate-x-1.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 shimmer" />
                </motion.button>
                <motion.button
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="btn-secondary text-[17px] px-8 min-h-[58px] w-full sm:w-auto"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="flex items-center gap-2">
                    {fil ? 'Paano Ito Gumagana' : 'How It Works'}
                    <ChevronRight size={18} className="text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.button>
              </motion.div>

              {/* ── Trust Features ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-12"
              >
                {TRUST_FEATURES.map(({ icon: Icon, en, fil: filLabel }) => (
                  <motion.div
                    key={en}
                    className="flex items-center gap-2.5"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-secondary">{fil ? filLabel : en}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* ════════════════════════════════════════ */}
          {/* IMPACT SNAPSHOT SECTION */}
          {/* ════════════════════════════════════════ */}
          <section className="snap-section min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10 sm:py-12 flex items-center">
            <div className="max-w-6xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[2rem] border border-blue-900/10 bg-white/85 shadow-2xl shadow-blue-950/8 backdrop-blur-xl p-5 sm:p-7 lg:p-8 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(29,78,216,0.10),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(67,56,202,0.10),transparent_34%)] pointer-events-none" />
                <div className="relative z-10 grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-700/15 bg-blue-700/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                      <BarChart3 size={13} />
                      {fil ? 'Live Preview' : 'Eligibility Snapshot'}
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-ink leading-tight">
                      {fil ? 'Isang malinaw na dashboard pagkatapos ng pagsusuri.' : 'A clearer result screen after one guided check.'}
                    </h2>
                    <p className="mt-4 text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
                      {fil
                        ? 'Pinagsasama ng TulongAI ang mabilis na pagsusuri, plain-language reasoning, at practical next steps para hindi magtapos sa listahan lamang ang user.'
                        : 'TulongAI combines quick screening, plain-language reasoning, and practical next steps so the user receives more than a list of programs.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {STATS.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700/10 to-indigo-700/10 flex items-center justify-center">
                                <Icon size={18} className="text-blue-700" />
                              </div>
                              <div>
                                <p className="text-2xl font-black text-ink leading-none tracking-tight">
                                  <AnimatedCounter value={stat.value} />
                                </p>
                                <p className="text-xs sm:text-sm text-secondary font-medium mt-1">
                                  {stat.label[language] || stat.label.en}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md mx-auto w-full"
                    whileHover={{ y: -4 }}
                  >
                    <div className="card-glass p-5 sm:p-6 text-left relative overflow-hidden border border-white/70 shadow-xl shadow-blue-950/10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-bl-full" />
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-700/20">
                          <span className="text-white font-black text-xl">T</span>
                        </div>
                        <div>
                          <p className="font-bold text-ink text-lg tracking-tight">TulongAI</p>
                          <p className="text-sm text-secondary">Eligibility Checker</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {[
                          { label: fil ? 'Edad' : 'Age', value: '32', icon: Clock },
                          { label: fil ? 'Buwanang Kita' : 'Monthly Income', value: '₱12,000', icon: TrendingUp },
                          { label: fil ? 'Sambahayan' : 'Household', value: '5 miyembro', icon: Users },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80"
                            whileHover={{ backgroundColor: 'rgba(219,234,254,0.85)' }}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon size={14} className="text-secondary" />
                              <span className="text-sm text-secondary font-medium">{item.label}</span>
                            </div>
                            <span className="text-sm font-bold text-ink">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="p-4 rounded-2xl relative overflow-hidden bg-emerald-50 border border-emerald-200"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <CheckCircle size={18} className="text-emerald-600" />
                          </motion.div>
                          <div>
                            <p className="text-sm font-bold text-emerald-700">
                              {fil ? 'May qualify sa 2 programa' : 'May qualify for 2 programs'}
                            </p>
                            <p className="text-xs text-secondary mt-0.5">
                              {fil ? '4Ps at PhilHealth • I-verify sa ahensya' : '4Ps & PhilHealth • Verify with agency'}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {[fil ? 'Reasoning' : 'Reasoning', fil ? 'Docs' : 'Docs', fil ? 'Next step' : 'Next step'].map((label) => (
                          <div key={label} className="rounded-xl bg-white/70 border border-slate-200/70 px-2 py-2">
                            <p className="text-[11px] font-bold text-blue-700">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* FEATURES SECTION */}
          {/* ════════════════════════════════════════ */}
          <section id="how-it-works" className="snap-section min-h-[calc(100vh-64px)] py-24 px-4 sm:px-6 flex items-center scroll-mt-16" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center mb-16"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold tracking-wide mb-4"
                >
                  <Zap size={12} />
                  {fil ? 'Paano Ito Gumagana' : 'How It Works'}
                </motion.span>
                <h2
                  className="font-black text-ink mb-4 tracking-tight"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.03em' }}
                >
                  {fil ? 'Simple, Mabilis, at Ligtas' : 'Simple, Fast, and Secure'}
                </h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">
                  {fil
                    ? 'Sinusuri namin ang iyong eligibilidad sa mga pangunahing programa ng gobyerno sa ilang segundo lamang.'
                    : 'We check your eligibility across major government programs in seconds — no paperwork, no waiting.'}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {FEATURES.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="card-hover p-8 relative overflow-hidden group"
                    >
                      <div
                        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `${feature.color}08` }}
                      />
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: `${feature.color}12` }}
                      >
                        <Icon size={24} style={{ color: feature.color }} />
                      </div>
                      <h3 className="font-bold text-ink text-xl mb-3 tracking-tight">
                        {feature.title[language] || feature.title.en}
                      </h3>
                      <p className="text-secondary text-sm leading-relaxed mb-6">
                        {feature.desc[language] || feature.desc.en}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <span className="text-2xl font-black" style={{ color: feature.color }}>
                          {feature.stats}
                        </span>
                        <span className="text-xs text-secondary">
                          {feature.statLabel[language] || feature.statLabel.en}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* PROGRAMS SECTION */}
          {/* ════════════════════════════════════════ */}
          <section className="snap-section min-h-[calc(100vh-64px)] py-24 px-4 sm:px-6 relative overflow-hidden flex items-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center mb-16"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/5 border border-violet-500/10 text-violet-600 text-xs font-semibold tracking-wide mb-4"
                >
                  <BarChart3 size={12} />
                  {fil ? 'Mga Programa' : 'Programs We Check'}
                </motion.span>
                <h2
                  className="font-black text-ink mb-4 tracking-tight"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.03em' }}
                >
                  {fil ? 'Apat na Pangunahing Programa' : 'Four Major Programs'}
                </h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">
                  {fil
                    ? 'Sinusuri namin ang iyong eligibilidad sa mga pangunahing programa ng gobyerno.'
                    : 'We check your eligibility across the most impactful government assistance programs available.'}
                </p>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {PROGRAMS.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="card-hover p-8 text-center relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-b ${p.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: p.bg }}
                    >
                      {p.icon}
                    </div>
                    <h3 className="font-bold text-ink text-lg mb-2 tracking-tight">{p.name}</h3>
                    <p className="text-secondary text-sm">{p.desc}</p>
                    <motion.div
                      className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: p.bg, color: p.color }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>{Math.round(Math.random() * 40 + 55)}% Match</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-14 text-center"
              >
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-[17px] px-12 min-h-[56px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {fil ? 'Suriin ang Aking Eligibilidad' : 'Check My Eligibility'}
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* TESTIMONIALS SECTION */}
          {/* ════════════════════════════════════════ */}
          <section className="snap-section min-h-[calc(100vh-64px)] py-24 px-4 sm:px-6 flex items-center">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center mb-16"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-xs font-semibold tracking-wide mb-4"
                >
                  <Quote size={12} />
                  {fil ? 'Mga Testimonial' : 'Testimonials'}
                </motion.span>
                <h2
                  className="font-black text-ink mb-4 tracking-tight"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.03em' }}
                >
                  {fil ? 'Pinagkakatiwalaan ng Libo-libo' : 'Trusted by Thousands'}
                </h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">
                  {fil
                    ? 'Maraming Pilipino ang natulungan na naming mahanap ang tamang tulong.'
                    : 'Hear from fellow Filipinos who found the right benefits through TulongAI.'}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="card-hover p-6 relative"
                  >
                    <div className="absolute top-4 right-4 text-4xl text-gray-100 font-serif leading-none">"</div>
                    <StarRating rating={testimonial.rating} />
                    <p className="text-ink text-sm leading-relaxed mt-4 mb-6 relative z-10">
                      "{testimonial.quote[language] || testimonial.quote.en}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{testimonial.author}</p>
                        <p className="text-xs text-secondary">{testimonial.role[language] || testimonial.role.en}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* MISSION SECTION */}
          {/* ════════════════════════════════════════ */}
          <section id="mission" className="snap-section min-h-[calc(100vh-64px)] py-24 px-4 sm:px-6 flex items-center bg-slate-950 text-white scroll-mt-16">
            <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  {fil ? 'Misyon' : 'Mission'}
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {fil ? 'Gawing malinaw ang sistemang pampubliko.' : 'Turn confusing public systems into clear next steps.'}
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">
                  {fil
                    ? 'TulongAI ay ginawa para sa mga pamilyang kailangang maintindihan ang mga benepisyo nang mabilis, ligtas, at walang teknikal na jargon.'
                    : 'TulongAI helps Filipino families understand support programs through guided questions, plain-language reasoning, and practical next actions.'}
                </p>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: fil ? 'Hindi ito final decision' : 'No final decisions',
                    text: fil ? 'Gumagamit ito ng “may qualify” language at nire-refer pa rin ang user sa opisyal na ahensya.' : 'The app uses “may qualify” framing and still directs users to official agencies for verification.',
                  },
                  {
                    title: fil ? 'May reasoning trace' : 'Visible reasoning trace',
                    text: fil ? 'Ipinapakita kung bakit tugma o hindi tugma ang isang programa sa sitwasyon ng user.' : 'Users can see why a program may or may not match their household situation.',
                  },
                  {
                    title: fil ? 'Human-in-the-loop' : 'Human-in-the-loop',
                    text: fil ? 'Ang caseworker o opisyal pa rin ang dapat mag-verify ng dokumento at kasalukuyang patakaran.' : 'A caseworker or agency officer remains responsible for document checks and current policy interpretation.',
                  },
                  {
                    title: fil ? 'Walang dead end' : 'No dead ends',
                    text: fil ? 'Kapag hindi tugma ang programa, nagbibigay pa rin ito ng NGO o community-based next steps.' : 'When a program does not match, the user still receives NGO or community-based next steps.',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur"
                  >
                    <p className="text-base font-extrabold text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* FINAL CTA SECTION */}
          {/* ════════════════════════════════════════ */}
          <section className="snap-section min-h-[calc(100vh-64px)] py-24 px-4 sm:px-6 relative overflow-hidden flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2
                  className="font-black text-white mb-4 tracking-tight"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.03em' }}
                >
                  {fil
                    ? 'Handa nang Malaman ang Iyong Mga Benepisyo?'
                    : 'Ready to Discover Your Benefits?'}
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                  {fil
                    ? 'Walang kinakailangang dokumento. Walang kinakailangang pila. Simulan ang iyong pagsusuri ngayon.'
                    : 'No documents needed. No lines to wait in. Start your eligibility check right now.'}
                </p>
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-10 min-h-[58px] rounded-pill text-[17px] font-bold bg-white text-blue-600 shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {fil ? 'Simulan ang Pagsusuri' : 'Check Your Eligibility'}
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

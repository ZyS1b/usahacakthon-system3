import { motion } from 'framer-motion'
import { ShieldCheck, Route, Users, FileText, AlertTriangle, HandHeart } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const teamValues = [
  {
    icon: Route,
    title: { en: 'Clarity over directories', fil: 'Linaw, hindi listahan lang' },
    body: {
      en: 'TulongAI turns scattered program rules into a guided path: user situation, rule-based interpretation, explanation, documents, and next action.',
      fil: 'Ginagawang malinaw ng TulongAI ang hiwa-hiwalay na patakaran: sitwasyon, pagsusuri, paliwanag, dokumento, at susunod na hakbang.',
    },
  },
  {
    icon: ShieldCheck,
    title: { en: 'Responsible AI by design', fil: 'Responsableng AI mula disenyo' },
    body: {
      en: 'Results use “may qualify” language, visible reasoning, and source-minded guidance so users do not treat the tool as a final government decision.',
      fil: 'Ginagamit ang “maaaring kwalipikado” na wika, nakikitang paliwanag, at gabay na hindi pumapalit sa opisyal na desisyon.',
    },
  },
  {
    icon: HandHeart,
    title: { en: 'No dead ends', fil: 'Walang dead end' },
    body: {
      en: 'When a user does not match a program, the app still provides gap analysis, NGO referrals, and practical next steps.',
      fil: 'Kapag hindi tugma sa programa, nagbibigay pa rin ng gap analysis, NGO referral, at praktikal na susunod na hakbang.',
    },
  },
]

const users = [
  {
    name: 'Maria',
    role: { en: 'Caregiver under time pressure', fil: 'Tagapag-alaga na kapos sa oras' },
    text: { en: 'Needs to understand several benefits before school pickup.', fil: 'Kailangang maintindihan ang ilang benepisyo bago sunduin ang mga anak.' },
  },
  {
    name: 'Rodrigo',
    role: { en: 'Displaced worker', fil: 'Nawalan ng trabaho' },
    text: { en: 'Needs help translating contribution history and missing documents into action.', fil: 'Kailangan ng gabay sa kontribusyon, kulang na dokumento, at susunod na gagawin.' },
  },
  {
    name: 'Ana',
    role: { en: 'Frontline community worker', fil: 'Barangay health worker' },
    text: { en: 'Needs a consistent aid-navigation tool for many families.', fil: 'Kailangan ng maaasahang gabay para sa maraming pamilya.' },
  },
]

export default function About() {
  const { language } = useLanguage()
  const fil = language === 'fil'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="bg-[#F7FAFC]"
    >
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Users size={16} /> {fil ? 'Tungkol sa Proyekto' : 'About the project'}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              {fil ? 'TulongAI: gabay para sa benepisyo ng pamilyang Pilipino.' : 'TulongAI: a benefits guide built for Filipino families.'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {fil
                ? 'Isang AI-assisted decision-support tool na tumutulong sa tao na maintindihan kung aling programa ang maaaring akma, bakit iyon ang resulta, anong dokumento ang kailangan, at saan magsisimula.'
                : 'An AI-assisted decision-support tool that helps people understand which programs may fit, why the result appears, what documents are needed, and where to start.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {teamValues.map((item) => (
            <motion.article
              key={item.title.en}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <item.icon size={22} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-950">{fil ? item.title.fil : item.title.en}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{fil ? item.body.fil : item.body.en}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
            <FileText className="mb-5 text-blue-300" size={28} />
            <h2 className="text-2xl font-black">{fil ? 'Paano gumagana' : 'How it works'}</h2>
            <ol className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
              <li><strong>1.</strong> {fil ? 'Tinatanggap ang sitwasyon ng user sa simpleng wika.' : 'Accepts the user situation in plain language.'}</li>
              <li><strong>2.</strong> {fil ? 'Pinapadaan sa rules engine para sa 4Ps, PhilHealth, TUPAD, at SSS.' : 'Runs the details through a rules engine for 4Ps, PhilHealth, TUPAD, and SSS.'}</li>
              <li><strong>3.</strong> {fil ? 'Ipinapakita ang reasoning trace, gap analysis, dokumento, at referrals.' : 'Shows reasoning trace, gap analysis, documents, and referrals.'}</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <AlertTriangle className="mb-5 text-amber-600" size={28} />
            <h2 className="text-2xl font-black text-slate-950">{fil ? 'Human-in-the-loop' : 'Human-in-the-loop'}</h2>
            <p className="mt-4 leading-7 text-slate-700">
              {fil
                ? 'Hindi nagbibigay ang TulongAI ng pinal na eligibility decision. Ang opisyal na ahensya, social worker, o case officer pa rin ang dapat magdesisyon dahil kailangan nilang beripikahin ang dokumento, kasalukuyang patakaran, at lokal na sitwasyon.'
                : 'TulongAI does not make the final eligibility decision. The official agency, social worker, or case officer remains responsible because documents, current rules, and local context must still be verified.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-black text-slate-950">{fil ? 'Ginawa para sa totoong user' : 'Built around real users'}</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {users.map((user) => (
            <div key={user.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-black text-slate-950">{user.name}</p>
              <p className="mt-1 text-sm font-semibold text-blue-600">{fil ? user.role.fil : user.role.en}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{fil ? user.text.fil : user.text.en}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

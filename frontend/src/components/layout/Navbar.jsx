import { MessageCircle, ClipboardList, FileCheck, Globe, Menu, X, Route } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function Navbar({
  onStart,
  hasResults,
  onViewResults,
  currentView,
  onChatClick,
  onCheckEligibility,
  onHowItWorks,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const navItems = [
    { label: language === 'fil' ? 'AI Chat' : 'AI Chat', icon: MessageCircle, onClick: onChatClick, view: 'chat' },
    { label: language === 'fil' ? 'Eligibility' : 'Eligibility', icon: ClipboardList, onClick: onCheckEligibility, view: 'home' },
    { label: language === 'fil' ? 'How It Works' : 'How It Works', icon: Route, onClick: onHowItWorks, view: 'home-how' },
    ...(hasResults ? [{ label: t?.nav?.results || 'Results', icon: FileCheck, onClick: onViewResults, view: 'results' }] : []),
  ]

  const isActive = (item) => {
    if (item.view === 'home-how') return false
    return currentView === item.view
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-xl font-extrabold text-lg text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
          aria-label="Open TulongAI chat"
        >
          <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold shadow-sm">
            T
          </span>
          TulongAI
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive(item)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors"
            title="Switch language / Palitan ang wika"
          >
            <Globe size={16} />
            <span>{language === 'en' ? 'EN' : 'FIL'}</span>
          </button>
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick?.(); setMobileOpen(false) }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${isActive(item) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            <button onClick={toggleLanguage} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100">
              <Globe size={18} /> {language === 'en' ? 'English' : 'Filipino'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

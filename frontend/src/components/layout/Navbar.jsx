import { MessageCircle, ClipboardList, FileCheck, Globe } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Navbar({
  onStart,
  hasResults,
  onViewResults,
  currentView,
  onChatClick,
  onCheckEligibility,
}) {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-surface-glass border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onStart}
          className="flex items-center gap-2 font-extrabold text-lg text-primary"
        >
          <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold">
            T
          </span>
          TulongAI
        </button>

        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onChatClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'chat'
                ? 'bg-primary-light text-primary'
                : 'text-gray-600 hover:bg-black/5'
            }`}
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">{t?.nav?.chat || 'Chat'}</span>
          </button>

          <button
            onClick={onCheckEligibility}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-primary-light text-primary'
                : 'text-gray-600 hover:bg-black/5'
            }`}
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">{t?.nav?.checkEligibility || 'Check Eligibility'}</span>
          </button>

          {hasResults && (
            <button
              onClick={onViewResults}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'results'
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-600 hover:bg-black/5'
              }`}
            >
              <FileCheck size={16} />
              <span className="hidden sm:inline">{t?.nav?.results || 'Results'}</span>
            </button>
          )}

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-black/5 transition-colors"
            title="Switch language / Palitan ang wika"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'FIL'}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
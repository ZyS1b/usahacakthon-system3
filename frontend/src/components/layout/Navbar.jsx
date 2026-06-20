import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ClipboardList } from 'lucide-react'
import BilingualToggle from '../BilingualToggle'
import { useLanguage } from '../../context/LanguageContext'

export default function Navbar({ onStart, hasResults, onViewResults, currentView, onChatClick, onCheckEligibility }) {
  const { language, setLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const fil = language === 'fil'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isChat = currentView === 'chat'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="pointer-events-auto w-full max-w-5xl"
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl transition-all duration-300"
          style={{
            background: scrolled
              ? 'rgba(250,251,252,0.82)'
              : 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: scrolled
              ? '1px solid rgba(0,0,0,0.08)'
              : '1px solid rgba(0,0,0,0.06)',
            boxShadow: scrolled
              ? '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)'
              : '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          {/* Brand Logo — goes to chat */}
          <motion.button
            onClick={onChatClick || onStart}
            className="flex items-center gap-3 focus:outline-none group"
            aria-label="TulongAI home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105 group-active:scale-95"
            >
              <span className="text-white font-black text-base sm:text-lg leading-none">T</span>
            </div>
            <span className="font-bold text-base sm:text-lg text-ink tracking-tight">TulongAI</span>
          </motion.button>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <BilingualToggle language={language} onChange={setLanguage} />

            {/* Chat button — shown when not in chat view */}
            {!isChat && (
              <motion.button
                onClick={onChatClick || onStart}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gray-100 text-secondary text-[13px] sm:text-sm font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={15} />
                <span className="hidden sm:inline">{fil ? 'Chat' : 'Chat'}</span>
              </motion.button>
            )}

            {/* Eligibility button */}
            <motion.button
              onClick={isChat ? onCheckEligibility : (hasResults ? onViewResults : onStart)}
                className="btn-primary text-[13px] sm:text-[14px] px-4 sm:px-5 min-h-[36px] sm:min-h-[40px] flex items-center gap-1.5 animate-pulse-ring"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
            >
              <ClipboardList size={15} className="hidden sm:block" />
              {isChat
                ? (fil ? 'Suriin' : 'Check')
                : hasResults
                  ? (fil ? 'Resulta' : 'Results')
                  : (fil ? 'Magsimula' : 'Get Started')}
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </header>
  )
}
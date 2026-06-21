import { createContext, useContext, useState } from 'react'
import translations from '../utils/i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children, initialLanguage = 'en' }) {
  const [language, setLanguage] = useState(initialLanguage)

  const t = translations[language] || translations.en

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fil' : 'en'))
  }

  const setLang = (lang) => {
    if (lang === 'en' || lang === 'fil') setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export default LanguageContext

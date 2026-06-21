import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import USAChat from './components/USAChat'
import ChatPage from './pages/ChatPage'
import Home from './pages/Home'
import Results from './pages/Results'
import Footer from './components/layout/Footer'
import { LanguageProvider } from './context/LanguageContext'

export default function App() {
  const [results, setResults] = useState(null)
  const [formData, setFormData] = useState(null)
  const [view, setView] = useState('chat')
  const [homeScrollTarget, setHomeScrollTarget] = useState(null)

  const handleResults = (data, form) => {
    setResults(data)
    setFormData(form)
    setView('results')
  }

  const goHomeSection = (target = 'top') => {
    setView('home')
    setResults(null)
    setFormData(null)
    setHomeScrollTarget(null)
    window.requestAnimationFrame(() => setHomeScrollTarget(target))
  }

  const handleCheckEligibility = () => goHomeSection('top')

  const handleHowItWorks = () => goHomeSection('how-it-works')

  const handleBackToChat = () => {
    setView('chat')
    setResults(null)
    setFormData(null)
  }

  const handleStart = () => {
    setView('chat')
    setResults(null)
    setFormData(null)
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar
          onStart={handleStart}
          hasResults={results !== null}
          onViewResults={() => setView('results')}
          currentView={view}
          onChatClick={() => setView('chat')}
          onCheckEligibility={handleCheckEligibility}
          onHowItWorks={handleHowItWorks}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {view === 'results' && results ? (
              <Results
                key="results"
                data={results}
                form={formData}
                onBack={handleBackToChat}
              />
            ) : view === 'home' ? (
              <Home
                key="home"
                onResults={handleResults}
                scrollTarget={homeScrollTarget}
                onScrollTargetHandled={() => setHomeScrollTarget(null)}
              />
            ) : (
              <ChatPage
                key="chat"
                onCheckEligibility={handleCheckEligibility}
              />
            )}
          </AnimatePresence>
        </main>

        {view !== 'chat' && <Footer />}

        {view !== 'chat' && <USAChat />}
      </div>
    </LanguageProvider>
  )
}
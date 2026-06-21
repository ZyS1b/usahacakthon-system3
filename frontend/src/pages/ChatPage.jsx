import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, User, Send, Sparkles, Shield, ClipboardList, ArrowRight,
  Copy, Check, Trash2, AlertCircle, Clock, ChevronDown,
  MessageSquare, Zap, Heart
} from 'lucide-react'
import { chatWithAI } from '../utils/api'
import { useLanguage } from '../context/LanguageContext'

const QUICK_PROMPTS_EN = [
  { text: 'What is 4Ps?', icon: '💙' },
  { text: 'How do I get PhilHealth?', icon: '🏥' },
  { text: 'Am I eligible for TUPAD?', icon: '🔨' },
  { text: 'Senior citizen benefits', icon: '👴' },
  { text: 'SSS contribution guide', icon: '💰' },
  { text: 'How to apply for DSWD?', icon: '🏛️' },
]
const QUICK_PROMPTS_FIL = [
  { text: 'Ano ang 4Ps?', icon: '💙' },
  { text: 'Paano kumuha ng PhilHealth?', icon: '🏥' },
  { text: 'Kwalipikado ba ako sa TUPAD?', icon: '🔨' },
  { text: 'Benepisyo ng senior citizen', icon: '👴' },
  { text: 'Gabay sa SSS contribution', icon: '💰' },
  { text: 'Paano mag-apply sa DSWD?', icon: '🏛️' },
]

const FEATURES_EN = [
  { icon: Zap, text: 'Real-time AI', color: 'text-amber-500' },
  { icon: Heart, text: '100% Free', color: 'text-rose-500' },
  { icon: Shield, text: 'Private & Secure', color: 'text-emerald-500' },
]
const FEATURES_FIL = [
  { icon: Zap, text: 'Agad na AI', color: 'text-amber-500' },
  { icon: Heart, text: '100% Libre', color: 'text-rose-500' },
  { icon: Shield, text: 'Ligtas at Pribado', color: 'text-emerald-500' },
]

const WELCOME_EN = `👋 Welcome to **TulongAI**! Your intelligent guide to Philippine social services.

I can help you with:

- **Program Explanations** — Understand 4Ps, PhilHealth, TUPAD, SSS & more
- **Eligibility Guidance** — Learn which programs you may qualify for
- **Application Help** — Step-by-step guides on how to apply
- **Quick Answers** — Instant responses to your questions

What would you like to know about today?`

const WELCOME_FIL = `👋 Mabuhay! Ako ang **TulongAI**, ang iyong matalinong gabay para sa mga serbisyong panlipunan ng Pilipinas.

Maaari kitang tulungan sa:

- **Pagpapaliwanag ng Programa** — Unawain ang 4Ps, PhilHealth, TUPAD, SSS at iba pa
- **Gabay sa Kwalipikasyon** — Alamin kung anong programa ang maaari mong makuha
- **Tulong sa Aplikasyon** — Sunud-sunod na gabay kung paano mag-apply
- **Mabilis na Sagot** — Agad na pagtugon sa iyong mga tanong

Ano ang nais mong malaman ngayon?`

export default function ChatPage({ onCheckEligibility }) {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: 'assistant',
      content: fil ? WELCOME_FIL : WELCOME_EN,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState(null)
  const [retryQueue, setRetryQueue] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)
  const [showScrollDown, setShowScrollDown] = useState(false)

  const quickPrompts = fil ? QUICK_PROMPTS_FIL : QUICK_PROMPTS_EN
  const features = fil ? FEATURES_FIL : FEATURES_EN

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when not loading
  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  // Detect if scrolled up for scroll-down button
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120
      setShowScrollDown(!isNearBottom && messages.length > 3)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setError(null)

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
    }

    setInput('')
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.role !== 'error')
        .slice(-15)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await chatWithAI(userMsg, history, language)

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date(),
      }])
    } catch (err) {
      const errorMsg = err.message?.includes('timeout') || err.message?.includes('504')
        ? (fil ? '⏱️ Ang AI ay masyadong matagal sumagot. Pakisubukan muli.' : '⏱️ The AI took too long to respond. Please try again.')
        : err.message?.includes('429')
          ? (fil ? '⏳ Masyadong maraming request. Sandali lang at subukan muli.' : '⏳ Too many requests. Please wait a moment.')
          : (fil ? '❌ May problema sa pagkonekta. Pakisubukan muli.' : '❌ Connection error. Please try again.')

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: errorMsg,
        timestamp: new Date(),
      }])
      setRetryQueue(userMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (retryQueue) {
      const msg = retryQueue
      setRetryQueue(null)
      handleSend(msg)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: fil ? WELCOME_FIL : WELCOME_EN,
        timestamp: new Date(),
      }
    ])
    setError(null)
    setRetryQueue(null)
  }

  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isWelcome = messages.length === 1

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-50 text-zinc-800 font-sans">

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg tracking-tight text-zinc-900">TulongAI</h1>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium">BETA</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11px] text-zinc-400 font-medium">{fil ? 'Online • Handang tumulong' : 'Online • Ready to help'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isWelcome && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearChat}
              className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-zinc-600 transition-colors"
              aria-label={fil ? 'Burahin ang usapan' : 'Clear chat'}
              title={fil ? 'Burahin ang usapan' : 'Clear conversation'}
            >
              <Trash2 size={15} />
            </motion.button>
          )}
          <button
            onClick={onCheckEligibility}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">{fil ? 'Suriin ang Eligibility' : 'Check Eligibility'}</span>
          </button>
        </div>
      </header>

      {/* ─── Message Stream ─── */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        {/* Welcome Features */}
        {isWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mt-8 mb-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200/60 mb-6 shadow-sm">
              <MessageSquare size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-zinc-600">
                {fil ? 'Simulan ang pag-uusap' : 'Start a conversation'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-zinc-200/60 text-xs text-zinc-500 shadow-sm"
                >
                  <f.icon size={14} className={f.color} />
                  <span className="font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user'
          const isError = msg.role === 'error'
          const isLast = i === messages.length - 1

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className={`group flex gap-4 items-start px-4 py-3 -mx-2 rounded-xl transition-colors ${
                isError
                  ? 'bg-red-50/60 hover:bg-red-50/80'
                  : isUser
                    ? 'hover:bg-white/50'
                    : 'bg-zinc-50/50 hover:bg-zinc-100/60'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : isError
                      ? 'bg-red-100 text-red-600'
                      : 'bg-white text-blue-600 border border-zinc-200/80 shadow-sm'
                }`}
              >
                {isUser ? <User size={14} /> : isError ? <AlertCircle size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Sender label */}
                <p className="text-xs font-semibold text-zinc-400 select-none">
                  {isUser ? (fil ? 'Ikaw' : 'You') : isError ? (fil ? 'Error' : 'Error') : 'TulongAI'}
                </p>

                {/* Bubble */}
                <div className={`text-sm leading-relaxed ${
                  isError
                    ? 'text-red-700'
                    : isUser
                      ? 'text-zinc-800'
                      : 'text-zinc-700'
                }`}>
                  {isUser || isError ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div
                      className="prose prose-zinc prose-sm max-w-none
                        prose-headings:text-zinc-900 prose-headings:font-semibold prose-headings:tracking-tight
                        prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2
                        prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1.5
                        prose-p:text-zinc-700 prose-p:leading-relaxed
                        prose-ul:my-2 prose-li:text-zinc-700 prose-li:my-0.5
                        prose-strong:text-zinc-900 prose-strong:font-semibold
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\n- /g, '</p><ul><li>')
                          .replace(/\n(\d+)\. /g, '</p><ol><li>')
                          .replace(/<\/p><(ul|ol)>/g, '<$1>')
                          .replace(/^(.+)$/gm, (line) => {
                            if (line.startsWith('<') || line === '') return line
                            return `<p>${line}</p>`
                          })
                      }}
                    />
                  )}
                </div>

                {/* Footer: timestamp + copy */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 select-none">
                    <Clock size={10} />
                    {formatTime(msg.timestamp)}
                  </span>
                  {!isUser && !isError && (
                    <button
                      onClick={() => copyMessage(msg.content, msg.id)}
                      className="text-zinc-400 hover:text-zinc-600 transition-colors"
                      aria-label="Copy message"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 items-start px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot size={14} className="text-blue-600" />
            </div>
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-semibold text-zinc-400">TulongAI</p>
              <div className="flex gap-1.5 py-1">
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Retry Button */}
        {retryQueue && !loading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 text-sm font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-colors flex items-center gap-2 shadow-sm"
            >
              <ChevronDown size={16} className="rotate-180" />
              {fil ? 'Subukan muli' : 'Retry message'}
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll Down Button */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-44 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:shadow-xl transition-all z-10"
          >
            <ChevronDown size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Prompts */}
      {isWelcome && (
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white border-t border-zinc-200/60 flex-shrink-0">
          <p className="text-center text-[11px] text-zinc-400 font-semibold tracking-wide uppercase mb-3">
            {fil ? 'Mga Mungkahing Tanong' : 'Suggested Questions'}
          </p>
          <div className="flex flex-wrap gap-2 max-w-3xl mx-auto justify-center">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all shadow-sm hover:shadow-md group disabled:opacity-50"
              >
                <span className="text-base">{prompt.icon}</span>
                <span>{prompt.text}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Floating Footer Input ─── */}
      <footer className="p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent sticky bottom-0">
        <div className="max-w-3xl mx-auto relative bg-white border border-zinc-200 shadow-lg rounded-2xl p-2 flex items-center gap-2 focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300/50 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={fil
              ? 'Ikuwento ang sitwasyon mo o magtanong...'
              : 'Describe your situation or ask anything...'}
            className="w-full bg-transparent resize-none outline-none py-2 px-3 text-sm text-zinc-800 placeholder:text-zinc-400 max-h-32 min-h-[40px]"
            rows={1}
            disabled={loading}
            style={{ minHeight: '40px', maxHeight: '140px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-sm shadow-blue-500/20"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Shield size={11} className="text-emerald-500" />
            <span>{fil ? 'Kumpidensyal at ligtas' : 'Private & secure'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Sparkles size={11} className="text-blue-500" />
            <span>{fil ? 'Pinapagana ng AI' : 'AI-Powered'}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
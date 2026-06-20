import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Loader2, Sparkles, Bot, User,
  Copy, Check, Trash2, ChevronDown, AlertCircle, Shield
} from 'lucide-react'
import { chatWithAI } from '../utils/api'
import { useLanguage } from '../context/LanguageContext'

const SUGGESTIONS_EN = [
  'What is 4Ps?',
  'How to apply for PhilHealth?',
  'Am I eligible for TUPAD?',
  'Senior citizen benefits',
]
const SUGGESTIONS_FIL = [
  'Ano ang 4Ps?',
  'Paano mag-apply ng PhilHealth?',
  'Kwalipikado ba ako sa TUPAD?',
  'Benepisyo ng senior citizen',
]

export default function USAChat() {
  const { language } = useLanguage()
  const fil = language === 'fil'
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState(null)
  const [retryQueue, setRetryQueue] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatStartRef = useRef(Date.now())

  const suggestions = fil ? SUGGESTIONS_FIL : SUGGESTIONS_EN

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: fil
            ? `👋 Kumusta! Ako si **TulongAI**, ang iyong matalinong gabay para sa mga serbisyong panlipunan ng gobyerno ng Pilipinas.\n\nMaaari kitang tulungan sa:\n• Pagpapaliwanag ng **4Ps, PhilHealth, TUPAD, SSS** at iba pa\n• Pagsagot sa mga tanong tungkol sa mga benepisyo\n• Pagbibigay ng gabay kung paano mag-apply\n\nAno ang gusto mong malaman ngayon?`
            : `👋 Hello! I'm **TulongAI**, your intelligent guide to Philippine government social services.\n\nI can help you with:\n• Explaining **4Ps, PhilHealth, TUPAD, SSS** and more\n• Answering questions about benefits and requirements\n• Providing step-by-step guidance on how to apply\n\nWhat would you like to know today?`,
          timestamp: new Date(),
        }
      ])
    }
  }, [isOpen, fil, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !loading) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, loading])

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
      // Fallback for older browsers
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
    setMessages([])
    setError(null)
    setRetryQueue(null)
  }

  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessage = (msg, i) => {
    const isUser = msg.role === 'user'
    const isError = msg.role === 'error'
    const isLastError = isError && i === messages.length - 1

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
              : isError
                ? 'bg-orange-100 text-orange-600'
                : 'bg-violet-100 text-violet-600 shadow-sm'
          }`}
        >
          {isUser ? <User size={14} /> : isError ? <AlertCircle size={14} /> : <Bot size={14} />}
        </div>

        {/* Bubble */}
        <div className={`group relative max-w-[82%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md shadow-lg shadow-blue-500/20'
                : isError
                  ? 'bg-orange-50 text-orange-800 rounded-tl-md border border-orange-200'
                  : 'bg-white text-gray-700 rounded-tl-md shadow-sm border border-gray-100/80'
            }`}
          >
            {msg.content.split('\n\n').map((paragraph, pi) => {
              // Process markdown bold
              const processed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              return (
                <p
                  key={pi}
                  className={pi > 0 ? 'mt-2' : ''}
                  dangerouslySetInnerHTML={{ __html: processed }}
                />
              )
            })}
          </div>

          {/* Message actions */}
          <div className={`flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
            {!isUser && !isError && (
              <button
                onClick={() => copyMessage(msg.content, msg.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Copy message"
              >
                {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group animate-glow-pulse"
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        aria-label={fil ? 'Buksan ang TulongAI Chat' : 'Open TulongAI Chat'}
      >
        <MessageCircle size={22} />
        {/* Pulse dot */}
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-40px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100/80"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">TulongAI</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <p className="text-[11px] text-blue-100 font-medium">
                        {fil ? 'Handa kang tulungan' : "I'm here to help"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <button
                      onClick={clearChat}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                      aria-label="Clear chat"
                      title={fil ? 'Burahin ang usapan' : 'Clear conversation'}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                    aria-label="Close chat"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100/50">
                {/* Welcome suggestions */}
                {messages.length <= 1 && (
                  <div className="pt-2 space-y-3">
                    <p className="text-center text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                      {fil ? 'Mga Mungkahing Tanong' : 'Suggested Questions'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(s)}
                          disabled={loading}
                          className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all shadow-sm hover:shadow-md text-left disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => renderMessage(msg, i))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-sm border border-gray-100/80">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Retry button */}
                {retryQueue && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronDown size={14} className="rotate-180" />
                      {fil ? 'Subukan muli' : 'Retry'}
                    </button>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100/80 bg-white flex-shrink-0">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={fil ? 'Magtanong tungkol sa mga programa...' : 'Ask about government programs...'}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
                      rows={1}
                      disabled={loading}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                      onInput={(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-blue-500/20"
                    aria-label="Send message"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2.5">
                  <Shield size={10} className="text-gray-400" />
                  <p className="text-[10px] text-gray-400">
                    {fil ? 'Ligtas at kumpidensyal • Walang kinukuhang data' : 'Secure & confidential • No data collected'}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
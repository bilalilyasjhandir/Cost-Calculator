'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content: `Hello, I'm Barak, Barakode's virtual assistant.\n\nI can help you with questions about our services, the cost calculator, or anything else about Barakode. How can I assist you today?`,
  timestamp: getCurrentTime(),
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function formatMessageContent(content: string) {
  const parts = content.split(/(\*\*[\s\S]*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDot, setShowDot] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when window opens
  useEffect(() => {
    if (isOpen) {
      setShowDot(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: getCurrentTime(),
    }

    // Add user message immediately
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Send full conversation history (excluding greeting which is frontend-only)
      const historyForAPI = updatedMessages
        .filter(m => m.id !== 'greeting')
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForAPI }),
      })

      const data = await res.json()

      const botMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply ?? 'I encountered an issue. Please try again.',
        timestamp: getCurrentTime(),
      }

      setMessages(prev => [...prev, botMessage])

    } catch {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'I encountered a connection issue. Please try again.',
        timestamp: getCurrentTime(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-widget-container text-foreground">

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat-trigger-btn bg-primary text-primary-foreground shadow-lg"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <MessageCircle className="w-6 h-6" />
            {showDot && <span className="notification-dot bg-destructive" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window bg-background border border-border shadow-xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >

            {/* Header */}
            <div className="chat-header bg-primary text-primary-foreground">
              <div className="chat-header-identity">
                <span className="chat-bot-name">Barak</span>
                <span className="chat-bot-sub text-primary-foreground/80">Barakode Assistant</span>
                <span className="chat-status text-primary-foreground/80">● Online</span>
              </div>
              <button
                className="chat-close-btn text-primary-foreground hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}
                >
                  <div className={`chat-bubble ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    {formatMessageContent(msg.content)}
                  </div>
                  <span className="chat-timestamp text-muted-foreground">{msg.timestamp}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="chat-bubble-wrapper bot">
                  <div className="chat-bubble bg-muted text-foreground typing-indicator">
                    <span className="bg-foreground/50" /><span className="bg-foreground/50" /><span className="bg-foreground/50" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area border-t border-border bg-background">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={isLoading}
                rows={1}
                className="chat-input bg-muted text-foreground focus:outline-none focus:ring-1 focus:ring-primary origin-left border border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="chat-send-btn bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Send
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

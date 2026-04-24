import { useState, useRef, useEffect } from 'react'
import { Send, ChefHat, Sparkles, Clock, Flame, ListOrdered, ShoppingBasket } from 'lucide-react'

export default function ChatInterface({ onRecipeFound }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hey! 👋 I'm your cooking assistant. Tell me any dish and I'll create a recipe with voice guidance. What are you craving?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const dishName = input
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dish: dishName }),
      })

      if (!response.ok) throw new Error('Failed to fetch recipe')
      const recipe = await response.json()

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: `Here's your recipe for **${recipe.dish}**. Tap below to start cooking with voice guidance.`,
        recipe,
        timestamp: new Date()
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: `Couldn't generate that recipe. Make sure the backend and Ollama are running, then try again.`,
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[620px] bg-[var(--color-surface-raised)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40"></div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${message.type === 'user' ? 'msg-slide-right' : 'msg-slide-left'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                <ChefHat className="text-white w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${
              message.type === 'user'
                ? 'bg-[var(--color-accent)] text-white rounded-2xl rounded-tr-md'
                : 'bg-[var(--color-surface-hover)] text-[var(--color-text)] rounded-2xl rounded-tl-md border border-[var(--color-border)]'
            } px-4 py-3`}>
              
              <p className="text-[14px] leading-relaxed">
                {message.text.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part
                )}
              </p>
              
              {/* Recipe Card */}
              {message.recipe && (
                <div className="mt-4 bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] animate-scale-in">
                  
                  {/* Title */}
                  <div className="flex items-center gap-2.5 mb-4 stagger-child">
                    <Sparkles size={16} className="text-[var(--color-accent-light)]" />
                    <h3 className="font-bold text-lg text-white capitalize">{message.recipe.dish}</h3>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="stagger-child flex flex-col items-center p-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-emerald-400">
                      <Flame size={15} className="mb-1" />
                      <span className="text-xs font-semibold capitalize">{message.recipe.difficulty || 'Easy'}</span>
                    </div>
                    <div className="stagger-child flex flex-col items-center p-2.5 rounded-lg bg-blue-500/8 border border-blue-500/15 text-blue-400">
                      <Clock size={15} className="mb-1" />
                      <span className="text-xs font-semibold">{message.recipe.cookingTime || 30} min</span>
                    </div>
                    <div className="stagger-child flex flex-col items-center p-2.5 rounded-lg bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/15 text-[var(--color-accent-light)]">
                      <ListOrdered size={15} className="mb-1" />
                      <span className="text-xs font-semibold">{message.recipe.steps?.length || 0} steps</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  {message.recipe.ingredients?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2 stagger-child">
                        <ShoppingBasket size={12} className="text-[var(--color-text-muted)]" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)]">Ingredients</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {message.recipe.ingredients.map((ing, idx) => (
                          <span key={idx} className="stagger-child px-2.5 py-1 text-[11px] bg-white/[0.04] border border-[var(--color-border)] rounded-md text-[var(--color-text-muted)] font-medium">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  {message.recipe.steps?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2 stagger-child">
                        <ListOrdered size={12} className="text-[var(--color-text-muted)]" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)]">Steps</span>
                      </div>
                      <ol className="space-y-1.5">
                        {message.recipe.steps.map((step, idx) => (
                          <li key={idx} className="stagger-child flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-[var(--color-border)]">
                            <span className="flex-shrink-0 w-5 h-5 rounded-md bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-[13px] text-[var(--color-text)] leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Cook Button */}
                  <button
                    onClick={() => onRecipeFound(message.recipe)}
                    className="stagger-child w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white font-semibold py-3 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ChefHat size={16} />
                    Start Cooking with Voice
                  </button>
                </div>
              )}

              <p className={`text-[10px] mt-2 font-medium ${message.type === 'user' ? 'text-white/40 text-right' : 'text-[var(--color-text-faint)]'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start msg-slide-left">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mr-3 mt-1">
              <ChefHat className="text-white w-4 h-4" />
            </div>
            <div className="bg-[var(--color-surface-hover)] rounded-2xl rounded-tl-md border border-[var(--color-border)] px-4 py-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">Generating recipe...</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-36 rounded skeleton-shimmer"></div>
                <div className="h-2.5 w-48 rounded skeleton-shimmer"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            placeholder="Type a dish name... (e.g., butter chicken, pizza)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-white placeholder-[var(--color-text-faint)] text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-30 active:scale-95"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

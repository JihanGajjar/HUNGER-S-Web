import { useState, useEffect } from 'react'
import RecipeDetail from './components/RecipeDetail'
import ChatInterface from './components/ChatInterface'
import { Sparkles, UtensilsCrossed } from 'lucide-react'

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-surface)] relative">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[var(--color-surface)]/90 backdrop-blur-xl border-b border-[var(--color-border)]' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-white w-[18px] h-[18px]" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                HUNGER'S
              </h1>
            </div>
            <nav className="hidden md:flex gap-8 text-sm">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-white transition-colors">Discover</a>
              <a href="#" className="text-white font-medium">AI Assistant</a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-white transition-colors">Saved</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 pt-28 pb-20">
        <section className="max-w-6xl mx-auto px-6 text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-light)] text-xs font-medium mb-5 border border-[var(--color-accent)]/20">
            <Sparkles size={13} />
            <span>Powered by Local AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.15]">
            Your Personal{' '}
            <span className="text-[var(--color-accent-light)]">AI Sous Chef</span>
          </h2>
          <p className="text-base text-[var(--color-text-muted)] max-w-lg mx-auto leading-relaxed">
            Tell me what you're craving. I'll generate the perfect recipe and guide you step-by-step with voice instructions.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <ChatInterface onRecipeFound={setSelectedRecipe} />
        </section>
      </main>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
            <UtensilsCrossed size={16} />
            <span className="text-sm font-medium">HUNGER'S</span>
          </div>
          <p className="text-[var(--color-text-faint)] text-xs">
            &copy; 2026 HUNGER'S AI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

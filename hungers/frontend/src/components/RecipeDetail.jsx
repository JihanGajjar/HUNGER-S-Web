import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X, ChefHat, Sparkles, Clock, Flame, ListOrdered, CheckCircle2, RotateCcw } from 'lucide-react'

export default function RecipeDetail({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [voices, setVoices] = useState([])
  const [checkedIngredients, setCheckedIngredients] = useState([])
  const [stepKey, setStepKey] = useState(0)
  const synthRef = useRef(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    const loadVoices = () => {
      const available = synthRef.current.getVoices()
      setVoices(available)
      const preferred = ['Google UK English Female', 'Samantha', 'Karen', 'Daniel', 'Google US English', 'Microsoft Zira']
      let best = null
      for (const name of preferred) {
        best = available.find(v => v.name.includes(name))
        if (best) break
      }
      if (!best) best = available.find(v => v.lang.startsWith('en'))
      if (best) setSelectedVoice(best)
    }
    loadVoices()
    synthRef.current.addEventListener('voiceschanged', loadVoices)
    return () => {
      synthRef.current?.cancel()
      synthRef.current?.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const steps = recipe.steps || []

  const cleanForVoice = (text) => text.replace(/[\u{1F600}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '').trim()

  const speak = (text, stepIndex) => {
    if (synthRef.current.speaking) synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(`Step ${stepIndex + 1}. ${cleanForVoice(text)}`)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.05
    utterance.volume = 1
    if (selectedVoice) utterance.voice = selectedVoice
    utterance.onstart = () => { setIsSpeaking(true); setIsPlaying(true) }
    utterance.onend = () => {
      setIsSpeaking(false)
      if (stepIndex < steps.length - 1) {
        setTimeout(() => {
          goToStep(stepIndex + 1)
          setTimeout(() => speak(steps[stepIndex + 1], stepIndex + 1), 400)
        }, 1000)
      } else setIsPlaying(false)
    }
    utterance.onerror = () => { setIsSpeaking(false); setIsPlaying(false) }
    synthRef.current.speak(utterance)
  }

  const goToStep = (idx) => { setCurrentStep(idx); setStepKey(prev => prev + 1) }

  const handlePlayPause = () => {
    if (isPlaying) { synthRef.current.cancel(); setIsPlaying(false); setIsSpeaking(false) }
    else speak(steps[currentStep], currentStep)
  }

  const handleNext = () => { if (currentStep < steps.length - 1) { synthRef.current.cancel(); setIsSpeaking(false); setIsPlaying(false); goToStep(currentStep + 1) } }
  const handlePrev = () => { if (currentStep > 0) { synthRef.current.cancel(); setIsSpeaking(false); setIsPlaying(false); goToStep(currentStep - 1) } }

  const toggleIngredient = (idx) => setCheckedIngredients(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])

  if (!recipe) return null
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] flex flex-col overflow-hidden animate-bounce-in">
        
        {/* Progress bar */}
        <div className="h-1 bg-[var(--color-surface-hover)]">
          <div className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <ChefHat className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white capitalize">{recipe.dish}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles size={12} className="text-[var(--color-accent-light)]" />
                <span className="text-[var(--color-accent-light)] text-xs font-medium">AI Generated • Voice Guided</span>
              </div>
            </div>
          </div>
          <button onClick={() => { synthRef.current?.cancel(); onClose() }} className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left: Ingredients */}
          <div className="lg:w-[280px] bg-[var(--color-surface-raised)] p-5 overflow-y-auto border-r border-[var(--color-border)]">
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
                <Flame className="text-emerald-400 mx-auto mb-1" size={18} />
                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-faint)] block">Level</span>
                <span className="text-white font-semibold text-sm capitalize">{recipe.difficulty || 'Easy'}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/8 border border-blue-500/15 text-center">
                <Clock className="text-blue-400 mx-auto mb-1" size={18} />
                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-faint)] block">Time</span>
                <span className="text-white font-semibold text-sm">{recipe.cookingTime || 30} min</span>
              </div>
            </div>

            {recipe.ingredients?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ListOrdered size={14} />
                  Ingredients
                  <span className="ml-auto text-[var(--color-text-faint)] font-normal">{checkedIngredients.length}/{recipe.ingredients.length}</span>
                </h3>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => toggleIngredient(idx)}
                      className={`stagger-child flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all text-sm border ${
                        checkedIngredients.includes(idx)
                          ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300'
                          : 'bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checkedIngredients.includes(idx) ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--color-text-faint)]'
                      }`}>
                        {checkedIngredients.includes(idx) && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <span className={checkedIngredients.includes(idx) ? 'line-through opacity-50' : ''}>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Step & Controls */}
          <div className="flex-1 flex flex-col p-6 lg:p-8">
            
            {/* Step dots */}
            <div className="flex gap-1.5 mb-8">
              {steps.map((_, idx) => (
                <button key={idx} onClick={() => { synthRef.current.cancel(); setIsSpeaking(false); setIsPlaying(false); goToStep(idx) }}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-400 ${
                    idx === currentStep ? 'bg-[var(--color-accent)]' : idx < currentStep ? 'bg-[var(--color-accent)]/30' : 'bg-[var(--color-border)]'
                  }`}
                />
              ))}
            </div>

            {/* Active step */}
            <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full" key={`step-${stepKey}`}>
              <div className="step-transition">
                <span className="inline-block px-3 py-1 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent-light)] text-xs font-semibold mb-5 border border-[var(--color-accent)]/20">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
                  {steps[currentStep]}
                </h2>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-auto bg-[var(--color-surface-raised)] rounded-2xl p-5 border border-[var(--color-border)]">
              
              <div className="flex items-center justify-between mb-4">
                {isSpeaking ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <div className="flex items-center gap-[2px] h-4">
                      <div className="sound-bar"></div>
                      <div className="sound-bar"></div>
                      <div className="sound-bar"></div>
                      <div className="sound-bar"></div>
                      <div className="sound-bar"></div>
                    </div>
                    Speaking
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] text-[var(--color-text-faint)] text-xs font-medium">
                    <Volume2 size={14} /> Ready
                  </div>
                )}
                <button onClick={() => speak(steps[currentStep], currentStep)} className="flex items-center gap-1 text-xs text-[var(--color-accent-light)] hover:text-white font-medium transition-colors">
                  <RotateCcw size={12} /> Repeat
                </button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={handlePrev} disabled={currentStep === 0}
                  className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-20 transition-all font-medium flex items-center gap-1.5 text-sm border border-[var(--color-border)]">
                  <SkipBack size={18} /> <span className="hidden sm:inline">Prev</span>
                </button>

                <button onClick={handlePlayPause}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 ${
                    isPlaying ? 'bg-red-500 hover:bg-red-400' : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)]'
                  }`}>
                  {isPlaying ? <Pause size={24} /> : <Play size={26} className="ml-1" />}
                </button>

                <button onClick={handleNext} disabled={currentStep === steps.length - 1}
                  className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-20 transition-all font-medium flex items-center gap-1.5 text-sm border border-[var(--color-border)]">
                  <span className="hidden sm:inline">Next</span> <SkipForward size={18} />
                </button>
              </div>

              {voices.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-[var(--color-text-faint)]">
                  <span>Voice:</span>
                  <select value={selectedVoice?.name || ''} onChange={(e) => { const v = voices.find(v => v.name === e.target.value); if (v) setSelectedVoice(v) }}
                    className="bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)] rounded px-1.5 py-0.5 text-[10px] focus:outline-none max-w-[180px]">
                    {voices.filter(v => v.lang.startsWith('en')).map(v => (
                      <option key={v.name} value={v.name} className="bg-[var(--color-surface)]">{v.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

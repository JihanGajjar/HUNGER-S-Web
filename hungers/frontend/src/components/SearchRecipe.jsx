import { useState } from 'react'
import { Loader, AlertCircle } from 'lucide-react'

export default function SearchRecipe({ onRecipeFound, onClose }) {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) {
      setError('Please enter a recipe name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5001/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dish: searchInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recipe')
      }

      const recipe = await response.json()
      onRecipeFound(recipe)
      setSearchInput('')
    } catch (err) {
      setError(err.message || 'Error fetching recipe. Make sure the backend is running.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Recipe</h2>
        <p className="text-gray-600 mb-6">Find a recipe and get step-by-step instructions with voice guidance</p>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g., Pasta, Biryani, Pizza..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-orange-500 text-lg"
            disabled={loading}
          />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white mb-3 transition flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            }`}
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Generating Recipe...
              </>
            ) : (
              'Search Recipe'
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-xs text-gray-500 text-center">
            💡 Tips: Be specific with recipe names for better results. Try "Tomato Pasta", "Butter Chicken", etc.
          </p>
        </div>
      </div>
    </div>
  )
}

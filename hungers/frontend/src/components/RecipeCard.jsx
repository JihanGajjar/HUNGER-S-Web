import { Clock, Flame, ChefHat } from 'lucide-react'

export default function RecipeCard({ recipe, onClick }) {
  const difficulty = recipe.difficulty || 'easy'
  const cookingTime = recipe.cookingTime || 30
  const steps = recipe.steps?.length || 0

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
        <div className="text-center">
          <ChefHat size={48} className="mx-auto text-orange-600 mb-2 opacity-50" />
          <p className="text-gray-500 font-semibold">Recipe</p>
        </div>
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold capitalize ${difficultyColor[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 capitalize">
          {recipe.dish}
        </h3>
        
        <div className="flex gap-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-orange-500" />
            <span>{cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={16} className="text-orange-500" />
            <span>{steps} steps</span>
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
        >
          Cook Now 🎧
        </button>
      </div>
    </div>
  )
}

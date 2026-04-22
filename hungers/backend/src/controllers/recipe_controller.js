import { getRecipeFromAI } from "../service/recipe_service.js";

export const getRecipe = async (req, res) => {
  try {
    const { dish } = req.body;
    const recipe = await getRecipeFromAI(dish);
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

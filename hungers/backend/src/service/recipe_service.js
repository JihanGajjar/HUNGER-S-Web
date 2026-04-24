import axios from "axios";

// ── JSON Repair Utility ──────────────────────────────────────────────
function repairJSON(raw) {
  let str = raw.trim();
  str = str.replace(/```json/gi, "").replace(/```/g, "").trim();

  const match = str.match(/\{[\s\S]*\}/);
  if (match) str = match[0];

  // Fix trailing commas
  str = str.replace(/,\s*]/g, "]");
  str = str.replace(/,\s*}/g, "}");

  // Balance brackets
  const openB = (str.match(/\[/g) || []).length;
  const closeB = (str.match(/\]/g) || []).length;
  if (openB > closeB) {
    for (let i = 0; i < openB - closeB; i++) {
      const last = str.lastIndexOf("}");
      if (last !== -1) str = str.slice(0, last) + "]" + str.slice(last);
    }
  }

  // Balance braces
  const openC = (str.match(/\{/g) || []).length;
  const closeC = (str.match(/\}/g) || []).length;
  if (openC > closeC) str += "}".repeat(openC - closeC);

  return str;
}

// ── Main function ────────────────────────────────────────────────────
export const getRecipeFromAI = async (dish) => {
  const prompt = `You are a recipe JSON generator. Return ONLY a JSON object for the dish "${dish}".

The JSON must have these fields:
- dish: full name of the dish
- ingredients: array of 6-8 ingredients with exact quantities like "2 cups flour"
- steps: array of 6-8 detailed cooking steps, each starting with an emoji, each step should be a full sentence explaining what to do clearly
- difficulty: "easy" or "medium" or "hard"
- cookingTime: total cooking time in minutes as a number

Here is an example JSON for "Butter Chicken":
{"dish":"Butter Chicken","ingredients":["500g chicken breast cut into pieces","1 cup yogurt","2 tbsp butter","1 cup tomato puree","1 tsp garam masala","1 tsp turmeric powder","1 cup heavy cream","2 cloves garlic minced"],"steps":["🍗 Cut chicken into small pieces and mix with yogurt, turmeric and salt for 30 minutes","🔥 Heat butter in a deep pan on medium heat until it melts","🧅 Add garlic to the pan and fry for one minute until golden","🍅 Pour in the tomato puree and cook for 5 minutes while stirring","🍗 Add the marinated chicken pieces and cook for 15 minutes on medium heat","🥛 Pour in the heavy cream and garam masala then stir and cook for 5 more minutes","🧂 Add salt and pepper to taste and mix everything well","🍽️ Serve hot with steamed basmati rice or naan bread"],"difficulty":"medium","cookingTime":45}

Now generate a detailed JSON recipe for "${dish}" with 6-8 ingredients and 6-8 detailed steps:`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${MAX_RETRIES} for "${dish}"...`);

    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "gemma:2b",
        prompt: prompt,
        format: "json",
        stream: false,
      });

      const rawResponse = response.data.response;
      console.log(`📝 Raw AI (attempt ${attempt}):`, rawResponse.substring(0, 200));

      // Repair and parse
      const repaired = repairJSON(rawResponse);
      let parsed;

      try {
        parsed = JSON.parse(repaired);
      } catch (parseErr) {
        console.warn(`⚠️ Parse failed (attempt ${attempt}):`, parseErr.message);
        if (attempt < MAX_RETRIES) continue;
        throw parseErr;
      }

      // Normalize with safe defaults
      const recipe = {
        dish: parsed.dish || dish,
        steps: Array.isArray(parsed.steps) ? parsed.steps.filter(s => typeof s === "string" && s.trim().length > 5) : [],
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.filter(s => typeof s === "string" && s.trim().length > 1) : [],
        difficulty: ["easy", "medium", "hard"].includes(parsed.difficulty) ? parsed.difficulty : "easy",
        cookingTime: typeof parsed.cookingTime === "number" ? parsed.cookingTime : 30,
        source: "ai",
      };

      // If steps are empty or too few, retry
      if (recipe.steps.length < 2) {
        console.warn(`⚠️ Only ${recipe.steps.length} valid steps, retrying...`);
        if (attempt < MAX_RETRIES) continue;
      }

      console.log("✅ Final Recipe:", JSON.stringify(recipe, null, 2));
      return recipe;

    } catch (error) {
      console.error(`❌ Attempt ${attempt} error:`, error.message);
      if (attempt >= MAX_RETRIES) {
        throw new Error("Failed to generate recipe after multiple attempts. Please try again.");
      }
    }
  }
};
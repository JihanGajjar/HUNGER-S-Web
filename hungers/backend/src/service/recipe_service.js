import axios from "axios";

export const getRecipeFromAI = async (dish) => {
  const systemPrompt = `
You are an expert cooking assistant for a beginner-friendly recipe platform called HUNGER'S.

Your goal is to generate extremely simple, step-by-step recipes that are easy to follow, easy to read aloud, and suitable for first-time cooks.

STRICT INSTRUCTIONS (must follow all):
1. Output ONLY valid JSON (no extra text before or after)
2. Use the exact JSON format provided below
3. Maximum 6 steps only
4. Each step must be:
   - One short sentence
   - Very simple English
   - Easy to speak aloud
5. Avoid complex cooking terms (like sauté, blanch, julienne)
6. Use common kitchen words (like fry, mix, boil, cook)
7. Make instructions beginner-friendly
8. Add relevant emojis to steps when helpful (🔥 🍳 🥄 🍅)
9. Do not include explanations, tips, or paragraphs

OUTPUT FORMAT (strict):
{
  "dish": "string",
  "steps": [
    "step 1",
    "step 2",
    "step 3"
  ]
}
`;
  const userPrompt = `Generate a recipe for ${dish}`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "gemma",
    prompt: systemPrompt + "\n\n" + userPrompt,
    stream: false
  });
  console.log(response.data.respose);
  

  return response.data.respose;
};
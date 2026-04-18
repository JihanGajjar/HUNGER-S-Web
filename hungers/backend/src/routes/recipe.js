import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { dish } = req.body;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma",
      prompt: `
Give a very simple step-by-step recipe for ${dish}.

Rules:
- Maximum 6 steps
- Each step must be short (1 line)
- Use very simple English
- No complex cooking words
      `,
      stream: false
    });

    res.json({ recipe: response.data.response });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
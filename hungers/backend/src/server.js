import express from "express";
import cors from "cors";
import recipeRoute from "./routes/recipe.js";

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api", recipeRoute);
export default app;
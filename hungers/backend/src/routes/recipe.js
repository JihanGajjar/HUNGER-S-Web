import { Router} from "express";
import { getRecipe } from "../controllers/recipe_controller.js";
const router = Router();
router.post("/recipes", getRecipe);
export default router;

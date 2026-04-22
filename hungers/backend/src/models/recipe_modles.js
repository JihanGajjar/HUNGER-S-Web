import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    dish: {
      type: String,
      required: true,
      trim: true,
    },

    steps: [
      {
        type: String,
        required: true,
      }
    ],

    ingredients: [
      {
        type: String,
      }
    ],

    images: [
      {
        type: String, // URL of image or GIF
      }
    ],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    cookingTime: {
      type: Number, // in minutes
      default: 10,
    },

    source: {
      type: String,
      enum: ["ai", "manual"],
      default: "ai",
    },

    createdBy: {
      type: String, // later you can link user ID
      default: "system",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("Recipe", recipeSchema);
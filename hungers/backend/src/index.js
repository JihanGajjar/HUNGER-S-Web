import { connectDB } from "./database/db.js";
import server from "./server.js";
import dotenv from "dotenv";
dotenv.config();

connectDB().then(() => {
  console.log("Connected to MongoDB");
  server.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
  });
}).catch((error) => {
  console.error(`Failed to connect to MongoDB: ${error.message}`);
  process.exit(1);
});
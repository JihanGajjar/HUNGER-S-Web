import { connectDB } from "./database/db.js";
import server from "./server.js";
import dotenv from "dotenv";
dotenv.config();

connectDB().then(() => {
  console.log("Connected to MongoDB");

  const DEFAULT_PORT = process.env.PORT || 5000;
  const FALLBACK_PORT = 5001;

  const startServer = (port) => {
    const httpServer = server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    httpServer.on("error", (err) => {
      if (err.code === "EADDRINUSE" && port === DEFAULT_PORT) {
        console.warn(`Port ${port} is already in use. Falling back to port ${FALLBACK_PORT}.`);
        startServer(FALLBACK_PORT);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
  };

  startServer(DEFAULT_PORT);
}).catch((error) => {
  console.error(`Failed to connect to MongoDB: ${error.message}`);
  process.exit(1);
});
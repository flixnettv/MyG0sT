import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "2.0.0", name: "MyGhost" });
  });

  // Model Management Endpoints (Mocked for now)
  app.get("/api/models", (req, res) => {
    res.json([
      { id: "gemini-3-flash", name: "Gemini 3 Flash", speed: "Fast", quality: "High", cost: "Free" },
      { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro", speed: "Moderate", quality: "Ultra", cost: "Free" },
      { id: "groq-llama3", name: "Groq Llama 3", speed: "Instant", quality: "High", cost: "Free" },
      { id: "ace3", name: "ACE3 (Local)", speed: "Instant", quality: "Good", cost: "Free" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MyGhost v2.0 Server running on http://localhost:${PORT}`);
  });
}

startServer();

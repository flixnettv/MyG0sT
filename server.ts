import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenAI } from "@google/genai";

let bot: TelegramBot | null = null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "2.0.0", name: "MyGhost" });
  });

  // Telegram Bot Token Endpoint
  app.post("/api/telegram/token", (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    try {
      if (bot) {
        bot.stopPolling();
      }

      bot = new TelegramBot(token, { polling: true });

      bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text) return;

        if (text === "/start") {
          bot?.sendMessage(chatId, "مرحباً بك في MyGhost v2.0! 👻\nأنا مساعدك الذكي الشخصي على تيليجرام. كيف يمكنني مساعدتك اليوم؟");
          return;
        }

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-latest",
            contents: text,
            config: {
              systemInstruction: "أنت MyGhost v2.0، مساعد ذكي شخصي متطور على تيليجرام. تحدث باللغة العربية بأسلوب عصري وودود.",
            },
          });

          const reply = response.text || "عذراً، لم أتمكن من توليد رد.";
          bot?.sendMessage(chatId, reply);
        } catch (error) {
          console.error("Gemini Error:", error);
          bot?.sendMessage(chatId, "عذراً، حدث خطأ أثناء معالجة طلبك.");
        }
      });

      res.json({ success: true, message: "Telegram Bot linked successfully!" });
    } catch (error) {
      console.error("Telegram Bot Error:", error);
      res.status(500).json({ error: "Failed to link Telegram Bot" });
    }
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

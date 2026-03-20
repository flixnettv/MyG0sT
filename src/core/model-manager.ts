import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { TOOLS, executeTool } from "../services/tools";

export enum ModelId {
  GEMINI_FLASH = "gemini-3-flash-preview",
  GEMINI_PRO = "gemini-3.1-pro-preview",
  GROQ = "groq-llama3",
  ACE3 = "ace3",
}

// ... (keep ModelConfig and MODELS as they were)
export interface ModelConfig {
  id: ModelId;
  name: string;
  speed: string;
  quality: string;
  cost: string;
  description: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: ModelId.GEMINI_FLASH,
    name: "Gemini 3 Flash",
    speed: "⚡ Fast",
    quality: "⭐⭐⭐⭐",
    cost: "Free",
    description: "Best for quick responses and daily tasks.",
  },
  {
    id: ModelId.GEMINI_PRO,
    name: "Gemini 3.1 Pro",
    speed: "🐢 Moderate",
    quality: "⭐⭐⭐⭐⭐",
    cost: "Free",
    description: "Best for complex reasoning and deep analysis.",
  },
  {
    id: ModelId.GROQ,
    name: "Groq Llama 3",
    speed: "🚀 Instant",
    quality: "⭐⭐⭐⭐",
    cost: "Free",
    description: "Ultra-fast response times using Groq hardware.",
  },
  {
    id: ModelId.ACE3,
    name: "ACE3 (Local)",
    speed: "🚀 Instant",
    quality: "⭐⭐⭐⭐",
    cost: "Free",
    description: "Local model simulation for privacy and speed.",
  },
];

export class ModelManager {
  private currentModelId: ModelId = ModelId.GEMINI_FLASH;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  setCurrentModel(id: ModelId) {
    this.currentModelId = id;
  }

  getCurrentModel() {
    return MODELS.find((m) => m.id === this.currentModelId) || MODELS[0];
  }

  async generateResponse(prompt: string, history: any[] = []) {
    const modelName = this.currentModelId.startsWith("gemini") 
      ? this.currentModelId 
      : "gemini-3-flash-preview";

    const systemInstruction = this.getSystemInstruction();

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: TOOLS }],
        },
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        const toolResults = await Promise.all(
          functionCalls.map(async (call) => {
            const result = await executeTool(call.name, call.args);
            return {
              functionResponse: {
                name: call.name,
                response: result,
              },
            };
          })
        );

        // Send tool results back to model
        const followUp = await this.ai.models.generateContent({
          model: modelName,
          contents: [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: response.candidates[0].content.parts },
            { role: "user", parts: toolResults as any },
          ],
          config: { systemInstruction },
        });

        return followUp.text || "تم تنفيذ المهمة بنجاح.";
      }

      return response.text || "No response generated.";
    } catch (error) {
      console.error("Error generating response:", error);
      return "عذراً، حدث خطأ أثناء معالجة طلبك.";
    }
  }

  private getSystemInstruction(): string {
    const base = "أنت MyGhost v2.0، مساعد ذكي شخصي متطور. تحدث باللغة العربية بأسلوب عصري وودود. لديك القدرة على استخدام أدوات مثل Gmail و Calendar و Speech. إذا طلب المستخدم إرسال إيميل أو إضافة موعد، استخدم الأدوات المتاحة.";
    
    switch (this.currentModelId) {
      case ModelId.ACE3:
        return `${base} أنت الآن تعمل بنمط ACE3 المحلي، ركز على السرعة والإيجاز الشديد.`;
      case ModelId.GROQ:
        return `${base} أنت الآن تعمل بنمط Groq، كن سريعاً جداً ودقيقاً.`;
      case ModelId.GEMINI_PRO:
        return `${base} أنت الآن تعمل بنمط Gemini Pro، قدم تحليلات عميقة ومفصلة وشاملة.`;
      default:
        return base;
    }
  }
}

export const modelManager = new ModelManager();

import { Type } from "@google/genai";

export const GMAIL_TOOL = {
  name: "send_email",
  parameters: {
    type: Type.OBJECT,
    description: "إرسال بريد إلكتروني عبر Gmail",
    properties: {
      to: { type: Type.STRING, description: "عنوان البريد الإلكتروني للمستلم" },
      subject: { type: Type.STRING, description: "موضوع الرسالة" },
      body: { type: Type.STRING, description: "محتوى الرسالة" },
    },
    required: ["to", "subject", "body"],
  },
};

export const CALENDAR_TOOL = {
  name: "add_calendar_event",
  parameters: {
    type: Type.OBJECT,
    description: "إضافة موعد إلى تقويم Google",
    properties: {
      title: { type: Type.STRING, description: "عنوان الموعد" },
      start_time: { type: Type.STRING, description: "وقت البدء (ISO 8601)" },
      duration_minutes: { type: Type.NUMBER, description: "مدة الموعد بالدقائق" },
    },
    required: ["title", "start_time"],
  },
};

export const SPEECH_TOOL = {
  name: "text_to_speech",
  parameters: {
    type: Type.OBJECT,
    description: "تحويل النص إلى كلام مسموع",
    properties: {
      text: { type: Type.STRING, description: "النص المراد تحويله" },
      voice: { type: Type.STRING, enum: ["Kore", "Puck", "Zephyr"], description: "اسم الصوت" },
    },
    required: ["text"],
  },
};

export const TOOLS = [GMAIL_TOOL, CALENDAR_TOOL, SPEECH_TOOL];

export async function executeTool(name: string, args: any) {
  console.log(`Executing tool: ${name}`, args);
  
  // Mock implementations for demo
  switch (name) {
    case "send_email":
      return { status: "success", message: `تم إرسال البريد الإلكتروني بنجاح إلى ${args.to}` };
    case "add_calendar_event":
      return { status: "success", message: `تمت إضافة الموعد "${args.title}" إلى التقويم` };
    case "text_to_speech":
      return { status: "success", message: "جاري تشغيل الصوت...", audio_ready: true };
    default:
      return { status: "error", message: "أداة غير معروفة" };
  }
}

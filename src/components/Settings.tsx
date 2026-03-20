import React, { useState } from "react";
import { Check, Zap, Brain, Cpu, Globe, Info, MessageSquare, Loader2 } from "lucide-react";
import { MODELS, ModelId, ModelConfig } from "../core/model-manager";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SettingsProps {
  currentModelId: ModelId;
  onModelChange: (id: ModelId) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function Settings({ currentModelId, onModelChange, isDarkMode, onDarkModeToggle }: SettingsProps) {
  const [telegramToken, setTelegramToken] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSaveTelegramToken = async () => {
    if (!telegramToken.trim()) return;

    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/telegram/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: telegramToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "تم ربط بوت تيليجرام بنجاح! 👻" });
        setTelegramToken("");
      } else {
        setStatus({ type: "error", message: data.error || "فشل ربط البوت. يرجى التحقق من التوكن." });
      }
    } catch (error) {
      console.error("Error saving telegram token:", error);
      setStatus({ type: "error", message: "حدث خطأ أثناء الاتصال بالخادم." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto w-full glass rounded-3xl shadow-2xl overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Cpu className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">إعدادات النماذج (Model Manager)</h2>
            <p className="text-sm text-zinc-400">اختر المحرك الذكي المناسب لمهمتك الحالية</p>
          </div>
        </div>

        <button
          onClick={onDarkModeToggle}
          className="p-3 rounded-xl bg-zinc-500/10 hover:bg-zinc-500/20 transition-all border border-black/5 dark:border-white/5"
          title={isDarkMode ? "تبديل للوضع المضيء" : "تبديل للوضع المظلم"}
        >
          {isDarkMode ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الوضع المظلم</span>
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الوضع المضيء</span>
              <div className="w-4 h-4 rounded-full bg-zinc-300" />
            </div>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={cn(
              "p-4 rounded-2xl border transition-all text-right flex flex-col gap-2 group relative overflow-hidden",
              currentModelId === model.id
                ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
                : "bg-black/5 dark:bg-zinc-800/50 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-zinc-800"
            )}
          >
            {currentModelId === model.id && (
              <div className="absolute top-3 left-3">
                <div className="bg-emerald-500 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl border",
                currentModelId === model.id ? "bg-emerald-500/20 border-emerald-500/30" : "bg-zinc-100 dark:bg-zinc-700 border-black/5 dark:border-white/10"
              )}>
                {model.id === ModelId.GEMINI_PRO ? <Brain className="w-5 h-5 text-emerald-400" /> : 
                 model.id === ModelId.GROQ ? <Zap className="w-5 h-5 text-yellow-400" /> :
                 model.id === ModelId.ACE3 ? <Cpu className="w-5 h-5 text-blue-400" /> :
                 <Globe className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{model.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/5">
                    {model.speed}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/5">
                    {model.quality}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {model.description}
            </p>
          </button>
        ))}
      </div>

      <div className="space-y-4 border-t border-black/5 dark:border-white/10 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">تكامل Telegram Bot</h2>
            <p className="text-sm text-zinc-400">اربط MyGhost بحسابك على تيليجرام للوصول السريع</p>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-300">Telegram Bot Token</label>
            <input 
              type="password" 
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz..."
              className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-[var(--text-color)]"
            />
          </div>
          
          {status && (
            <div className={cn(
              "p-3 rounded-xl text-sm",
              status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}>
              {status.message}
            </div>
          )}

          <button 
            onClick={handleSaveTelegramToken}
            disabled={isSaving || !telegramToken.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            حفظ وربط البوت
          </button>
        </div>
      </div>

      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex gap-4 items-start">
        <Info className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-400">نصيحة ذكية</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            استخدم <strong>Claude</strong> (Gemini Pro) للتحليلات المعقدة، و <strong>ACE3</strong> للمحادثات السريعة والبسيطة. يمكنك التبديل في أي وقت دون فقدان سياق المحادثة.
          </p>
        </div>
      </div>
    </div>
  );
}

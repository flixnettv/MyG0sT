import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatProps {
  onSendMessage: (content: string) => Promise<string>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
}

export default function Chat({ onSendMessage, messages, setMessages, isTyping }: ChatProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await onSendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full glass rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-bottom border-white/10 flex items-center justify-between bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">MyGhost v2.0</h2>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              متصل وجاهز للمساعدة
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-red-400"
          title="مسح المحادثة"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50"
            >
              <Bot className="w-16 h-16 text-emerald-500/50" />
              <p className="text-lg font-medium">كيف يمكنني مساعدتك اليوم؟</p>
              <div className="grid grid-cols-2 gap-2 max-w-sm">
                {["ما هو ACE3؟", "أخبرني نكتة", "خطط ليومي", "ترجمة نص"].map((q) => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex w-full gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === "user" ? "bg-emerald-500" : "bg-zinc-700 border border-white/10"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[80%] space-y-1",
                msg.role === "user" ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 shadow-xl",
                  msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                )}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="chat-bubble-ai flex items-center gap-2 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-zinc-400">MyGhost يفكر...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 bg-zinc-900/80 border-t border-white/10"
      >
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-500"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute left-2 p-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-zinc-500 mt-2">
          MyGhost v2.0 قد يرتكب أخطاء، يرجى التحقق من المعلومات المهمة.
        </p>
      </form>
    </div>
  );
}

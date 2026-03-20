import React, { useState, useEffect } from "react";
import { MessageSquare, Settings as SettingsIcon, Ghost, Sparkles, Github, Twitter, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Chat from "./components/Chat";
import Settings from "./components/Settings";
import { modelManager, ModelId } from "./core/model-manager";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from "firebase/firestore";
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

function MainApp() {
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<ModelId>(ModelId.GEMINI_FLASH);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync messages with Firestore
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const q = query(
      collection(db, `users/${user.uid}/messages`),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Message;
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const handleSendMessage = async (content: string) => {
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً لحفظ محادثاتك.");
      return "Error";
    }

    setIsTyping(true);
    
    // Save user message to Firestore
    try {
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        role: "user",
        content,
        timestamp: serverTimestamp(),
      });

      const response = await modelManager.generateResponse(content, messages);
      
      // Save AI response to Firestore
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        role: "assistant",
        content: response,
        timestamp: serverTimestamp(),
      });

      return response;
    } catch (error) {
      console.error("Failed to send message:", error);
      return "Error";
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessages([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleModelChange = (id: ModelId) => {
    setCurrentModelId(id);
    modelManager.setCurrentModel(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-x-0 border-t-0 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Ghost className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                MyGhost <span className="text-emerald-500">v2.0</span>
              </span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === "chat" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-400 hover:text-white"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                المحادثة
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === "settings" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-400 hover:text-white"
                )}
              >
                <SettingsIcon className="w-4 h-4" />
                الإعدادات
              </button>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-white/10" />
                  <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all border border-white/10"
                >
                  <LogIn className="w-4 h-4" />
                  دخول
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
        {!user && activeTab === "chat" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm glass p-8 rounded-3xl border-emerald-500/20">
              <Sparkles className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold">مرحباً بك في MyGhost</h3>
              <p className="text-sm text-zinc-400">سجل دخولك لحفظ محادثاتك والوصول إلى ميزات v2.0 الكاملة.</p>
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                تسجيل الدخول بجوجل
              </button>
            </div>
          </div>
        )}
        {(user || activeTab === "settings") && (
          <AnimatePresence mode="wait">
            {activeTab === "chat" ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <Chat 
                  messages={messages} 
                  setMessages={setMessages} 
                  onSendMessage={handleSendMessage} 
                  isTyping={isTyping} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1"
              >
                <Settings 
                  currentModelId={currentModelId} 
                  onModelChange={handleModelChange} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>تم التطوير بواسطة ❤️ للمطورين العرب</span>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            MyGhost v2.0 - Advanced AI Agent System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

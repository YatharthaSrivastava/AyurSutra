import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Bot,
  Send,
  User,
  Sparkles,
  PhoneCall
} from "lucide-react";

interface Message {
  id: string;
  sender: "USER" | "BOT";
  text: string;
  timestamp: string;
  category?: "DIET" | "WARNING" | "GENERAL";
}

export default function AICareAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "M-1",
      sender: "BOT",
      text: "Namaste! I am your AyurSutra AI Care Assistant. How can I assist with your Panchakarma treatment, Samsarjana Krama dietary guidelines, or recovery routine today?",
      timestamp: "10:00 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const presetQuestions = [
    "What diet is allowed on Day 2 of Samsarjana Krama?",
    "Is mild fatigue normal after Virechana purgation?",
    "What are the key rules during Snehapana oleation?",
    "When can I resume cold drinks or normal workouts?",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `M-${Date.now()}`,
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Based on classical Panchakarma guidelines: Ensure you drink warm water, avoid direct cold breeze, and maintain physical rest.";
      let category: "DIET" | "WARNING" | "GENERAL" = "GENERAL";

      const lower = query.toLowerCase();

      if (lower.includes("diet") || lower.includes("day 2") || lower.includes("samsarjana")) {
        category = "DIET";
        botResponse =
          "🌿 **Samsarjana Krama Day 2 Diet Guidelines**:\n- **Lunch**: Consume *Vilepi* (thick rice porridge cooked with 4 parts water). You may add a drop of Saindhava salt.\n- **Dinner**: Have *Akrita Yusha* (clear boiled green gram soup without oil or ghee).\n- **Strictly Avoid**: Heavy spices, raw salad, dairy, curd, cold juices, or solid rotis.";
      } else if (lower.includes("fatigue") || lower.includes("virechana") || lower.includes("weakness")) {
        category = "WARNING";
        botResponse =
          "⚡ **Clinical Note on Post-Virechana Fatigue**:\nMild weakness and digestive sensitivity are expected because toxins (pitta/kapha) and intestinal fluid were purged. Drink warm boiled water with a pinch of dry ginger (*Shunti*). If you experience severe dizziness, persistent vomiting, or extreme dry mouth, contact your Vaidya immediately.";
      } else if (lower.includes("snehapana") || lower.includes("rules") || lower.includes("oleation")) {
        category = "GENERAL";
        botResponse =
          "🧘 **Snehapana Care Rules**:\n1. Drink only warm water whenever thirsty.\n2. Do not sleep during daytime (*Diva Swapna*).\n3. Avoid suppressing natural urges (*Vega Dharana*).\n4. Eat lunch only when true hunger (*Kshut*) manifests, signaling ghee digestion.";
      } else if (lower.includes("cold") || lower.includes("workout") || lower.includes("exercise")) {
        category = "GENERAL";
        botResponse =
          "🚫 **Post-Therapy Rest Restrictions**:\nDo not perform vigorous exercise, heavy lifting, or take cold water baths during the 7 days of Paschatkarma. The body channels are expanded and delicate. Gentle walking is permitted after Day 3 of recovery.";
      }

      const botMsg: Message = {
        id: `M-${Date.now() + 1}`,
        sender: "BOT",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Bot className="w-4 h-4" />
              <span>Phase 3 Sprint 3.2 AI Assistant</span>
            </div>
            <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-emerald-300 via-teal-100 to-amber-200 bg-clip-text text-transparent">
              24/7 AI Patient Care Assistant
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Instant Panchakarma guidance for Paschatkarma diet, lifestyle restrictions, and symptoms recovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Emergency alert sent to Vaidya Rajesh Sharma desk.")}
              className="flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Contact Vaidya Emergency</span>
            </button>
          </div>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Suggested Questions:</span>
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-full text-xs text-slate-300 whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Chat Box Container */}
        <div className="glass-panel flex-1 min-h-[420px] p-6 flex flex-col justify-between space-y-4">
          {/* Messages Area */}
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "BOT" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                    <Bot className="w-4 h-4 text-slate-950" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "USER"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[9px] text-slate-400 mt-2 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "USER" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Bot className="w-4 h-4 text-amber-400 animate-spin" />
                <span>AyurSutra Care AI is composing response...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 pt-4 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="Ask about diet, therapy symptoms, or recovery rules..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

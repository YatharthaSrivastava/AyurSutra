import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Send,
  User,
  Sparkles,
  PhoneCall,
  X,
  Maximize2,
  ChevronDown
} from "lucide-react";

interface Message {
  id: string;
  sender: "USER" | "BOT";
  text: string;
  timestamp: string;
  category?: "DIET" | "WARNING" | "GENERAL";
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "What diet is allowed on Day 2 of Samsarjana Krama?",
    "Is mild fatigue normal after Virechana?",
    "What are the key rules during Snehapana?",
    "When can I resume workouts?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      let botResponse =
        "Based on classical Panchakarma guidelines: Ensure you drink warm water, avoid direct cold breeze, and maintain physical rest.";
      let category: "DIET" | "WARNING" | "GENERAL" = "GENERAL";

      const lower = query.toLowerCase();

      if (lower.includes("diet") || lower.includes("day 2") || lower.includes("samsarjana")) {
        category = "DIET";
        botResponse =
          "🌿 **Samsarjana Krama Day 2 Diet**:\n- **Lunch**: Consume *Vilepi* (thick rice porridge cooked with 4 parts water).\n- **Dinner**: Have *Akrita Yusha* (clear boiled green gram soup without oil/ghee).\n- **Strictly Avoid**: Dairy, curd, raw salad, cold drinks, or solid rotis.";
      } else if (lower.includes("fatigue") || lower.includes("virechana") || lower.includes("weakness")) {
        category = "WARNING";
        botResponse =
          "⚡ **Clinical Note on Post-Virechana Fatigue**:\nMild weakness is expected because toxins (pitta/kapha) and fluids were purged. Drink warm boiled water with dry ginger (*Shunti*). If severe dizziness occurs, contact your Vaidya immediately.";
      } else if (lower.includes("snehapana") || lower.includes("rules") || lower.includes("oleation")) {
        category = "GENERAL";
        botResponse =
          "🧘 **Snehapana Care Rules**:\n1. Drink only warm water whenever thirsty.\n2. Avoid daytime sleep (*Diva Swapna*).\n3. Do not suppress natural urges (*Vega Dharana*).\n4. Eat only when true hunger manifests.";
      } else if (lower.includes("cold") || lower.includes("workout") || lower.includes("exercise")) {
        category = "GENERAL";
        botResponse =
          "🚫 **Rest Restrictions**:\nAvoid vigorous exercise, heavy lifting, or cold water baths during the 7 days of Paschatkarma. Gentle walking is permitted after Day 3.";
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
    }, 700);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4.5 py-3.5 rounded-full shadow-2xl border-2 border-emerald-700/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Open 24/7 AI Care Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#d4a373] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-[#1b4332]"></span>
            </div>
            <span className="text-xs font-extrabold tracking-wide text-white">AI Care Assistant</span>
          </button>
        )}
      </div>

      {/* Floating Chatbot Dialog Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#1b4332]/25 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#1b4332] text-white p-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#d4a373] flex items-center justify-center font-bold text-[#1b4332] shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                  <span>AyurSutra Care AI</span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-white/70">24/7 Clinical & Samsarjana Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/patient/ai-assistant"
                title="Open Full Screen"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Emergency Button Banner */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-3.5 py-1.5 flex items-center justify-between text-[11px] shrink-0">
            <span className="text-amber-900 font-medium">Need doctor attention?</span>
            <button
              onClick={() => alert("Emergency alert dispatched to duty Vaidya.")}
              className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 underline cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Alert Vaidya</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf6f1]/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "BOT" && (
                  <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "USER"
                      ? "bg-[#1b4332] text-white rounded-br-xs shadow-sm"
                      : "bg-white border border-[#1b4332]/15 text-gray-800 rounded-bl-xs shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans font-normal">{msg.text}</p>
                  <span className="block text-[9px] opacity-60 mt-1.5 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "USER" && (
                  <div className="w-7 h-7 rounded-lg bg-[#d4a373] text-[#1b4332] flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                <Bot className="w-3.5 h-3.5 text-[#1b4332] animate-spin" />
                <span>AyurSutra Care AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Questions Chips */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-[#faf6f1] hover:bg-[#1b4332]/10 border border-[#1b4332]/15 rounded-full text-[10px] text-[#1b4332] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#b45309]" />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about diet, symptoms, or recovery..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1b4332] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#d4a373]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

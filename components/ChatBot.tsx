"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: string;
}

const quickReplies = ["Top rate now", "Compare providers", "Rate alerts", "I need help"];

const botResponses: Record<string, string> = {
  "best rate now": "Use our comparison tool to find a top rate available right now for your transfer. Rates update every 30 seconds.\n\n👉 Compare Rates Now →",
  "top rate now": "Use our comparison tool to find a top rate available right now for your transfer. Rates update every 30 seconds.\n\n👉 Compare Rates Now →",
  "compare providers": "SaveRateAfrica compares 14+ providers including Wise, Remitly, WorldRemit, Grey Finance, LemFi, SendWave and more.\n\nUse the comparison tool on the homepage to see live payouts side by side.",
  "rate alerts": "You can set a target NGN rate and we will notify you the moment a provider hits it.\n\n🔔 Go to Rate Alerts in the nav to get started.",
  "i need help": "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  help: "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  support: "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  contact: "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  "talk to someone": "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  human: "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  agent: "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible.",
  "i have a problem": "📧 We are here to help!\n\nFor support or any questions about SaveRateAfrica please email us at:\n\npatterns@saverateafrica.com\n\nOur team will get back to you as soon as possible."
};

const defaultResponse = "I am only able to help with questions about sending money to Nigeria and exchange rates.\n\nFor other support please email:\n📧 patterns@saverateafrica.com";

const welcomeMessage: Message = {
  id: "welcome",
  type: "bot",
  text: "👋 Hi there! I am the SaveRateAfrica assistant. I can help you find top NGN exchange rates, compare providers, and set rate alerts.\n\nWhat would you like to know?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && showNotification) {
      setShowNotification(false);
      if (messages.length === 0) {
        setMessages([welcomeMessage]);
      }
    }
  };

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowChips(false);
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase().trim();
      const response = botResponses[lowerText] || defaultResponse;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[9999] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_4px_16px_rgba(46,125,50,0.35)] transition-transform hover:scale-110"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {showNotification && (
          <div className="absolute -top-1 -right-1 flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-white bg-[#f6c619] text-[8px] font-bold text-[#1a1a1a]">
            1
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-[90px] right-6 z-[9998] flex h-[480px] w-[360px] flex-col overflow-hidden rounded-[16px] border border-[#c8e6c9] bg-white shadow-[0_4px_24px_rgba(46,125,50,0.12)] transition-all duration-250 ease-out sm:bottom-[90px] sm:right-6 sm:w-[360px]"
          style={{
            animation: "fadeUp 0.25s ease-out",
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#2e7d32] p-[14px_16px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] text-[14px] font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              S
            </div>
            <div>
              <div className="text-[13px] font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                SaveRateAfrica Assistant
              </div>
              <div className="text-[10px] text-[rgba(255,255,255,0.72)]">
                Ask me anything about sending money to Nigeria
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] text-[14px] text-white"
            >
              ✕
            </button>
          </div>

          {/* Live Bar */}
          <div className="flex items-center gap-2 bg-[#1b5e20] p-[5px_16px] text-[10px] text-[rgba(255,255,255,0.75)]">
            <div className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#69f0ae]"></div>
            Live rates active · 14+ providers
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#c8e6c9 transparent" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 max-w-[85%] rounded-[12px] p-[10px_14px] text-[13px] leading-[1.55] ${
                  msg.type === "bot"
                    ? "self-start rounded-br-none bg-white text-[#1a2e1a]"
                    : "self-end rounded-bl-none bg-[#2e7d32] text-white"
                }`}
                style={{ animation: "fadeUp 0.3s ease" }}
              >
                {msg.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
                <div className="mt-1 text-[9px] text-[#a5c8a5]">{msg.timestamp}</div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 max-w-[85%] self-start rounded-[12px] rounded-br-none bg-white p-[10px_14px]">
                <div className="flex gap-1">
                  <div className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#a5c8a5]"></div>
                  <div className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#a5c8a5]" style={{ animationDelay: "0.15s" }}></div>
                  <div className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#a5c8a5]" style={{ animationDelay: "0.3s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showChips && (
            <div className="flex flex-wrap gap-2 p-[8px_16px]">
              {quickReplies.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-[#c8e6c9] bg-white px-3 py-[5px] text-[11px] font-medium text-[#2e7d32] transition-all hover:bg-[#2e7d32] hover:text-white hover:border-[#2e7d32]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-center gap-2 border-t border-[#c8e6c9] bg-white p-[10px_12px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about rates..."
              className="flex-1 rounded-full border border-[#c8e6c9] bg-[#f4faf5] px-4 py-2 text-[12px] text-[#1a2e1a] outline-none placeholder:text-[#a5c8a5]"
            />
            <button
              onClick={handleSend}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#2e7d32] hover:opacity-85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 480px) {
          .fixed.bottom-6.right-6 {
            bottom: 16px;
            right: 16px;
          }
          .fixed.bottom-[90px].right-6 {
            bottom: 80px;
            right: 16px;
            width: calc(100vw - 32px);
          }
        }
      `}</style>
    </>
  );
}

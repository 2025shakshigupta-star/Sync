import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Sparkles, 
  Languages, 
  Bot, 
  User, 
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CopilotLanguage, CopilotMessage } from '../types';
import { multilingualCopilotKnowledge } from '../data/mockPortfolio';

export const ContextualCopilot: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<CopilotLanguage>('en');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-init',
      sender: 'copilot',
      text: multilingualCopilotKnowledge.en.defaultIntro,
      timestamp: 'Just now',
      lang: 'en',
    },
    {
      id: 'msg-example-user',
      sender: 'user',
      text: 'Am I over-exposed?',
      timestamp: 'Just now',
      lang: 'en',
    },
    {
      id: 'msg-example-bot',
      sender: 'copilot',
      text: multilingualCopilotKnowledge.en.answers['Am I over-exposed?'],
      timestamp: 'Just now',
      lang: 'en',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const knowledge = multilingualCopilotKnowledge[currentLang];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleLanguageChange = (lang: CopilotLanguage) => {
    setCurrentLang(lang);
    const newKnowledge = multilingualCopilotKnowledge[lang];
    setMessages(prev => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'copilot',
        text: newKnowledge.defaultIntro,
        timestamp: 'Just now',
        lang: lang,
        badge: `Switched to ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}`,
      },
    ]);
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now',
      lang: currentLang,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      // Find matched or contextual answer
      let answer = knowledge.answers[promptText];
      if (!answer) {
        // Fallback contextual response based on prompt text
        const lower = promptText.toLowerCase();
        if (lower.includes('reit') || lower.includes('real estate') || lower.includes('कमर्शियल')) {
          answer = knowledge.answers['What is a REIT and how does it reduce risk?'];
        } else if (lower.includes('score') || lower.includes('diversif') || lower.includes('स्कोर')) {
          answer = knowledge.answers['Why is my diversification score low?'];
        } else if (lower.includes('fd') || lower.includes('balance') || lower.includes('संतुलित')) {
          answer = knowledge.answers['How do I balance my fixed deposits and equity?'];
        } else {
          answer = knowledge.answers['Am I over-exposed?'];
        }
      }

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: answer,
        timestamp: 'Just now',
        lang: currentLang,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  const simulateMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const chosen = knowledge.prompts[0];
      setInputValue(chosen);
    }, 1200);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'copilot',
        text: knowledge.defaultIntro,
        timestamp: 'Just now',
        lang: currentLang,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching Screenshot 2 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Contextual Multilingual Copilot
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time portfolio intelligence answering queries in English, Hindi, and Marathi.
            </p>
          </div>

          {/* Language Selector Pills matching Screenshot 2 */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentLang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentLang === 'hi'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLanguageChange('mr')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentLang === 'mr'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Context Summary Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Active Portfolio Context:</span>
            <span className="text-cyan-400 font-mono font-semibold">₹12.50L Total</span>
            <span>·</span>
            <span className="text-slate-300 font-mono">68% Equity (₹8.5L)</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">32% FDs (₹4.0L)</span>
            <span>·</span>
            <span className="text-rose-400 font-mono">0% REITs</span>
          </div>

          <button
            onClick={handleResetChat}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear Conversation
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-xl">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {msg.badge && (
                  <div className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full mb-1">
                    {msg.badge}
                  </div>
                )}

                <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-900/40 text-blue-100 border border-blue-700/50 rounded-tr-none'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800/80 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 px-9">
                  {msg.timestamp}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing portfolio context & formulating response...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Contextual Prompts Chips */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
          {knowledge.prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700 whitespace-nowrap shrink-0 transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputValue);
          }}
          className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={simulateMic}
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Speech recognition"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? 'Listening...' : knowledge.placeholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white rounded-xl shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

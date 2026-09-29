import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  Trash2,
  Zap,
  Cpu,
  Compass,
  Smile,
  Shield,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage, PersonaType, TaskComplexity, RoomAnalysisData } from '../types';

interface DeclutterChatProps {
  roomContext: RoomAnalysisData | null;
  initialMessage?: string;
  onClearInitialMessage?: () => void;
}

export const DeclutterChat: React.FC<DeclutterChatProps> = ({
  roomContext,
  initialMessage,
  onClearInitialMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: roomContext
        ? `Hello! I've loaded your **${roomContext.roomType}** decluttering profile with ${roomContext.hotspots.length} detected friction zones. How would you like to begin? We can prioritize quick 5-minute wins, tackle a specific area, or discuss budget storage solutions.`
        : `Hello! I am your AI Decluttering & Organizing Coach. Upload a room photo for tailored spatial advice, or ask me any question about organizing principles, category decluttering, or small space storage.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [persona, setPersona] = useState<PersonaType>('organizer');
  const [complexity, setComplexity] = useState<TaskComplexity>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initialMessage triggered from outside (e.g., from hotspot card)
  useEffect(() => {
    if (initialMessage) {
      sendMessage(initialMessage);
      if (onClearInitialMessage) {
        onClearInitialMessage();
      }
    }
  }, [initialMessage]);

  const personaConfig: Record<
    PersonaType,
    { title: string; subtitle: string; icon: React.ReactNode }
  > = {
    organizer: {
      title: 'Lead Organizing Consultant',
      subtitle: 'Compassionate, balanced, practical daily routines',
      icon: <Shield className="w-4 h-4 text-emerald-600" />,
    },
    minimalist: {
      title: 'The Joyful Minimalist',
      subtitle: 'KonMari inspired, ruthless sorting, visual peace',
      icon: <Smile className="w-4 h-4 text-amber-600" />,
    },
    spatial_architect: {
      title: 'Spatial Ergonomics Architect',
      subtitle: 'Vertical storage, reach zones, layout flow',
      icon: <Compass className="w-4 h-4 text-indigo-600" />,
    },
    fast_budget: {
      title: 'Blitz & Budget Organizer',
      subtitle: '10-minute micro-sprints, zero-dollar DIY hacks',
      icon: <Zap className="w-4 h-4 text-rose-600" />,
    },
  };

  const complexityConfig: Record<
    TaskComplexity,
    { label: string; model: string; desc: string; icon: React.ReactNode }
  > = {
    complex: {
      label: 'Complex Spatial Planning',
      model: 'gemini-3.1-pro-preview',
      desc: 'Deep reasoning, structural re-zoning & custom layouts',
      icon: <Cpu className="w-3.5 h-3.5 text-purple-600" />,
    },
    general: {
      label: 'General Organizing Coaching',
      model: 'gemini-3.5-flash',
      desc: 'Balanced step-by-step guidance & category advice',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    },
    fast: {
      label: 'Fast Decision Hacks',
      model: 'gemini-3.1-flash-lite',
      desc: 'Ultra-low latency quick wins & rapid triage',
      icon: <Zap className="w-3.5 h-3.5 text-blue-500" />,
    },
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend?: string) => {
    const userText = textToSend || input.trim();
    if (!userText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Map messages for Gemini API
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          roomContext: roomContext ? JSON.stringify(roomContext) : undefined,
          persona,
          taskComplexity: complexity,
          requestedModel: complexityConfig[complexity].model,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || complexityConfig[complexity].model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat send error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Error: ${err.message || 'Failed to reach Gemini. Please verify your connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content: 'Conversation history cleared. How can I help you organize today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: complexityConfig[complexity].model,
      },
    ]);
  };

  const starterPrompts = roomContext
    ? [
        `What is the single highest-impact 10-minute task for my ${roomContext.roomType}?`,
        `Give me 3 zero-cost DIY organizing hacks using items I likely already have.`,
        `How do I decide what papers and cords to toss vs store?`,
        `Write me a customized $30 shopping list for this room's storage.`,
      ]
    : [
        'How do I begin decluttering a room that feels completely overwhelming?',
        'Explain the "1-In-1-Out" rule with real practical examples.',
        'What are the best small space organization hacks on a budget?',
        'How can I organize desk cables and electronics neatly?',
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[780px]">
        {/* Chat Header & Persona Switcher */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
                  <span>AI Declutter Coach</span>
                  {roomContext && (
                    <span className="text-[11px] font-normal font-sans text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      Grounded in: {roomContext.roomType}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-neutral-500">
                  Multi-turn spatial conversation & personalized decluttering strategy
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Persona Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
              <span className="text-neutral-400 font-medium">Role:</span>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as PersonaType)}
                className="font-semibold text-neutral-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="organizer">Lead Organizing Consultant</option>
                <option value="minimalist">The Joyful Minimalist</option>
                <option value="spatial_architect">Spatial Ergonomics Architect</option>
                <option value="fast_budget">Blitz & Budget Organizer</option>
              </select>
            </div>

            {/* Model & Complexity Switcher */}
            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
              <span className="text-neutral-400 font-medium">Model:</span>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as TaskComplexity)}
                className="font-semibold text-neutral-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="complex">gemini-3.1-pro-preview (Complex Tasks)</option>
                <option value="general">gemini-3.5-flash (General Tasks)</option>
                <option value="fast">gemini-3.1-flash-lite (Fast Tasks)</option>
              </select>
            </div>

            <button
              onClick={clearChat}
              title="Reset conversation"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Persona Banner */}
        <div className="px-5 py-2 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            {personaConfig[persona].icon}
            <span className="font-semibold text-neutral-800">{personaConfig[persona].title}:</span>
            <span className="text-neutral-500 hidden sm:inline">{personaConfig[persona].subtitle}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500">
            {complexityConfig[complexity].icon}
            <span>{complexityConfig[complexity].model}</span>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-neutral-50/20">
          {messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isUser
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-800 shadow-2xs'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-amber-500" />}
                </div>

                <div className={`space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-900 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap select-text font-sans">
                      {message.content}
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-neutral-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{message.timestamp}</span>
                    {message.modelUsed && !isUser && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{message.modelUsed}</span>
                      </>
                    )}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-200" />
                  <span className="font-mono text-[11px] text-neutral-400">
                    {complexityConfig[complexity].model} thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts */}
        <div className="px-4 py-2 border-t border-neutral-100 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap shrink-0">
              Suggestions:
            </span>
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-neutral-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={2}
                placeholder={`Ask ${personaConfig[persona].title} anything about decluttering, storage, or sorting...`}
                className="w-full resize-none px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                isLoading || !input.trim()
                  ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 px-1">
            <span>Shift + Enter for new line · Enter to send</span>
            <span>Task complexity: {complexityConfig[complexity].label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

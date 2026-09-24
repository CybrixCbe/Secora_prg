import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, ShieldAlert, ShieldCheck, Activity, Globe as GlobeIcon, Target } from 'lucide-react';
import Globe from '../components/Globe';
import { api } from '../services/api';

type SenderType = 'user' | 'ai';

interface ChatMessage {
  sender: SenderType;
  text: string;
  time: string;
  items?: string[];
  footer?: string;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  sender: 'ai',
  text: 'Workspace intelligence operational. Ask me anything about exposed TCP sockets, DNS records, Clickjacking frame settings, or general server vulnerabilities.',
  footer: 'SECORA AI is here to help.',
  time: '10:42 AM'
};

export default function Intelligence() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [sendingChat, setSendingChat] = useState(false);
  const [clearingChat, setClearingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load user's active session or clean slate if expired (>24h)
  useEffect(() => {
    api.getChatSession()
      .then(res => {
        if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
          const mapped: ChatMessage[] = res.messages.map((m: any) => ({
            sender: m.role === 'user' ? 'user' : 'ai',
            text: m.content,
            time: m.timestamp ? m.timestamp.split(' ')[1]?.substring(0, 5) || 'Recent' : 'Recent'
          }));
          setChatHistory(mapped);
        } else {
          setChatHistory([
            {
              sender: 'ai',
              text: res.welcome_message || DEFAULT_WELCOME_MESSAGE.text,
              footer: 'SECORA AI is here to help.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      })
      .catch(err => {
        console.error("Failed to load chat session:", err);
      });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText, time: timeString }]);
    setSendingChat(true);

    try {
      const res = await api.sendChatMessage(userText);
      const reply = res.response || (res.success === false ? res.error : "SECORA AI is temporarily unavailable. Please try again shortly.");
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: reply, 
        time: timeString 
      }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: "SECORA AI is temporarily unavailable. Please try again shortly.", 
        time: timeString 
      }]);
    } finally {
      setSendingChat(false);
    }
  };

  const handleClearChat = async () => {
    if (clearingChat) return;
    setClearingChat(true);
    try {
      const res = await api.clearChat();
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatHistory([
        {
          sender: 'ai',
          text: res.welcome_message || "Welcome back to SECORA. How can I assist with your security reconnaissance today?",
          footer: 'SECORA AI is here to help.',
          time: timeString
        }
      ]);
    } catch (err) {
      console.error("Clear chat failed:", err);
    } finally {
      setClearingChat(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 flex flex-col gap-10 flex-grow">
      
      {/* Header Description */}
      <div className="flex flex-col gap-2 border-b border-border/30 pb-6">
        <span className="font-heading text-[10px] text-text-secondary tracking-[0.2em]">[ SECORA / INTELLIGENCE / 03 ]</span>
        <h1 className="font-display-lg text-4xl text-text-primary tracking-tight font-light uppercase">
          SECURITY INTELLIGENCE.
        </h1>
        <p className="font-body text-sm text-text-secondary max-w-2xl leading-relaxed mt-2">
          Review recent reconnaissance findings and identify areas that may require further investigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive 3D Globe Visualization with Metrics details */}
        <div className="lg:col-span-6 flex flex-col border border-border bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <span className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider">HOLOGRAPHIC THREAT GLOBE</span>
            </div>
            <span className="flex items-center gap-2 text-[9px] font-mono text-text-secondary">
              <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,107,95,0.4)]"></span>
              LIVE FEED
            </span>
          </div>

          {/* Sub Header Badge */}
          <div className="px-6 pt-4">
            <div className="inline-flex items-center gap-2 bg-secondary/5 border border-secondary/20 px-3 py-1 rounded-full text-secondary font-heading text-[10px] uppercase font-bold">
              🌐 3D GLOBE ACTIVE
            </div>
          </div>

          {/* Body Section: Metrics left, Globe right */}
          <div className="grid grid-cols-12 gap-6 px-6 py-6 items-center">
            
            {/* Stat Cards list */}
            <div className="col-span-12 sm:col-span-5 flex flex-col gap-3">
              {/* Stat 1 */}
              <div className="border border-border bg-surface-container-lowest p-3 flex items-center gap-3 rounded-md shadow-sm">
                <Activity className="h-4 w-4 text-secondary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-text-secondary uppercase">TOTAL EVENTS</span>
                  <span className="text-sm font-heading font-bold text-text-primary">12,845</span>
                  <span className="text-[8px] text-text-secondary font-mono">Last 24h</span>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="border border-border bg-surface-container-lowest p-3 flex items-center gap-3 rounded-md shadow-sm">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-text-secondary uppercase">HIGH RISK</span>
                  <span className="text-sm font-heading font-bold text-text-primary text-red-600">238</span>
                  <span className="text-[8px] text-text-secondary font-mono">Last 24h</span>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="border border-border bg-surface-container-lowest p-3 flex items-center gap-3 rounded-md shadow-sm">
                <GlobeIcon className="h-4 w-4 text-secondary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-text-secondary uppercase">ATTACK SOURCES</span>
                  <span className="text-sm font-heading font-bold text-text-primary">98</span>
                  <span className="text-[8px] text-text-secondary font-mono">Last 24h</span>
                </div>
              </div>
              {/* Stat 4 */}
              <div className="border border-border bg-surface-container-lowest p-3 flex items-center gap-3 rounded-md shadow-sm">
                <Target className="h-4 w-4 text-secondary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-text-secondary uppercase">ACTIVE TARGETS</span>
                  <span className="text-sm font-heading font-bold text-text-primary">124</span>
                  <span className="text-[8px] text-text-secondary font-mono">Last 24h</span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Globe Area */}
            <div className="col-span-12 sm:col-span-7 relative flex items-center justify-center min-h-[300px]">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-secondary/10 rounded-full blur-lg pointer-events-none"></div>
              <Globe />
            </div>

          </div>

          {/* Bottom Risk Grid Status */}
          <div className="border-t border-border px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-container-low/50">
            <div className="flex flex-col border border-border/60 bg-surface-container-lowest p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[8px] font-mono text-text-secondary uppercase">LOW RISK</span>
              </div>
              <span className="text-xs font-heading font-bold text-text-primary mt-1">1,238</span>
            </div>
            <div className="flex flex-col border border-border/60 bg-surface-container-lowest p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="text-[8px] font-mono text-text-secondary uppercase">MEDIUM RISK</span>
              </div>
              <span className="text-xs font-heading font-bold text-text-primary mt-1">3,421</span>
            </div>
            <div className="flex flex-col border border-border/60 bg-surface-container-lowest p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="text-[8px] font-mono text-text-secondary uppercase">HIGH RISK</span>
              </div>
              <span className="text-xs font-heading font-bold text-text-primary mt-1">238</span>
            </div>
            <div className="flex flex-col border border-border/60 bg-surface-container-lowest p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span className="text-[8px] font-mono text-text-secondary uppercase">CRITICAL</span>
              </div>
              <span className="text-xs font-heading font-bold text-text-primary mt-1">67</span>
            </div>
          </div>

        </div>

        {/* Right Column: Full Workspace AI Assistant Chat */}
        <div className="lg:col-span-6 flex flex-col border border-border bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden h-[540px]">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-border bg-surface-container-lowest flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider">SECORA WORKSPACE ASSISTANT</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearChat}
                disabled={clearingChat || sendingChat}
                className="font-mono text-[9px] text-text-secondary hover:text-secondary tracking-wider uppercase transition-colors px-2 py-0.5 rounded-[14px] hover:bg-secondary/10 cursor-pointer disabled:opacity-40"
                title="Clear current active conversation"
              >
                {clearingChat ? "CLEARING..." : "CLEAR CHAT"}
              </button>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                ACTIVE
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {chatHistory.map((chat, idx) => (
              <div key={idx}>
                {chat.sender === 'ai' ? (
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full border border-secondary/20 bg-secondary/5 flex items-center justify-center shrink-0">
                      <BrainCircuit className="h-4.5 w-4.5 text-secondary" />
                    </div>
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div className="bg-surface-container-low border border-border p-4 rounded-xl text-text-primary text-xs leading-relaxed">
                        <p className="whitespace-pre-line">{chat.text}</p>
                        {chat.items && (
                          <ul className="mt-3 space-y-2">
                            {chat.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-text-secondary">
                                <span className="text-secondary font-bold">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {chat.footer && (
                          <p className="mt-3 font-semibold text-text-secondary">{chat.footer}</p>
                        )}
                      </div>
                      <span className="text-[9px] text-text-secondary font-mono self-start ml-1">{chat.time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-start justify-end">
                    <div className="flex flex-col gap-1 items-end max-w-[80%]">
                      <div className="bg-secondary text-white p-4 rounded-xl text-xs leading-relaxed shadow-sm">
                        {chat.text}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 mr-1 text-text-secondary">
                        <span className="text-[9px] font-mono">{chat.time}</span>
                        <span className="text-secondary text-[10px] font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {sendingChat && (
              <div className="flex justify-start">
                <div className="bg-surface-container-low text-text-secondary border border-border p-4 rounded-xl flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce delay-100"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="p-4 border-t border-border bg-surface-container-low/50 flex gap-3">
            <input 
              type="text" 
              placeholder="Ask Secora AI..."
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              className="flex-grow px-4 py-3 bg-surface-container-lowest border border-border text-xs focus:border-secondary focus:outline-none rounded-full"
              disabled={sendingChat}
            />
            <button 
              type="submit"
              disabled={sendingChat || !chatMessage.trim()}
              className="w-10 h-10 bg-secondary hover:bg-secondary-hover text-white rounded-full transition-all disabled:opacity-40 flex items-center justify-center shrink-0"
            >
              →
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

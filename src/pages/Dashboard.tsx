import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Activity, Terminal, AlertTriangle, CheckCircle2, ArrowRight, Radio } from 'lucide-react';

import { api } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Chat Widget State

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Analyst session connected. Ask me anything regarding perimeter exposures, DNS misconfigurations, SSL cipher weaknesses, or security mitigations.' }
  ]);
  const [sendingChat, setSendingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard statistics.");
        setLoading(false);
      });

    // Load active session for dashboard widget
    api.getChatSession()
      .then(res => {
        if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
          const mapped = res.messages.map((m: any) => ({
            sender: (m.role === 'user' ? 'user' : 'ai') as 'user' | 'ai',
            text: m.content
          }));
          setChatHistory(mapped);
        } else if (res.welcome_message) {
          setChatHistory([{ sender: 'ai', text: res.welcome_message }]);
        }
      })
      .catch(err => {
        console.error("Failed to load dashboard chat session:", err);
      });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setSendingChat(true);

    try {
      const res = await api.sendChatMessage(userText);
      const reply = res.response || (res.success === false ? res.error : "SECORA AI is temporarily unavailable. Please try again shortly.");
      setChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: "SECORA AI is temporarily unavailable. Please try again shortly." }]);
    } finally {
      setSendingChat(false);
    }
  };

  if (loading) {

    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
          <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">LOADING WORKSPACE TELEMETRY...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 min-h-[60vh]">
        <div className="bg-[#0b1c18] border border-red-500/30 max-w-md p-8 text-center space-y-4 rounded-sm">
          <h3 className="font-heading font-bold text-sm text-red-400 uppercase tracking-wider">Telemetry Offline</h3>
          <p className="text-xs text-white/70 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider transition-all rounded-xs cursor-pointer"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  const { stats = { total_scans: 0, unique_domains: 0, high_risk_count: 0 }, activity_logs = [], username = "Analyst" } = data || {};

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8 flex-grow">
      
      {/* Top Welcome Panel with Dark Emerald Gradients */}
      <section className="bg-[#081512] border border-white/10 p-8 sm:p-10 relative overflow-hidden rounded-sm shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-12 gap-8 relative z-10">
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SECORA // WORKSTATION ACTIVE</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white uppercase tracking-tight mb-4">
                Welcome, <span className="font-semibold text-emerald-400">{username}</span>
              </h1>
              
              <p className="font-body text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed mb-6">
                Your reconnaissance environment is initialized and synchronized. Launch targeted sweeps across authorized public perimeters or review threat intelligence telemetry.
              </p>
            </div>

            {/* Quick Recon Action */}
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => navigate('/reconnaissance')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider uppercase px-6 py-3 transition-all flex items-center justify-center gap-2 rounded-xs shrink-0 cursor-pointer shadow-md hover:shadow-emerald-900/40 group"
              >
                <span>EXECUTE SWEEP</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          
          {/* Abstract Telemetry Indicator */}
          <div className="hidden lg:flex col-span-4 relative flex-col justify-between p-6 border border-white/10 bg-black/30 rounded-xs">
            <div className="flex justify-between items-center font-mono text-[9px] text-white/50 border-b border-white/10 pb-3">
              <span className="text-emerald-400">TELEMETRY // FEED</span>
              <span>NODE: EAST-01</span>
            </div>

            <div className="my-6 space-y-3 font-mono text-[10px]">
              <div className="flex justify-between text-white/70">
                <span>DNS RESOLVER:</span>
                <span className="text-emerald-400">PASSIVE SECURE</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>BGP ASSET MAP:</span>
                <span className="text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>PORT PROBE MODE:</span>
                <span className="text-emerald-400">NON-INTRUSIVE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center font-mono text-[9px] text-white/40">
              <span>LATENCY: 11.8ms</span>
              <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#081512] border border-white/10 hover:border-emerald-400/40 transition-all p-6 flex flex-col justify-between rounded-sm relative group">
          <div className="flex items-center justify-between font-mono text-[9px] text-white/50 mb-4">
            <span className="text-emerald-400 font-bold">01 // RECON CYCLES</span>
            <span>TOTAL RUNS</span>
          </div>
          <div className="my-2">
            <span className="font-heading text-4xl text-white font-light tracking-tight">{stats.total_scans}</span>
          </div>
          <div className="pt-3 border-t border-white/10 mt-2 flex justify-between items-center">
            <Link to="/history" className="text-emerald-400 hover:text-emerald-300 font-mono text-[10px] flex items-center gap-1">
              <span>EXPLORE ALL SCANS</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-[#081512] border border-white/10 hover:border-emerald-400/40 transition-all p-6 flex flex-col justify-between rounded-sm relative group">
          <div className="flex items-center justify-between font-mono text-[9px] text-white/50 mb-4">
            <span className="text-emerald-400 font-bold">02 // ASSET CATALOG</span>
            <span>UNIQUE PERIMETERS</span>
          </div>
          <div className="my-2">
            <span className="font-heading text-4xl text-emerald-400 font-light tracking-tight">{stats.unique_domains}</span>
          </div>
          <div className="pt-3 border-t border-white/10 mt-2 flex justify-between items-center text-white/60 font-mono text-[10px]">
            <span>MONITORED TARGETS</span>
            <span className="text-emerald-400">VALIDATED</span>
          </div>
        </div>

        <div className="bg-[#081512] border border-white/10 hover:border-red-400/40 transition-all p-6 flex flex-col justify-between rounded-sm relative group">
          <div className="flex items-center justify-between font-mono text-[9px] text-white/50 mb-4">
            <span className="text-red-400 font-bold">03 // EXPOSURE INDEX</span>
            <span>ELEVATED FINDINGS</span>
          </div>
          <div className="my-2">
            <span className="font-heading text-4xl text-red-400 font-light tracking-tight">{stats.high_risk_count}</span>
          </div>
          <div className="pt-3 border-t border-white/10 mt-2 flex justify-between items-center text-white/60 font-mono text-[10px]">
            <span>CRITICAL OBSERVATIONS</span>
            <span className="text-red-400">PRIORITY</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Recent Activity & AI Security Advisor */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left: Recent Activity Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-heading text-xs uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>RECENT TELEMETRY & SCAN RUNS</span>
            </h2>
            <Link to="/history" className="font-mono text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <span>VIEW FULL HISTORY</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#081512] border border-white/10 divide-y divide-white/10 rounded-sm overflow-hidden">
            {activity_logs.length === 0 ? (
              <div className="p-10 text-center text-xs text-white/50 font-mono uppercase tracking-wider">
                No active reconnaissance scans recorded in database
              </div>
            ) : (
              activity_logs.map((log: any) => (
                <div key={log.id} className="grid grid-cols-12 items-center p-4 hover:bg-white/5 transition-colors text-xs gap-4">
                  {/* Col 1: ID */}
                  <div className="col-span-2 sm:col-span-1">
                    <span className="font-mono text-[10px] text-white/40">
                      #{log.id}
                    </span>
                  </div>

                  {/* Col 2: Action / Target */}
                  <div className="col-span-6 sm:col-span-4">
                    <span className="font-medium text-white text-xs truncate block">
                      {log.action || log.activity_type || "Recon Sweep"}
                    </span>
                    <span className="font-mono text-[9px] text-white/40 block mt-0.5">
                      {log.timestamp ? log.timestamp.split(' ')[0] : 'Today'}
                    </span>
                  </div>

                  {/* Col 3: Details */}
                  <div className="hidden sm:block col-span-4">
                    <span className="font-mono text-[10px] text-white/60 truncate block" title={log.details}>
                      {log.details || "Telemetry indexed"}
                    </span>
                  </div>

                  {/* Col 4: Status Indicator */}
                  <div className="col-span-4 sm:col-span-3 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xs font-mono text-[9px] text-emerald-400 font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      COMPLETED
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Security AI Assistant */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="bg-[#081512] border border-white/10 p-6 flex flex-col gap-5 rounded-sm sticky top-24 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="font-heading text-xs uppercase tracking-widest text-white font-bold">SECORA AI ADVISOR</h3>
              </div>
              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">● ONLINE</span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-body">
              Context-aware security assistant analyzing discovered ports, DNS zone records, SSL ciphers, and defensive posture.
            </p>

            {/* Quick Prompts */}
            <div className="flex flex-col gap-1.5 font-mono text-[10px]">
              <button 
                type="button"
                onClick={() => {
                  setChatMessage("Explain my latest scan");
                  const userText = "Explain my latest scan";
                  setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
                  setSendingChat(true);
                  api.sendChatMessage(userText)
                    .then(res => {
                      const reply = res.response || (res.success === false ? res.error : "No response generated.");
                      setChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
                    })
                    .catch((err: any) => {
                      setChatHistory(prev => [...prev, { sender: 'ai', text: err?.message || "Error reaching SECORA AI." }]);
                    })
                    .finally(() => setSendingChat(false));
                }} 
                className="text-left text-emerald-400 hover:text-emerald-300 py-1 transition-colors cursor-pointer"
              >
                → Explain latest perimeter sweep
              </button>
              <button 
                type="button"
                onClick={() => {
                  setChatMessage("What are the risks in recent findings?");
                  const userText = "What are the risks in recent findings?";
                  setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
                  setSendingChat(true);
                  api.sendChatMessage(userText)
                    .then(res => {
                      const reply = res.response || (res.success === false ? res.error : "No response generated.");
                      setChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
                    })
                    .catch((err: any) => {
                      setChatHistory(prev => [...prev, { sender: 'ai', text: err?.message || "Error reaching SECORA AI." }]);
                    })
                    .finally(() => setSendingChat(false));
                }} 
                className="text-left text-emerald-400 hover:text-emerald-300 py-1 transition-colors cursor-pointer"
              >
                → Summarize exposure vulnerabilities
              </button>
              <Link to="/intelligence" className="text-left text-emerald-400 hover:text-emerald-300 py-1 transition-colors">
                → Open Full Intelligence Console
              </Link>
            </div>

            {/* Chat Conversation History */}
            {chatHistory.length > 1 && (
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto p-3 bg-black/40 border border-white/10 rounded-xs text-xs">
                {chatHistory.slice(1).map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2.5 rounded-xs text-xs leading-relaxed max-w-[90%] whitespace-pre-line ${
                      msg.sender === 'user' ? 'bg-emerald-600 text-white font-medium' : 'bg-[#0f241f] border border-white/10 text-white/90'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {sendingChat && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span>Analyzing threat records...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
            )}

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="relative mt-2">
              <input 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Ask SECORA AI..." 
                type="text"
                disabled={sendingChat}
                className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 text-white placeholder-white/30 text-xs py-2.5 pl-3 pr-9 outline-none transition-colors rounded-xs"
              />
              <button 
                type="submit"
                disabled={sendingChat || !chatMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-30 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

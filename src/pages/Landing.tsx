import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, Radio, ArrowRight, Terminal, CheckCircle2, Lock, Activity, Cpu } from 'lucide-react';
import secoraLogo from '../assets/secora-logo.png';
import secoraFoliage from '../assets/secora-foliage.jpg';
import TacticalRadar from '../components/TacticalRadar';

export default function Landing() {
  const navigate = useNavigate();
  const [activePerimeter, setActivePerimeter] = useState<'01' | '02' | '03' | '04'>('01');

  return (
    <div className="min-h-screen bg-[#06100e] font-body text-white blueprint-bg flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#06100e]/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 md:px-16">
        <div className="flex items-center gap-3">
          <img 
            src={secoraLogo} 
            alt="SECORA Logo" 
            className="h-8 w-8 rounded-md object-cover shadow-sm border border-white/20"
          />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-white tracking-[0.2em] uppercase text-sm">SECORA</span>
            <span className="font-mono text-[8px] text-white/50 tracking-wider">RECONNAISSANCE PLATFORM</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline font-mono text-[10px] text-emerald-400 uppercase tracking-widest">[SYS_ID: SEC-ART-648]</span>
          <button
            onClick={() => navigate('/login')}
            className="font-heading text-xs uppercase tracking-widest px-5 py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-400 text-white hover:text-emerald-300 transition-all rounded-xs cursor-pointer"
          >
            Sign In →
          </button>
        </div>
      </header>

      <main className="pt-16 flex-grow">
        
        {/* Hero Section with Botanical Atmosphere & High-Tech Overlays */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-16 border-b border-white/10 overflow-hidden">
          
          {/* Ambient Botanical Backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none filter blur-sm scale-105"
            style={{ backgroundImage: `url(${secoraFoliage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06100e] via-[#06100e]/70 to-transparent pointer-events-none" />

          {/* Large Ghost Typography */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.015] pointer-events-none flex items-center justify-center select-none">
            <span className="font-heading font-bold text-[20vw] leading-none text-white tracking-tighter">SECORA</span>
          </div>
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 relative z-10 py-16">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 md:gap-10">
              
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">[ SECORA / PASSIVE RECONNAISSANCE ]</span>
                <div className="h-px flex-grow bg-white/10"></div>
                <span className="font-mono text-[9px] text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SYS.STATUS // ONLINE
                </span>
              </div>

              <div>
                <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light uppercase leading-[1.05] tracking-tight">
                  <span className="text-white block">WHAT CAN THE</span>
                  <span className="text-white block">INTERNET REVEAL</span>
                  <span className="text-emerald-400 block font-medium">ABOUT YOU?</span>
                </h1>
              </div>

              <p className="font-body text-base text-white/70 max-w-2xl leading-relaxed">
                Gather surface-level intelligence about a target domain or IP without active intrusion. SECORA provides a surgical view of the attack surface your infrastructure exposes to potential observers.
              </p>

              <div className="flex items-center gap-6 flex-wrap pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 transition-all duration-300 font-heading text-xs uppercase tracking-widest rounded-xs shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <span className="font-bold">EXPLORE SECORA</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-3 rounded-xs">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  <span className="font-mono text-[9px] text-white/80 uppercase tracking-wider">PASSIVE INTELLIGENCE / ZERO-INTRUSION</span>
                </div>
              </div>
            </div>

            {/* Tactical Radar HUD Console */}
            <div className="hidden lg:flex col-span-4 items-center justify-center">
              <TacticalRadar />
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="border-t border-white/10 px-6 md:px-16 py-3.5 flex items-center justify-between font-mono text-[9px] text-white/50 bg-[#06100e]/70">
            <div className="flex items-center gap-6">
              <span>DATA.COLLECTION // STANDBY</span>
              <span className="hidden sm:inline">RECON.ENGINE // V1.0</span>
            </div>
            <span className="text-emerald-400">[ SCROLL TO EXPLORE ]</span>
          </div>
        </section>

        {/* Section 02: Look Before You Test */}
        <section className="relative py-24 px-6 md:px-16 border-b border-white/10 bg-[#081512]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">[ 02 / RECON ]</span>
                <div className="h-px w-full bg-white/10 my-6"></div>
                <h3 className="font-heading text-lg text-white uppercase tracking-wider font-semibold">Look Before You Test</h3>
                <p className="font-body text-xs text-white/70 leading-relaxed mt-4">
                  Surface mapping precedes every diagnostic cycle. SECORA structures reconnaissance into three distinct phases to establish situational awareness without generating intrusive telemetry.
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-white/10 hidden md:block">
                <span className="font-mono text-[9px] text-white/40 block mb-2">ENGAGEMENT PROTOCOL</span>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">ZERO INTRUSION STANDARD</span>
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: '01',
                  name: 'PASSIVE COLLECTION',
                  desc: 'Discover subdomains, DNS records, and registrar data via public registries and CT logs.',
                  tag: 'WHOIS / DNS'
                },
                {
                  step: '02',
                  name: 'SURFACE INVENTORY',
                  desc: 'Enumerate open listening ports, TLS configurations, and HTTP response security headers.',
                  tag: 'NETWORK / SSL'
                },
                {
                  step: '03',
                  name: 'RISK DIAGNOSIS',
                  desc: 'Synthesize findings into actionable vulnerability metrics and mitigation guidance.',
                  tag: 'INTELLIGENCE'
                }
              ].map((card) => (
                <div 
                  key={card.step} 
                  className="bg-[#0b1c18] border border-white/10 hover:border-emerald-400/40 p-6 flex flex-col justify-between transition-all rounded-xs group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
                        [ {card.step} ]
                      </span>
                      <span className="font-mono text-[8px] text-white/50 uppercase">{card.tag}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-2">
                      {card.name}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                    <span>READY</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Section 03: Mapping the Perimeter (Interactive SVG Attack Surface Graph) */}
        <section className="py-24 px-6 md:px-16 border-b border-white/10 bg-[#06100e]">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-white/10 pb-6 gap-4">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">[ 03 / FOOTPRINT ]</span>
                <h2 className="font-heading text-3xl sm:text-4xl text-white uppercase tracking-tight mt-2">MAPPING THE PERIMETER</h2>
              </div>
              <p className="font-body text-xs text-white/60 max-w-md">
                Interactive topological visualization of discovered hostnames, BGP routing, nameservers, and network listeners.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Dark Precision Topology SVG Graph */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="relative aspect-[4/3] bg-[#071411] border border-white/15 rounded-sm overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Graph Header Telemetry */}
                  <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex justify-between items-center font-mono text-[9px] text-white/60">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-emerald-400 font-bold">TOPOLOGY // ACTIVE</span>
                    </span>
                    <span>LAYER: {
                      activePerimeter === '01' ? 'DOMAIN HIERARCHY' :
                      activePerimeter === '02' ? 'BGP & IP CIDR' :
                      activePerimeter === '03' ? 'DNS & SPF ZONES' : 'PORT / SERVICE AUDIT'
                    }</span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative flex-grow p-4 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 340 280">
                      <defs>
                        <linearGradient id="glowLineDark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>

                      {/* Connection Links */}
                      <line x1="170" y1="140" x2="80" y2="70" stroke={activePerimeter === '01' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '01' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="260" y2="70" stroke={activePerimeter === '01' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '01' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="55" y2="155" stroke={activePerimeter === '02' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '02' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="285" y2="155" stroke={activePerimeter === '02' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '02' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="105" y2="225" stroke={activePerimeter === '03' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '03' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="235" y2="225" stroke={activePerimeter === '03' ? '#10b981' : '#1e3831'} strokeWidth={activePerimeter === '03' ? '2' : '1'} />
                      <line x1="170" y1="140" x2="170" y2="45" stroke={activePerimeter === '04' ? '#ef4444' : '#1e3831'} strokeWidth={activePerimeter === '04' ? '2' : '1'} strokeDasharray={activePerimeter === '04' ? 'none' : '3,3'} />

                      {/* Center Root Node */}
                      <circle cx="170" cy="140" r="22" fill="#0b241d" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="170" cy="140" r="8" fill="#10b981" />
                      <text x="170" y="172" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">TARGET.DOMAIN [ROOT]</text>

                      {/* Layer 01: Subdomains */}
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('01')}>
                        <circle cx="80" cy="70" r="14" fill={activePerimeter === '01' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '01' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="80" y="73" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">API</text>
                        <text x="80" y="94" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">api.target</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('01')}>
                        <circle cx="260" cy="70" r="14" fill={activePerimeter === '01' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '01' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="260" y="73" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">SSO</text>
                        <text x="260" y="94" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">admin.sso</text>
                      </g>

                      {/* Layer 02: IP & BGP */}
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('02')}>
                        <circle cx="55" cy="155" r="14" fill={activePerimeter === '02' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '02' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="55" y="158" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">BGP</text>
                        <text x="55" y="178" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">AS13335</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('02')}>
                        <circle cx="285" cy="155" r="14" fill={activePerimeter === '02' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '02' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="285" y="158" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">CIDR</text>
                        <text x="285" y="178" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">104.21.32.0/24</text>
                      </g>

                      {/* Layer 03: DNS Records */}
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('03')}>
                        <circle cx="105" cy="225" r="14" fill={activePerimeter === '03' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '03' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="105" y="228" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">NS</text>
                        <text x="105" y="248" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">ns1.dns.zone</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('03')}>
                        <circle cx="235" cy="225" r="14" fill={activePerimeter === '03' ? '#0f3227' : '#0a1a15'} stroke={activePerimeter === '03' ? '#10b981' : '#28463e'} strokeWidth="1.5" />
                        <text x="235" y="228" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">MX</text>
                        <text x="235" y="248" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontFamily="monospace">mail.relay</text>
                      </g>

                      {/* Layer 04: Open Port */}
                      <g className="cursor-pointer" onClick={() => setActivePerimeter('04')}>
                        <circle cx="170" cy="45" r="15" fill={activePerimeter === '04' ? '#2d1212' : '#0a1a15'} stroke={activePerimeter === '04' ? '#ef4444' : '#28463e'} strokeWidth="1.5" />
                        <circle cx="170" cy="45" r="5" fill={activePerimeter === '04' ? '#ef4444' : '#10b981'} />
                        <text x="170" y="26" textAnchor="middle" fill={activePerimeter === '04' ? '#ef4444' : '#e5e7eb'} fontSize="7.5" fontFamily="monospace" fontWeight="bold">PORT 443 / TLS 1.3</text>
                        <text x="170" y="68" textAnchor="middle" fill="#9ca3af" fontSize="6.5" fontFamily="monospace">ACTIVE LISTENER</text>
                      </g>
                    </svg>
                  </div>

                  {/* Footer Telemetry */}
                  <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex justify-between items-center font-mono text-[8px] text-white/60">
                    <span>MODE: NON-INTRUSIVE</span>
                    <span className="text-emerald-400 font-bold">RTT: 14.2 MS</span>
                    <span>100% CLIENT-SIDE</span>
                  </div>
                </div>

                {/* Quick Selector Tabs */}
                <div className="grid grid-cols-4 gap-2 font-mono text-[9px]">
                  {[
                    { id: '01', label: 'DOMAIN' },
                    { id: '02', label: 'IP / BGP' },
                    { id: '03', label: 'DNS' },
                    { id: '04', label: 'PORTS' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActivePerimeter(tab.id as '01' | '02' | '03' | '04')}
                      className={`py-2 px-2 border text-center transition-all cursor-pointer rounded-xs ${
                        activePerimeter === tab.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold shadow-xs'
                          : 'border-white/10 bg-[#081512] hover:bg-white/5 text-white/60'
                      }`}
                    >
                      {tab.id} // {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Vector Cards */}
              <div className="lg:col-span-6 flex flex-col border border-white/10 bg-[#081512] divide-y divide-white/10 rounded-sm">
                {[
                  {
                    idx: '01',
                    title: 'DOMAIN TOPOLOGY',
                    desc: 'Discovering subdomains, associated top-level domains, vanity assets, and historical certificate transparency (CT) log entries.',
                    badges: ['CT LOGS', 'SUB-ENUMERATION', 'CNAME MAP'],
                    telemetry: 'DETECTED: 18 ASSETS · RECURSION DEPTH: 4',
                  },
                  {
                    idx: '02',
                    title: 'IP ADDRESS SPACE',
                    desc: 'Mapping routing tables, Autonomous System Numbers (ASNs), cloud infrastructure IP blocks, and physical datacenter coordinates.',
                    badges: ['BGP ROUTING', 'ASN LOOKUP', 'GEO-COORDS'],
                    telemetry: 'PRIMARY: AS13335 (CLOUDFLARE) · ORIGIN: US-EAST',
                  },
                  {
                    idx: '03',
                    title: 'DNS RECORDS',
                    desc: 'Authoritative nameserver analysis resolving MX, TXT, SPF, and DMARC configurations to detect email security and zone vulnerabilities.',
                    badges: ['SPF / DMARC', 'MX RELAY', 'NS DELEGATION'],
                    telemetry: 'NAMESERVERS: 2 CLUSTERS · DNSSEC: ENFORCED',
                  },
                  {
                    idx: '04',
                    title: 'OPEN PORTS',
                    desc: 'Non-intrusive TCP SYN banner inspection to identify active HTTP daemons, administrative panels, and cipher suite configurations.',
                    badges: ['SYN STEALTH', 'TLS 1.3', 'BANNER AUDIT'],
                    telemetry: 'ACTIVE: 80, 443 · ENCRYPTION: PFS ENABLED',
                  },
                ].map((item) => {
                  const isActive = activePerimeter === item.idx;
                  return (
                    <div
                      key={item.idx}
                      onClick={() => setActivePerimeter(item.idx as '01' | '02' | '03' | '04')}
                      onMouseEnter={() => setActivePerimeter(item.idx as '01' | '02' | '03' | '04')}
                      className={`p-6 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-[#0d221d] border-l-4 border-l-emerald-400 pl-5'
                          : 'hover:bg-white/5 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-base font-bold ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                            {item.idx}
                          </span>
                          <h4 className={`font-heading font-bold text-sm uppercase tracking-wider ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {item.title}
                          </h4>
                        </div>
                        {isActive && (
                          <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-300 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xs font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            ACTIVE LAYER
                          </span>
                        )}
                      </div>

                      <p className="font-body text-xs text-white/60 leading-relaxed mb-4">
                        {item.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.badges.map((b) => (
                          <span key={b} className="font-mono text-[8px] px-2 py-0.5 bg-black/40 border border-white/10 text-white/60">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="font-mono text-[8px] text-white/50 pt-2.5 border-t border-white/10 flex items-center justify-between">
                        <span>{item.telemetry}</span>
                        <ArrowRight className={`h-3 w-3 transition-transform ${isActive ? 'text-emerald-400 translate-x-1' : 'text-white/30'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* Section 04: Engagement Vectors */}
        <section className="py-24 px-6 md:px-16 border-b border-white/10 bg-[#081512]">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
              <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">[ 04 / METHODS ]</span>
              <h2 className="font-heading text-3xl sm:text-4xl text-white uppercase tracking-tight">ENGAGEMENT VECTORS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b1c18] border border-white/10 p-10 flex flex-col gap-6 hover:border-emerald-400/30 transition-all rounded-xs">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <Eye className="h-7 w-7 text-emerald-400" />
                  <h3 className="font-heading text-xl text-white uppercase tracking-wider">Passive Collection</h3>
                </div>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  Gathering intelligence without directly interacting with the target's infrastructure. Utilizing public records, search engines, and third-party datasets to build an attack profile stealthily.
                </p>
                <ul className="font-mono text-[10px] text-white/60 flex flex-col gap-2.5 mt-auto pt-6 border-t border-white/10">
                  {['OSINT Collection', 'WHOIS Lookups', 'Certificate Transparency Logs'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0b1c18] border border-white/10 p-10 flex flex-col gap-6 hover:border-emerald-400/30 transition-all rounded-xs">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <Radio className="h-7 w-7 text-emerald-400" />
                  <h3 className="font-heading text-xl text-white uppercase tracking-wider">Active Probing</h3>
                </div>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  Direct engagement with target systems to elicit responses. Requires careful execution to avoid triggering defensive mechanisms while extracting definitive technical data.
                </p>
                <ul className="font-mono text-[10px] text-white/60 flex flex-col gap-2.5 mt-auto pt-6 border-t border-white/10">
                  {['SYN Port Scanning', 'Banner Grabbing', 'Vulnerability Header Probing'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Call to Action */}
        <section className="py-28 px-6 md:px-16 min-h-[50vh] flex flex-col items-center justify-center relative overflow-hidden bg-[#06100e]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none filter blur-sm"
            style={{ backgroundImage: `url(${secoraFoliage})` }}
          />

          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 relative z-10">
            <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase border border-emerald-400/30 px-4 py-1.5 bg-emerald-950/40 rounded-full">
              [ INITIATE SECORA RECONNAISSANCE ]
            </span>

            <h2 className="font-heading text-4xl sm:text-6xl leading-tight text-white uppercase font-light">
              Discover what is exposed.<br />
              <span className="text-emerald-400 font-medium">Understand what it means.</span><br />
              Protect what matters.
            </h2>

            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white px-9 py-4 font-heading text-xs uppercase tracking-widest transition-all duration-300 rounded-xs shadow-xl shadow-emerald-950/60 cursor-pointer"
            >
              <span className="font-bold">LAUNCH WORKSTATION</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </section>

      </main>

      {/* Dark Obsidian Footer */}
      <footer className="w-full border-t border-white/10 bg-[#040a09] py-12 px-6 md:px-16 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <img src={secoraLogo} alt="SECORA" className="h-6 w-6 rounded-xs" />
              <span className="font-heading font-bold text-white tracking-[0.2em] uppercase text-xs">Secora Systems</span>
            </div>
            <p className="font-body text-xs text-white/60 leading-relaxed">
              Architectural precision for modern intelligence. Engineered for surgical clarity, passive reconnaissance, and technical authority.
            </p>
          </div>
          <div className="flex gap-12 font-mono text-xs">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-emerald-400 uppercase">[01] Navigation</span>
              <Link to="/login" className="text-white/60 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="text-white/60 hover:text-white transition-colors">Register</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-emerald-400 uppercase">[02] Workstation</span>
              <span className="text-white/40">v1.0.4-PROD</span>
              <span className="text-emerald-400">STATUS: HEALTHY</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex justify-between items-center font-mono text-[9px] text-white/40">
          <span>© SECORA SYSTEMS {new Date().getFullYear()}</span>
          <span>ANALYST GRADE ENCRYPTION</span>
        </div>
      </footer>
    </div>
  );
}

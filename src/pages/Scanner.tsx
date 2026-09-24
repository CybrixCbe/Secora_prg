import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface ScanModule {
  id: string;
  label: string;
  desc: string;
  index: string;
}

interface ScanDetailsInfo {
  id: string;
  label: string;
  tagline: string;
  overview: string;
  checks: string[];
  whyUseful: string;
  exampleOutput?: { col1: string; col2: string; col3: string }[];
  note?: string;
}

const SCAN_DETAILS: Record<string, ScanDetailsInfo> = {
  portscan: {
    id: 'portscan',
    label: 'PORT AVAILABILITY SWEEP',
    tagline: 'Identify reachable TCP services and active network listeners on an authorized target.',
    overview: 'This reconnaissance module examines commonly exposed TCP ports to identify services that are reachable from the network.',
    checks: [
      'Common TCP ports (SSH, HTTP, HTTPS, RDP, MySQL, etc.)',
      'Open port states',
      'Closed port states',
      'Filtered ports',
      'Detected network services',
      'Potentially exposed administrative or legacy services'
    ],
    whyUseful: "Helps identify the target's visible network attack surface and understand which network services are publicly accessible.",
    exampleOutput: [
      { col1: '22', col2: 'SSH', col3: 'OPEN' },
      { col1: '80', col2: 'HTTP', col3: 'OPEN' },
      { col1: '443', col2: 'HTTPS', col3: 'OPEN' },
      { col1: '3306', col2: 'MYSQL', col3: 'FILTERED' }
    ]
  },
  dns: {
    id: 'dns',
    label: 'DNS RECORD RESOLUTION',
    tagline: 'Map domain namespace records and name server routing infrastructure.',
    overview: 'Retrieves publicly available DNS records associated with the target domain to build a complete picture of its DNS architecture and services.',
    checks: [
      'A records (IPv4 host mappings)',
      'AAAA records (IPv6 host mappings)',
      'MX records (Mail exchange server priority & hosts)',
      'NS records (Authoritative nameservers)',
      'TXT records (SPF, DKIM, DMARC, site verification tokens)',
      'SOA records (Start of Authority zone parameters)'
    ],
    whyUseful: "Helps understand the domain's infrastructure, mail configuration, third-party integrations, and DNS architecture.",
    exampleOutput: [
      { col1: 'A', col2: '104.21.48.122', col3: 'TTL: 300' },
      { col1: 'AAAA', col2: '2606:4700:3033::6815', col3: 'TTL: 300' },
      { col1: 'MX', col2: 'mail.protection.outlook.com', col3: 'PRIO: 10' },
      { col1: 'TXT', col2: 'v=spf1 include:_spf.google.com ~all', col3: 'RESOLVED' }
    ]
  },
  whois: {
    id: 'whois',
    label: 'WHOIS REGISTRY LOOKUP',
    tagline: 'Extract ownership, registrar entities, and administrative registration lifecycle.',
    overview: 'Retrieves publicly available domain registration and registry metadata from authoritative WHOIS databases and registry lookup services.',
    checks: [
      'Domain registrar',
      'Registration / Creation date',
      'Expiration date',
      'Updated / Modification date',
      'Authoritative name servers',
      'Available administrative metadata & contact organizations'
    ],
    whyUseful: 'Provides critical ownership, registration lifecycle context, and domain age for security analysis.',
    exampleOutput: [
      { col1: 'REGISTRAR', col2: 'MarkMonitor Inc.', col3: 'ACTIVE' },
      { col1: 'CREATED', col2: '2015-08-20', col3: 'VERIFIED' },
      { col1: 'EXPIRES', col2: '2030-08-20', col3: 'VALID' },
      { col1: 'ORG', col2: 'Cloudflare, Inc.', col3: 'PUBLIC' }
    ]
  },
  ip: {
    id: 'ip',
    label: 'IP FOOTPRINT GEOLOCATION',
    tagline: 'Pinpoint hosting infrastructure, Autonomous System routing, and geographic location.',
    overview: 'Analyzes the public network footprint associated with the resolved target IP address, extracting Autonomous System Number (ASN) and geographic coordinates.',
    checks: [
      'Resolved public IP address',
      'Country and Region geolocation',
      'Internet Service Provider (ISP)',
      'Organization / Host entity',
      'Autonomous System Number (ASN)',
      'Network routing ownership & ranges'
    ],
    whyUseful: 'Helps understand where infrastructure is physically hosted and which cloud provider or ISP operates the underlying network.',
    exampleOutput: [
      { col1: 'IP', col2: '172.67.182.204', col3: 'PUBLIC' },
      { col1: 'LOCATION', col2: 'San Francisco, United States', col3: 'GEO-L1' },
      { col1: 'ASN', col2: 'AS13335 (CLOUDFLARENET)', col3: 'BGP' },
      { col1: 'PROVIDER', col2: 'Cloudflare Hosting', col3: 'INFRA' }
    ]
  },
  ssl: {
    id: 'ssl',
    label: 'SSL CERTIFICATE ANALYSIS',
    tagline: 'Validate encryption strength, certificate validity window, and TLS configuration.',
    overview: "Examines the target's SSL/TLS certificate chain and related encryption settings to verify certificate integrity, issuer authority, and cipher suite parameters.",
    checks: [
      'Certificate issuer organization (CA)',
      'Subject common name & Alternative Names (SANs)',
      'Validity period & days remaining until expiration',
      'Key length and algorithm strength (RSA / ECC)',
      'Active TLS handshake protocol (TLSv1.2 / TLSv1.3)',
      'Certificate revocation status & chain integrity'
    ],
    whyUseful: 'Helps identify expired, expiring, weak, or potentially misconfigured certificate settings across public endpoints.',
    exampleOutput: [
      { col1: 'ISSUER', col2: "Let's Encrypt / Google Trust", col3: 'TRUSTED' },
      { col1: 'CIPHER', col2: 'TLS_AES_256_GCM_SHA384', col3: 'TLSv1.3' },
      { col1: 'KEY SIZE', col2: '2048 bits RSA / ECDSA 256', col3: 'SECURE' },
      { col1: 'EXPIRY', col2: '84 Days Remaining', col3: 'VALID' }
    ]
  },
  headers: {
    id: 'headers',
    label: 'SECURITY HEADERS CHECK',
    tagline: 'Inspect HTTP response headers to prevent XSS, clickjacking, and data leakage.',
    overview: 'Analyzes HTTP response headers used to enforce browser security standards and protect web applications against framing and injection vectors.',
    checks: [
      'Content-Security-Policy (CSP & frame-ancestors)',
      'Strict-Transport-Security (HSTS)',
      'X-Frame-Options (Clickjacking defense)',
      'X-Content-Type-Options (MIME sniffing defense)',
      'Referrer-Policy (Referral leakage prevention)',
      'Permissions-Policy (Browser feature restrictions)'
    ],
    whyUseful: 'Helps identify missing or weak browser security controls. In particular, missing framing protections (X-Frame-Options or CSP frame-ancestors) leave web pages vulnerable to UI redressing and Clickjacking attacks.',
    exampleOutput: [
      { col1: 'HSTS', col2: 'max-age=31536000; includeSubDomains', col3: 'PASS' },
      { col1: 'X-FRAME', col2: 'SAMEORIGIN / DENY', col3: 'PASS' },
      { col1: 'CSP', col2: "default-src 'self'", col3: 'PASS' },
      { col1: 'NOSNIFF', col2: 'X-Content-Type-Options: nosniff', col3: 'PASS' }
    ]
  },
  tech: {
    id: 'tech',
    label: 'FRONTEND TECHNOLOGY FUZZ',
    tagline: 'Discover CMS platforms, web servers, JavaScript libraries, and CDN layers.',
    overview: 'Identifies publicly observable software signatures, web server headers, and client-side JavaScript technologies utilized by the target web application.',
    checks: [
      'Frontend frameworks (React, Vue, Angular, Next.js, etc.)',
      'JavaScript utility libraries & UI components',
      'Content Management Systems (WordPress, Drupal, Joomla, etc.)',
      'Web server signatures (Nginx, Apache, Caddy, Cloudflare)',
      'CDN & Web Application Firewall (WAF) signatures',
      'Public technology fingerprints and meta headers'
    ],
    whyUseful: 'Helps build a comprehensive technology profile of the target to identify outdated software stacks and potential version vulnerabilities.',
    exampleOutput: [
      { col1: 'SERVER', col2: 'Cloudflare / Nginx', col3: 'DETECTED' },
      { col1: 'FRONTEND', col2: 'React / Next.js Framework', col3: 'ACTIVE' },
      { col1: 'WAF', col2: 'Cloudflare Web Application Firewall', col3: 'ACTIVE' },
      { col1: 'CDN', col2: 'Cloudflare Edge Cache', col3: 'DETECTED' }
    ]
  }
};

export default function Scanner() {
  const [target, setTarget] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'whois', 'dns', 'ip', 'ssl', 'headers', 'tech', 'portscan'
  ]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [scanStatus, setScanStatus] = useState<'idle' | 'running' | 'done' | 'cancelled' | 'error'>('idle');
  const [scanId, setScanId] = useState<number | null>(null);
  const [activeAboutModal, setActiveAboutModal] = useState<ScanDetailsInfo | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const consoleBottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const modulesList: ScanModule[] = [
    { id: 'portscan', label: 'PORT AVAILABILITY SWEEP', desc: 'Sweeps common TCP ports to map active network listeners', index: '01' },
    { id: 'dns', label: 'DNS RECORD RESOLUTION', desc: 'Resolves A, AAAA, MX, NS, SOA, and TXT registry values', index: '02' },
    { id: 'whois', label: 'WHOIS REGISTRY LOOKUP', desc: 'Queries domain administrative registration metadata records', index: '03' },
    { id: 'ip', label: 'IP FOOTPRINT GEOLOCATION', desc: 'Resolves host country, ISP owners, ASN registration numbers', index: '04' },
    { id: 'ssl', label: 'SSL CERTIFICATE ANALYSIS', desc: 'Inspects active TLS/SSL encryption chain expiration dates', index: '05' },
    { id: 'headers', label: 'SECURITY HEADERS CHECK', desc: 'Validates CSP, CORS, HSTS policies, and clickjacking risks', index: '06' },
    { id: 'tech', label: 'FRONTEND TECHNOLOGY FUZZ', desc: 'Infers framework versions, software headers, backend systems', index: '07' },
  ];

  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveAboutModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleModuleToggle = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleOpenAbout = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const details = SCAN_DETAILS[id];
    if (details) {
      setActiveAboutModal(details);
    }
  };

  const handleCloseAbout = () => {
    setActiveAboutModal(null);
  };

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || selectedModules.length === 0) return;

    setScanning(true);
    setProgress(5);
    setLogs(['[i] Initializing SECORA security diagnostics engine...']);
    setScanStatus('running');
    setScanId(null);

    const modulesQuery = selectedModules.join(',');
    const sseUrl = `/scan/stream?target=${encodeURIComponent(target)}&modules=${encodeURIComponent(modulesQuery)}`;
    
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.log) {
          setLogs(prev => [...prev, payload.log]);
        }
        if (payload.percent) {
          setProgress(payload.percent);
        }
        
        if (payload.status === 'done' || payload.status === 'success_done') {
          setScanStatus('done');
          setScanning(false);
          if (payload.scan_id) {
            setScanId(payload.scan_id);
            setTimeout(() => {
              navigate(`/scan/${payload.scan_id}`);
            }, 1500);
          }
          eventSource.close();
        } else if (payload.status === 'cancelled') {
          setScanStatus('cancelled');
          setScanning(false);
          if (payload.scan_id) {
            setScanId(payload.scan_id);
          }
          eventSource.close();
        } else if (payload.status === 'error' && payload.percent === 100) {
          setScanStatus('error');
          setScanning(false);
          eventSource.close();
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setLogs(prev => [...prev, '[-] Event stream link interrupted. Scan aborted.']);
      setScanStatus('error');
      setScanning(false);
      eventSource.close();
    };
  };

  const handleStopScan = async () => {
    if (!scanning) return;
    try {
      setLogs(prev => [...prev, '[!] Interrupt signal sent. Cancelling scan modules...']);
      await api.cancelScan();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      setScanning(false);
      setScanStatus('cancelled');
    } catch (err) {
      console.error("Cancel scan failed:", err);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 grid grid-cols-12 gap-8 flex-grow">
      {scanStatus === 'idle' ? (
        <form onSubmit={handleStartScan} className="col-span-12 flex flex-col gap-12 z-10">
          
          {/* Header Description */}
          <div className="flex flex-col gap-2">
            <span className="font-heading text-[10px] text-text-secondary tracking-[0.2em]">[ SECORA / RECONNAISSANCE / 02 ]</span>
            <h1 className="font-display-lg text-4xl text-text-primary tracking-tight font-light uppercase">
              BEGIN WITH THE <span className="text-secondary font-medium">TARGET.</span>
            </h1>
            <p className="font-body text-sm text-text-secondary max-w-2xl leading-relaxed mt-2">
              Enter an authorized domain or IP address to begin gathering information about its publicly visible infrastructure.
            </p>
          </div>

          {/* Target Address Input */}
          <div className="relative bg-surface-container-lowest border border-border p-8 flex flex-col gap-4 group rounded-md shadow-sm overflow-hidden">
            {/* Ambient radar sweep background accent */}
            <div className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full border border-secondary/15 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(0,107,95,0.15)_360deg)] radar-sweep opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-border rounded-t-md"></div>
            <div className="absolute top-6 right-8 font-mono text-[9px] text-text-secondary tracking-widest">
              [ TARGET / REQUIRED ]
            </div>
            
            <label className="font-heading text-[10px] text-text-primary tracking-widest uppercase font-bold" htmlFor="target-input">
              TARGET ADDRESS
            </label>
            
            <div className="w-full bg-border/40 p-[1px] mt-1 transition-all focus-within:bg-secondary rounded-sm">
              <div className="w-full bg-surface-container-lowest relative flex items-center rounded-sm">
                <input 
                  autoComplete="off" 
                  className="w-full bg-transparent py-5 px-6 font-mono text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-0 rounded-sm" 
                  id="target-input" 
                  placeholder="example.com or 192.168.1.1" 
                  type="text"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-text-secondary">
              <span className="font-mono text-[9px] uppercase">
                ℹ Only scan systems and networks that you own or have explicit permission to assess.
              </span>
            </div>
          </div>

          {/* Checklist Area */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h2 className="font-heading text-[10px] text-text-primary tracking-[0.15em] font-bold uppercase">SELECT METHOD</h2>
              <span className="font-mono text-[9px] text-text-secondary tracking-widest">
                {selectedModules.length} / {modulesList.length} PROBES ACTIVE
              </span>
            </div>
            
            <div className="flex flex-col border border-border bg-surface-container-lowest divide-y divide-border rounded-md overflow-hidden">
              {modulesList.map((m) => {
                const isSelected = selectedModules.includes(m.id);
                return (
                  <div 
                    key={m.id}
                    onClick={() => handleModuleToggle(m.id)}
                    className="group relative flex items-center justify-between py-4 px-6 transition-all cursor-pointer hover:bg-surface-container-low"
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                      <span className="font-mono text-[10px] text-text-secondary/60 mt-0.5 sm:mt-0">[ {m.index} ]</span>
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="font-heading text-xs tracking-wider font-bold text-text-primary group-hover:text-secondary transition-colors uppercase">
                          {m.label}
                        </span>
                        <span className="text-[10px] text-text-secondary">{m.desc}</span>
                        <div className="pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleOpenAbout(e, m.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary tracking-wider py-1 px-2.5 rounded-[14px] hover:bg-secondary/10 active:bg-secondary/20 transition-all duration-250 cursor-pointer w-fit -ml-2 hover:translate-x-0.5"
                          >
                            <span>ABOUT THIS SCAN</span>
                            <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`font-mono text-[10px] tracking-wider transition-opacity shrink-0 ml-4 ${
                      isSelected ? 'text-secondary font-bold opacity-100' : 'text-text-secondary/40 opacity-40 group-hover:opacity-100'
                    }`}>
                      {isSelected ? 'SELECTED ✓' : 'DESELECTED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Scan Controls */}
          <div className="flex items-center justify-between mt-4 pt-8 border-t border-border/30 relative">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-text-secondary tracking-widest">SYS.STATUS / <span className="text-secondary font-bold">READY</span></span>
              <span className="font-mono text-[9px] text-text-secondary/50 tracking-widest">DATA.COLLECTION / STANDBY</span>
            </div>
            
            <button 
              type="submit" 
              disabled={selectedModules.length === 0 || !target.trim()}
              className="relative bg-secondary hover:bg-[#004d44] text-white transition-all group overflow-hidden border border-secondary disabled:opacity-40 rounded-sm"
            >
              <div className="px-8 py-5 flex items-center gap-4 relative z-10">
                <span className="font-heading text-xs tracking-[0.2em] whitespace-nowrap uppercase">START RECONNAISSANCE</span>
                <span>→</span>
              </div>
            </button>
          </div>

        </form>
      ) : (
        <div className="col-span-12 flex flex-col gap-8 flex-grow">
          {/* Scanning Progress Console */}
          <div className="flex flex-col gap-4 border-b border-border pb-6">
            <div className="flex flex-col gap-2">
              <span className="font-heading text-[10px] text-text-secondary tracking-[0.2em]">[ SECORA / ACTIVE WORKSPACE ]</span>
              <h2 className="font-display-lg text-4xl text-text-primary tracking-tight font-light uppercase">
                TARGET: <span className="font-mono text-secondary font-medium">{target}</span>
              </h2>
              <p className="font-body text-xs text-text-secondary leading-relaxed">
                {scanStatus === 'running' && "Analysis modules executing. View diagnostics feed below."}
                {scanStatus === 'done' && "Reconnaissance completed! Redirecting to report detail..."}
                {scanStatus === 'cancelled' && "Analysis cancelled by operator. Completed telemetry saved."}
                {scanStatus === 'error' && "Scanning error encountered. Check diagnostics log."}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              {scanning ? (
                <button 
                  onClick={handleStopScan}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase transition-colors rounded-sm"
                >
                  STOP SCAN ◼
                </button>
              ) : (
                <div className="flex gap-4">
                  {scanId && (
                    <button 
                      onClick={() => navigate(`/scan/${scanId}`)}
                      className="px-6 py-3 bg-secondary hover:bg-[#004d44] text-white font-heading text-xs tracking-widest uppercase transition-colors rounded-sm"
                    >
                      VIEW REPORT DETAILS
                    </button>
                  )}
                  <button 
                    onClick={() => setScanStatus('idle')}
                    className="px-6 py-3 bg-surface-container-lowest border border-border hover:bg-surface-container-low text-text-primary font-heading text-xs tracking-widest uppercase transition-colors rounded-sm"
                  >
                    RESCAN NEW TARGET
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Percent Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-heading font-bold text-text-primary uppercase">
              <span>DIAGNOSTICS PROGRESS</span>
              <span className="font-mono text-secondary tabular-nums font-bold">{progress}%</span>
            </div>
            <div className="h-2.5 bg-surface-container-low border border-border rounded-full overflow-hidden p-[1px]">
              <div 
                className={`h-full bg-secondary rounded-full transition-all duration-300 ${scanning ? 'progress-striped' : ''}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Console logs terminal */}
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex items-center justify-between text-text-secondary text-[10px] font-mono uppercase">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${scanning ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`}></span>
                <span>Diagnostics Telemetry Feed</span>
              </span>
              <span>{logs.length} EVENTS RECORDED</span>
            </div>
            <div className="flex-grow overflow-y-auto font-mono text-[11px] leading-relaxed bg-zinc-950 border border-zinc-800 p-6 rounded-md h-[400px] select-text shadow-inner">
              {logs.map((log, idx) => {
                const isSuccess = log.startsWith('[+]');
                const isError = log.startsWith('[-]');
                const isWarn = log.startsWith('[!]');
                const colorClass = isSuccess ? 'text-emerald-400' : isError ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-slate-300';
                return (
                  <div key={idx} className={`mb-1 whitespace-pre-wrap terminal-line ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
              {scanning && (
                <div className="flex items-center gap-2 text-text-secondary mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 threat-pulse"></span>
                  <span className="text-emerald-400 font-mono">Executing telemetry probe...</span>
                  <span className="text-emerald-400 font-mono terminal-cursor font-bold">█</span>
                </div>
              )}
              <div ref={consoleBottomRef} />
            </div>
          </div>

        </div>
      )}

      {/* ABOUT SCAN MODAL OVERLAY */}
      {activeAboutModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-250 animate-in fade-in"
          onClick={handleCloseAbout}
        >
          <div 
            className="relative w-full max-w-[700px] max-h-[90vh] bg-[#fbfdfc] dark:bg-[#141b1a] text-text-primary border border-border/80 rounded-[24px] shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 transition-all duration-250 transform scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'aboutModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4">
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-secondary tracking-[0.2em] uppercase font-semibold">
                <span>[ RECONNAISSANCE MODULE / {modulesList.find(m => m.id === activeAboutModal.id)?.index || '01'} ]</span>
              </div>
              <button
                type="button"
                onClick={handleCloseAbout}
                aria-label="Close modal"
                className="h-8 w-8 rounded-full border border-border/70 hover:border-secondary hover:bg-secondary/10 hover:text-secondary flex items-center justify-center text-text-secondary transition-all duration-200 cursor-pointer text-base shrink-0"
              >
                ×
              </button>
            </div>

            {/* Title & Tagline */}
            <div className="flex flex-col gap-2 pt-1 pb-5">
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary uppercase">
                {activeAboutModal.label}
              </h2>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                {activeAboutModal.tagline}
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="h-px w-full bg-border/60 my-1"></div>

            {/* Section: Overview */}
            <div className="py-5 flex flex-col gap-2">
              <span className="font-heading text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">
                OVERVIEW
              </span>
              <p className="font-body text-xs sm:text-[13px] text-text-primary leading-relaxed">
                {activeAboutModal.overview}
              </p>
            </div>

            {/* Section: What this scan checks */}
            <div className="py-4 flex flex-col gap-3">
              <span className="font-heading text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">
                WHAT THIS SCAN CHECKS
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeAboutModal.checks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-text-secondary leading-normal">
                    <span className="text-secondary font-bold shrink-0 mt-0.5">✓</span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section: Why it is useful */}
            <div className="py-4 flex flex-col gap-2">
              <span className="font-heading text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">
                WHY IT IS USEFUL
              </span>
              <p className="font-body text-xs sm:text-[13px] text-text-secondary leading-relaxed">
                {activeAboutModal.whyUseful}
              </p>
            </div>

            {/* Section: Example Output (if available) */}
            {activeAboutModal.exampleOutput && activeAboutModal.exampleOutput.length > 0 && (
              <div className="py-4 flex flex-col gap-2.5">
                <span className="font-heading text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">
                  EXAMPLE OUTPUT
                </span>
                <div className="bg-surface-container-low/70 border border-border/70 rounded-[14px] p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs text-text-secondary overflow-x-auto space-y-1.5">
                  {activeAboutModal.exampleOutput.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 py-0.5 border-b border-border/20 last:border-0 font-mono">
                      <span className="font-bold text-text-primary min-w-[70px]">{row.col1}</span>
                      <span className="text-text-secondary flex-1 truncate">{row.col2}</span>
                      <span className="text-secondary font-semibold text-right">{row.col3}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtle Divider */}
            <div className="h-px w-full bg-border/60 my-3"></div>

            {/* Modal Footer Note */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <span className="font-mono text-[9px] sm:text-[10px] text-text-secondary/70 tracking-widest uppercase">
                [ AUTHORIZED SECURITY TESTING ONLY ]
              </span>
              <button
                type="button"
                onClick={handleCloseAbout}
                className="px-5 py-2 rounded-[14px] bg-secondary hover:bg-[#004d44] text-white font-heading text-[11px] tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
              >
                GOT IT
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

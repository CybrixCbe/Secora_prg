import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, Download, Printer, BrainCircuit, Globe, Server, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

type TabType = 'overview' | 'whois' | 'dns' | 'ssl' | 'headers' | 'clickjacking' | 'tech' | 'portscan' | 'advisor';

export default function ScanDetail() {
  const { scanId } = useParams<{ scanId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [displayScore, setDisplayScore] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [portFilter, setPortFilter] = useState<'open' | 'all' | 'filtered' | 'closed'>('open');

  const navigate = useNavigate();

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  useEffect(() => {
    if (!scanId) return;

    api.getScanResults(scanId)
      .then(res => {
        setData(res);
        setLoading(false);
        const targetScore = res?.results?.risk_assessment?.score ?? 80;
        let start = 0;
        const duration = 1000;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setDisplayScore(Math.round(eased * targetScore));
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      })
      .catch(err => {
        console.error("Scan detail error:", err);
        setError(err.message || "Failed to load scan report.");
        setLoading(false);
      });
  }, [scanId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="card max-w-md p-8 text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">Report Error</h3>
          <p className="text-xs text-text-secondary">{error || "Scan report data could not be located."}</p>
          <button onClick={() => navigate('/history')} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-heading font-black tracking-wider rounded-sm transition-all shadow-md">
            RETURN TO HISTORY
          </button>
        </div>
      </div>
    );
  }

  // Parse fields
  const scanMeta = data;
  const results = data.results || {};
  const modules = results.modules || {};
  const risk = results.risk_assessment || { score: 0, level: 'Low', reasons: [], recommendations: [] };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40';
    if (score >= 60) return 'text-sky-300 bg-sky-950/70 border-sky-500/40';
    if (score >= 40) return 'text-amber-300 bg-amber-950/70 border-amber-500/40';
    return 'text-red-300 bg-red-950/70 border-red-500/40';
  };

  const getRiskBorder = (score: number) => {
    if (score >= 80) return 'border-emerald-500';
    if (score >= 60) return 'border-blue-500';
    if (score >= 40) return 'border-amber-500';
    return 'border-red-500';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const triggerExport = (format: string) => {
    // Directly trigger standard download endpoint
    window.open(`/scan/export/${format}/${scanMeta.id}`, '_blank');
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'whois', label: 'WHOIS LOOKUP' },
    { id: 'dns', label: 'DNS RESOLUTION' },
    { id: 'ssl', label: 'SSL/TLS & IP' },
    { id: 'headers', label: 'HTTP HEADERS' },
    { id: 'clickjacking', label: 'CLICKJACKING AUDIT' },
    { id: 'tech', label: 'TECHNOLOGY STACK' },
    { id: 'portscan', label: 'OPEN PORTS' },
    { id: 'advisor', label: 'AI ADVISOR' },
  ];

  return (
    <div className="space-y-8 flex-grow flex flex-col">
      {/* Scan Summary Header */}
      <section className="card p-6 bg-surface border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-primary uppercase">[ SECORA / DIAGNOSTICS REPORT ]</span>
          <h2 className="font-heading font-black tracking-wide text-sm text-text-primary uppercase">
            TARGET: <span className="font-mono text-primary">{scanMeta.target}</span>
          </h2>
          <div className="flex items-center gap-4 text-[10px] text-text-secondary font-mono">
            <span>SCAN ID: #{scanMeta.id}</span>
            <span className="h-1 w-1 rounded-full bg-border"></span>
            <span>FINISHED: {scanMeta.timestamp}</span>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => triggerExport('pdf')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-heading font-black tracking-wider rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>PDF REPORT</span>
          </button>
          <button 
            onClick={() => triggerExport('markdown')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-heading font-bold tracking-wider rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <FileText className="h-3 w-3" />
            <span>MARKDOWN</span>
          </button>
          <button 
            onClick={() => triggerExport('json')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-heading font-bold tracking-wider rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <span>JSON DATA</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-heading font-bold tracking-wider rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <Printer className="h-3 w-3" />
            <span>PRINT</span>
          </button>
        </div>
      </section>

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Left Side: Navigation Tabs list */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all font-heading text-xs tracking-wider cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-2 border-emerald-400 rounded-sm shadow-sm'
                  : 'text-white/60 bg-[#081512] hover:bg-white/5 hover:text-white border border-white/10 rounded-sm'
              }`}
            >
              <span>{tab.label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Right Side: Tab Viewport details */}
        <div className="lg:col-span-9 flex flex-col">
          <div className="card p-8 bg-surface border border-border flex-grow min-h-[460px]">
            
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-6">
                  <div className="space-y-1">
                    <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">Executive Findings Summary</h3>
                    <p className="text-[11px] text-text-secondary">Summary details of calculations and vulnerability metrics.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-text-secondary font-heading uppercase font-bold">RISK GRADE</span>
                    <span className={`text-sm font-black px-2.5 py-0.5 border rounded-sm ${getRiskColor(risk.score)}`}>
                      {getGrade(risk.score)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Risk gauge card with circular SVG meter */}
                  <div className="p-6 bg-surface-muted border border-border rounded-md text-center flex flex-col justify-center items-center gap-3">
                    <span className="text-[10px] font-mono text-text-secondary tracking-wider uppercase">Risk Score Index</span>
                    
                    {/* Circular Animated SVG Gauge */}
                    <div className="relative flex items-center justify-center my-1">
                      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="7"
                          className="text-border/40"
                          fill="transparent"
                        />
                        {/* Animated Gauge Arc */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="7"
                          strokeLinecap="round"
                          fill="transparent"
                          className={`transition-all duration-700 ease-out ${
                            displayScore >= 80 ? 'text-emerald-600' : displayScore >= 60 ? 'text-blue-600' : displayScore >= 40 ? 'text-amber-500' : 'text-red-600'
                          }`}
                          style={{
                            strokeDasharray: 251.2,
                            strokeDashoffset: 251.2 - (251.2 * displayScore) / 100,
                          }}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-heading font-black tabular-nums tracking-tight text-text-primary">
                          {displayScore}
                        </span>
                        <span className="text-[9px] font-mono text-text-secondary/70">/ 100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                      <span className={`h-2 w-2 rounded-full ${
                        displayScore >= 80 ? 'bg-emerald-500' : displayScore >= 60 ? 'bg-blue-500' : displayScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-text-primary">{risk.level} Severity Level</span>
                    </div>
                  </div>

                  {/* High vulnerabilities info */}
                  <div className="col-span-2 p-6 bg-surface-muted border border-border rounded-md flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-text-secondary uppercase">Key Threat Assessment</span>
                      <ul className="list-disc pl-4 text-xs text-text-secondary space-y-1 mt-2">
                        {risk.reasons.length === 0 ? (
                          <li>No critical vulnerability indicators detected on target host.</li>
                        ) : (
                          risk.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block">Mitigation Recommendations</span>
                  <div className="p-5 border border-border bg-surface-muted rounded-md space-y-2">
                    {risk.recommendations.length === 0 ? (
                      <p className="text-xs text-text-secondary">Host is configured correctly. Maintain standard audit telemetry scheduling.</p>
                    ) : (
                      <ul className="list-decimal pl-4 text-xs text-text-secondary space-y-1.5">
                        {risk.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. WHOIS Tab */}
            {activeTab === 'whois' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">WHOIS Registry Details</h3>
                  <p className="text-[11px] text-text-secondary">Metadata lookup parsed from registration database.</p>
                </div>
                
                {!modules.whois || modules.whois.status === 'error' ? (
                  <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                    No WHOIS registry details loaded.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-2.5">
                      <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Domain Name:</span><span className="font-mono font-bold">{modules.whois.domain_name || "Unknown"}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Registrar:</span><span className="font-heading font-bold text-right max-w-[200px] truncate">{modules.whois.registrar || "Unknown"}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Created Date:</span><span className="font-mono">{modules.whois.creation_date || modules.whois.created_date || "Unknown"}</span></div>
                      <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Expiration:</span><span className="font-mono text-red-600">{modules.whois.expiration_date || "Unknown"}</span></div>
                    </div>
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-2.5">
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">Name Servers:</span>
                        <span className="font-mono text-[10px] text-text-primary break-all">
                          {/* name_servers can be string or array */}
                          {Array.isArray(modules.whois.name_servers)
                            ? modules.whois.name_servers.join(', ')
                            : (modules.whois.name_servers || "Unknown")}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">Organisation:</span>
                        {/* scanner returns 'org' field */}
                        <span className="font-heading font-bold">{modules.whois.org || modules.whois.organization || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">Emails:</span>
                        <span className="font-mono text-[10px]">{modules.whois.emails || "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. DNS Tab */}
            {activeTab === 'dns' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">DNS Record Resolution</h3>
                  <p className="text-[11px] text-text-secondary">Resolved active DNS mappings.</p>
                </div>

                {!modules.dns || modules.dns.status === 'error' ? (
                  <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                    No DNS records loaded.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['A', 'AAAA', 'MX', 'NS', 'TXT'].map((type) => {
                      const records = modules.dns[type] || [];
                      return (
                        <div key={type} className="p-4 border border-border bg-surface-muted rounded-md space-y-2">
                          <span className="px-2 py-0.5 text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 rounded-md font-bold uppercase">{type} Records</span>
                          {records.length === 0 ? (
                            <p className="text-[10px] text-text-secondary italic">No resolved records found.</p>
                          ) : (
                            <ul className="list-disc pl-4 text-xs font-mono text-text-secondary space-y-1 mt-1">
                              {records.map((r: string, idx: number) => <li key={idx} className="break-all">{r}</li>)}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. SSL/TLS & IP Tab */}
            {activeTab === 'ssl' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">SSL Certificate & IP Geolocation</h3>
                  <p className="text-[11px] text-text-secondary">Security grading checks and hosting metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IP Info */}
                  <div className="p-5 border border-border bg-surface-muted rounded-md space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block">IP Intelligence</span>
                    {!modules.ip || modules.ip.status === 'error' ? (
                      <p className="text-xs text-text-secondary italic">No IP information available.</p>
                    ) : (
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Resolved IP:</span><span className="font-mono font-bold">{modules.ip.ip}</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">ASN:</span><span className="font-mono text-right">{modules.ip.asn}</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Hosting Owner:</span><span className="font-heading font-bold">{modules.ip.hosting_provider}</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Location:</span><span>{modules.ip.city}, {modules.ip.country}</span></div>
                      </div>
                    )}
                  </div>

                  {/* SSL Info */}
                  <div className="p-5 border border-border bg-surface-muted rounded-md space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block">SSL handshake grade</span>
                    {!modules.ssl || modules.ssl.status === 'error' ? (
                      <p className="text-xs text-text-secondary italic">No SSL/TLS certificate available.</p>
                    ) : (
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Issuer:</span><span className="font-heading font-bold text-right truncate max-w-[150px]">{modules.ssl.issuer_org || "Unknown"}</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Cipher Protocol:</span><span className="font-mono">{modules.ssl.protocol || "TLSv1.3"}</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Key Length:</span><span className="font-mono">{modules.ssl.key_size || 2048} bits</span></div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5"><span className="text-text-secondary">Expiry Status:</span><span className={`font-bold ${modules.ssl.days_left < 30 ? 'text-red-600' : 'text-emerald-700'}`}>{modules.ssl.days_left} Days Left</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Headers Tab */}
            {activeTab === 'headers' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">HTTP Security Headers</h3>
                  <p className="text-[11px] text-text-secondary">XSS, frame restrictions, and content validation audits.</p>
                </div>

                {!modules.headers || modules.headers.status === 'error' ? (
                  <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                    No HTTP headers loaded.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(modules.headers.headers || {}).map(([key, val]: any) => (
                      <div key={key} className="p-4 border border-border bg-surface-muted rounded-md flex justify-between items-start gap-4">
                        <div className="space-y-1 min-w-0">
                          <span className="font-mono text-xs font-bold text-text-primary break-all">{key}</span>
                          <span className="font-mono text-[10px] text-text-secondary break-all block mt-0.5">{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* 6. Clickjacking Tab */}
            {activeTab === 'clickjacking' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">Clickjacking Vulnerability Audit</h3>
                    <p className="text-[11px] text-text-secondary">Inspects framing restrictions (X-Frame-Options & CSP frame-ancestors) to detect UI redressing risks.</p>
                  </div>
                  {(() => {
                    const cj = modules.clickjacking || modules.headers?.clickjacking;
                    if (!cj) return null;
                    const isVuln = cj.is_vulnerable ?? cj.vulnerable ?? (String(cj.status || '').toLowerCase() === 'vulnerable');
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm border uppercase tracking-wider self-start sm:self-auto ${
                        isVuln ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isVuln ? 'bg-red-500 threat-pulse' : 'bg-emerald-500'}`}></span>
                        <span>{isVuln ? 'Vulnerable Target' : 'Framing Restricted (Protected)'}</span>
                      </span>
                    );
                  })()}
                </div>

                {(() => {
                  const cj = modules.clickjacking || modules.headers?.clickjacking;
                  if (!modules.headers && !cj) {
                    return (
                      <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                        Headers and Clickjacking modules were not included in this scan.
                      </div>
                    );
                  }

                  if (!cj && modules.headers?.status === 'error') {
                    return (
                      <div className="p-6 border border-amber-500/30 bg-amber-500/10 rounded-md space-y-2">
                        <span className="font-heading font-bold text-xs text-amber-400 uppercase">Headers Diagnostic Warning</span>
                        <p className="text-xs text-text-secondary leading-relaxed">{modules.headers.error_msg || modules.headers.msg || 'Could not connect to target to inspect HTTP response headers.'}</p>
                        <p className="text-[10px] text-amber-400/80 italic mt-2">Clickjacking assessment requires an active HTTP/HTTPS connection to probe framing headers.</p>
                      </div>
                    );
                  }

                  if (!cj) {
                    return (
                      <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                        No Clickjacking assessment telemetry recorded for this host.
                      </div>
                    );
                  }

                  const isVuln = cj.is_vulnerable ?? cj.vulnerable ?? (String(cj.status || '').toLowerCase() === 'vulnerable');
                  const xfo = cj.x_frame_options || modules.headers?.security_headers?.['X-Frame-Options'] || modules.headers?.headers?.['x-frame-options'] || 'Not Set';
                  const csp = cj.csp_frame_ancestors || modules.headers?.security_headers?.['Content-Security-Policy'] || modules.headers?.headers?.['content-security-policy'] || 'Not Configured';
                  const details = cj.explanation || cj.details || cj.message || (
                    isVuln
                      ? 'The target does not enforce framing restriction headers (X-Frame-Options or CSP frame-ancestors). An attacker can render this page in a transparent <iframe> on an external domain and trick authenticated users into unauthorized clicks.'
                      : 'The target successfully restricts framing rendering via security headers, protecting end-users against UI redressing and click hijacking attacks.'
                  );

                  const xfoActive = xfo !== 'Not Set' && xfo !== 'Absent' && xfo !== 'None' && xfo !== 'Unreachable';
                  const cspActive = csp.toLowerCase().includes('frame-ancestors') || (csp !== 'Not Configured' && csp !== 'Absent' && csp !== 'None' && csp !== 'Unreachable');

                  return (
                    <div className="space-y-6">
                      {/* Overview Threat Card */}
                      <div className={`p-6 border rounded-md space-y-3 ${
                        isVuln ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${isVuln ? 'bg-red-500 threat-pulse' : 'bg-emerald-500'}`} />
                          <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide">
                            {isVuln ? 'Threat Detected: Vulnerable to Clickjacking' : 'Security Clearance: Clickjacking Mitigated'}
                          </h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-body">
                          {details}
                        </p>
                      </div>

                      {/* Header Defense Matrix */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        {/* X-Frame-Options Matrix Card */}
                        <div className="p-4 bg-surface border border-border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">X-Frame-Options</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                              xfoActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}>
                              {xfoActive ? 'Enforced' : 'Missing'}
                            </span>
                          </div>
                          <div className="p-2.5 bg-surface-muted border border-border/60 rounded text-text-primary text-[11px] truncate select-all">
                            {xfo}
                          </div>
                          <p className="text-[10px] text-text-secondary font-body">
                            Standard header directive (DENY / SAMEORIGIN) indicating whether a browser can render the page inside a frame.
                          </p>
                        </div>

                        {/* CSP Frame-Ancestors Matrix Card */}
                        <div className="p-4 bg-surface border border-border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">CSP frame-ancestors</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                              cspActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}>
                              {cspActive ? 'Enforced' : 'Missing'}
                            </span>
                          </div>
                          <div className="p-2.5 bg-surface-muted border border-border/60 rounded text-text-primary text-[11px] truncate select-all">
                            {csp}
                          </div>
                          <p className="text-[10px] text-text-secondary font-body">
                            Modern W3C standard directive replacing X-Frame-Options to control allowed embedding origins.
                          </p>
                        </div>
                      </div>

                      {/* Remediation Hardening Block */}
                      {isVuln && (
                        <div className="p-5 bg-surface border border-border rounded-md space-y-3">
                          <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block font-bold">
                            Recommended Hardening Directive
                          </span>
                          <p className="text-xs text-text-secondary font-body leading-relaxed">
                            To remediate clickjacking vulnerabilities, instruct the web server or edge proxy to append the following HTTP response headers:
                          </p>
                          <div className="p-3 bg-surface-muted border border-border font-mono text-[11px] text-emerald-400 rounded-sm space-y-1 select-all">
                            <div>X-Frame-Options: SAMEORIGIN</div>
                            <div>Content-Security-Policy: frame-ancestors 'self';</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 7. Tech Tab */}
            {activeTab === 'tech' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">Web Technology Analysis</h3>
                  <p className="text-[11px] text-text-secondary">Identified servers, libraries, and frameworks.</p>
                </div>

                {!modules.tech || modules.tech.status === 'error' ? (
                  <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                    No web technology signature mappings loaded.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Web Server */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">Web Server</span>
                      <p className="font-heading font-bold text-text-primary">{modules.tech.web_server || modules.tech.server || "Not Detected"}</p>
                    </div>
                    {/* CMS */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">CMS / Platform</span>
                      <p className="font-heading font-bold text-text-primary">{modules.tech.cms || "Not Detected"}</p>
                    </div>
                    {/* JS Frameworks */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">Frontend / JS Frameworks</span>
                      <p className="font-heading font-bold text-text-primary">
                        {Array.isArray(modules.tech.js_frameworks)
                          ? modules.tech.js_frameworks.filter((f: string) => f !== 'None Detected').join(', ') || 'None Detected'
                          : (modules.tech.js_frameworks || modules.tech.frameworks?.join(', ') || "Not Detected")}
                      </p>
                    </div>
                    {/* Backend */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">Backend Technology</span>
                      <p className="font-heading font-bold text-text-primary">{modules.tech.backend || "Not Detected"}</p>
                    </div>
                    {/* CDN */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">CDN</span>
                      <p className="font-heading font-bold text-text-primary">{modules.tech.cdn || "Not Detected"}</p>
                    </div>
                    {/* WAF */}
                    <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">WAF / Firewall</span>
                      <p className={`font-heading font-bold ${modules.tech.waf && modules.tech.waf !== 'Unknown' ? 'text-secondary' : 'text-text-primary'}`}>
                        {modules.tech.waf || "Not Detected"}
                      </p>
                    </div>
                    {/* Analytics */}
                    {modules.tech.analytics && (
                      <div className="p-4 bg-surface-muted border border-border rounded-md text-xs space-y-1.5 md:col-span-2">
                        <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block">Analytics / Trackers</span>
                        <p className="font-heading font-bold text-text-primary">
                          {Array.isArray(modules.tech.analytics)
                            ? modules.tech.analytics.filter((a: string) => a !== 'None Detected').join(', ') || 'None Detected'
                            : modules.tech.analytics}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 8. Open Ports Tab */}
            {activeTab === 'portscan' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">Perimeter TCP Port Sweep</h3>
                    <p className="text-[11px] text-text-secondary">Network listeners, port states, and service banner identification.</p>
                  </div>
                  {modules.portscan?.engine && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold rounded-sm uppercase tracking-wider self-start sm:self-auto">
                      <Server className="h-3 w-3" />
                      <span>{modules.portscan.engine}</span>
                    </div>
                  )}
                </div>

                {!modules.portscan ? (
                  <div className="p-8 text-center text-xs text-text-secondary uppercase border border-border bg-surface-muted rounded-md">
                    Port scan module not included in this scan.
                  </div>
                ) : modules.portscan.status === 'error' ? (
                  <div className="p-6 border border-amber-100 bg-amber-50 rounded-md space-y-2">
                    <span className="font-heading font-bold text-xs text-amber-700 uppercase">Port Scan Error</span>
                    <p className="text-xs text-amber-600 leading-relaxed">{modules.portscan.error_msg || 'Could not reach target for port scanning.'}</p>
                  </div>
                ) : (() => {
                  const allPorts: any[] = modules.portscan.ports || modules.portscan.open_ports || [];
                  const openPorts = allPorts.filter((p: any) => String(p.state || '').toLowerCase() === 'open' || !p.state);
                  const filteredPorts = allPorts.filter((p: any) => String(p.state || '').toLowerCase() === 'filtered');
                  const closedPorts = allPorts.filter((p: any) => String(p.state || '').toLowerCase() === 'closed');

                  const displayedPorts = 
                    portFilter === 'open' ? openPorts :
                    portFilter === 'filtered' ? filteredPorts :
                    portFilter === 'closed' ? closedPorts :
                    allPorts;

                  return (
                    <div className="space-y-4">
                      {/* Filter Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPortFilter('open')}
                          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-sm border ${
                            portFilter === 'open'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Open ({openPorts.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortFilter('all')}
                          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-sm border ${
                            portFilter === 'all'
                              ? 'bg-primary/10 text-primary border-primary/30'
                              : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          All Scanned ({allPorts.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortFilter('filtered')}
                          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-sm border ${
                            portFilter === 'filtered'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Filtered ({filteredPorts.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortFilter('closed')}
                          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-sm border ${
                            portFilter === 'closed'
                              ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                              : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Closed ({closedPorts.length})
                        </button>
                      </div>

                      <div className="card overflow-hidden bg-surface border border-border rounded-md">
                        {displayedPorts.length === 0 ? (
                          <div className="p-8 text-center text-xs text-text-secondary uppercase">
                            {portFilter === 'open'
                              ? 'No open TCP ports discovered among scanned perimeter services.'
                              : `No ports with state "${portFilter}" discovered.`}
                          </div>
                        ) : (
                          <table className="w-full text-xs text-left">
                            <thead className="bg-surface-muted font-heading uppercase text-[10px] tracking-wider border-b border-border">
                              <tr>
                                <th className="p-3">Port</th>
                                <th className="p-3">Service</th>
                                <th className="p-3">Banner / Identification</th>
                                <th className="p-3">State</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border font-mono text-text-secondary">
                              {displayedPorts.map((p: any) => {
                                const stateLower = String(p.state || 'open').toLowerCase();
                                const isOpen = stateLower === 'open';
                                const isFiltered = stateLower === 'filtered';
                                return (
                                  <tr key={p.port} className="hover:bg-surface-container-low transition-colors">
                                    <td className="p-3 font-bold text-text-primary">
                                      <div className="flex items-center gap-2">
                                        <span className="tabular-nums">{p.port}</span>
                                        <button
                                          onClick={() => handleCopy(String(p.port), `port-${p.port}`)}
                                          title="Copy port"
                                          className="p-1 hover:text-secondary text-text-secondary/60 transition-colors"
                                        >
                                          {copiedField === `port-${p.port}` ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="p-3 font-medium text-text-primary">{p.service || 'unknown'}</td>
                                    <td className="p-3 text-[11px] text-text-secondary truncate max-w-[280px]">
                                      {p.banner || `${p.service || 'TCP'} Service`}
                                    </td>
                                    <td className="p-3">
                                      {isOpen ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-sm font-bold uppercase">
                                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 threat-pulse"></span>
                                          <span>Open</span>
                                        </span>
                                      ) : isFiltered ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-sm font-bold uppercase">
                                          <span>Filtered</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 rounded-sm font-bold uppercase">
                                          <span>Closed</span>
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 9. AI Advisor Tab */}
            {activeTab === 'advisor' && (
              <div className="space-y-6">
                <div className="border-b border-border pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wider">AI Security Advisor recommendation</h3>
                    <p className="text-[11px] text-text-secondary">Heuristic telemetry mitigation advice.</p>
                  </div>
                  <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />
                </div>

                <div className="p-6 border border-border bg-surface-muted rounded-md space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    <span className="font-heading font-bold text-xs uppercase text-text-primary">Secora Advisor Diagnostic</span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                    Based on the scan findings of {scanMeta.target}, the following security hardening steps are advised:
                  </p>
                  
                  <div className="pl-4 border-l-2 border-primary py-2 text-xs text-text-secondary leading-relaxed italic whitespace-pre-wrap">
                    {risk.recommendations?.join('\n') || "Ensure that standard TLSv1.3 configurations and frame framing policies are enforced across the host headers."}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

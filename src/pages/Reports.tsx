import { useState, useEffect } from 'react';
import { Download, FileText, Code2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getHistory()
      .then(res => {
        const completed = (res.scans || []).filter((s: any) => s.status === 'Completed' || s.status === 'success');
        setScans(completed);
        setLoading(false);
      })
      .catch(err => {
        console.error("Reports loading error:", err);
        setError(err.message || "Failed to retrieve completed scan reports.");
        setLoading(false);
      });
  }, []);

  const triggerExport = (format: string, scanId: number) => {
    window.open(`/scan/export/${format}/${scanId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
          <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">LOADING COMPILED REPORTS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8 flex-grow">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <span className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">[ SECORA / REPORTS / 05 ]</span>
        <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-tight font-light uppercase">
          SECURITY REPORTS
        </h1>
        <p className="font-body text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed mt-1">
          Export compiled diagnostic assessment bundles into structured executive formats (PDF, Markdown, JSON).
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold font-mono rounded-xs">
          {error}
        </div>
      )}

      {/* Reports Grid */}
      {scans.length === 0 ? (
        <div className="border border-white/10 p-12 text-center bg-[#081512] flex flex-col items-center justify-center gap-4 rounded-sm">
          <ShieldCheck className="h-10 w-10 text-emerald-400/60" />
          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">No Reports Generated Yet</h3>
          <p className="text-xs text-white/60 max-w-md leading-relaxed">Execute a reconnaissance sweep across an authorized target to compile downloadable vulnerability and perimeter reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scans.map((scan) => (
            <div key={scan.id} className="border border-white/10 p-6 bg-[#081512] flex flex-col justify-between gap-6 hover:border-emerald-400/40 transition-all rounded-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">REPORT ID: #{scan.id}</span>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xs font-bold uppercase">
                    COMPILED
                  </span>
                </div>
                <h4 className="font-heading font-bold text-white text-base tracking-wide uppercase truncate">
                  {scan.target}
                </h4>
                <p className="text-[9px] text-white/50 font-mono">
                  TIMESTAMP: {scan.timestamp}
                </p>
              </div>

              {/* Export Actions Panel */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase block">Select Export Format</span>
                
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <button 
                    onClick={() => triggerExport('pdf', scan.id)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold tracking-wider transition-colors rounded-xs cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={() => triggerExport('markdown', scan.id)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-heading font-bold tracking-wider transition-colors rounded-xs cursor-pointer"
                  >
                    <FileText className="h-3 w-3" />
                    <span>MARKDOWN</span>
                  </button>
                  <button 
                    onClick={() => triggerExport('json', scan.id)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-heading font-bold tracking-wider transition-colors rounded-xs cursor-pointer"
                  >
                    <Code2 className="h-3 w-3" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

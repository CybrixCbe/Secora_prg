import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    api.getHistory()
      .then(res => {
        setScans(res.scans || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("History loading error:", err);
        setError(err.message || "Failed to retrieve scan records.");
        setLoading(false);
      });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this scan record?")) return;
    
    setDeletingId(id);
    try {
      await api.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete scan record.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 75) return 'text-red-300 bg-red-950/70 border-red-500/40';
    if (score >= 40) return 'text-amber-300 bg-amber-950/70 border-amber-500/40';
    return 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40';
  };

  const filteredScans = scans.filter(s => 
    s.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 flex flex-col gap-10 flex-grow">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/30 pb-6">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[10px] text-text-secondary tracking-[0.2em]">[ SECORA / HISTORY / 04 ]</span>
          <h1 className="font-display-lg text-4xl text-text-primary tracking-tight font-light uppercase">
            SCAN HISTORY
          </h1>
          <p className="font-body text-sm text-text-secondary max-w-2xl leading-relaxed mt-2">
            Review and manage all historical vulnerability scans and infrastructure sweeps.
          </p>
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search target domains..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-border p-3 pr-10 font-body text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-secondary transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">🔍</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xs">
          {error}
        </div>
      )}

      {/* Grid Table Layout */}
      <div className="border border-border bg-surface-container-lowest overflow-hidden flex-grow">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-surface-container-low font-heading uppercase text-[10px] tracking-wider border-b border-border text-text-secondary">
            <tr>
              <th className="p-4 border-r border-border/30 w-16 text-center">[ID]</th>
              <th className="p-4 border-r border-border/30">Target Host</th>
              <th className="p-4 border-r border-border/30">Scan Date</th>
              <th className="p-4 border-r border-border/30">Risk Score</th>
              <th className="p-4 border-r border-border/30">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-text-secondary">
            {filteredScans.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-xs text-text-secondary uppercase tracking-wider">
                  No scan logs matching database query.
                </td>
              </tr>
            ) : (
              filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 border-r border-border/30 text-center font-bold text-text-primary">#{scan.id}</td>
                  <td className="p-4 border-r border-border/30 font-heading font-bold text-text-primary">{scan.target}</td>
                  <td className="p-4 border-r border-border/30 text-[10px]">{scan.timestamp}</td>
                  <td className="p-4 border-r border-border/30">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold ${getRiskBadge(scan.risk_score)}`}>
                      {scan.risk_score}/100
                    </span>
                  </td>
                  <td className="p-4 border-r border-border/30">
                    <span className={`px-2 py-0.5 text-[9px] border uppercase tracking-wider rounded-xs ${
                      scan.status === 'Cancelled'
                        ? 'bg-white/5 border-white/15 text-white/50'
                        : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-4">
                      <button 
                        onClick={() => navigate(`/scan/${scan.id}`)}
                        className="font-heading text-[10px] text-secondary hover:text-[#004d44] uppercase tracking-widest transition-colors font-bold"
                      >
                        VIEW DETAILS →
                      </button>
                      <button 
                        onClick={() => handleDelete(scan.id)}
                        disabled={deletingId === scan.id}
                        className="font-heading text-[10px] text-red-600 hover:text-red-800 uppercase tracking-widest transition-colors disabled:opacity-40"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


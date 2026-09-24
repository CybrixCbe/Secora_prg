import { useState, useEffect } from 'react';
import { Shield, Radio, Activity, Target, AlertTriangle, CheckCircle2, Crosshair } from 'lucide-react';

interface Blip {
  id: string;
  label: string;
  sub: string;
  type: 'open' | 'active' | 'warning' | 'info';
  x: number; // percentage from center (-50 to 50)
  y: number; // percentage from center (-50 to 50)
  color: string;
  status: string;
}

const BLIPS: Blip[] = [
  {
    id: 'T-01',
    label: 'api.target.com',
    sub: 'PORT 443 / TLS 1.3',
    type: 'open',
    x: 22,
    y: -24,
    color: '#10b981',
    status: 'ACTIVE LISTENER',
  },
  {
    id: 'T-02',
    label: 'AS13335 (BGP)',
    sub: '104.21.32.0/24',
    type: 'info',
    x: -32,
    y: -18,
    color: '#06b6d4',
    status: 'ROUTING PEER',
  },
  {
    id: 'T-03',
    label: 'ns1.auth-zone.net',
    sub: 'DNSSEC ENFORCED',
    type: 'active',
    x: 28,
    y: 26,
    color: '#10b981',
    status: 'RESOLVED',
  },
  {
    id: 'T-04',
    label: 'mail.relay-in.com',
    sub: 'MX / SPF VERIFIED',
    type: 'active',
    x: -24,
    y: 28,
    color: '#10b981',
    status: 'SPF PASS',
  },
  {
    id: 'T-05',
    label: 'ssh.bastion:22',
    sub: 'EXPOSED TCP SERVICE',
    type: 'warning',
    x: 8,
    y: -36,
    color: '#f59e0b',
    status: 'POTENTIAL EXPOSURE',
  },
];

export default function TacticalRadar() {
  const [activeBlip, setActiveBlip] = useState<Blip | null>(BLIPS[0]);
  const [bearing, setBearing] = useState(142);
  const [targetsCount, setTargetsCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setBearing(prev => (prev + 3) % 360);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[390px] bg-[#071310]/95 border border-emerald-500/30 rounded-lg p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 select-none">
      
      {/* Corner Technical Brackets */}
      <span className="absolute top-1.5 left-1.5 font-mono text-[8px] text-emerald-500/50">◤</span>
      <span className="absolute top-1.5 right-1.5 font-mono text-[8px] text-emerald-500/50">◥</span>
      <span className="absolute bottom-1.5 left-1.5 font-mono text-[8px] text-emerald-500/50">◣</span>
      <span className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-emerald-500/50">◢</span>

      {/* Top Header Telemetry HUD */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[9px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold tracking-wider">RADAR // ACTIVE</span>
          <span className="text-white/40">SEC-94</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-emerald-400/80">BRG: {String(bearing).padStart(3, '0')}°</span>
          <span className="text-white/30">|</span>
          <span className="text-white/80">9.4 GHz</span>
        </div>
      </div>

      {/* Radar Main Scope (Circular Polar Display) */}
      <div className="relative w-full aspect-square flex items-center justify-center p-2">
        
        {/* Outer Azimuth Compass Ring with Graduations */}
        <div className="absolute inset-2 rounded-full border border-emerald-500/40 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>

        {/* Cardinal Markers */}
        <span className="absolute top-0 text-[8px] font-mono font-bold text-emerald-400 tracking-wider">N 000°</span>
        <span className="absolute bottom-0 text-[8px] font-mono font-bold text-white/50 tracking-wider">S 180°</span>
        <span className="absolute left-0 text-[8px] font-mono font-bold text-white/50 tracking-wider">W 270°</span>
        <span className="absolute right-0 text-[8px] font-mono font-bold text-white/50 tracking-wider">E 090°</span>

        {/* Tactical SVG Scope Canvas */}
        <div className="relative w-[90%] h-[90%] rounded-full overflow-hidden bg-[#040e0c] border border-emerald-500/30 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center">
          
          {/* Radial Grid & Range Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
            {/* Concentric Range Rings */}
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.75" strokeDasharray="2,2" />
            <circle cx="100" cy="100" r="38" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="16" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="0.75" />

            {/* Horizontal & Vertical Crosshairs */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.75" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.75" />

            {/* 45 Degree Diagonal Crosshairs */}
            <line x1="36" y1="36" x2="164" y2="164" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="164" y1="36" x2="36" y2="164" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Crosshair Metric Graduations (Ticks) */}
            <line x1="97" y1="38" x2="103" y2="38" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="97" y1="60" x2="103" y2="60" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="97" y1="82" x2="103" y2="82" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="97" y1="118" x2="103" y2="118" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="97" y1="140" x2="103" y2="140" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="97" y1="162" x2="103" y2="162" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />

            <line x1="38" y1="97" x2="38" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="60" y1="97" x2="60" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="82" y1="97" x2="82" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="118" y1="97" x2="118" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="140" y1="97" x2="140" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />
            <line x1="162" y1="97" x2="162" y2="103" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.75" />

            {/* Range distance tags */}
            <text x="104" y="42" fill="rgba(16, 185, 129, 0.5)" fontSize="5.5" fontFamily="monospace">75NM</text>
            <text x="104" y="64" fill="rgba(16, 185, 129, 0.5)" fontSize="5.5" fontFamily="monospace">50NM</text>
            <text x="104" y="86" fill="rgba(16, 185, 129, 0.5)" fontSize="5.5" fontFamily="monospace">25NM</text>
          </svg>

          {/* Sweeping Beam Sector with Phosphor Glow Trail */}
          <div 
            className="absolute inset-0 rounded-full radar-sweep pointer-events-none origin-center"
            style={{
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.45) 0deg, rgba(16, 185, 129, 0.12) 40deg, transparent 65deg, transparent 360deg)'
            }}
          />

          {/* Leading Sweep Edge Line */}
          <div 
            className="absolute inset-0 rounded-full radar-sweep pointer-events-none origin-center flex items-center justify-center"
          >
            <div className="w-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300 to-white absolute right-0 top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
          </div>

          {/* Expanding Sonar Waves */}
          <div className="absolute w-8 h-8 rounded-full border border-emerald-400/40 animate-ping pointer-events-none"></div>

          {/* Target Blips */}
          {BLIPS.map((blip) => {
            const isSelected = activeBlip?.id === blip.id;
            return (
              <div
                key={blip.id}
                onClick={() => setActiveBlip(blip)}
                className="absolute cursor-pointer group"
                style={{
                  left: `calc(50% + ${blip.x}%)`,
                  top: `calc(50% + ${blip.y}%)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Ping rings */}
                <div 
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-125 border-white bg-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'hover:scale-110'
                  }`}
                  style={{ borderColor: blip.color }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: blip.color }}
                  />
                </div>

                {/* Target label tooltip on hover / active */}
                <div 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-xs bg-black/90 border text-[7.5px] font-mono whitespace-nowrap transition-all z-20 pointer-events-none ${
                    isSelected 
                      ? 'border-emerald-400 text-emerald-300 opacity-100' 
                      : 'border-white/10 text-white/60 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {blip.id}: {blip.label}
                </div>
              </div>
            );
          })}

          {/* Center Target Lock Shield Glyph */}
          <div className="relative z-10 w-9 h-9 rounded-full bg-[#030908] border border-emerald-400/60 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <Shield className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
            <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Selected Target Information Card */}
      {activeBlip ? (
        <div className="bg-black/50 border border-emerald-500/30 rounded-xs p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[8.5px]">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeBlip.color }}></span>
              [{activeBlip.id}] {activeBlip.label}
            </span>
            <span className="text-emerald-400 font-bold uppercase">{activeBlip.status}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[8px] text-white/60 pt-1 border-t border-white/10">
            <span>SPEC: {activeBlip.sub}</span>
            <span className="text-emerald-400">TRACKED</span>
          </div>
        </div>
      ) : (
        <div className="bg-black/40 border border-white/10 rounded-xs p-2.5 text-center font-mono text-[8px] text-white/50">
          SELECT BLIP TO INSPECT PERIMETER ASSET
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 font-mono text-[8px] text-white/50">
        <span className="text-emerald-400/90 font-bold">5 ASSETS ACQUIRED</span>
        <span>LAT: 37.77° N · LON: 122.41° W</span>
      </div>

    </div>
  );
}

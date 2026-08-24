'use client';

import { motion } from 'framer-motion';
import { Globe, ShieldAlert, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ThreatVector {
  id: string;
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  type: string;
  severity: string;
}

const initialVectors: ThreatVector[] = [
  { id: 'v1', from: 'Washington, USA', to: 'Frankfurt, DE', fromCoords: [60, 80], toCoords: [180, 70], type: 'SQLi Probe', severity: 'HIGH' },
  { id: 'v2', from: 'Shenzhen, CN', to: 'Tokyo, JP', fromCoords: [300, 110], toCoords: [340, 95], type: 'DDoS Leak', severity: 'CRITICAL' },
  { id: 'v3', from: 'Moscow, RU', to: 'Dhaka, BD', fromCoords: [220, 50], toCoords: [290, 130], type: 'Model Infiltration', severity: 'HIGH' },
  { id: 'v4', from: 'London, UK', to: 'Sydney, AU', fromCoords: [160, 60], toCoords: [360, 200], type: 'PII Exfiltration', severity: 'CRITICAL' },
];

export function CyberWorldMap() {
  const [vectors, setVectors] = useState<ThreatVector[]>(initialVectors);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      // Randomly change one vector's target/source to simulate live changes
      setVectors(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        const cities = [
          { name: 'Washington, USA', coords: [60, 80] },
          { name: 'Frankfurt, DE', coords: [180, 70] },
          { name: 'Dhaka, BD', coords: [290, 130] },
          { name: 'Tokyo, JP', coords: [340, 95] },
          { name: 'Sydney, AU', coords: [360, 200] },
          { name: 'Cape Town, ZA', coords: [200, 190] },
          { name: 'Sao Paulo, BR', coords: [120, 180] }
        ];
        const fromCity = cities[Math.floor(Math.random() * cities.length)];
        let toCity = cities[Math.floor(Math.random() * cities.length)];
        while (toCity.name === fromCity.name) {
          toCity = cities[Math.floor(Math.random() * cities.length)];
        }
        const types = ['Token Abuse', 'Prompt Injection', 'Data Poisoning', 'Model Exploit'];
        const severities = ['HIGH', 'CRITICAL', 'MEDIUM'];
        
        next[idx] = {
          id: `v_${Date.now()}`,
          from: fromCity.name,
          to: toCity.name,
          fromCoords: fromCity.coords as [number, number],
          toCoords: toCity.coords as [number, number],
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)]
        };
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111827]/40 border border-[var(--color-panel-border)]/80 rounded-lg p-5 shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-[340px]">
      <div className="flex justify-between items-center border-b border-[var(--color-panel-border)]/40 pb-2 mb-2 font-mono">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
          <Globe className="w-3.5 h-3.5 text-orange-400 mr-2 animate-[spin_10s_linear_infinite]" /> Global Cyber Threat Vector Map
        </h3>
        <div className="flex items-center space-x-1 text-[9px] text-[var(--color-status-orange)]">
          <Wifi className="w-3 h-3 animate-ping" />
          <span>MAP_STREAM_ACTIVE</span>
        </div>
      </div>

      {/* Cyber world map SVG view */}
      <div className="flex-1 relative min-h-[200px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220">
          {/* Cyber grid lines */}
          <line x1="0" y1="110" x2="400" y2="110" stroke="var(--color-panel-border)" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="200" y1="0" x2="200" y2="220" stroke="var(--color-panel-border)" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="200" cy="110" r="80" stroke="var(--color-panel-border)" strokeWidth="0.5" strokeDasharray="5 5" fill="none" />
          <circle cx="200" cy="110" r="140" stroke="var(--color-panel-border)" strokeWidth="0.5" strokeDasharray="10 5" fill="none" />

          {/* Dotted World Outlines (Cyberpunk grid contour) */}
          {/* North America */}
          <circle cx="60" cy="60" r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <circle cx="80" cy="80" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          {/* South America */}
          <circle cx="120" cy="170" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          {/* Europe / Asia */}
          <circle cx="200" cy="60" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <circle cx="280" cy="80" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          {/* Africa */}
          <circle cx="190" cy="150" r="18" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          {/* Australia */}
          <circle cx="350" cy="190" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

          {/* Vectors paths */}
          {vectors.map((vec) => {
            const dx = vec.toCoords[0] - vec.fromCoords[0];
            const dy = vec.toCoords[1] - vec.fromCoords[1];
            const dr = Math.sqrt(dx * dx + dy * dy);
            // Draw arc path
            const pathData = `M ${vec.fromCoords[0]} ${vec.fromCoords[1]} A ${dr} ${dr} 0 0 1 ${vec.toCoords[0]} ${vec.toCoords[1]}`;
            const color = vec.severity === 'CRITICAL' ? 'var(--color-status-red)' : 'var(--color-status-orange)';
            return (
              <g key={vec.id}>
                {/* Arc line */}
                <path 
                  d={pathData} 
                  stroke={color} 
                  strokeWidth="1.5" 
                  strokeOpacity="0.4"
                  fill="none" 
                />

                {/* Packet pulse */}
                <motion.circle r="3" fill={color} filter={`drop-shadow(0 0 3px ${color})`}>
                  <animateMotion dur="2s" repeatCount="indefinite" path={pathData} />
                </motion.circle>

                {/* Source node */}
                <circle cx={vec.fromCoords[0]} cy={vec.fromCoords[1]} r="2" fill="#e2e8f0" />
                <circle cx={vec.fromCoords[0]} cy={vec.fromCoords[1]} r="6" stroke="#e2e8f0" strokeWidth="0.5" fill="none" className="animate-ping" />

                {/* Target node */}
                <circle cx={vec.toCoords[0]} cy={vec.toCoords[1]} r="3" fill={color} />
                <circle cx={vec.toCoords[0]} cy={vec.toCoords[1]} r="8" stroke={color} strokeWidth="0.5" fill="none" className="animate-ping" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cyber logs status logs feed */}
      <div className="border-t border-[var(--color-panel-border)]/40 pt-2 h-16 font-mono text-[10px] overflow-hidden">
        <span className="text-gray-500 uppercase block font-bold tracking-wider mb-1">Threat Vector Monitor:</span>
        <div className="space-y-1">
          {vectors.map((vec, idx) => (
            <div key={`${vec.id}_log_${idx}`} className="flex justify-between items-center text-gray-400">
              <span className="text-red-400 font-semibold flex items-center">
                <ShieldAlert className="w-3 h-3 text-red-500 mr-1 animate-pulse" />
                {vec.severity}: {vec.type}
              </span>
              <span>{vec.from} ➔ {vec.to}</span>
            </div>
          )).slice(0, 2)}
        </div>
      </div>
    </div>
  );
}

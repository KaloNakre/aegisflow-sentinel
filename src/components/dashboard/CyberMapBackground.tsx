'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ThreatVector {
  id: string;
  from: [number, number]; // Percentage coords [x, y]
  to: [number, number];
  color: string;
  duration: number;
}

export function CyberMapBackground() {
  const [vectors, setVectors] = useState<ThreatVector[]>([]);

  useEffect(() => {
    // Generate initial vectors
    const initial: ThreatVector[] = [
      { id: 'v1', from: [15, 35], to: [50, 25], color: 'rgba(14, 165, 233, 0.4)', duration: 4 },
      { id: 'v2', from: [80, 20], to: [45, 65], color: 'rgba(249, 115, 22, 0.3)', duration: 6 },
      { id: 'v3', from: [50, 25], to: [85, 75], color: 'rgba(239, 68, 68, 0.3)', duration: 5 },
      { id: 'v4', from: [30, 75], to: [80, 20], color: 'rgba(167, 139, 250, 0.3)', duration: 7 },
      { id: 'v5', from: [15, 35], to: [30, 75], color: 'rgba(16, 185, 129, 0.3)', duration: 4.5 },
    ];
    setVectors(initial);

    // Periodically replace a random vector to simulate active scanning/threat dynamics
    const interval = setInterval(() => {
      setVectors(prev => {
        const next = [...prev];
        const index = Math.floor(Math.random() * next.length);
        const x1 = Math.floor(Math.random() * 90) + 5;
        const y1 = Math.floor(Math.random() * 70) + 15;
        const x2 = Math.floor(Math.random() * 90) + 5;
        const y2 = Math.floor(Math.random() * 70) + 15;
        const colors = [
          'rgba(14, 165, 233, 0.35)', // Cyan
          'rgba(249, 115, 22, 0.3)',   // Orange
          'rgba(239, 68, 68, 0.3)',    // Red
          'rgba(167, 139, 250, 0.35)', // Purple
          'rgba(16, 185, 129, 0.3)',   // Green
        ];
        next[index] = {
          id: `v-bg-${Date.now()}`,
          from: [x1, y1],
          to: [x2, y2],
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 4 + 3,
        };
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 opacity-20">
      {/* AI-Generated Cyber Map Background */}
      <img 
        src="/cyber_map_background.png" 
        alt="Cyber Map Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
      />

      {/* Absolute grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Cyber world map SVG canvas for dynamic active threat paths */}
      <svg className="w-full h-full min-w-[1200px] min-h-[800px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80">
        <defs>
          {/* Cyber glowing filters */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Scanning Circles (Kaspersky style radar sweep) */}
        <circle cx="50%" cy="50%" r="280" fill="none" stroke="rgba(14, 165, 233, 0.04)" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="50%" cy="50%" r="480" fill="none" stroke="rgba(14, 165, 233, 0.02)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="680" fill="none" stroke="rgba(14, 165, 233, 0.01)" strokeWidth="1.5" strokeDasharray="20 10" />

        {/* Global Radar Line sweep */}
        <motion.line
          x1="50%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(14, 165, 233, 0.03)"
          strokeWidth="2"
          style={{ originX: '50%', originY: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ ease: 'linear', duration: 45, repeat: Infinity }}
        />


        {/* Global Threat Arcs and Vectors */}
        {vectors.map((v) => {
          const x1 = `${v.from[0]}%`;
          const y1 = `${v.from[1]}%`;
          const x2 = `${v.to[0]}%`;
          const y2 = `${v.to[1]}%`;
          const pathId = `path-${v.id}`;

          return (
            <g key={v.id}>
              {/* Connection vector path line */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={v.color}
                strokeWidth="1"
                strokeDasharray="4 8"
                className="opacity-40"
              />

              {/* Pulsing endpoint nodes */}
              <circle cx={x1} cy={y1} r="2" fill="rgba(255,255,255,0.4)" />
              <circle cx={x2} cy={y2} r="3" fill={v.color} />
              <circle
                cx={x2}
                cy={y2}
                r="8"
                stroke={v.color}
                strokeWidth="0.5"
                fill="none"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />

              {/* Live signal particle pulse travelling along connection */}
              <motion.circle
                r="3"
                fill={v.color}
                style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))' }}
                animate={{
                  cx: [x1, x2],
                  cy: [y1, y2],
                }}
                transition={{
                  duration: v.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Cyber watermark metadata logs (corners/sides) */}
      <div className="absolute top-24 left-8 font-mono text-[9px] text-gray-600 space-y-1 opacity-70">
        <div>[SYS_SENTINEL_NODE: US_EAST_4]</div>
        <div>[TELEMETRY_LATENCY: 12MS]</div>
        <div>[DECRYPT_PROTOCOL: AES_256]</div>
      </div>

      <div className="absolute bottom-12 right-8 font-mono text-[9px] text-gray-600 space-y-1 opacity-70 text-right">
        <div>[GLOBAL_THREAT_INDEX: LEVEL_MINIMAL]</div>
        <div>[SHIELD_COVERAGE: 99.87%]</div>
        <div>[MODEL_SAFEGUARD: VERIFIED_OK]</div>
      </div>
    </div>
  );
}

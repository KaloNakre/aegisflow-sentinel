'use client';

import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
}

export function RiskGauge({ score }: RiskGaugeProps) {
  let color = 'var(--color-status-green)';
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let label = 'LOW THREAT';
  
  if (score >= 76) {
    color = 'var(--color-status-red)';
    glowColor = 'rgba(239, 68, 68, 0.5)';
    label = 'CRITICAL ALERT';
  } else if (score >= 51) {
    color = 'var(--color-status-orange)';
    glowColor = 'rgba(249, 115, 22, 0.4)';
    label = 'HIGH DANGER';
  } else if (score >= 31) {
    color = 'var(--color-status-yellow)';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    label = 'MODERATE';
  }

  const size = 220;
  const strokeWidth = 12;
  const radius = (size - 32) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75;
  const strokeDasharray = `${arcLength} ${circumference}`;
  
  const percent = score / 100;
  const strokeDashoffset = arcLength - percent * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 bg-[#090c10]/40 rounded-lg border border-[var(--color-panel-border)]/60 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)]">
      {/* Target cyber lines */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[85%] h-[85%] border border-[var(--color-panel-border)]/30 rounded-full border-dashed animate-[spin_80s_linear_infinite]" />
        <div className="absolute w-[95%] h-[95%] border border-[var(--color-accent)]/5 rounded-full" />
        {/* Crosshair ticks */}
        <div className="absolute w-full h-[1px] bg-[var(--color-panel-border)]/20" />
        <div className="absolute h-full w-[1px] bg-[var(--color-panel-border)]/20" />
      </div>

      <div className="relative w-[220px] h-[220px]">
        {/* Rotating outer scanner line */}
        <motion.div 
          className="absolute inset-2 border-2 border-t-[var(--color-accent)] border-r-transparent border-b-transparent border-l-transparent rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        {/* Background track */}
        <svg
          className="absolute top-0 left-0 w-full h-full transform rotate-135"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#111827"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>

        {/* Glowing animated value track */}
        <svg
          className="absolute top-0 left-0 w-full h-full transform rotate-135"
          viewBox={`0 0 ${size} ${size}`}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Center UI Stats */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pt-2">
          {/* Cyber matrix border decoration */}
          <div className="w-16 h-1 bg-[var(--color-panel-border)] mb-2" />
          
          <motion.span 
            className="text-4xl font-extrabold font-mono tracking-tight"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1, color }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-bold tracking-widest mt-1 uppercase" style={{ color }}>
            {label}
          </span>
          <span className="text-[9px] text-gray-500 mt-4 uppercase tracking-wider font-mono">
            SYS_RISK_INDEX
          </span>
        </div>
      </div>
    </div>
  );
}

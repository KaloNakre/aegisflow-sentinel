'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Activity, Cpu } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
}

export function SecurityScore({ score }: SecurityScoreProps) {
  let statusColor = 'var(--color-status-red)';
  let statusText = 'CRITICAL ALERT';
  let Icon = ShieldAlert;
  let glowStyle = 'shadow-[0_0_15px_rgba(239,68,68,0.25)] border-red-500/20';

  if (score >= 90) {
    statusColor = 'var(--color-status-green)';
    statusText = 'OPTIMAL COMPLIANCE';
    Icon = ShieldCheck;
    glowStyle = 'shadow-[0_0_15px_rgba(16,185,129,0.25)] border-green-500/20';
  } else if (score >= 70) {
    statusColor = 'var(--color-status-green)';
    statusText = 'SECURE TELEMETRY';
    Icon = ShieldCheck;
    glowStyle = 'shadow-[0_0_15px_rgba(16,185,129,0.25)] border-green-500/20';
  } else if (score >= 50) {
    statusColor = 'var(--color-status-yellow)';
    statusText = 'POLICY WARNING';
    Icon = Activity;
    glowStyle = 'shadow-[0_0_15px_rgba(245,158,11,0.25)] border-yellow-500/20';
  } else if (score >= 30) {
    statusColor = 'var(--color-status-orange)';
    statusText = 'HIGH RISK DEGRADATION';
    glowStyle = 'shadow-[0_0_15px_rgba(249,115,22,0.25)] border-orange-500/20';
  }

  return (
    <div className={`flex flex-col h-full justify-between p-5 bg-[#111827]/40 border ${glowStyle} rounded-lg backdrop-blur-md`}>
      <div className="flex items-center justify-between border-b border-[var(--color-panel-border)]/50 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#090c10] rounded-lg border border-[var(--color-panel-border)] shadow-inner">
            <Icon className="w-7 h-7" style={{ color: statusColor }} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono block">OPERATIONAL_MODE</span>
            <div className="text-base font-extrabold tracking-wider font-mono" style={{ color: statusColor }}>
              {statusText}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono block">SECURITY_INDEX</span>
          <motion.div 
            className="text-3xl font-black font-mono tracking-tight text-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {score}<span className="text-base text-gray-500">/100</span>
          </motion.div>
        </div>
      </div>

      {/* Cyber compliance tracking bars */}
      <div className="space-y-3.5">
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-gray-400 flex items-center"><Cpu className="w-3 h-3 text-[var(--color-accent)] mr-1.5" /> POLICY COMPLIANCE</span>
            <span className="text-gray-200">98%</span>
          </div>
          <div className="h-2 w-full bg-[#090c10] border border-[var(--color-panel-border)]/60 rounded-sm overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-[var(--color-status-green)] rounded-sm"
              style={{ boxShadow: '0 0 8px var(--color-status-green)' }}
              initial={{ width: 0 }}
              animate={{ width: '98%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-gray-400 flex items-center"><Cpu className="w-3 h-3 text-[var(--color-accent)] mr-1.5" /> MODEL WEIGHTS PROTECTION</span>
            <span className="text-gray-200">100%</span>
          </div>
          <div className="h-2 w-full bg-[#090c10] border border-[var(--color-panel-border)]/60 rounded-sm overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-[var(--color-status-green)] rounded-sm"
              style={{ boxShadow: '0 0 8px var(--color-status-green)' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-gray-400 flex items-center"><Cpu className="w-3 h-3 text-[var(--color-accent)] mr-1.5" /> PROMPT PROTECTION LEVEL</span>
            <span className="text-gray-200">85%</span>
          </div>
          <div className="h-2 w-full bg-[#090c10] border border-[var(--color-panel-border)]/60 rounded-sm overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-[var(--color-status-yellow)] rounded-sm"
              style={{ boxShadow: '0 0 8px var(--color-status-yellow)' }}
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

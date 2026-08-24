'use client';

import { Terminal, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AlertData {
  id: string;
  timestamp: string;
  severity: Severity;
  message: string;
  source: string;
}

interface AlertCenterProps {
  alerts: AlertData[];
}

const severityConfig = {
  INFO: { color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-900/30', glow: 'text-blue-400' },
  LOW: { color: 'text-green-400', bg: 'bg-green-950/30 border-green-900/30', glow: 'text-green-400' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-900/30', glow: 'text-yellow-400' },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-950/30 border-orange-900/30', glow: 'text-orange-400' },
  CRITICAL: { color: 'text-red-400', bg: 'bg-red-950/30 border-red-900/30', glow: 'text-red-400 animate-pulse' },
};

export function AlertCenter({ alerts }: AlertCenterProps) {
  return (
    <div className="font-mono text-xs space-y-2.5">
      <div className="flex items-center space-x-2 border-b border-[var(--color-panel-border)]/50 pb-2 mb-3">
        <Terminal className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">LIVE_THREAT_SYSSTREAM</span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500 py-6 text-center border border-dashed border-[var(--color-panel-border)]/60 rounded-md">
          [SYS_OK] No high-severity threats detected.
        </div>
      ) : (
        alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.INFO;
          return (
            <div 
              key={alert.id} 
              className={`p-3 rounded-sm border ${config.bg} flex items-start space-x-3 bg-black/60 relative overflow-hidden`}
            >
              {/* Pulsing indicator block */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-current" style={{ color: `var(--color-status-${alert.severity.toLowerCase()})` }} />

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-gray-200">{alert.message}</div>
                  <div className="text-[10px] text-gray-500 whitespace-nowrap ml-2">[{alert.timestamp}]</div>
                </div>
                <div className="flex items-center space-x-3 text-[10px] mt-1 pt-1 border-t border-[var(--color-panel-border)]/20">
                  <span className={`font-black uppercase tracking-wider ${config.glow}`}>
                    ⚡ {alert.severity}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">ENGINE: {alert.source}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

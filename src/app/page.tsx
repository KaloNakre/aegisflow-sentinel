'use client';

import { useState, useEffect } from 'react';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { SecurityScore } from '@/components/dashboard/SecurityScore';
import { RiskBreakdown } from '@/components/dashboard/RiskBreakdown';
import { AlertCenter, AlertData } from '@/components/dashboard/AlertCenter';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { ProcessArchitecture } from '@/components/dashboard/ProcessArchitecture';
import { Terminal, Shield, Cpu, Database, Eye, Flame, AlertCircle } from 'lucide-react';

interface TelemetryData {
  overallRisk: number;
  securityScore: number;
  risks: {
    [key: string]: { value: number; trend: 'up' | 'down' | 'stable' };
  };
  alerts: AlertData[];
  timeline: { id: string; time: string; message: string; status: 'passed' | 'warning' | 'critical' | 'info' }[];
}

interface HFModel {
  name: string;
  likes: number;
  downloads: number;
  author: string;
  safety_rating: string;
  type: string;
}

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [hfModels, setHfModels] = useState<HFModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [telemetryRes, hfRes] = await Promise.all([
        fetch('http://localhost:8000/api/telemetry'),
        fetch('http://localhost:8000/api/huggingface/models')
      ]);

      if (telemetryRes.ok) {
        const data = await telemetryRes.json();
        setTelemetry(data);
      }
      if (hfRes.ok) {
        const hfData = await hfRes.json();
        setHfModels(hfData);
      }
    } catch (e) {
      console.error("Dashboard fetch error: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-[var(--color-accent)] font-mono text-sm space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse">BOOTING SENTINEL CYBER INTERFACE...</div>
      </div>
    );
  }

  if (!telemetry) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500 font-mono border border-dashed border-red-950/50 rounded-lg p-6 bg-red-950/10">
        <AlertCircle className="w-12 h-12 mb-3 animate-pulse" />
        <span className="font-bold">CONNECTION TERMINATED</span>
        <span className="text-xs text-gray-500 mt-2">Uvicorn backend API server offline. Port: 8000</span>
      </div>
    );
  }

  const riskArray = [
    { label: 'Security Risk', ...telemetry.risks.security },
    { label: 'SOP Risk', ...telemetry.risks.sop },
    { label: 'Model Risk', ...telemetry.risks.model },
    { label: 'Data Leakage', ...telemetry.risks.data },
    { label: 'Runtime Load', ...telemetry.risks.runtime },
    { label: 'Network Risk', ...telemetry.risks.network },
    { label: 'Agent Intrusion', ...telemetry.risks.agent },
    { label: 'Token Cost Rate', ...telemetry.risks.cost },
  ];

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* Top Cyber SIEM Panel Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-panel-border)]/50 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[var(--color-accent)] font-mono text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>SENTINEL_SEC_CORE_v1.0.3</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-gray-100 uppercase mt-1">
            SOC Operations Command
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-green-500/10 text-xs font-semibold rounded border border-green-500/20 text-[var(--color-status-green)] tracking-widest flex items-center space-x-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
            <span>SIEM_FEED_ONLINE</span>
          </div>
        </div>
      </div>

      {/* Grid Layer: Gauges and Main Indexes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)]/80 rounded-lg p-5 shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Overall Threat Risk</h2>
              <span className="text-[10px] text-red-400 font-mono">[AUDIT]</span>
            </div>
            <RiskGauge score={telemetry.overallRisk} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <SecurityScore score={telemetry.securityScore} />
        </div>
      </div>

      {/* Middle Row: Process Architecture & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProcessArchitecture />
        </div>
        
        <div className="lg:col-span-1 bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 shadow-md flex flex-col justify-between">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">Risk Matrix Breakdown</h2>
          <div className="flex-1 flex items-center justify-center">
            <RiskBreakdown risks={riskArray} />
          </div>
        </div>
      </div>

      {/* Hugging Face AI Model Audit Hub */}
      <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 shadow-lg flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4 border-b border-[var(--color-panel-border)]/50 pb-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center">
            <Database className="w-4 h-4 text-orange-400 mr-2" /> Hugging Face Hub Sentinel Audit
          </h2>
          <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono">HF_API_LIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hfModels.map((model) => (
            <div 
              key={model.name} 
              className="bg-[#090c10]/60 border border-[var(--color-panel-border)]/50 rounded p-3 flex items-center justify-between hover:border-orange-500/20 transition-all font-mono"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-200">{model.name}</div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                  <span>Task: {model.type}</span>
                  <span>•</span>
                  <span>Downloads: {model.downloads.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-orange-400 block font-semibold">❤️ {model.likes} likes</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${model.safety_rating === 'Passed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {model.safety_rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Live Log Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 shadow-lg h-96 overflow-y-auto">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">SIEM Live Alert Terminal</h2>
          <AlertCenter alerts={telemetry.alerts} />
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 shadow-lg h-96 overflow-y-auto">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">Operations Chronology Timeline</h2>
          <IncidentTimeline events={telemetry.timeline} />
        </div>
      </div>
    </div>
  );
}

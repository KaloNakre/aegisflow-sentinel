'use client';

import { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Database, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface RuntimeTelemetry {
  id: number;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  gpu_usage?: number;
  latency: number;
}

export default function RuntimePage() {
  const [telemetry, setTelemetry] = useState<RuntimeTelemetry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/runtime');
        if (res.ok) {
          const data = await res.json();
          // Backend returns newest first. Reverse to display left-to-right timeline.
          setTelemetry(data.reverse());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = telemetry[telemetry.length - 1];

  const formattedChartData = telemetry.map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    CPU: Math.round(t.cpu_usage),
    Memory: Math.round(t.memory_usage),
    GPU: t.gpu_usage ? Math.round(t.gpu_usage) : 0,
    Latency: Math.round(t.latency)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
          <Server className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          Runtime Telemetry Logs
        </h1>
        <p className="text-gray-400 text-sm mt-1">Real-time compute utilization and host hardware logs.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading runtime telemetry...</div>
      ) : telemetry.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg">
          No telemetry logs found.
        </div>
      ) : (
        <>
          {/* Hardware Quick Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Host CPU Load</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">{latest?.cpu_usage.toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-[var(--color-accent)]/10 rounded-full">
                <Cpu className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Memory Allocation</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">{latest?.memory_usage.toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-[var(--color-status-green)]/10 rounded-full">
                <HardDrive className="w-6 h-6 text-[var(--color-status-green)]" />
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">GPU VRAM Load</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">{latest?.gpu_usage ? `${latest.gpu_usage.toFixed(1)}%` : 'N/A'}</span>
              </div>
              <div className="p-3 bg-[var(--color-status-orange)]/10 rounded-full">
                <Database className="w-6 h-6 text-[var(--color-status-orange)]" />
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">SLA Latency Target</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">{latest?.latency.toFixed(0)} ms</span>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Usage Telemetry Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg shadow-sm">
              <h3 className="text-base font-semibold text-gray-200 mb-6">Compute Resources Load (%)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedChartData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                    <Area type="monotone" dataKey="CPU" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Memory" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg shadow-sm">
              <h3 className="text-base font-semibold text-gray-200 mb-6">SLA Latency Timeline (ms)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                    <Line type="monotone" dataKey="Latency" stroke="#a78bfa" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

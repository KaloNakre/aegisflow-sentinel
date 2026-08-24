'use client';

import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface AIModel {
  id: number;
  name: string;
  type: string;
  accuracy: number;
  latency: number;
  vulnerability_count: number;
  request_count: number;
  status: 'Active' | 'Degraded' | 'Paused';
}

const statusConfig = {
  Active: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2 },
  Degraded: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertOctagon },
  Paused: { color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertOctagon },
};

export default function ModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/models');
        if (res.ok) {
          const data = await res.json();
          setModels(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
          <Activity className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          AI Model Monitoring Inventory
        </h1>
        <p className="text-gray-400 text-sm mt-1">Audit security vulnerability states, latency metrics, and API traffic volume per model.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading model telemetry...</div>
      ) : models.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg">
          No models connected to Sentinel.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const config = statusConfig[model.status] || statusConfig.Active;
            const Icon = config.icon;
            const hasVulns = model.vulnerability_count > 0;
            return (
              <div 
                key={model.id}
                className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] hover:border-gray-700 transition-all rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200">{model.name}</h3>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-[#090c10] border border-[var(--color-panel-border)] rounded mt-1 inline-block">
                        {model.type}
                      </span>
                    </div>
                    <span className={`flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{model.status}</span>
                    </span>
                  </div>

                  <div className="space-y-4 my-6">
                    {/* SLA Accuracy */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Model Accuracy SLA</span>
                        <span className="font-semibold text-gray-200">{(model.accuracy * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-[#090c10] h-1.5 rounded overflow-hidden">
                        <div 
                          className="bg-green-500 h-full rounded" 
                          style={{ width: `${model.accuracy * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Latency */}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Response Latency</span>
                      <span className="font-semibold text-gray-200">{model.latency.toFixed(1)} ms</span>
                    </div>

                    {/* Traffic Count */}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Processed Request API Traffic</span>
                      <span className="font-semibold text-gray-200">{model.request_count.toLocaleString()} calls</span>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 border-t border-[var(--color-panel-border)] pt-4 flex items-center justify-between`}>
                  <div className="flex items-center space-x-2 text-xs">
                    <ShieldAlert className={`w-4 h-4 ${hasVulns ? 'text-orange-400' : 'text-gray-500'}`} />
                    <span className={hasVulns ? 'text-orange-400 font-semibold' : 'text-gray-500'}>
                      {model.vulnerability_count} CVE Threats
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">ID: MODEL_{model.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

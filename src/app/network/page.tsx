'use client';

import { useState, useEffect } from 'react';
import { Network, ShieldCheck, ShieldAlert, ArrowUpRight, ArrowDownLeft, Globe } from 'lucide-react';

interface NetworkLog {
  id: number;
  timestamp: string;
  source_ip: string;
  destination_domain: string;
  bytes_sent: number;
  bytes_received: number;
  status: 'Allowed' | 'Blocked' | 'Flagged';
}

const statusConfig = {
  Allowed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: ShieldCheck, border: 'border-green-500/10' },
  Blocked: { color: 'text-red-400', bg: 'bg-red-400/10', icon: ShieldAlert, border: 'border-red-500/10' },
  Flagged: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: ShieldAlert, border: 'border-yellow-500/10' },
};

export default function NetworkPage() {
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/network');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const totalBytesSent = logs.reduce((acc, curr) => acc + curr.bytes_sent, 0);
  const totalBytesReceived = logs.reduce((acc, curr) => acc + curr.bytes_received, 0);
  const blockedCount = logs.filter(l => l.status === 'Blocked').length;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
          <Network className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          Network Egress Sentinel
        </h1>
        <p className="text-gray-400 text-sm mt-1">Audit active egress connections, firewall status, and domain whitelisting alerts.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading network access logs...</div>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Total Upload (Egress)</span>
                <span className="text-xl font-bold text-gray-200 mt-1 block flex items-center">
                  <ArrowUpRight className="w-4 h-4 text-orange-400 mr-1" />
                  {formatBytes(totalBytesSent)}
                </span>
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Total Download (Ingress)</span>
                <span className="text-xl font-bold text-gray-200 mt-1 block flex items-center">
                  <ArrowDownLeft className="w-4 h-4 text-green-400 mr-1" />
                  {formatBytes(totalBytesReceived)}
                </span>
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Blocked Host Connections</span>
                <span className="text-xl font-bold text-red-400 mt-1 block flex items-center">
                  <ShieldAlert className="w-4 h-4 text-red-400 mr-1" />
                  {blockedCount} anomalies
                </span>
              </div>
            </div>
          </div>

          {/* Network Logs List */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[var(--color-panel-border)]">
              <h3 className="text-base font-semibold text-gray-200">Active Access Logs</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-panel-border)] text-gray-400 text-xs font-semibold bg-[#090c10]/40">
                    <th className="p-4">SOURCE IP</th>
                    <th className="p-4">DESTINATION DOMAIN</th>
                    <th className="p-4">BYTES SENT</th>
                    <th className="p-4">BYTES RECEIVED</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-panel-border)]">
                  {logs.map((log) => {
                    const config = statusConfig[log.status] || statusConfig.Allowed;
                    const Icon = config.icon;
                    return (
                      <tr key={log.id} className="hover:bg-[#090c10]/20 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-300">{log.source_ip}</td>
                        <td className="p-4 font-semibold text-gray-200 flex items-center space-x-2">
                          <Globe className="w-3.5 h-3.5 text-gray-500" />
                          <span>{log.destination_domain}</span>
                        </td>
                        <td className="p-4 text-gray-400">{formatBytes(log.bytes_sent)}</td>
                        <td className="p-4 text-gray-400">{formatBytes(log.bytes_received)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                            <Icon className="w-3 h-3" />
                            <span>{log.status}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

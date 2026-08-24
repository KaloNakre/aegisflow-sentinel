'use client';

import { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, CheckCircle, Plus } from 'lucide-react';

interface Incident {
  id: number;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  source: string;
  details?: string;
  timestamp: string;
}

const severityConfig = {
  INFO: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Info },
  LOW: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertTriangle },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-400/10', icon: AlertTriangle },
  CRITICAL: { color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertOctagon },
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  
  // For creating new incident
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [newSev, setNewSev] = useState('HIGH');
  const [newSrc, setNewSrc] = useState('SOP Engine');
  const [newDet, setNewDet] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    let result = incidents;
    if (severityFilter !== 'ALL') {
      result = result.filter(i => i.severity === severityFilter);
    }
    if (sourceFilter !== 'ALL') {
      result = result.filter(i => i.source === sourceFilter);
    }
    setFilteredIncidents(result);
  }, [incidents, severityFilter, sourceFilter]);

  const handleAddIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: newSev,
          message: newMsg,
          source: newSrc,
          details: newDet
        })
      });
      if (res.ok) {
        setNewMsg('');
        setNewDet('');
        setShowAddForm(false);
        fetchIncidents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sources = Array.from(new Set(incidents.map(i => i.source)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
            <ShieldAlert className="w-6 h-6 text-[var(--color-accent)] mr-2" />
            Security Incident Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">Review, filter, and track AI security anomalies.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-md transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Trigger Mock Incident
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddIncident} className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg p-6 space-y-4 max-w-xl">
          <h2 className="text-lg font-semibold text-gray-200">Trigger New Security Event</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">SEVERITY</label>
              <select 
                value={newSev} 
                onChange={(e) => setNewSev(e.target.value)}
                className="w-full bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
              >
                <option value="INFO">INFO</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">SOURCE ENGINE</label>
              <input 
                type="text" 
                value={newSrc} 
                onChange={(e) => setNewSrc(e.target.value)}
                className="w-full bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">INCIDENT MESSAGE</label>
            <input 
              type="text" 
              value={newMsg} 
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="e.g. Model prompt leakage detected"
              className="w-full bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">DETAILS / PAYLOAD</label>
            <textarea 
              value={newDet} 
              onChange={(e) => setNewDet(e.target.value)}
              placeholder="Additional logs, raw prompts, or context..."
              className="w-full h-24 bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[var(--color-panel-border)] rounded-md text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md text-sm font-semibold"
            >
              Trigger Alert
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-4 rounded-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">SEVERITY FILTER</label>
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:outline-none"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="INFO">INFO</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">SOURCE FILTER</label>
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#090c10] border border-[var(--color-panel-border)] rounded px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:outline-none"
          >
            <option value="ALL">ALL SOURCES</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading security logs...</div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border-dashed border border-[var(--color-panel-border)] rounded-lg m-4">
            No incidents match the active filters.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-panel-border)]">
            {filteredIncidents.map((incident) => {
              const config = severityConfig[incident.severity] || severityConfig.INFO;
              const Icon = config.icon;
              return (
                <div 
                  key={incident.id} 
                  onClick={() => setSelectedIncident(incident)}
                  className="p-4 hover:bg-[var(--color-panel-border)]/50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{incident.message}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${config.bg} ${config.color}`}>
                          {incident.severity}
                        </span>
                        <span>•</span>
                        <span>Source: {incident.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(incident.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${severityConfig[selectedIncident.severity].bg} ${severityConfig[selectedIncident.severity].color}`}>
                  {selectedIncident.severity} Severity Alert
                </span>
                <h3 className="text-xl font-bold mt-2 text-gray-200">{selectedIncident.message}</h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-white text-lg font-semibold"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-y border-[var(--color-panel-border)] py-4 text-sm text-gray-300">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Detection Engine</span>
                <span className="font-medium mt-1 block">{selectedIncident.source}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Triggered At</span>
                <span className="font-medium mt-1 block">{new Date(selectedIncident.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-gray-400 uppercase">Incident Details & Payload Context</span>
              <pre className="bg-[#090c10] border border-[var(--color-panel-border)] p-4 rounded text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {selectedIncident.details || 'No additional debug context was logged for this incident.'}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-[var(--color-panel-border)] hover:bg-[var(--color-panel-border)]/80 text-white rounded-md text-sm font-semibold transition-colors"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

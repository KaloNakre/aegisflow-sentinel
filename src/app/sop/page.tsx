'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface SOP {
  id: number;
  name: string;
  content_parsed?: string;
  status: 'Passed' | 'Warning' | 'Critical';
  violations?: string;
  uploaded_at: string;
}

const statusConfig = {
  Passed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2, border: 'border-green-500/20' },
  Warning: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertTriangle, border: 'border-yellow-500/20' },
  Critical: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, border: 'border-red-500/20' },
};

export default function SOPPage() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [message, setMessage] = useState('');

  const fetchSOPs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/sops');
      if (res.ok) {
        const data = await res.json();
        setSops(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOPs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setMessage('');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/api/sops/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('SOP uploaded and parsed successfully!');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('sop-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchSOPs();
      } else {
        setMessage('Failed to upload/parse SOP.');
      }
    } catch (e) {
      console.error(e);
      setMessage('Error connecting to backend API.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
          <FileText className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          SOP Sentinel Compliance
        </h1>
        <p className="text-gray-400 text-sm mt-1">Upload and evaluate Standard Operating Procedure (SOP) regulations against active telemetry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="lg:col-span-1 bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg space-y-4 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center">
            <Upload className="w-5 h-5 text-[var(--color-accent)] mr-2" /> Upload Regulation PDF
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[var(--color-panel-border)] hover:border-[var(--color-accent)]/50 rounded-lg p-6 text-center cursor-pointer transition-colors relative">
              <input
                id="sop-file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <span className="text-xs text-gray-300 block font-medium">
                {file ? file.name : 'Choose a PDF file...'}
              </span>
              <span className="text-[10px] text-gray-500 mt-1 block">Maximum upload size: 10MB</span>
            </div>
            {message && (
              <div className="text-xs font-semibold text-center text-[var(--color-accent)]">{message}</div>
            )}
            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-colors text-white ${
                file && !uploading ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]' : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Parsing Compliance Rules...' : 'Submit to Sentinel'}
            </button>
          </form>
        </div>

        {/* SOP Policies List */}
        <div className="lg:col-span-2 bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Active Compliance Guidelines</h2>
          {loading ? (
            <div className="text-gray-400 text-center py-12">Loading guidelines...</div>
          ) : sops.length === 0 ? (
            <div className="text-gray-400 text-center py-12 border border-dashed border-[var(--color-panel-border)] rounded-md">
              No SOP documents uploaded yet. Upload a compliance guidelines PDF file.
            </div>
          ) : (
            <div className="space-y-4">
              {sops.map((sop) => {
                const config = statusConfig[sop.status] || statusConfig.Warning;
                const Icon = config.icon;
                const parsedViolations = sop.violations ? JSON.parse(sop.violations) : [];
                return (
                  <div
                    key={sop.id}
                    className={`border ${config.border} bg-[#090c10]/40 rounded-lg p-4 transition-all hover:scale-[1.01]`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${config.bg}`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200">{sop.name}</h4>
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            Uploaded {new Date(sop.uploaded_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${config.bg} ${config.color}`}>
                        {sop.status}
                      </span>
                    </div>

                    {sop.content_parsed && (
                      <p className="text-xs text-gray-400 mt-3 border-t border-[var(--color-panel-border)] pt-2 leading-relaxed italic">
                        "{sop.content_parsed}"
                      </p>
                    )}

                    {parsedViolations.length > 0 && (
                      <div className="mt-3 bg-red-950/20 border border-red-900/30 rounded p-3 text-xs">
                        <span className="font-semibold text-red-400 block mb-1">Detected Policy Violations:</span>
                        <ul className="list-disc pl-4 space-y-1 text-red-300">
                          {parsedViolations.map((v: string, index: number) => (
                            <li key={index}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

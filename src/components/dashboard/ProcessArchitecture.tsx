'use client';

import { motion } from 'framer-motion';
import { Network, FileText, Cpu, ShieldAlert, Zap, Play, RotateCcw, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NodeInfo {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: any;
  color: string;
  title: string;
  easyDesc: string;
  techDesc: string;
}

export function ProcessArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState<number>(-1); // -1 = not simulating
  const [simulationLog, setSimulationLog] = useState<string>('');
  const [simulatedPayload, setSimulatedPayload] = useState<string>('');

  const nodes: NodeInfo[] = [
    { 
      id: 'ingress', 
      label: '1. API INGRESS', 
      x: 50, 
      y: 120, 
      icon: Network, 
      color: '#0ea5e9', 
      title: 'API Ingress Gateway',
      easyDesc: 'The entry gate for all user questions and data. It checks who you are and prepares the message.',
      techDesc: 'Validates JSON schemas, enforces rate limits, strips malicious prompt headers, and tokenizes payload strings.' 
    },
    { 
      id: 'sop', 
      label: '2. SOP FILTER', 
      x: 200, 
      y: 60, 
      icon: FileText, 
      color: '#10b981', 
      title: 'Standard Operating Procedure (SOP) Auditor',
      easyDesc: 'The compliance guard. It reads internal guidelines from your PDFs and blocks illegal or unsafe instructions.',
      techDesc: 'Runs semantic vector searches against parsed compliance manuals to catch policy violations and prompt injection attempts before they reach the AI.' 
    },
    { 
      id: 'model', 
      label: '3. MODEL CORE', 
      x: 200, 
      y: 180, 
      icon: Cpu, 
      color: '#a78bfa', 
      title: 'ML / LLM Inference Engine',
      easyDesc: 'The brain of the system. This runs the actual AI model to generate answers based on approved prompts.',
      techDesc: 'Performs parameter weight calculations via Triton inference server. Tracks attention layer scores and halts execution if alignment deviations occur.' 
    },
    { 
      id: 'siem', 
      label: '4. SIEM SENTINEL', 
      x: 350, 
      y: 120, 
      icon: ShieldAlert, 
      color: '#ef4444', 
      title: 'SIEM Threat & Audit Central',
      easyDesc: 'The security log. It keeps track of how much the AI cost to run and flags any weird behavior.',
      techDesc: 'Monitors PII leakage patterns, records system utility metrics, computes Hugging Face safety evaluations, and aggregates token billing records.' 
    },
  ];

  const simulationSteps = [
    {
      nodeId: 'ingress',
      log: 'Inbound prompt received: "Extract billing tables and cross-reference with SOP-A2..."',
      payload: '{"raw_query": "Extract billing tables...", "ip": "192.168.1.92", "tokens": 42}'
    },
    {
      nodeId: 'sop',
      log: 'SOP compliance scan completed. Passed vector match (Similarity score: 0.94 / Secure).',
      payload: '{"compliance_check": "PASSED", "violates_sop": false, "action": "forward_to_model"}'
    },
    {
      nodeId: 'model',
      log: 'AI inference triggered successfully. 128 response tokens generated securely.',
      payload: '{"inference_time": "120ms", "output": "Here is the summary of compliance data...", "gpu_util": "78%"}'
    },
    {
      nodeId: 'siem',
      log: 'SIEM audit complete. Saved event log, token cost billed: $0.00034. Security status: GREEN.',
      payload: '{"billing_cost": 0.00034, "data_leak_detected": false, "sentinel_grade": "A+"}'
    }
  ];

  // Handle simulation flow
  useEffect(() => {
    if (simulationStep < 0) return;
    
    const step = simulationSteps[simulationStep];
    setActiveNode(step.nodeId);
    setSimulationLog(step.log);
    setSimulatedPayload(step.payload);

    const timer = setTimeout(() => {
      if (simulationStep < simulationSteps.length - 1) {
        setSimulationStep(s => s + 1);
      } else {
        // End simulation but keep highlight or reset
        setSimulationStep(-2); // Completed state
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [simulationStep]);

  const startSimulation = () => {
    setSimulationStep(0);
  };

  const resetSimulation = () => {
    setSimulationStep(-1);
    setActiveNode(null);
    setSimulationLog('');
    setSimulatedPayload('');
  };

  const activeNodeData = nodes.find(n => n.id === activeNode);

  return (
    <div className="bg-[#111827]/40 border border-[var(--color-panel-border)]/80 rounded-lg p-5 shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[480px]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-panel-border)]/40 pb-3 mb-4 font-mono">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <Zap className="w-4 h-4 text-[var(--color-accent)] mr-2 animate-pulse" /> Sentinel Data-Flow Architecture
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Interactive visual query pipeline simulator</p>
        </div>
        <div className="flex items-center space-x-2">
          {simulationStep >= 0 && (
            <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded animate-pulse font-mono">
              SIMULATING_FLOW... STEP {simulationStep + 1}/4
            </span>
          )}
          {simulationStep === -2 && (
            <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-mono">
              SIMULATION_COMPLETE
            </span>
          )}
          {simulationStep < 0 ? (
            <button 
              onClick={startSimulation}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[11px] font-bold font-mono rounded transition-all cursor-pointer shadow-md shadow-sky-500/15"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>TEST QUERY SIMULATOR</span>
            </button>
          ) : (
            <button 
              onClick={resetSimulation}
              className="flex items-center space-x-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-bold font-mono rounded transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
        {/* Left: SVG Diagram */}
        <div className="lg:col-span-7 relative h-[250px] lg:h-[300px] border border-gray-800/40 bg-[#090c10]/40 rounded-lg p-2 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            <defs>
              <linearGradient id="grad-sop" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad-model" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad-sop-siem" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad-model-siem" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Grid background markers for detailed feel */}
            <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="200" y1="0" x2="200" y2="240" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* SVG Connection Paths */}
            <path 
              d="M 50 120 L 200 60" 
              stroke="url(#grad-sop)" 
              strokeWidth={activeNode === 'ingress' || activeNode === 'sop' ? "2.5" : "1.5"} 
              strokeDasharray={simulationStep >= 0 ? "none" : "5 5"}
              fill="none" 
              className={`transition-all duration-300 ${simulationStep >= 0 ? 'animate-[dash_1s_linear_infinite]' : ''}`} 
            />
            <path 
              d="M 50 120 L 200 180" 
              stroke="url(#grad-model)" 
              strokeWidth={activeNode === 'ingress' || activeNode === 'model' ? "2.5" : "1.5"} 
              strokeDasharray={simulationStep >= 0 ? "none" : "5 5"}
              fill="none" 
              className={`transition-all duration-300 ${simulationStep >= 0 ? 'animate-[dash_1.5s_linear_infinite]' : ''}`} 
            />
            <path 
              d="M 200 60 L 350 120" 
              stroke="url(#grad-sop-siem)" 
              strokeWidth={activeNode === 'sop' || activeNode === 'siem' ? "2.5" : "1.5"} 
              strokeDasharray={simulationStep >= 0 ? "none" : "5 5"}
              fill="none" 
              className={`transition-all duration-300 ${simulationStep >= 0 ? 'animate-[dash_1.2s_linear_infinite]' : ''}`} 
            />
            <path 
              d="M 200 180 L 350 120" 
              stroke="url(#grad-model-siem)" 
              strokeWidth={activeNode === 'model' || activeNode === 'siem' ? "2.5" : "1.5"} 
              strokeDasharray={simulationStep >= 0 ? "none" : "5 5"}
              fill="none" 
              className={`transition-all duration-300 ${simulationStep >= 0 ? 'animate-[dash_1.4s_linear_infinite]' : ''}`} 
            />

            {/* Flowing animated signal packets (Normal Mode) */}
            {simulationStep < 0 && (
              <>
                <motion.circle r="3" fill="#0ea5e9" filter="drop-shadow(0 0 3px #0ea5e9)">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 50 120 L 200 60" />
                </motion.circle>
                <motion.circle r="3" fill="#0ea5e9" filter="drop-shadow(0 0 3px #0ea5e9)">
                  <animateMotion dur="5.5s" repeatCount="indefinite" path="M 50 120 L 200 180" />
                </motion.circle>
                <motion.circle r="3" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                  <animateMotion dur="3.5s" begin="1s" repeatCount="indefinite" path="M 200 60 L 350 120" />
                </motion.circle>
                <motion.circle r="3" fill="#a78bfa" filter="drop-shadow(0 0 3px #a78bfa)">
                  <animateMotion dur="4.8s" begin="1.5s" repeatCount="indefinite" path="M 200 180 L 350 120" />
                </motion.circle>
              </>
            )}

            {/* Active Simulation packet tracking */}
            {simulationStep === 0 && (
              <motion.circle r="5" fill="#0ea5e9" filter="drop-shadow(0 0 5px #0ea5e9)">
                <animateMotion dur="1s" repeatCount="indefinite" path="M 50 120 L 200 60" />
              </motion.circle>
            )}
            {simulationStep === 1 && (
              <motion.circle r="5" fill="#10b981" filter="drop-shadow(0 0 5px #10b981)">
                <animateMotion dur="1s" repeatCount="indefinite" path="M 200 60 L 350 120" />
              </motion.circle>
            )}
            {simulationStep === 2 && (
              <motion.circle r="5" fill="#a78bfa" filter="drop-shadow(0 0 5px #a78bfa)">
                <animateMotion dur="1.2s" repeatCount="indefinite" path="M 50 120 L 200 180" />
              </motion.circle>
            )}
            {simulationStep === 3 && (
              <motion.circle r="5" fill="#ef4444" filter="drop-shadow(0 0 5px #ef4444)">
                <animateMotion dur="1s" repeatCount="indefinite" path="M 200 180 L 350 120" />
              </motion.circle>
            )}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const IconComp = node.icon;
              const isActive = activeNode === node.id;
              
              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer group"
                  onMouseEnter={() => { if (simulationStep < 0) setActiveNode(node.id); }}
                  onMouseLeave={() => { if (simulationStep < 0) setActiveNode(null); }}
                >
                  {/* Outer glowing shield rings */}
                  {isActive && (
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r="28" 
                      fill="none" 
                      stroke={node.color} 
                      strokeWidth="1" 
                      className="animate-ping opacity-35"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="22" 
                    fill="#0b0f17" 
                    stroke={isActive ? node.color : 'rgba(31, 41, 55, 0.9)'} 
                    strokeWidth={isActive ? "2.5" : "1.5"}
                    style={{ filter: isActive ? `drop-shadow(0 0 10px ${node.color})` : 'none' }}
                    className="transition-all duration-300"
                  />

                  {/* Node icon inside SVG */}
                  <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                    <IconComp className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: isActive ? node.color : '#9ca3af' }} />
                  </g>

                  {/* Label */}
                  <text 
                    x={node.x} 
                    y={node.y + 36} 
                    fill={isActive ? '#f3f4f6' : '#9ca3af'} 
                    fontSize="9" 
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="transition-colors duration-200"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Interactive explainer panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-[300px]">
          {activeNodeData ? (
            <div className="border border-[var(--color-panel-border)]/75 bg-[#090c10]/70 rounded-lg p-4 flex-1 flex flex-col justify-between font-sans">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNodeData.color }} />
                  <span className="font-mono text-xs font-bold text-gray-200 uppercase">{activeNodeData.title}</span>
                </div>
                
                {/* Simplified Explanation */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-sky-400 font-bold block font-mono">Simple Explanation:</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {activeNodeData.easyDesc}
                  </p>
                </div>

                {/* Technical details */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block font-mono">Technical Operation:</span>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                    {activeNodeData.techDesc}
                  </p>
                </div>
              </div>

              {/* Simulation metrics if active */}
              {simulationStep >= 0 && (
                <div className="mt-3 bg-black/40 border border-gray-900 rounded p-2 font-mono text-[9px] text-[var(--color-status-yellow)] space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>LIVE_FLOW_TELEMETRY:</span>
                    <span className="animate-pulse">● MATCH</span>
                  </div>
                  <div className="text-gray-400 truncate">{simulationLog}</div>
                  <div className="text-[8px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-thin py-0.5">
                    {simulatedPayload}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-gray-800/80 bg-[#090c10]/20 rounded-lg p-6 flex-1 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-10 h-10 text-gray-600 mb-3 animate-pulse" />
              <h4 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">AegisFlow architecture audit</h4>
              <p className="text-xs text-gray-500 mt-2 max-w-[240px] leading-relaxed">
                Hover over any node in the data diagram or click <span className="text-[var(--color-accent)] font-bold">TEST QUERY SIMULATOR</span> to see the live step-by-step query safety check in action.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

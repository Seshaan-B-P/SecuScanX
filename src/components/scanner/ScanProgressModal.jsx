import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Loader2, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function ScanProgressModal({ isOpen, progress, scanType }) {
  if (!isOpen) return null;

  const steps = [
    { key: 'System Info', label: 'System Information Collection' },
    { key: 'Firewall', label: 'Windows Firewall Inspection' },
    { key: 'Defender', label: 'Microsoft Defender & Antivirus Audit' },
    { key: 'Updates', label: 'Patch Management & Hotfix Analysis' },
    { key: 'RDP', label: 'Remote Desktop & NLA Audit' },
    { key: 'Network', label: 'Network Exposure & Port Scanning' },
    { key: 'Analysis', label: 'Security Rule Engine & Scoring' },
  ];

  const currentPercent = progress?.percent || 0;
  const currentStepKey = progress?.step || 'System Info';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Top Scan Beam Animated Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 relative">
            <Shield className="w-8 h-8 animate-pulse" />
            <div className="absolute inset-0 rounded-xl border border-cyan-400/50 animate-ping opacity-20" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Executing {scanType || 'Security Assessment'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Agent-less Local Assessment in Progress...
            </p>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mb-6 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              {progress?.message || 'Scanning system security configurations...'}
            </span>
            <span className="text-sm font-bold text-white font-mono">{currentPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full shadow-cyber-glow"
              initial={{ width: '0%' }}
              animate={{ width: `${currentPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Interactive Scan Workflow Stepper */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Assessment Workflow Pipeline
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {steps.map((stepItem, idx) => {
              const isDone = currentPercent > (idx + 1) * 13 || currentPercent === 100;
              const isCurrent = currentStepKey.toLowerCase().includes(stepItem.key.toLowerCase());

              return (
                <div
                  key={stepItem.key}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition border ${
                    isCurrent
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                      : isDone
                      ? 'bg-slate-900/60 border-slate-800/80 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[10px] text-slate-600">
                        {idx + 1}
                      </div>
                    )}
                    <span>{stepItem.label}</span>
                  </div>
                  {isDone ? (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-500">Verified</span>
                  ) : isCurrent ? (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-cyan-400 animate-pulse">Running</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-600">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Workflow Diagram */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between flex-wrap gap-1">
          <span>START</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Sys Info</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Security Scan</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Network</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Rule Engine</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Score</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
          <span>Remediation</span>
        </div>
      </motion.div>
    </div>
  );
}

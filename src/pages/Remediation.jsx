import React, { useState } from 'react';
import { Wrench, Copy, Check, Terminal, ShieldAlert, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';

export default function Remediation({ currentScan }) {
  const [copiedId, setCopiedId] = useState(null);
  const findings = currentScan?.findings || [];

  const handleCopy = (id, cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#090e1a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-cyber-card">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            Remediation Guidance Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step administrator remediation guidance and post-fix verification procedures.
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Manual Admin Remediation Only (No Auto System Modification)</span>
        </div>
      </div>

      {/* Remediation Cards List */}
      <div className="space-y-6">
        {findings.length > 0 ? (
          findings.map((f) => (
            <div key={f.id} className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 shadow-cyber-card space-y-5 hover:border-cyan-500/30 transition duration-200">
              {/* Finding Title & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shadow-cyber-glow">
                    {f.id}
                  </span>
                  <h3 className="text-base font-extrabold text-white">{f.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-fit ${
                  f.severity === 'Critical' ? 'badge-critical' :
                  f.severity === 'High' ? 'badge-high' :
                  'badge-medium'
                }`}>
                  {f.severity} Severity
                </span>
              </div>

              {/* 4 Required Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Problem */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="font-extrabold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" /> 1. Problem (What is wrong?)
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-sans">{f.description}</p>
                </div>

                {/* 2. Risk */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" /> 2. Risk (Why does it matter?)
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    Exposes host component <strong className="text-slate-200">{f.affectedComponent || 'Windows System'}</strong> to unauthorized exploitation or policy bypass.
                  </p>
                </div>

                {/* 3. Recommendation */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 3. Recommendation (What to do?)
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-sans">{f.recommendation}</p>
                </div>

                {/* 4. Verification */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="font-extrabold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <HelpCircle className="w-3.5 h-3.5" /> 4. Verification (How to verify?)
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-sans">{f.verification}</p>
                </div>
              </div>

              {/* Copyable PowerShell Snippet */}
              {f.remediationCmd && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Authorized PowerShell Remediation Command:
                    </span>
                    <button
                      onClick={() => handleCopy(f.id, f.remediationCmd)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition flex items-center space-x-1.5 text-[11px] font-bold"
                    >
                      {copiedId === f.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-[#040711] text-cyan-300 rounded-lg border border-slate-800 font-bold select-all overflow-x-auto shadow-inner">
                    {f.remediationCmd}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-[#090e1a] border border-slate-800 p-12 rounded-2xl text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Zero Action Required</h3>
            <p className="text-xs text-slate-400">All security rules evaluated clean during the recent scan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

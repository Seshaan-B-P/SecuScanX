import React, { useState } from 'react';
import { Settings, Shield, Sliders, Database, Info, Moon, Sun, Check, Radio } from 'lucide-react';
import { DEFAULT_SCORING_WEIGHTS } from '../rules/scoringConfig';

export default function SettingsPage({ isDemoMode, setIsDemoMode }) {
  const [weights, setWeights] = useState({ ...DEFAULT_SCORING_WEIGHTS });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            SecuScanX Application Settings & Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure scan preferences, risk weights, demo data modes, and data retention.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-cyber-glow transition flex items-center space-x-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo Mode & Operational Controls */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            Demo Mode & Execution Controls
          </h3>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Interactive Demo Mode</div>
              <div className="text-[11px] text-slate-400">Simulate local scan data for demonstration or unprivileged environments.</div>
            </div>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isDemoMode ? 'Demo Mode Active' : 'Real Hardware Scan'}
            </button>
          </div>
        </div>

        {/* Customizable Severity Deduction Weights */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Severity Score Impact Penalties
          </h3>

          <div className="space-y-3 text-xs">
            {Object.keys(weights).map((sev) => (
              <div key={sev} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-slate-300">{sev} Finding Impact Penalty</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={weights[sev]}
                    onChange={(e) => setWeights({ ...weights, [sev]: parseInt(e.target.value, 10) || 0 })}
                    className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-cyan-400"
                  />
                  <span className="text-slate-500 font-mono">Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Metadata & Security Disclaimer */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card space-y-3 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Application Information & Security Scope
          </h3>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-cyan-400">SecuScanX (WinSecureX)</strong> is an agent-less Windows security assessment desktop system designed for authorized workstation audits.
            </p>
            <p>
              • <strong>Agent-less Design:</strong> No background services or permanent agents are installed on the local system.<br />
              • <strong>Read-Only Policy:</strong> The assessment engine does not modify Windows Registry keys, Firewall rules, passwords, or system policies automatically.<br />
              • <strong>Safe Execution:</strong> All system checks utilize safe, read-only PowerShell commands, WMI queries, and Node.js APIs.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Version: 1.0.0 | Architecture: Electron + React + Node.js | Environment: Windows OS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

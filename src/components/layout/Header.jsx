import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Zap, Layers, Radio, Monitor, CheckCircle2 } from 'lucide-react';

export default function Header({ onStartScan, isDemoMode, setIsDemoMode }) {
  const location = useLocation();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Security Assessment Dashboard';
      case '/system-info': return 'System Information & Hardware Specs';
      case '/system-scanner': return 'System Security Scanner';
      case '/network-scanner': return 'Network Exposure & Port Inspector';
      case '/vulnerabilities': return 'Vulnerability Findings Registry';
      case '/risk-assessment': return 'Risk Assessment & Scoring Engine';
      case '/remediation': return 'Remediation Guidance Center';
      case '/history': return 'Historical Assessments Log';
      case '/reports': return 'Report Generator & Exporter';
      case '/settings': return 'System Settings & Preferences';
      default: return 'SecuScanX System';
    }
  };

  return (
    <header className="h-16 bg-[#050914]/90 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 backdrop-blur-xl z-10 select-none">
      <div className="flex items-center space-x-4">
        <h2 className="text-base font-extrabold text-slate-100 tracking-wide font-sans">
          {getPageTitle(location.pathname)}
        </h2>
        {isDemoMode && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Radio className="w-3 h-3 text-amber-400" /> DEMO DATA ACTIVE
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Scan Action Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onStartScan('Quick Scan')}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition flex items-center space-x-1.5"
            title="Run Quick Security Audit"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Audit</span>
          </button>
          <button
            onClick={() => onStartScan('Full Scan')}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition flex items-center space-x-1.5"
            title="Run Full System & Network Security Assessment"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Full Scan</span>
          </button>
          <button
            onClick={() => onStartScan('Network Scan')}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-purple-400 hover:bg-slate-900 rounded-lg transition flex items-center space-x-1.5"
            title="Run Network Exposure & Listening Ports Scan"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Network Scan</span>
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border ${
            isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-cyber-glow'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {isDemoMode ? 'Exit Demo' : 'Demo Mode'}
        </button>

        {/* Live System Clock */}
        <div className="text-right text-xs font-mono text-slate-400 border-l border-slate-800/80 pl-4">
          <div className="text-cyan-400 font-black tracking-wide">{timeStr}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Local Host
          </div>
        </div>
      </div>
    </header>
  );
}

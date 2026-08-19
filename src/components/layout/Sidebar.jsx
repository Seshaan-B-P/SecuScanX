import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Monitor, 
  ShieldCheck, 
  Network, 
  AlertTriangle, 
  Activity, 
  Wrench, 
  History, 
  FileText, 
  Settings, 
  Play,
  Lock,
  UserCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ onStartScan, isAdmin, currentScan }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/system-info', label: 'System Info', icon: Monitor },
    { path: '/system-scanner', label: 'System Scanner', icon: ShieldCheck },
    { path: '/network-scanner', label: 'Network Scanner', icon: Network },
    { path: '/vulnerabilities', label: 'Vulnerabilities', icon: AlertTriangle },
    { path: '/risk-assessment', label: 'Risk Assessment', icon: Activity },
    { path: '/remediation', label: 'Remediation Center', icon: Wrench },
    { path: '/history', label: 'Scan History', icon: History },
    { path: '/reports', label: 'Report Generator', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#050914]/95 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 select-none z-20 backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/30 shadow-cyber-glow relative group">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white flex items-center gap-1">
                SecuScan<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">X</span>
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold font-mono">
                Agent-less Windows System
              </p>
            </div>
          </div>
          <div className="mt-3 text-[10px] font-mono tracking-widest uppercase flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-400">Tagline</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Scan. Assess. Secure.
            </span>
          </div>
        </div>

        {/* Start Scan Button */}
        <div className="px-4 py-4">
          <button
            onClick={() => onStartScan('Full Scan')}
            disabled={currentScan?.scanning}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-[1px] font-bold text-white shadow-cyber-glow hover:shadow-cyan-500/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex items-center justify-center space-x-2 rounded-xl bg-slate-950/50 px-4 py-3 backdrop-blur-md group-hover:bg-transparent transition-colors">
              <Play className="w-4 h-4 fill-cyan-400 text-cyan-400 group-hover:fill-white group-hover:text-white transition-colors animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase">Start Security Scan</span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-cyber-glow font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r shadow-[0_0_10px_#06b6d4]" />
                    )}
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Privilege & Session Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <UserCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-[11px] font-bold text-slate-300 font-mono">
              {isAdmin ? 'ADMIN SESSION' : 'STANDARD SESSION'}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border ${isAdmin ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'}`}>
            {isAdmin ? 'ELEVATED' : 'LIMITED'}
          </span>
        </div>
      </div>
    </aside>
  );
}

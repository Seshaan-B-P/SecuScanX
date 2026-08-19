import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Monitor, User, RefreshCw, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SystemScanner({ currentScan, onStartScan }) {
  const fw = currentScan?.firewallInfo || {};
  const def = currentScan?.defenderInfo || {};
  const rdp = currentScan?.rdpInfo || {};
  const sys = currentScan?.systemInfo || {};
  const patch = currentScan?.updateInfo || {};

  const modules = [
    {
      title: 'Windows Firewall Status',
      category: 'Firewall',
      icon: ShieldCheck,
      status: fw.allEnabled ? 'Secure' : 'Exposure Detected',
      color: fw.allEnabled ? 'emerald' : 'red',
      details: [
        { label: 'Public Profile', val: fw.publicProfile || 'Unavailable', secure: fw.publicProfile === 'Enabled' },
        { label: 'Private Profile', val: fw.privateProfile || 'Unavailable', secure: fw.privateProfile === 'Enabled' },
        { label: 'Domain Profile', val: fw.domainProfile || 'Unavailable', secure: fw.domainProfile === 'Enabled' }
      ]
    },
    {
      title: 'Microsoft Defender & Antivirus',
      category: 'Defender',
      icon: Shield,
      status: def.realTimeProtection === 'Enabled' ? 'Secure' : 'Critical Exposure',
      color: def.realTimeProtection === 'Enabled' ? 'emerald' : 'red',
      details: [
        { label: 'Antivirus Service', val: def.antivirusEnabled || 'Unavailable', secure: def.antivirusEnabled === 'Enabled' },
        { label: 'Real-Time Protection', val: def.realTimeProtection || 'Unavailable', secure: def.realTimeProtection === 'Enabled' },
        { label: 'Intelligence Signatures', val: def.signaturesUpToDate || 'Unavailable', secure: !def.signaturesUpToDate?.includes('Outdated') }
      ]
    },
    {
      title: 'Remote Desktop Protocol (RDP)',
      category: 'RDP',
      icon: KeyRound,
      status: rdp.enabled ? 'RDP Active' : 'Disabled (Secure)',
      color: rdp.enabled ? (rdp.nlaRequired === 'Disabled (High Risk)' ? 'red' : 'amber') : 'emerald',
      details: [
        { label: 'RDP Service State', val: rdp.statusText || 'Disabled', secure: !rdp.enabled },
        { label: 'NLA Enforcement', val: rdp.nlaRequired || 'Unavailable', secure: rdp.nlaRequired === 'Enabled' },
        { label: 'Port Exposure', val: `Port ${rdp.port || 3389}`, secure: !rdp.enabled }
      ]
    },
    {
      title: 'Patch Management & Updates',
      category: 'Patch Management',
      icon: RefreshCw,
      status: patch.serviceStatus === 'Running' ? 'Active Service' : 'Attention Needed',
      color: patch.serviceStatus === 'Running' ? 'emerald' : 'amber',
      details: [
        { label: 'Windows Update Service', val: patch.serviceStatus || 'Unavailable', secure: patch.serviceStatus === 'Running' },
        { label: 'Hotfixes Installed', val: `${patch.hotfixCount || 0} Patches Recorded`, secure: (patch.hotfixCount || 0) > 0 },
        { label: 'Last Hotfix Date', val: patch.lastHotfixDate || 'Unavailable', secure: patch.lastHotfixDate !== 'Unavailable' }
      ]
    },
    {
      title: 'User Security & Credentials',
      category: 'User Security',
      icon: User,
      status: sys.uacStatus?.includes('Secure') ? 'Secure' : 'Risk Flagged',
      color: sys.uacStatus?.includes('Secure') ? 'emerald' : 'red',
      details: [
        { label: 'User Account Control (UAC)', val: sys.uacStatus || 'Unavailable', secure: sys.uacStatus?.includes('Secure') },
        { label: 'Current Session Privilege', val: sys.isAdmin ? 'Administrator' : 'Standard User', secure: !sys.isAdmin },
        { label: 'Guest Account Status', val: (sys.localUsers || []).find(u => u.name === 'Guest')?.enabled ? 'Active (High Risk)' : 'Disabled (Secure)', secure: !(sys.localUsers || []).find(u => u.name === 'Guest')?.enabled }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            System Security Audit Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Read-only policy inspection across OS, Firewall, Defender, RDP, and Patching.
          </p>
        </div>
        <button
          onClick={() => onStartScan('Full Scan')}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-cyber-glow transition"
        >
          Re-Run System Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{m.title}</h3>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{m.category}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${m.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : m.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {m.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {m.details.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80 text-xs">
                      <span className="text-slate-400">{d.label}</span>
                      <span className={`font-mono font-bold ${d.secure ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {d.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

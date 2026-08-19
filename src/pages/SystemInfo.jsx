import React from 'react';
import { Monitor, Cpu, HardDrive, User, Clock, ShieldCheck, Wifi, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SystemInfo({ systemInfo, networkInfo }) {
  const sys = systemInfo || {};
  const net = networkInfo || {};

  const infoFields = [
    { label: 'Computer Name', value: sys.computerName, icon: Server, color: 'text-cyan-400' },
    { label: 'Windows Version', value: sys.windowsVersion, icon: Monitor, color: 'text-blue-400' },
    { label: 'Windows Build', value: sys.buildNumber ? `Build ${sys.buildNumber}` : null, icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Architecture', value: sys.architecture, icon: Cpu, color: 'text-emerald-400' },
    { label: 'CPU Model', value: sys.cpu, icon: Cpu, color: 'text-amber-400' },
    { label: 'Total RAM Memory', value: sys.totalRAM, icon: Server, color: 'text-cyan-400' },
    { label: 'Current Logged-in User', value: sys.currentUser ? `${sys.currentUser} (${sys.isAdmin ? 'Administrator' : 'Standard User'})` : null, icon: User, color: 'text-indigo-400' },
    { label: 'System Uptime', value: sys.uptime, icon: Clock, color: 'text-cyan-400' },
    { label: 'UAC Status', value: sys.uacStatus, icon: ShieldCheck, color: sys.uacStatus?.includes('Secure') ? 'text-emerald-400' : 'text-amber-400' },
    { label: 'Local IPv4 Address', value: net.localIP || sys.localIP, icon: Wifi, color: 'text-emerald-400' },
    { label: 'Active Interface', value: net.interfaceName, icon: Wifi, color: 'text-blue-400' },
    { label: 'Default Gateway', value: net.defaultGateway, icon: Server, color: 'text-slate-400' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            Host System Information & Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Collected via Node.js APIs and safe PowerShell system queries.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${sys.isAdmin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
            {sys.isAdmin ? 'ELEVATED ADMIN PERMISSIONS' : 'STANDARD USER PERMISSIONS'}
          </span>
        </div>
      </div>

      {/* Grid of System Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoFields.map((item, idx) => {
          const Icon = item.icon;
          const displayVal = item.value || 'Unavailable';
          const isUnavailable = displayVal === 'Unavailable';

          return (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-start space-x-3.5 hover:border-cyan-500/30 transition">
              <div className={`p-2.5 rounded-lg bg-slate-900 border border-slate-800 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</div>
                <div className="mt-1">
                  {isUnavailable ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-500 border border-slate-700">
                      Unavailable
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-slate-100 font-mono truncate block">
                      {displayVal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage & Local Accounts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Partition Usage */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            Storage Drive Partitions
          </h3>
          <div className="space-y-4">
            {(sys.disks || []).length > 0 ? (
              sys.disks.map((d, i) => (
                <div key={i} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white font-mono">{d.drive} Local Disk</span>
                    <span className="text-slate-400 font-mono">{d.usedGB} GB Used / {d.sizeGB} GB Total ({d.usedPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full ${d.usedPercent > 85 ? 'bg-red-500' : d.usedPercent > 70 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                      style={{ width: `${Math.min(100, d.usedPercent)}%` }} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-4">No local disk partitions retrieved.</div>
            )}
          </div>
        </div>

        {/* Local Users Audit */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Local User Accounts Audit
          </h3>
          <div className="space-y-3">
            {(sys.localUsers || []).length > 0 ? (
              sys.localUsers.map((u, i) => (
                <div key={i} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{u.name}</div>
                    <div className="text-[10px] text-slate-400">Last Session: {u.lastLogon || 'N/A'}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${u.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    {u.enabled ? 'Active Account' : 'Disabled'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-4">Local accounts unavailable.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

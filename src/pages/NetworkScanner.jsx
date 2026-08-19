import React from 'react';
import { Network, Wifi, Server, Radio, ShieldAlert, Cpu, Activity, AlertOctagon } from 'lucide-react';

export default function NetworkScanner({ networkInfo, onStartScan }) {
  const net = networkInfo || {};
  const ports = net.listeningPorts || [];
  const arp = net.arpTable || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            Network Exposure & Listening Port Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Safe, non-intrusive local socket inspection (ipconfig, netstat, arp, Get-NetTCPConnection).
          </p>
        </div>
        <button
          onClick={() => onStartScan('Network Scan')}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-cyber-glow transition"
        >
          Re-Scan Network Exposure
        </button>
      </div>

      {/* Network Interface Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Local IP Address</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{net.localIP || 'Unavailable'}</div>
          <div className="text-[10px] text-slate-500 mt-1">{net.interfaceName || 'Wi-Fi / Ethernet'}</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">MAC Hardware Address</div>
          <div className="text-sm font-bold text-slate-200 font-mono mt-1 truncate">{net.macAddress || 'Unavailable'}</div>
          <div className="text-[10px] text-slate-500 mt-1">Local Interface</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Default Gateway</div>
          <div className="text-sm font-bold text-slate-200 font-mono mt-1">{net.defaultGateway || 'Unavailable'}</div>
          <div className="text-[10px] text-slate-500 mt-1">Router IP</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Listening TCP Sockets</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">{net.totalListeningPorts || ports.length}</div>
          <div className="text-[10px] text-red-400 font-semibold mt-1">{net.highRiskPortsCount || 0} High/Critical Risk</div>
        </div>
      </div>

      {/* Main Table: Listening Ports & Services */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-400" />
          Active Listening Network Ports & Process Risk
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3 px-4">Port</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Owning Process / Service</th>
                <th className="py-3 px-4">Exposure Reason</th>
                <th className="py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {ports.length > 0 ? (
                ports.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{p.port}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{p.protocol || 'TCP'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {p.state || 'LISTENING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{p.process || 'Unknown Process'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.reason || 'Network Service Listener'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        p.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        p.risk === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        p.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {p.risk || 'Low'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No active listening TCP ports detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARP Cache Table */}
      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Neighbor ARP Table Cache
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {arp.map((a, idx) => (
            <div key={idx} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-mono font-bold text-white">{a.ip}</div>
                <div className="font-mono text-[10px] text-slate-400">{a.mac}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 uppercase">
                {a.type || 'dynamic'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

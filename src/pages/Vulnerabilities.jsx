import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, ShieldAlert, ArrowRight, X, Terminal, CheckCircle2 } from 'lucide-react';

export default function Vulnerabilities({ currentScan }) {
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFindingModal, setActiveFindingModal] = useState(null);

  const findings = currentScan?.findings || [];

  const severities = ['All', 'Critical', 'High', 'Medium', 'Low', 'Informational'];

  const filteredFindings = findings.filter(f => {
    const matchesSeverity = selectedSeverity === 'All' || f.severity === selectedSeverity;
    const matchesQuery = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesQuery;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Vulnerability Findings Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detected security weaknesses, configuration flaws, and exposure points.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>Showing <strong className="text-cyan-400">{filteredFindings.length}</strong> of <strong className="text-white">{findings.length}</strong> findings</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
        {/* Severity Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {severities.map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 shadow-cyber-glow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, Title, Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-cyber-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Finding Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Impact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredFindings.length > 0 ? (
                filteredFindings.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setActiveFindingModal(f)}
                    className="hover:bg-slate-900/60 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{f.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{f.title}</td>
                    <td className="py-3.5 px-4 text-slate-400">{f.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        f.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        f.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        f.severity === 'Low' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-red-400">-{f.scoreImpact || 0} pts</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {f.status || 'Open'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center justify-end space-x-1 ml-auto">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No findings match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finding Details Modal / Drawer */}
      {activeFindingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveFindingModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                activeFindingModal.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                activeFindingModal.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {activeFindingModal.severity} Severity (-{activeFindingModal.scoreImpact} Score)
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {activeFindingModal.id}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">{activeFindingModal.title}</h3>
            <p className="text-xs text-slate-400 mb-6">Category: <strong className="text-cyan-400">{activeFindingModal.category}</strong> | Affected Component: <strong className="text-slate-200">{activeFindingModal.affectedComponent || 'Windows System'}</strong></p>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-slate-300 leading-relaxed">{activeFindingModal.description}</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider mb-1">Audit Evidence Collected</h4>
                <div className="font-mono text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {activeFindingModal.evidence}
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider mb-1">Remediation Recommendation</h4>
                <p className="text-slate-300 leading-relaxed">{activeFindingModal.recommendation}</p>
              </div>

              {activeFindingModal.remediationCmd && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-cyan-400" /> Authorized Admin PowerShell Remediation Command:
                  </div>
                  <div className="text-cyan-300 select-all p-2 bg-slate-900 rounded border border-slate-800 font-bold overflow-x-auto">
                    {activeFindingModal.remediationCmd}
                  </div>
                </div>
              )}

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-purple-400 uppercase tracking-wider mb-1">Post-Fix Verification Step</h4>
                <p className="text-slate-400">{activeFindingModal.verification}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveFindingModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
              >
                Close Finding Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

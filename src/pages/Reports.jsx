import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Printer, CheckCircle2, Eye } from 'lucide-react';
import { exportReportToPDF, downloadHTMLReportFile, generateHTMLReport } from '../services/reportExporter';

export default function Reports({ currentScan }) {
  const [activeTab, setActiveTab] = useState('preview');

  if (!currentScan) {
    return (
      <div className="p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Active Scan Data to Export</h3>
        <p className="text-xs">Perform a security scan first to generate PDF or HTML assessment reports.</p>
      </div>
    );
  }

  const sys = currentScan.systemInfo || {};
  const findings = currentScan.findings || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Security Assessment Report Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Export professional PDF & HTML reports branded with SecuScanX.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => downloadHTMLReportFile(currentScan)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-400 font-bold text-xs rounded-xl transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export HTML Report</span>
          </button>
          <button
            onClick={() => exportReportToPDF(currentScan)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-cyber-glow transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Interactive Report Document Preview Card */}
      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl shadow-cyber-card space-y-8 max-w-4xl mx-auto">
        {/* Report Header Cover */}
        <div className="border-b-2 border-cyan-500 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-cyan-400 tracking-wider">SecuScanX</h1>
            <div className="text-sm font-semibold text-slate-300 mt-1">Agent-less Windows Security Assessment System</div>
            <div className="text-[11px] text-emerald-400 font-bold tracking-widest uppercase mt-2">SCAN. ASSESS. SECURE.</div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div className="text-white font-bold">Report ID: {currentScan.id}</div>
            <div>Date: {currentScan.dateFormatted || new Date().toLocaleDateString()}</div>
            <div>Time: {currentScan.timeFormatted}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-cyan-400 border-l-4 border-cyan-500 pl-3">Executive Summary</h3>
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Overall Security Rating</div>
              <div className="text-2xl font-black mt-1" style={{ color: currentScan.ratingHex }}>{currentScan.rating} ({currentScan.score} / 100)</div>
              <div className="text-xs text-slate-400 mt-1">Total Vulnerability Findings: <strong className="text-white">{currentScan.totalFindings}</strong></div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-red-400 font-bold">{currentScan.critical} Critical</div>
              <div className="text-orange-400 font-bold">{currentScan.high} High</div>
              <div className="text-amber-400 font-bold">{currentScan.medium} Medium</div>
              <div className="text-cyan-400 font-bold">{currentScan.low} Low</div>
            </div>
          </div>
        </div>

        {/* Target Information */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-cyan-400 border-l-4 border-cyan-500 pl-3">Target System Specifications</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800"><span className="text-slate-500">Host Name:</span> <strong className="text-white">{sys.computerName}</strong></div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800"><span className="text-slate-500">Windows OS:</span> <strong className="text-white">{sys.windowsVersion}</strong></div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800"><span className="text-slate-500">Build / Arch:</span> <strong className="text-white">Build {sys.buildNumber} ({sys.architecture})</strong></div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800"><span className="text-slate-500">User Session:</span> <strong className="text-white">{sys.currentUser} ({sys.isAdmin ? 'Admin' : 'Standard'})</strong></div>
          </div>
        </div>

        {/* Findings Summary Table Preview */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-cyan-400 border-l-4 border-cyan-500 pl-3">Vulnerability Findings Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-slate-400 font-mono">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Finding Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {findings.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{f.id}</td>
                    <td className="p-3 font-semibold">{f.title}</td>
                    <td className="p-3 text-slate-400">{f.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        f.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {f.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          Generated by <strong>SecuScanX</strong> – Agent-less Windows Security Assessment System
        </div>
      </div>
    </div>
  );
}

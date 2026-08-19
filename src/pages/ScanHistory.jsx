import React from 'react';
import { History, TrendingDown, Download, Trash2, Shield, Calendar, Clock, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { exportReportToPDF, downloadHTMLReportFile } from '../services/reportExporter';

export default function ScanHistory({ scanHistory = [], onSelectScan, onClearHistory }) {
  const lineData = scanHistory.slice(0, 10).reverse().map(s => ({
    date: s.dateFormatted || s.timestamp?.slice(5, 10) || 'Scan',
    score: s.score
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Historical Security Assessments Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Historical audit records stored locally in SQLite / JSON file database.
          </p>
        </div>

        {scanHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 bg-slate-900 hover:bg-red-500/20 text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History Log</span>
          </button>
        )}
      </div>

      {/* Recharts Score Trend Line Chart */}
      {lineData.length > 0 && (
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-cyber-card">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            Historical Score Progression Over Time
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-cyber-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4">Scan ID</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Scan Type</th>
                <th className="py-3.5 px-4">Security Score</th>
                <th className="py-3.5 px-4">Findings Breakdown</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4 text-right">Export Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {scanHistory.length > 0 ? (
                scanHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{scan.id}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{scan.dateFormatted || scan.timestamp?.slice(0, 10)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{scan.timeFormatted}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {scan.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold ${scan.badgeClass}`}>
                        {scan.score} / 100 ({scan.rating})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                        <span className="text-red-400 font-bold">{scan.critical || 0} Critical</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-orange-400 font-bold">{scan.high || 0} High</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400">{scan.medium || 0} Med</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{scan.duration || '5s'}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => exportReportToPDF(scan)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition font-semibold text-[11px]"
                        title="Download PDF"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => downloadHTMLReportFile(scan)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-700 transition font-semibold text-[11px]"
                        title="Download HTML"
                      >
                        HTML
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No historical security scan records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

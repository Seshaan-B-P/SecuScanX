import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Network, 
  Play, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Cpu,
  Radio,
  Server
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

import ScoreGauge from '../components/dashboard/ScoreGauge';

export default function Dashboard({ currentScan, scanHistory = [], onStartScan }) {
  const navigate = useNavigate();

  // Initial Empty State when no scan completed yet
  if (!currentScan) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[75vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#090e1a] border border-cyan-500/30 p-12 rounded-3xl max-w-xl shadow-cyber-card relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 animate-pulse" />
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-6 shadow-cyber-glow">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-wide">No Scan Executed Yet</h2>
          <p className="text-slate-400 text-xs mb-8 leading-relaxed">
            Welcome to <strong className="text-cyan-400">SecuScanX</strong>. Run an agent-less Windows security assessment to audit system configurations, inspect open ports, detect security flaws, and calculate your workstation security rating.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onStartScan('Full Scan')}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-cyber-glow transition flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start First Security Scan</span>
            </button>
            <button
              onClick={() => onStartScan('Quick Scan')}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Quick Audit</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const score = currentScan.score ?? 100;
  const rating = currentScan.rating || 'Good';
  const ratingColor = currentScan.ratingHex || '#06b6d4';

  // Severity Chart Data
  const severityData = [
    { name: 'Critical', value: currentScan.critical || 0, color: '#ef4444' },
    { name: 'High', value: currentScan.high || 0, color: '#f97316' },
    { name: 'Medium', value: currentScan.medium || 0, color: '#f59e0b' },
    { name: 'Low', value: currentScan.low || 0, color: '#06b6d4' },
  ].filter(d => d.value > 0);

  // Category Chart Data
  const categoryMap = {};
  (currentScan.findings || []).forEach(f => {
    categoryMap[f.category] = (categoryMap[f.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    category: cat,
    findings: categoryMap[cat]
  }));

  // History Line Chart Data
  const historyLineData = scanHistory.slice(0, 7).reverse().map(s => ({
    date: s.dateFormatted || s.timestamp?.slice(5, 10) || 'Scan',
    score: s.score
  }));
  if (historyLineData.length === 0) {
    historyLineData.push({ date: 'Current', score: currentScan.score });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Scan Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-card border border-slate-800 p-6 rounded-2xl shadow-cyber-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-black text-white tracking-wide">Workstation Assessment Summary</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${currentScan.badgeClass}`}>
              {rating} ({score} / 100)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span>Last Scan: <strong className="text-slate-200">{currentScan.dateFormatted || 'Just now'} ({currentScan.timeFormatted})</strong></span>
            <span>•</span>
            <span>Duration: <strong className="text-slate-200">{currentScan.duration || '5s'}</strong></span>
            <span>•</span>
            <span>Type: <strong className="text-cyan-400">{currentScan.type}</strong></span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onStartScan('Quick Scan')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Quick Scan</span>
          </button>
          <button
            onClick={() => onStartScan('Network Scan')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition flex items-center space-x-2"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Network Scan</span>
          </button>
          <button
            onClick={() => onStartScan('Full Scan')}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-black text-white uppercase tracking-wider rounded-xl shadow-cyber-glow transition flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Security Scan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Circular Gauge Meter & Severity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Circular SVG Score Gauge Meter */}
        <div className="bg-cyber-card border border-cyan-500/30 p-6 rounded-2xl shadow-cyber-glow flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest font-mono">
            Overall Security Score
          </span>
          <ScoreGauge 
            score={score} 
            rating={rating} 
            ratingColor={ratingColor} 
            badgeClass={currentScan.badgeClass} 
          />
          <div className="mt-2 text-[11px] text-slate-400 max-w-xs leading-relaxed font-sans">
            Score evaluated based on local system security baseline policies and network exposure checks.
          </div>
        </div>

        {/* Right: 5 Severity Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-2 gap-4">
          {/* Total Findings */}
          <div className="bg-cyber-card border border-slate-800 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Findings</span>
            <div className="text-3xl font-black text-white my-2 font-mono">{currentScan.totalFindings || 0}</div>
            <span className="text-[10px] text-slate-500 font-mono">Rules Triggered</span>
          </div>

          {/* Critical Card */}
          <div className="bg-cyber-card border border-red-500/30 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Critical</span>
            <div className="text-3xl font-black text-red-500 my-2 font-mono">{currentScan.critical || 0}</div>
            <span className="text-[10px] text-red-400 font-bold">Immediate Fix Needed</span>
          </div>

          {/* High Card */}
          <div className="bg-cyber-card border border-orange-500/30 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">High</span>
            <div className="text-3xl font-black text-orange-500 my-2 font-mono">{currentScan.high || 0}</div>
            <span className="text-[10px] text-orange-400 font-bold">Action Required</span>
          </div>

          {/* Medium Card */}
          <div className="bg-cyber-card border border-amber-500/30 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Medium</span>
            <div className="text-3xl font-black text-amber-400 my-2 font-mono">{currentScan.medium || 0}</div>
            <span className="text-[10px] text-amber-400 font-bold">Review Policy</span>
          </div>

          {/* Low Card */}
          <div className="bg-cyber-card border border-cyan-500/30 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Low</span>
            <div className="text-3xl font-black text-cyan-400 my-2 font-mono">{currentScan.low || 0}</div>
            <span className="text-[10px] text-cyan-400 font-bold">Minor Exposure</span>
          </div>

          {/* Duration Card */}
          <div className="bg-cyber-card border border-slate-800 p-4 rounded-2xl flex flex-col justify-between cyber-card-hover">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scan Duration</span>
            <div className="text-2xl font-black text-blue-400 my-2 font-mono">{currentScan.duration || '5s'}</div>
            <span className="text-[10px] text-slate-500">Agent-less Execution</span>
          </div>
        </div>
      </div>

      {/* Secondary Status Badges (Health & Exposure) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-card border border-slate-800 p-4 rounded-xl flex items-center justify-between cyber-card-hover">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">System Health</div>
              <div className="text-[11px] text-slate-400">{currentScan.systemInfo?.windowsVersion || 'Windows OS Baseline'}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            NORMAL
          </span>
        </div>

        <div className="bg-cyber-card border border-slate-800 p-4 rounded-xl flex items-center justify-between cyber-card-hover">
          <div className="flex items-center space-x-3">
            <Network className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Network Exposure</div>
              <div className="text-[11px] text-slate-400">{currentScan.networkInfo?.totalListeningPorts || 0} Open Ports ({currentScan.networkInfo?.highRiskPortsCount || 0} High Risk)</div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${currentScan.networkInfo?.highRiskPortsCount > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {currentScan.networkInfo?.highRiskPortsCount > 0 ? 'EXPOSED' : 'SECURE'}
          </span>
        </div>

        <div className="bg-cyber-card border border-slate-800 p-4 rounded-xl flex items-center justify-between cyber-card-hover">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Assessment Timestamp</div>
              <div className="text-[11px] text-slate-400">{currentScan.dateFormatted || 'Today'} ({currentScan.timeFormatted})</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
            {currentScan.type}
          </span>
        </div>
      </div>

      {/* 4 Interactive Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Vulnerability Severity Doughnut Chart */}
        <div className="bg-cyber-card border border-slate-800 p-5 rounded-2xl shadow-cyber-card">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            Vulnerability Severity Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090e1a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Zero Severity Vulnerabilities Detected!
              </div>
            )}
          </div>
        </div>

        {/* 2. Findings by Category Bar Chart */}
        <div className="bg-cyber-card border border-slate-800 p-5 rounded-2xl shadow-cyber-card">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Findings by Security Category
          </h3>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#090e1a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="findings" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No category findings to render.
              </div>
            )}
          </div>
        </div>

        {/* 3. Scan History Line Chart */}
        <div className="bg-cyber-card border border-slate-800 p-5 rounded-2xl shadow-cyber-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              Historical Security Score Trend
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>View History Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090e1a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

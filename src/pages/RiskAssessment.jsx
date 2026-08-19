import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, TrendingDown, Layers, ArrowRight } from 'lucide-react';
import { DEFAULT_SCORING_WEIGHTS, SECURITY_RATING_THRESHOLDS } from '../rules/scoringConfig';

export default function RiskAssessment({ currentScan }) {
  const score = currentScan?.score ?? 100;
  const rating = currentScan?.rating || 'Good';
  const ratingHex = currentScan?.ratingHex || '#06b6d4';
  const findings = currentScan?.findings || [];

  let totalDeducted = 0;
  findings.forEach(f => {
    totalDeducted += f.scoreImpact || 0;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Risk Assessment & Scoring Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configurable rule-based score deductions starting from baseline 100 down to floor 0.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Current Security Score</div>
            <div className="text-2xl font-black" style={{ color: ratingHex }}>{score} / 100</div>
          </div>
        </div>
      </div>

      {/* Security Score Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl lg:col-span-2 shadow-cyber-card space-y-6">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            Risk Penalty Point Deductions
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-white">Base Security Baseline Score</span>
              <span className="font-mono font-bold text-emerald-400">+100 Points</span>
            </div>

            {findings.map((f, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="font-bold text-slate-200">{f.title}</span>
                  <div className="text-[10px] text-slate-400">{f.category} • {f.severity} Severity</div>
                </div>
                <span className="font-mono font-bold text-red-400">-{f.scoreImpact} Pts</span>
              </div>
            ))}

            {findings.length === 0 && (
              <div className="p-4 text-center text-xs text-emerald-400 font-bold">
                Zero security findings. Full 100 points baseline retained!
              </div>
            )}

            <div className="flex justify-between items-center bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/30 text-sm">
              <span className="font-extrabold text-white">Calculated Final Security Score</span>
              <span className="font-mono font-black text-xl" style={{ color: ratingHex }}>
                {score} / 100 ({rating})
              </span>
            </div>
          </div>
        </div>

        {/* Rating Scale Matrix Legend */}
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-cyber-card space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Rating Scale Matrix
          </h3>

          <div className="space-y-2.5">
            {SECURITY_RATING_THRESHOLDS.map((tier, idx) => {
              const isCurrentTier = score >= tier.min && score <= tier.max;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition ${
                    isCurrentTier
                      ? 'bg-slate-900 border-cyan-500/50 shadow-cyber-glow'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold font-mono" style={{ color: tier.hex }}>{tier.min} - {tier.max} Pts</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tier.badgeClass}`}>
                      {tier.rating}
                    </span>
                  </div>
                  {isCurrentTier && (
                    <div className="text-[10px] text-cyan-400 font-bold mt-1">★ Active System Rating Tier</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="font-bold text-slate-300 mb-1">Configurable Severity Weights:</div>
            <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
              <span>Critical: -{DEFAULT_SCORING_WEIGHTS.Critical} pts</span>
              <span>High: -{DEFAULT_SCORING_WEIGHTS.High} pts</span>
              <span>Medium: -{DEFAULT_SCORING_WEIGHTS.Medium} pts</span>
              <span>Low: -{DEFAULT_SCORING_WEIGHTS.Low} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

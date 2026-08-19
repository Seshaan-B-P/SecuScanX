export const DEFAULT_SCORING_WEIGHTS = {
  Critical: 20,
  High: 10,
  Medium: 5,
  Low: 2,
  Informational: 0
};

export const SECURITY_RATING_THRESHOLDS = [
  { min: 90, max: 100, rating: 'Excellent', color: 'emerald', hex: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { min: 75, max: 89, rating: 'Good', color: 'cyan', hex: '#06b6d4', badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { min: 50, max: 74, rating: 'Moderate', color: 'amber', hex: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { min: 25, max: 49, rating: 'Poor', color: 'orange', hex: '#f97316', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { min: 0, max: 24, rating: 'Critical', color: 'red', hex: '#ef4444', badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30' }
];

export function calculateSecurityScore(findings = [], customWeights = DEFAULT_SCORING_WEIGHTS) {
  let totalDeductions = 0;
  
  findings.forEach(finding => {
    const severity = finding.severity || 'Low';
    const weight = customWeights[severity] ?? (DEFAULT_SCORING_WEIGHTS[severity] || 0);
    totalDeductions += weight;
  });

  const finalScore = Math.max(0, 100 - totalDeductions);
  const ratingObj = SECURITY_RATING_THRESHOLDS.find(t => finalScore >= t.min && finalScore <= t.max) || SECURITY_RATING_THRESHOLDS[4];

  return {
    score: finalScore,
    totalDeductions,
    rating: ratingObj.rating,
    ratingColor: ratingObj.color,
    ratingHex: ratingObj.hex,
    badgeClass: ratingObj.badgeClass
  };
}

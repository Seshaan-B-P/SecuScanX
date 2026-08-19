import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';

export default function ScoreGauge({ score = 100, rating = 'Good', ratingColor = '#06b6d4', badgeClass = '' }) {
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Radial SVG Score Arc */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg height="192" width="192" className="transform -rotate-90">
          {/* Background Track */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx="96"
            cy="96"
          />
          {/* Animated Glowing Score Arc */}
          <motion.circle
            stroke="url(#scoreGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="96"
            cy="96"
            className="filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ratingColor} />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Score Text Overlay */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black font-mono tracking-tight"
            style={{ color: ratingColor }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-mono">
            OUT OF 100
          </span>
        </div>
      </div>

      {/* Rating Pill Badge */}
      <div className="mt-2 flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase border flex items-center gap-1.5 shadow-cyber-glow ${badgeClass}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{rating} Security Level</span>
        </span>
      </div>
    </div>
  );
}

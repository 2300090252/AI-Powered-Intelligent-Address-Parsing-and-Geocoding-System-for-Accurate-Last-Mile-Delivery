import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  PhoneOff, 
  Award,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ValidationReportCard({ report }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!report) return null;

  const {
    completeness,
    completeness_percentage,
    corrections,
    has_corrections,
    validation_status,
    confidence_score,
    confidence_level,
    reasoning,
    business_impact
  } = report;

  const isHigh = confidence_level === 'HIGH' || confidence_score >= 80;
  const isMed = confidence_level === 'MEDIUM' || (confidence_score >= 50 && confidence_score < 80);

  // Gauge colors
  const strokeColor = isHigh ? '#10b981' : isMed ? '#f59e0b' : '#ef4444';
  const badgeBg = isHigh
    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
    : isMed
    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300';

  // Circular gauge math (radius = 36, circumference ~ 226)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence_score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm dark:shadow-md transition-all duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              AI Address Validation & Correction Report
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time spatial verification, postal accuracy analysis & delivery performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${badgeBg}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Validation Complete</span>
          </div>

          {/* View Details / Hide Details Accordion Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 transition-all shadow-sm"
          >
            <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Section (Always Expanded): Gauge Meter, Completeness & Status Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Confidence Gauge & Address Completeness Progress */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          {/* Circular Confidence Meter */}
          <div className="flex items-center gap-5 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-200 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {confidence_score}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                AI Confidence Meter
              </span>
              <div className={`inline-block text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider ${
                isHigh ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                isMed ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {confidence_level} Confidence
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Consensus score from spatial DB & OpenStreetMap indexing
              </p>
            </div>
          </div>

          {/* Section 1: Address Completeness Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                1. Address Completeness
              </span>
              <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {completeness_percentage}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${completeness_percentage}%` }}
              ></div>
            </div>

            {/* 7 Field Items Checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {completeness.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium ${
                    item.present
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-300 font-semibold'
                  }`}
                >
                  {item.present ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className="truncate">{item.field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Validation Status Badges */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 h-full flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-3">
                3. Validation Status Badges
              </span>

              <div className="flex flex-wrap gap-2.5 mb-4">
                {validation_status.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 shadow-xs ${
                      badge.status
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {badge.status ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Detailed AI corrections, spatial logic & business impact metrics available:</span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>{showDetails ? 'Hide Details' : 'View Full Details'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Collapsible Details (Triggered via View Details) */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn transition-all duration-300">
          {/* Section 2: AI Corrections */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-3">
              2. AI Corrections & Normalizations
            </span>

            {has_corrections && corrections.length > 0 ? (
              <div className="space-y-2">
                {corrections.map((item, idx) => {
                  const isDifferent = item.original && item.corrected && item.original.trim() !== item.corrected.trim() && item.type !== 'verified';
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28 shrink-0">
                        {item.field}
                      </span>

                      <div className="flex items-center gap-2 flex-1 font-mono text-xs">
                        {isDifferent ? (
                          <>
                            <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded">
                              <span className="text-[10px] text-slate-400 block font-sans">Original</span>
                              <span className="line-through">{item.original || 'Missing'}</span>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                            <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                              <span className="text-[10px] text-slate-400 block font-sans">Corrected</span>
                              <span className="font-bold">{item.corrected}</span>
                            </div>
                          </>
                        ) : (
                          <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                            <span className="text-[10px] text-slate-400 block font-sans">Verified</span>
                            <span className="font-bold">{item.corrected}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                No corrections required. Address components are standardized.
              </p>
            )}
          </div>

          {/* Section 5: AI Reasoning Bullet Points */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2.5">
              5. AI Reasoning & Spatial Logic
            </span>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {reasoning.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Business Impact Cards */}
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-3">
              6. Business Impact & Last-Mile Efficiency
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Card 1: Delivery Success */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-[11px]">Delivery Success</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {business_impact.delivery_success}
                </span>
              </div>

              {/* Card 2: Phone Calls Saved */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-[11px]">Phone Calls Saved</span>
                  <PhoneOff className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {business_impact.calls_saved}
                </span>
              </div>

              {/* Card 3: Estimated Time Saved */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-[11px]">Estimated Time Saved</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {business_impact.time_saved}
                </span>
              </div>

              {/* Card 4: Delivery Confidence */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-[11px]">Delivery Confidence</span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {business_impact.delivery_confidence}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

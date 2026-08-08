import React from 'react';
import { Layers, MapPin, CheckCircle2, Navigation, Info } from 'lucide-react';

export default function CandidateLocationsCard({ candidates, selectedCandidateId, onSelectCandidate }) {
  if (!candidates || candidates.length === 0) return null;

  const ranks = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm dark:shadow-md transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              AI Candidate Locations
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multiple potential matches ranked by POI similarity, spatial vector precision & consensus confidence
          </p>
        </div>

        <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
          {candidates.length} Ranked Candidates
        </span>
      </div>

      {/* Candidates List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {candidates.map((cand, idx) => {
          const isSelected = cand.id === selectedCandidateId;
          const medal = ranks[idx] || ` Match ${cand.rank}`;
          const isHigh = cand.confidence >= 80;
          const isMed = cand.confidence >= 50 && cand.confidence < 80;

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
                isSelected
                  ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20 scale-[1.01]'
                  : 'border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100/60 dark:hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Card Top Line: Rank & Confidence */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                    <span className="text-base">{medal}</span>
                    <span>Match {cand.rank}</span>
                  </div>

                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isHigh
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : isMed
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}>
                    {cand.confidence}%
                  </span>
                </div>

                {/* Landmark Name */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate">{cand.landmark}</span>
                </h4>

                {/* Full Address */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {cand.full_address}
                </p>
              </div>

              <div>
                {/* Distance & Selection Badge */}
                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <Navigation className="w-3 h-3 text-slate-400" />
                    {cand.distance}
                  </span>

                  {isSelected ? (
                    <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Alternative
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Footer */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p>
          Multiple matching locations were found. The AI ranked them based on landmark similarity, locality match, PIN code verification, OpenStreetMap data, and overall confidence. The highest-ranked candidate is automatically selected. Click any candidate to view its map coordinates.
        </p>
      </div>
    </div>
  );
}

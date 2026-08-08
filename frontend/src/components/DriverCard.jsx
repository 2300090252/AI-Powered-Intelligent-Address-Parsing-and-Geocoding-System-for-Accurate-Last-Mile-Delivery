import React, { useState } from 'react';
import { ExternalLink, Compass, ChevronDown, ChevronUp } from 'lucide-react';

export default function DriverCard({ result }) {
  const [expanded, setExpanded] = useState(false);

  if (!result) return null;

  const { latitude, longitude, explanation } = result;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="bg-white dark:bg-slate-900 border-l-4 border-l-indigo-600 border-y border-r border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 shadow-sm dark:shadow-md transition-all duration-300">
      {/* Accordion Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Driver Delivery Notes & Navigation</span>
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1 rounded-lg">
          <span>{expanded ? 'Hide Notes' : 'View Notes'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Spatial Navigation Guidance
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <span>Open Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}

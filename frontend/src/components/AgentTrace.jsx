import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Clock } from 'lucide-react';

export default function AgentTrace({ trace, totalTimeMs }) {
  const [expanded, setExpanded] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm dark:shadow-md transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-slate-100">
            ▶ Technical Resolution Trace ({trace.length} Steps · {totalTimeMs} ms)
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold">
          <span>{expanded ? 'Hide Trace' : 'View Trace'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn transition-all duration-300">
          {trace.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                  {step.agent.replace(/Agent$/, '')} Module
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {step.duration_ms} ms
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {step.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

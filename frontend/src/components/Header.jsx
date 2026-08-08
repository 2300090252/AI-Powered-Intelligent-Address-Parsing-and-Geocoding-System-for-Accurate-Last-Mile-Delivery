import React from 'react';
import { MapPin, Globe, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({ theme, toggleTheme, onReset }) {
  const isDark = theme === 'dark';

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-6 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-all duration-300">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer" onClick={onReset}>
          <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <MapPin className="w-6 h-6 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
              Pata AI
            </h1>
            <span className="text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Address Intelligence</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Multi-Agent Last-Mile Geocoding & Postal Verification Engine
          </p>
        </div>
      </div>

      {/* Navigation Controls & Theme Switcher */}
      <div className="flex items-center gap-3 text-xs">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">System Status:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">OPERATIONAL</span>
        </div>

        {/* Coverage Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 shadow-xs">
          <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Coverage:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">Pan-India (19,000+ PINs)</span>
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold transition-all duration-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm active:scale-95"
          title="Toggle Light / Dark Theme Mode"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

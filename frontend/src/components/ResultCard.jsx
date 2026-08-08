import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';

export default function ResultCard({ result }) {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!result) return null;

  const { parsed_address, confidence, formatted_address, latitude, longitude } = result;

  const isHigh = confidence.level === 'HIGH';
  const isMed = confidence.level === 'MEDIUM';

  const coordsString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formatted_address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 shadow-sm dark:shadow-md transition-all">
      {/* Header Result Line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Resolved Delivery Address
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{formatted_address}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyAddress}
            className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
            title="Copy Formatted Address"
          >
            {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
          </button>

          <div className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
            isHigh
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : isMed
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{confidence.score}% Accuracy</span>
          </div>
        </div>
      </div>

      {/* Lat/Lng Quick Action Pill & Real Google Maps Integration */}
      <div className="mb-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">GPS Lat/Long:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded">
            {coordsString}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCoords}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {copiedCoords ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Coordinates</span>
              </>
            )}
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Auto-Correction Notice if applicable */}
      {parsed_address.pincode_corrected && (
        <div className="mb-4 bg-amber-50/90 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            Postal code auto-updated from <strong>{parsed_address.provided_pincode || 'missing'}</strong> to verified postal code <strong>{parsed_address.verified_pincode}</strong> based on spatial locality match.
          </span>
        </div>
      )}

      {/* Structured Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Area / Locality</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{parsed_address.locality || 'Not specified'}</span>
        </div>

        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Nearby Landmark</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-300">{parsed_address.landmark || 'None'}</span>
        </div>

        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Spatial Vector</span>
          <span className="font-semibold text-amber-600 dark:text-amber-300">{parsed_address.spatial_relation || 'Near'}</span>
        </div>

        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">City / District</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{parsed_address.city || 'N/A'}</span>
        </div>

        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Provided PIN</span>
          <span className={`font-semibold ${parsed_address.pincode_corrected ? 'line-through text-rose-500 dark:text-rose-400 font-mono' : 'text-slate-900 dark:text-slate-100 font-mono'}`}>
            {parsed_address.provided_pincode || 'Missing'}
          </span>
        </div>

        <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Verified PIN</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{parsed_address.verified_pincode || 'Verified'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

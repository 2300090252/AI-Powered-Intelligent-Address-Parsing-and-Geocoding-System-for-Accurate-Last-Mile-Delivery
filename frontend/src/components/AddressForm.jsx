import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, LayoutGrid, FileText, Building, Home, Navigation, Hash, Languages, RotateCcw, Sparkles } from 'lucide-react';

export default function AddressForm({ onSubmit, loading, presets, onSelectPreset, languageInfo }) {
  const [inputMode, setInputMode] = useState('single'); // 'single' | 'structured' default single line for ease of typing

  // Structured Input Fields State
  const [doorNo, setDoorNo] = useState('');
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  // Single Line Freeform State
  const [singleAddress, setSingleAddress] = useState('');

  const handleStructuredSubmit = (e) => {
    e.preventDefault();
    const parts = [
      doorNo,
      building,
      street,
      landmark,
      locality,
      city,
      stateName,
      pincode
    ].map(p => p.trim()).filter(Boolean);

    if (parts.length > 0) {
      onSubmit(parts.join(', '));
    }
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (singleAddress.trim()) {
      onSubmit(singleAddress.trim());
    }
  };

  const handlePresetSelect = (preset) => {
    onSelectPreset(preset);

    // Populate single line
    setSingleAddress(preset.address);

    // Populate structured fields if available or fallback parse
    if (preset.structured) {
      setDoorNo(preset.structured.doorNo || '');
      setBuilding(preset.structured.building || '');
      setStreet(preset.structured.street || '');
      setLandmark(preset.structured.landmark || '');
      setLocality(preset.structured.locality || '');
      setCity(preset.structured.city || '');
      setStateName(preset.structured.state || '');
      setPincode(preset.structured.pincode || '');
    } else {
      setSingleAddress(preset.address);
    }
  };

  const handleClear = () => {
    setSingleAddress('');
    setDoorNo('');
    setBuilding('');
    setStreet('');
    setLandmark('');
    setLocality('');
    setCity('');
    setStateName('');
    setPincode('');
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-md dark:shadow-2xl transition-all duration-300">
      {/* Header & Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Delivery Address Resolution Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Handles messy Indian directions, regional scripts (Telugu, Hindi), Hinglish & PIN code typos.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setInputMode('single')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              inputMode === 'single'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Single Line Text</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('structured')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              inputMode === 'structured'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Structured Fields</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SINGLE LINE UNSTRUCTURED INPUT (DEFAULT) */}
      {inputMode === 'single' && (
        <form onSubmit={handleSingleSubmit} className="mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={singleAddress}
                onChange={(e) => setSingleAddress(e.target.value)}
                placeholder="Enter raw address, landmark ('Opposite Ganesh Temple'), colony, or PIN code in Telugu, Hindi, Hinglish, English..."
                className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-3.5 pl-11 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium shadow-inner"
                disabled={loading}
              />
              <Search className="w-4 h-4 text-indigo-500 absolute left-4 top-4" />

              {singleAddress && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Clear input"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !singleAddress.trim()}
              className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 text-sm shrink-0 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Locating Address...</span>
                </>
              ) : (
                <>
                  <span>Resolve Geocode</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* MODE 2: STRUCTURED FORM FIELDS */}
      {inputMode === 'structured' && (
        <form onSubmit={handleStructuredSubmit} className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
            {/* Door / Flat No */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Door / Flat / House No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={doorNo}
                  onChange={(e) => setDoorNo(e.target.value)}
                  placeholder="Flat 402, Door #12/3"
                  className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  disabled={loading}
                />
                <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Building / Premises */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Building / Premises
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="Regency Apartments"
                  className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  disabled={loading}
                />
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Street / Road */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Street / Road Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="10th Main Road, M.G. Road"
                  className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  disabled={loading}
                />
                <Navigation className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Landmark & Spatial Relation */}
            <div>
              <label className="block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">
                Landmark & Preposition
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Opposite Ganesh Temple"
                  className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-indigo-300 dark:border-indigo-800/80 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  disabled={loading}
                />
                <MapPin className="w-3.5 h-3.5 text-indigo-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Locality / Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Locality / Area
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Indiranagar, Labbipet"
                className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                disabled={loading}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                City / District
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Vijayawada, Bengaluru"
                className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                disabled={loading}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                State
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Andhra Pradesh, Karnataka"
                className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                disabled={loading}
              />
            </div>

            {/* Postal PIN Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Postal PIN Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="520010"
                  className="w-full bg-slate-50/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono font-bold text-indigo-600 dark:text-indigo-400"
                  disabled={loading}
                />
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>

            <button
              type="submit"
              disabled={loading || (!doorNo && !building && !street && !landmark && !locality && !city && !pincode)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all duration-200 disabled:opacity-50 text-xs shrink-0 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Locating Address...</span>
                </>
              ) : (
                <>
                  <span>Resolve Geocode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Language Detection & Automatic Translation Badge Banner */}
      {languageInfo && (
        <div className="mb-5 p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Detected Script / Language:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full shadow-2xs">
              {languageInfo.detected_language}
            </span>
          </div>

          {languageInfo.translation_required ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 line-through bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded">
                Input: {languageInfo.original_address}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded">
                English Vector: {languageInfo.translated_address}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 font-medium italic text-[11px]">
              ✓ Standard English input tokenized without translation requirement.
            </span>
          )}
        </div>
      )}

      {/* Quick Example Suggestions */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Try preset delivery edge cases (Telugu, Hindi, Hinglish, English):</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:border-indigo-300 dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:hover:border-indigo-600 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 font-medium shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              <span className="text-xs">🇮🇳</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

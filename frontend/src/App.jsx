import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AddressForm from './components/AddressForm';
import ValidationReportCard from './components/ValidationReportCard';
import CandidateLocationsCard from './components/CandidateLocationsCard';
import ResultCard from './components/ResultCard';
import MapView from './components/MapView';
import AgentTrace from './components/AgentTrace';
import DriverCard from './components/DriverCard';
import { Search } from 'lucide-react';

const DEFAULT_PRESETS = [
  {
    id: "preset_telugu_1",
    title: "Vijayawada (Telugu Script)",
    address: "గణేష్ టెంపుల్ ఎదురుగా, ఆటో నగర్, విజయవాడ",
    structured: {
      landmark: "గణేష్ టెంపుల్ ఎదురుగా",
      locality: "ఆటో నగర్",
      city: "విజయవాడ",
      pincode: "520007"
    }
  },
  {
    id: "preset_telugu_2",
    title: "Kunchanapalli (Telugu Script)",
    address: "పంచాయతీ ఆఫీస్ దగ్గర, కుంచనపల్లి",
    structured: {
      landmark: "పంచాయతీ ఆఫీస్ దగ్గర",
      locality: "కుంచనపల్లి",
      pincode: "522501"
    }
  },
  {
    id: "preset_hindi_1",
    title: "Vijayawada (Hindi Script)",
    address: "गणेश मंदिर के सामने, विजयवाड़ा",
    structured: {
      landmark: "गणेश मंदिर के सामने",
      city: "विजयवाड़ा",
      pincode: "520007"
    }
  },
  {
    id: "preset_hinglish_1",
    title: "Vijayawada (Hinglish)",
    address: "Ganesh Temple daggara Auto Nagar Vijayawada",
    structured: {
      landmark: "Ganesh Temple daggara",
      locality: "Auto Nagar",
      city: "Vijayawada",
      pincode: "520007"
    }
  },
  {
    id: "preset_1",
    title: "Indiranagar, Bengaluru (English)",
    address: "Opposite Ganesh Temple, 10th Main Road, Indiranagar, Bengaluru, 560002",
    structured: {
      doorNo: "Flat 402",
      building: "Ganesh Nivas",
      street: "10th Main Road",
      landmark: "Opposite Ganesh Temple",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560002"
    }
  },
  {
    id: "preset_2",
    title: "Andheri West, Mumbai (English)",
    address: "Behind State Bank ATM, near Lokhandwala Complex, Andheri West, Mumbai",
    structured: {
      doorNo: "Block B-12",
      building: "Lokhandwala Complex",
      street: "Main Link Road",
      landmark: "Behind State Bank ATM",
      locality: "Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053"
    }
  }
];

export default function App() {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  // Theme Mode State (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pata_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'dark-mode';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'light-mode';
    }
    localStorage.setItem('pata_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleGeocode = async (addressText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addressText })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setGeocodeResult(data.result);
        if (data.result.candidate_locations && data.result.candidate_locations.length > 0) {
          setSelectedCandidateId(data.result.candidate_locations[0].id);
        }
        setExecutionTime(data.execution_time_ms);
      } else {
        throw new Error('Geocoding failed');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to geocoding backend service.');
    } finally {
      setLoading(false);
    }
  };

  // Derive active result dynamically when user switches candidate
  const getActiveResult = () => {
    if (!geocodeResult) return null;
    const candidates = geocodeResult.candidate_locations || [];
    const activeCand = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

    if (!activeCand) return geocodeResult;

    return {
      ...geocodeResult,
      latitude: activeCand.latitude,
      longitude: activeCand.longitude,
      formatted_address: activeCand.full_address,
      confidence: {
        ...geocodeResult.confidence,
        score: activeCand.confidence,
        level: activeCand.confidence_level
      },
      explanation: activeCand.reasoning,
      matched_landmark: activeCand.landmark ? {
        name: activeCand.landmark,
        category: "POI",
        latitude: activeCand.latitude,
        longitude: activeCand.longitude,
        distance_meters: 25.0
      } : geocodeResult.matched_landmark,
      validation_report: geocodeResult.validation_report ? {
        ...geocodeResult.validation_report,
        confidence_score: activeCand.confidence,
        confidence_level: activeCand.confidence_level,
        business_impact: {
          ...geocodeResult.validation_report.business_impact,
          delivery_confidence: activeCand.confidence_level.charAt(0) + activeCand.confidence_level.slice(1).toLowerCase()
        }
      } : null
    };
  };

  const activeResult = getActiveResult();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Navigation Header with Dark / Light Theme Switcher */}
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Search Bar & Suggestions with Regional Language Support */}
        <AddressForm
          onSubmit={handleGeocode}
          loading={loading}
          presets={presets}
          onSelectPreset={(preset) => handleGeocode(preset.address)}
          languageInfo={geocodeResult?.language_info}
        />

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
            <span>{error}</span>
            <button
              onClick={() => handleGeocode(DEFAULT_PRESETS[0].address)}
              className="bg-rose-600 dark:bg-rose-900 hover:bg-rose-700 text-white px-3 py-1 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State Before Any Search */}
        {!geocodeResult && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 mb-6 shadow-sm dark:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Ready for Location Resolution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Enter an address above to generate ranked AI candidate locations, inspect validation metrics, and view interactive map tiles.
            </p>
          </div>
        )}

        {/* AI Address Validation & Correction Report Card */}
        {activeResult && activeResult.validation_report && (
          <ValidationReportCard report={activeResult.validation_report} />
        )}

        {/* AI Candidate Locations Card (Positioned Between Validation Report & Resolved Address Grid) */}
        {geocodeResult && geocodeResult.candidate_locations && (
          <CandidateLocationsCard
            candidates={geocodeResult.candidate_locations}
            selectedCandidateId={selectedCandidateId}
            onSelectCandidate={(cand) => setSelectedCandidateId(cand.id)}
          />
        )}

        {/* Results Layout */}
        {activeResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Left Side: Address Details & Driver Instructions */}
            <div className="lg:col-span-7 flex flex-col">
              <ResultCard result={activeResult} />
              <DriverCard result={activeResult} />
            </div>

            {/* Right Side: Map View with Layer Switcher */}
            <div className="lg:col-span-5">
              <MapView result={activeResult} theme={theme} />
            </div>
          </div>
        )}

        {/* Technical Resolution Trace (Collapsible at bottom) */}
        {geocodeResult && (
          <AgentTrace
            trace={geocodeResult.agent_trace}
            totalTimeMs={executionTime}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-normal">
        © 2026 Pata Address Intelligence System · All rights reserved.
      </footer>
    </div>
  );
}

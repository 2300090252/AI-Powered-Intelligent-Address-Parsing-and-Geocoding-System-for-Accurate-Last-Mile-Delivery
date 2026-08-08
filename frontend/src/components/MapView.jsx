import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Map as MapIcon, Globe, Compass, Moon, Sun, LocateFixed, ExternalLink } from 'lucide-react';

// Fix default leaflet marker icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Markers
const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const landmarkIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map Tile Layer Configurations
const MAP_LAYERS = {
  street: {
    name: 'Street',
    icon: MapIcon,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap'
  },
  satellite: {
    name: 'Satellite',
    icon: Globe,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri World Imagery'
  },
  terrain: {
    name: 'Terrain',
    icon: Compass,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap'
  },
  dark: {
    name: 'Dark',
    icon: Moon,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO Dark'
  },
  light: {
    name: 'Light',
    icon: Sun,
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO Light'
  }
};

function RecenterMap({ lat, lng, triggerRecenter }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng && map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.0 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [lat, lng, map, triggerRecenter]);
  return null;
}

export default function MapView({ result, theme }) {
  const lat = result?.latitude || 12.9784;
  const lng = result?.longitude || 77.6408;
  const landmark = result?.matched_landmark;
  const confidenceScore = result?.confidence?.score || 90;

  // Provider Mode: 'leaflet' | 'google'
  const [provider, setProvider] = useState('google'); // Default to real Google Maps view!
  const [activeLayer, setActiveLayer] = useState('street');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [recenterCount, setRecenterCount] = useState(0);

  useEffect(() => {
    if (theme === 'dark' && (activeLayer === 'light' || activeLayer === 'street')) {
      setActiveLayer('street');
    }
  }, [theme]);

  // Accuracy circle radius
  const accuracyRadius = confidenceScore >= 80 ? 40 : confidenceScore >= 50 ? 120 : 300;
  const currentLayerConfig = MAP_LAYERS[activeLayer] || MAP_LAYERS.street;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 h-[470px] flex flex-col relative shadow-md dark:shadow-xl transition-all">
      {/* Map Header Bar & Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {provider === 'google' ? 'Real Google Maps View' : 'Interactive POI Map'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Provider Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setProvider('google')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                provider === 'google'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Google Maps
            </button>
            <button
              onClick={() => setProvider('leaflet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                provider === 'leaflet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              OpenStreetMap
            </button>
          </div>

          {/* External Google Maps Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-2xs shrink-0"
            title="Open in Real Google Maps"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-inner">
        {provider === 'google' ? (
          /* REAL GOOGLE MAPS EMBEDDED IFRAME */
          <div className="w-full h-full relative">
            <iframe
              title="Real Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
            ></iframe>
            <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
              Live Google Maps Sync ({lat.toFixed(5)}, {lng.toFixed(5)})
            </div>
          </div>
        ) : (
          /* LEAFLET INTERACTIVE MAP */
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              key={activeLayer}
              attribution={currentLayerConfig.attribution}
              url={currentLayerConfig.url}
              maxZoom={19}
            />

            <RecenterMap lat={lat} lng={lng} triggerRecenter={recenterCount} />

            <Circle
              center={[lat, lng]}
              radius={accuracyRadius}
              pathOptions={{
                color: '#6366f1',
                fillColor: '#818cf8',
                fillOpacity: 0.18,
                weight: 2
              }}
            />

            {landmark && (
              <Marker position={[landmark.latitude, landmark.longitude]} icon={landmarkIcon}>
                <Popup defaultOpen={true}>
                  <div className="p-1 min-w-[150px]">
                    <span className="text-xs font-bold text-amber-500 block mb-1">
                      Resolved POI Landmark
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{landmark.name}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            <Marker position={[lat, lng]} icon={deliveryIcon}>
              <Popup>
                <div className="p-1 min-w-[170px]">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block mb-1">
                    Target Delivery Location
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {result?.formatted_address}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}

        {/* Floating Controls for Leaflet Mode */}
        {provider === 'leaflet' && (
          <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
            <button
              onClick={() => setRecenterCount(prev => prev + 1)}
              className="bg-white/95 hover:bg-white text-slate-800 dark:bg-slate-900/95 dark:hover:bg-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 p-2 rounded-xl shadow-lg text-xs font-semibold backdrop-blur-sm transition-all active:scale-95"
              title="Recenter Map Pin"
            >
              <LocateFixed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="bg-white/95 hover:bg-white text-slate-800 dark:bg-slate-900/95 dark:hover:bg-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm transition-all active:scale-95"
              title="Switch Map Layers"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Layers ({currentLayerConfig.name})</span>
            </button>

            {showLayerMenu && (
              <div className="mt-1 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 rounded-xl p-2 shadow-2xl backdrop-blur-md flex flex-col gap-1 min-w-[150px]">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 px-2 py-1 tracking-wider">
                  Map Style Tiles
                </span>
                {Object.entries(MAP_LAYERS).map(([key, config]) => {
                  const IconComponent = config.icon;
                  const isSelected = activeLayer === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveLayer(key);
                        setShowLayerMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{config.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

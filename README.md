# AI Location Intelligence

Frontend for an AI-powered address parser and geocoder built for last-mile delivery in India.

Paste a messy address — landmarks, half-written pincodes, abbreviations — and get back structured components, a confidence score, and map coordinates.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router
- Axios
- React Leaflet (OpenStreetMap)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Make sure the backend is running at `http://127.0.0.1:8000` with a `POST /geocode` endpoint. If it's offline, the app falls back to a local demo engine so you can still test the UI.

## API

**POST** `/geocode`

```json
{ "address": "Near Hanuman Temple Guntur" }
```

Response includes `original_address`, `cleaned_address`, `parsed_address`, `latitude`, `longitude`, `confidence`, and `evidence`.

## Folder structure

```
src/
├── components/
│   ├── AddressInput.jsx    # Hero search box + examples
│   ├── ConfidenceCard.jsx    # Circular progress score
│   ├── EvidenceCard.jsx      # Verification checklist
│   ├── Footer.jsx
│   ├── Loader.jsx            # Loading screen
│   ├── MapComponent.jsx      # React Leaflet map
│   ├── Navbar.jsx
│   ├── PageWrapper.jsx       # Page transition wrapper
│   ├── ResultCard.jsx        # Address + parsed parts
│   └── Toast.jsx             # Notifications
├── context/
│   └── LocationContext.jsx   # App state + search flow
├── pages/
│   ├── About.jsx
│   ├── History.jsx
│   ├── Home.jsx
│   ├── Loading.jsx
│   └── Result.jsx
├── services/
│   ├── api.js                # Axios + fallback geocoder
│   └── historyStore.js       # localStorage history
├── App.jsx
├── main.jsx
└── index.css
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

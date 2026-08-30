# 🌾 Krishi Setu (KisaniQ)

**AI-Powered Farm Intelligence Platform** — built for **Smart India Hackathon Grand Finale 2026**

**Live demo:** [kisani-q.vercel.app](https://kisani-q.vercel.app/)

> Observe. Understand. Decide. Act.

Krishi Setu converges climate, soil/groundwater, crop-health, market, scheme, and machinery data into a single, localized, actionable recommendation for farmers — instead of scattering that information across disconnected dashboards, government portals, and word-of-mouth.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Available Scripts](#available-scripts)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Overview

Farmers today have to piece together decisions from scattered sources — a weather app, a WhatsApp forward about a government scheme, a neighbor's opinion on a pesticide, a phone call to find a tractor. Krishi Setu's core idea is a **single decision engine** (`farmerDecisionEngine.ts`) that ingests live climate, groundwater/soil, and crop-health signals for a farmer's profile and village, and converts them into one clear, explainable recommendation — surfaced consistently across every tab of the app (Dashboard, Climate, Water & Soil, Advisory, Schemes).

## Features

### 🧠 Central Decision Engine
A single source of truth (`generateFarmerDecision`) combines farmer profile, selected village, live weather, climate risk, crop identity, and detected disease into one coherent, per-page advisory — not a set of disconnected widgets.

### 🌦️ Climate Intelligence
Live 7-day forecasts via Open-Meteo (with optional OpenWeatherMap key), automatic climate-risk scoring, and trend visualizations (`ClimateView`, `WeatherTrendsChart`, `climateIntelligence.ts`).

### 🩺 AI Crop Doctor
Leaf-image disease detection using two complementary paths:
- **On-device inference** with TensorFlow.js + a Teachable Machine image model (`teachableMachine.ts`) — works with low/no connectivity.
- **Cloud vision fallback** via Google Gemini Vision (`geminiVision.ts`) for deeper diagnosis, treatment guidance, and confidence scoring on Indian crops (Cotton, Sugarcane, Onion, Wheat, Rice, Tomato, Soybean, Maize).

### 💧 Water & Soil Advisory
Groundwater and soil-type–aware irrigation guidance per village (`waterSoilDecision.ts`, `groundSoil.ts`), including proximity to the Godavari canal system and CGWB-listed groundwater recharge sites.

### 🏛️ Government Scheme Matching
Rule-based relevance scoring (`schemeMatching.ts`) ranks government schemes (`schemesData.ts`) against the farmer's crop, village, detected disease, and climate risk — surfacing "High Relevance" schemes first instead of an undifferentiated list.

### 🚜 Labour & Machinery Sharing
Local listings for tractors, harvesters, implements, sprayers, and labour, with provider-listed vs. reference-benchmark rate distinctions and verification/availability status (`LabourMachinery.tsx`, `machineryData.ts`).

### 📊 Before/After Impact Comparison
`ImpactComparison` + `impactCalculator.ts` quantify the effect of adopting each feature (groundwater rules, Crop Doctor, weather alerts, gov schemes, machinery sharing) on water usage, input cost, yield, and disease loss for a given crop and acreage — evidence, not a marketing claim.

### 🎙️ Multilingual Voice Assistant
A floating voice assistant (`VoiceFloatingButton`, `VoiceAssistantModal`) with speech recognition, speech synthesis, language auto-detection, and an intent engine (`intentEngine.ts`) that can navigate the app and answer farm questions hands-free — built for low-literacy accessibility. Full UI is localized in **English and Marathi** (`i18n/`).

### 🔐 Authentication & Farmer Profiles
Email/password auth with signup, login, forgot/reset password flows (`components/auth/`), backed by Supabase Auth and Row Level Security. Farmer profiles (land size, soil type, water source, primary crop/goal) persist to the cloud and auto-restore on login.

### 🛡️ Self-Healing Data Vault
A dual-write resilience layer (`selfHealingVault.ts`): every profile write is mirrored to a local browser "shadow vault" in addition to Supabase. On login, `auditAndSelfHeal()` detects if cloud records are missing or wiped and automatically re-hydrates them from the local vault (matched by user ID or email) — so a corrupted or reset backend doesn't mean lost farmer data. A `SelfHealingBanner` surfaces healing events to the user transparently.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Styling | Vanilla CSS |
| Backend / Data | Supabase (Postgres + Auth + Row Level Security) |
| On-device ML | TensorFlow.js + Teachable Machine |
| Cloud vision AI | Google Gemini Vision API |
| Weather data | Open-Meteo (default) / OpenWeatherMap (optional) |
| Localization | i18next / react-i18next (English, Marathi) |
| Icons | Lucide React |

## Architecture

```
Farmer Profile ─┐
Selected Village ─┤
Live Weather ─────┼──▶  farmerDecisionEngine.ts  ──▶  FarmerDecision
Climate Risk ─────┤        (single source of truth)         │
Crop / Disease ───┘                                          │
                                                               ▼
                              ┌────────────────────────────────────────────┐
                              │  Dashboard · Climate · Water & Soil ·        │
                              │  Advisory · Schemes  (all consume the        │
                              │  same FarmerDecision object)                 │
                              └────────────────────────────────────────────┘

Resilience layer:  every profile write ──▶ Supabase (cloud) + Shadow Vault (localStorage)
                   on login             ──▶ auditAndSelfHeal() re-hydrates cloud from vault if missing
```

## Project Structure

```
src/
├── components/          # UI components (Dashboard, CropHealth, ClimateView, WaterSoil, Schemes, etc.)
│   ├── auth/             # Login, signup, password reset, protected routes
│   ├── climate/          # Climate risk modal, weather trend charts
│   ├── schemes/          # Scheme card & detail modal
│   └── voice/            # Voice assistant UI
├── context/              # AuthContext, LanguageContext, ThemeContext
├── data/                 # Static/reference datasets (crops, villages, schemes, machinery, pricing)
├── hooks/                # useVoiceNavigation
├── i18n/                 # Translations (English/Marathi) and i18next config
├── lib/                  # Core logic: decision engine, weather, scheme matching,
│                         # impact calculator, self-healing vault, Gemini/Teachable Machine integration
├── services/voice/       # Speech recognition/synthesis, intent engine, language detection
├── App.tsx               # Root layout, tab routing, central decision-engine wiring
└── main.tsx              # App entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase project (free tier works)

### Installation

```bash
git clone <repo-url>
cd KisaniQ-main
npm install
```

### Configure environment variables

Copy the example file and fill in your own keys (see [Environment Variables](#environment-variables) and the security note below):

```bash
cp .env.example .env
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key (safe for client-side use under RLS) |
| `VITE_GEMINI_API_KEY` | Optional | Enables Gemini Vision–powered crop disease analysis; without it, the app falls back to the on-device Teachable Machine model |
| `VITE_OPENWEATHER_API_KEY` | Optional | Enables OpenWeatherMap as the weather provider; without it, the app uses the keyless Open-Meteo API automatically |

## Database Setup (Supabase)

Run the SQL schema and Row Level Security policies described in [`SUPABASE_RLS_GUIDE.md`](./SUPABASE_RLS_GUIDE.md) against your Supabase project before running the app. This provisions the `profiles` and `farmer_profiles` tables (and their RLS policies) that authentication and the self-healing vault depend on.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

## Security Notes

Before deploying your own instance or submitting this repo publicly, please address the following:

- **`.env.example` currently contains a real Supabase URL and anon key, not placeholders.** Supabase anon keys are meant to be public *only when Row Level Security is correctly enabled on every table* (see `SUPABASE_RLS_GUIDE.md`). Rotate these keys if this repository becomes public and RLS hasn't been fully verified, and replace the committed values with placeholders.
- **`src/lib/geminiVision.ts` contains a hardcoded fallback Gemini API key** (obfuscated via a string split, not encrypted). Any key shipped in client-side code is extractable by anyone who opens dev tools or reads the built bundle. Remove the hardcoded fallback, require `VITE_GEMINI_API_KEY` to be set, and rotate that key if it has already been exposed.
- Treat all `VITE_*` variables as **public** — Vite inlines them into the client bundle at build time. Never put a server-only secret (e.g., a Supabase service-role key) behind a `VITE_` prefix.

## Roadmap

- [ ] Market price intelligence (mandi price integration)
- [ ] Offline-first support for low-connectivity areas
- [ ] Expanded regional language support beyond English/Marathi
- [ ] Trust/verification layer for scheme and treatment misinformation
- [ ] Automated test coverage for the decision engine and self-healing vault

## Team

Built for **Smart Kopargaon Hackathon Grand Finale 2026**.

---


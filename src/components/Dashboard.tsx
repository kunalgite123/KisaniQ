import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { kopargaonProfile } from "../data/groundSoil";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { FarmerProfile, loadSavedFarmerProfile } from "../data/farmerProfile";
import ProfileCompletionCard from "./ProfileCompletionCard";
import ProfileSetupModal from "./ProfileSetupModal";
import AdvisoryCard from "./AdvisoryCard";
import FarmHealthScore from "./FarmHealthScore";

interface Props {
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onNavigateTab?: (tab: string) => void;
}

export default function Dashboard({ village, detectedDisease, cropName, onNavigateTab }: Props) {
  const { t } = useLanguage();
  const { profile: authProfile } = useAuth();
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [risk, setRisk] = useState<ClimateRisk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Farmer Profile Completion State (reads authenticated user credentials)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() =>
    loadSavedFarmerProfile(authProfile)
  );
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setFarmerProfile((prev) => ({
        ...prev,
        fullName: authProfile.full_name || prev.fullName,
        email: authProfile.email || prev.email,
        phone: authProfile.phone || prev.phone
      }));
    }
  }, [authProfile]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchKopargaonWeather()
      .then((snap) => {
        if (cancelled) return;
        setWeather(snap);
        setRisk(assessClimateRisk(snap));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "Could not reach weather service");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  function handleProfileSave(updated: FarmerProfile) {
    setFarmerProfile(updated);
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 0. Profile Completion Banner Card (Displays if completion < 100%) */}
      <ProfileCompletionCard
        profile={farmerProfile}
        onOpenSetup={() => setShowSetupModal(true)}
      />

      {/* 1. Farm Health Greeting Banner */}
      <FarmHealthScore
        climateRisk={risk}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
      />

      {/* 2. Flagship ONE DOMINANT CARD: Today's Farm Decision */}
      <AdvisoryCard
        climateRisk={risk}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
        onViewDetails={onNavigateTab ? () => onNavigateTab("advisory") : undefined}
      />

      {/* 3. Balanced Grid for Climate & Crop Intelligence */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Climate Intelligence Card */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <span className="section-label" style={{ fontSize: 11 }}>CLIMATE INTELLIGENCE</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                  Weather &amp; Dry-Spell Risk
                </h3>
              </div>
              {onNavigateTab && (
                <button
                  className="btn-outline-sm"
                  onClick={() => onNavigateTab("climate")}
                  style={{ fontSize: 12 }}
                >
                  View 7-day forecast →
                </button>
              )}
            </div>

            {loading && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Fetching satellite forecast…</p>}
            {error && <p style={{ color: "var(--color-urgent)", fontSize: 13 }}>{error}</p>}

            {weather && risk && (
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-main)" }}>
                    {Math.round(weather.days[0]?.tempMaxC ?? 32)}°C
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Rain chance: {Math.round(weather.days[0]?.precipitationProbabilityPct ?? 0)}%
                  </span>
                </div>

                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {risk.headline}
                </p>

                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
                    {risk.dryDaysAhead}/7 dry days
                  </span>
                  <span className="badge badge-healthy">
                    {risk.heatStressDays} heat-stress days
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Crop Diagnostic Intelligence Card */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <span className="section-label" style={{ fontSize: 11 }}>CROP INTELLIGENCE</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                  Pest &amp; Disease Diagnostics
                </h3>
              </div>
              {onNavigateTab && (
                <button
                  className="btn-outline-sm"
                  onClick={() => onNavigateTab("crop")}
                  style={{ fontSize: 12 }}
                >
                  Open Crop Doctor →
                </button>
              )}
            </div>

            {detectedDisease && cropName ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>
                    {cropName}: {detectedDisease.displayName}
                  </span>
                  <span className={`badge badge-${detectedDisease.severity}`}>
                    {detectedDisease.severity}
                  </span>
                </div>
                <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {detectedDisease.advisory}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  No active disease detected. Scan a leaf sample using Crop Doctor neural network to check for early stress symptoms.
                </p>
                {onNavigateTab && (
                  <button
                    className="btn btn-outline"
                    onClick={() => onNavigateTab("crop")}
                    style={{ marginTop: 14, padding: "6px 16px", fontSize: 12 }}
                  >
                    📷 Open Crop Doctor Diagnostic Scanner
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Water & Soil Intelligence Row */}
      <div className="card" style={{ padding: 22, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div>
            <span className="section-label" style={{ fontSize: 11 }}>GROUNDWATER &amp; SOIL HEALTH</span>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              Groundwater Level &amp; Soil Baseline
            </h3>
          </div>
          {onNavigateTab && (
            <button
              className="btn-outline-sm"
              onClick={() => onNavigateTab("water")}
              style={{ fontSize: 12 }}
            >
              View Water &amp; Soil details →
            </button>
          )}
        </div>

        <div className="grid-3" style={{ gap: 16 }}>
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Groundwater Source</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              {village ? village.waterSourceType.replace("_", " ").toUpperCase() : "Taluka Baseline"}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-urgent)", marginTop: 6, fontWeight: 600 }}>
              Status: ↘ Semi-Critical Zone
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Distance to Godavari River</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
              {village ? `${village.distanceToGodavariKm.toFixed(1)} km` : "Centre"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {village?.proposedRecharge ? "Recharge Site" : "Standard Monitoring"}
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Soil Type</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              Medium Black / Murrum
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
              Normal Rainfall: {kopargaonProfile.normalRainfallMm} mm/year
            </div>
          </div>
        </div>
      </div>

      {/* Profile Setup Modal Drawer */}
      {showSetupModal && (
        <ProfileSetupModal
          profile={farmerProfile}
          onSave={handleProfileSave}
          onClose={() => setShowSetupModal(false)}
        />
      )}
    </div>
  );
}

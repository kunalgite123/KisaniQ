import { useState } from "react";
import { WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { kopargaonProfile } from "../data/groundSoil";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useAuth } from "../context/AuthContext";
import { FarmerProfile } from "../data/farmerProfile";
import ProfileCompletionCard from "./ProfileCompletionCard";
import ProfileSetupModal from "./ProfileSetupModal";
import AdvisoryCard from "./AdvisoryCard";
import FarmHealthScore from "./FarmHealthScore";
import { FarmerDecision } from "../lib/farmerDecisionEngine";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  weather?: WeatherSnapshot | null;
  climateRisk?: ClimateRisk | null;
  farmerProfile?: FarmerProfile | null;
  decision?: FarmerDecision | null;
  onFarmerProfileChange?: (profile: FarmerProfile) => void;
  onNavigateTab?: (tab: string) => void;
}

export default function Dashboard({
  village,
  detectedDisease,
  cropName,
  weather,
  climateRisk: risk,
  farmerProfile: propProfile,
  decision,
  onFarmerProfileChange,
  onNavigateTab
}: Props) {
  const { profile: authProfile } = useAuth();
  const { language } = useLanguage();
  const isMr = language === "mr";
  const [showSetupModal, setShowSetupModal] = useState(false);

  const localProfile: FarmerProfile = propProfile || {
    fullName: authProfile?.full_name || "Kisan Farmer",
    email: authProfile?.email || "farmer@krishisetu.in",
    phone: authProfile?.phone || "+91 98220 12345",
    locationVillage: village?.name || "",
    district: "Ahilyanagar (Ahmednagar)",
    primaryCrop: cropName || "",
    landArea: 0,
    landUnit: "acres",
    waterSource: "",
    soilType: "",
    primaryGoal: "yield",
    isCompleted: false,
    completionPercentage: 35
  };

  function handleProfileSave(updated: FarmerProfile) {
    if (onFarmerProfileChange) {
      onFarmerProfileChange(updated);
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 0. Profile Completion Banner Card */}
      <ProfileCompletionCard
        profile={localProfile}
        onOpenSetup={() => setShowSetupModal(true)}
      />

      {/* 1. Farm Health Greeting Banner */}
      <FarmHealthScore
        climateRisk={risk || null}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
      />

      {/* 2. Flagship ONE DOMINANT CARD: Today's Farm Decision */}
      <AdvisoryCard
        climateRisk={risk || null}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
        decision={decision}
        onViewDetails={onNavigateTab ? () => onNavigateTab("advisory") : undefined}
      />

      {/* 3. Balanced Grid for Climate & Crop Intelligence */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Climate Intelligence Card */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <span className="section-label" style={{ fontSize: 11 }}>{isMr ? "हवामान बुद्धिमत्ता" : "CLIMATE INTELLIGENCE"}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                  {isMr ? "हवामान अंदाज व कोरड्या दिवसांचा धोका" : "Weather & Dry-Spell Risk"}
                </h3>
              </div>
              {onNavigateTab && (
                <button
                  className="btn-outline-sm"
                  onClick={() => onNavigateTab("climate")}
                  style={{ fontSize: 12 }}
                >
                  {isMr ? "७ दिवसांचा अंदाज पहा →" : "View 7-day forecast →"}
                </button>
              )}
            </div>

            {!weather && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{isMr ? "उपग्रह हवामान अंदाज लोड होत आहे..." : "Fetching satellite forecast…"}</p>}

            {weather && risk && (
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-main)" }}>
                    {Math.round(weather.days[0]?.tempMaxC ?? 32)}°C
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {isMr ? "पावसाची शक्यता:" : "Rain chance:"} {Math.round(weather.days[0]?.precipitationProbabilityPct ?? 0)}%
                  </span>
                </div>

                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {risk.headline}
                </p>

                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
                    {risk.dryDaysAhead}/7 {isMr ? "कोरडे दिवस" : "dry days"}
                  </span>
                  <span className="badge badge-healthy">
                    {risk.heatStressDays} {isMr ? "उकाड्याचे दिवस" : "heat-stress days"}
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
                <span className="section-label" style={{ fontSize: 11 }}>{isMr ? "पीक आरोग्य बुद्धिमत्ता" : "CROP INTELLIGENCE"}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                  {isMr ? "किड व रोग निदान तंत्रज्ञान" : "Pest & Disease Diagnostics"}
                </h3>
              </div>
              {onNavigateTab && (
                <button
                  className="btn-outline-sm"
                  onClick={() => onNavigateTab("crop")}
                  style={{ fontSize: 12 }}
                >
                  {isMr ? "पीक डॉक्टर उघडा →" : "Open Crop Doctor →"}
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
                  {isMr ? "कोणताही सक्रिय रोग आढळला नाही. सुरुवातीचे ताण ओळखण्यासाठी पानांचे स्कॅनिंग करा." : "No active disease detected. Scan a leaf sample using Crop Doctor neural network to check for early stress symptoms."}
                </p>
                {onNavigateTab && (
                  <button
                    className="btn btn-outline"
                    onClick={() => onNavigateTab("crop")}
                    style={{ marginTop: 14, padding: "6px 16px", fontSize: 12 }}
                  >
                    📷 {isMr ? "पीक डॉक्टर स्कॅनर उघडा" : "Open Crop Doctor Diagnostic Scanner"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BEFORE VS AFTER KRISHI SETU IMPACT BANNER CARD */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary-900), var(--primary-700))",
          color: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          marginBottom: 32,
          boxShadow: "var(--shadow-md)",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255, 255, 255, 0.2)", padding: "4px 12px", borderRadius: "999px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            📊 {isMr ? "पारंपारिक विरुद्ध कृषी सेतू एआय प्रभाव" : "TRADITIONAL VS KRISHI SETU IMPACT"}
          </span>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", marginTop: 10, margin: "10px 0 6px 0" }}>
            {isMr ? "केवळ पारंपारिक शेती VS कृषी सेतू मार्गदर्शन" : "Traditional Farming vs Krishi Setu Guided Farming"}
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.5, margin: 0 }}>
            {isMr
              ? "पहा कृषी सेतूच्या अचूक नियमांमुळे किती नफा वाढतो, किती पाणी वाचते व कोणते शासकीय अनुदान मिळते."
              : "Compare your expected cost savings, water preserved, yield gains (+35% to +66%), and unlocked subsidies."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("impact")}
              style={{
                background: "#ffffff",
                color: "var(--primary-900)",
                border: "none",
                fontWeight: 800,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: "var(--radius-full)",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.2s ease"
              }}
            >
              <span>📈 {isMr ? "पूर्ण प्रभाव तुलना पहा" : "View Impact Comparison"}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Water & Soil Intelligence Row */}
      <div className="card" style={{ padding: 22, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div>
            <span className="section-label" style={{ fontSize: 11 }}>{isMr ? "भूजल व माती आरोग्य" : "GROUNDWATER & SOIL HEALTH"}</span>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              {isMr ? "भूजल पातळी व मातीची स्थिती" : "Groundwater Level & Soil Baseline"}
            </h3>
          </div>
          {onNavigateTab && (
            <button
              className="btn-outline-sm"
              onClick={() => onNavigateTab("water")}
              style={{ fontSize: 12 }}
            >
              {isMr ? "पाणी व मातीचे तपशील पहा →" : "View Water & Soil details →"}
            </button>
          )}
        </div>

        <div className="grid-3" style={{ gap: 16 }}>
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "पाण्याचा स्त्रोत" : "Groundwater Source"}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              {village ? village.waterSourceType.replace("_", " ").toUpperCase() : (isMr ? "तालुका पातळी" : "Taluka Baseline")}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-urgent)", marginTop: 6, fontWeight: 600 }}>
              {isMr ? "स्थिती: ↘ अर्ध-गंभीर क्षेत्र" : "Status: ↘ Semi-Critical Zone"}
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "गोदावरी नदीपासून अंतर" : "Distance to Godavari River"}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
              {village ? `${village.distanceToGodavariKm.toFixed(1)} km` : (isMr ? "मध्यवर्ती" : "Centre")}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {village?.proposedRecharge ? (isMr ? "पुनर्भरण क्षेत्र" : "Recharge Site") : (isMr ? "मानक निरीक्षण" : "Standard Monitoring")}
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "मातीचा प्रकार" : "Soil Type"}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              {isMr ? "मध्यम काळी / मुरामाची माती" : "Medium Black / Murrum"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
              {isMr ? "सरासरी पाऊस:" : "Normal Rainfall:"} {kopargaonProfile.normalRainfallMm} {isMr ? "मीमी/वर्ष" : "mm/year"}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Setup Modal Drawer */}
      {showSetupModal && (
        <ProfileSetupModal
          profile={localProfile}
          onSave={handleProfileSave}
          onClose={() => setShowSetupModal(false)}
        />
      )}
    </div>
  );
}

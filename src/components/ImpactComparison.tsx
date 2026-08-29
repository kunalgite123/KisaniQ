import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { calculateImpactComparison, CropType, ImpactFeatureSelection } from "../lib/impactCalculator";
import PageHeader from "./PageHeader";
import {
  TrendingUp,
  Droplets,
  DollarSign,
  Award,
  Sparkles,
  CheckSquare,
  Square,
  ShieldCheck,
  Building2,
  Sprout,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  Zap
} from "lucide-react";

interface Props {
  initialCrop?: string | null;
  initialAcres?: number;
}

export default function ImpactComparison({ initialCrop, initialAcres = 2 }: Props) {
  const { t, language } = useLanguage();
  const isMr = language === "mr";

  // Interactive State Controls
  const [crop, setCrop] = useState<CropType>(
    initialCrop?.toLowerCase().includes("cotton")
      ? "cotton"
      : initialCrop?.toLowerCase().includes("onion")
      ? "onion"
      : "sugarcane"
  );
  const [acres, setAcres] = useState<number>(initialAcres || 2);

  // Active Features Checkboxes
  const [features, setFeatures] = useState<ImpactFeatureSelection>({
    groundwaterRules: true,
    cropDoctor: true,
    weatherAlerts: true,
    govSchemes: true,
    machinerySharing: true
  });

  // Calculate dynamic impact metrics
  const impactResult = calculateImpactComparison({
    acres,
    crop,
    selectedFeatures: features,
    lang: language as any
  });

  const { traditional, guided, impact, featureContributions } = impactResult;

  function toggleFeature(key: keyof ImpactFeatureSelection) {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Format Large Liters/Rupees neatly
  function formatLiters(liters: number) {
    if (liters >= 10000000) {
      return `${(liters / 10000000).toFixed(2)} ${isMr ? "कोटी लिटर" : "Cr Liters"}`;
    }
    if (liters >= 100000) {
      return `${(liters / 100000).toFixed(1)} ${isMr ? "लाख लिटर" : "Lakh Liters"}`;
    }
    return `${liters.toLocaleString("en-IN")} L`;
  }

  return (
    <div>
      {/* 1. INTERACTIVE PARAMETERS & CROP SELECTOR CONTROL CARD */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--surface-card), var(--surface-muted))",
          border: "2px solid var(--primary-500)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginBottom: 24,
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-md)",
              background: "var(--primary-700)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="section-label" style={{ fontSize: 11 }}>
              {isMr ? "परस्परसंवादी प्रभाव कॅल्क्युलेटर" : "INTERACTIVE IMPACT CALCULATOR"}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
              {isMr ? "तुमचे पीक व शेतीचे क्षेत्र निवडा" : "Select Your Crop & Farm Acreage"}
            </h3>
          </div>
        </div>

        <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
          {/* Crop Selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              🌱 {isMr ? "पीक निवडा" : "Select Active Crop"}
            </label>
            <select
              className="select"
              value={crop}
              onChange={(e) => setCrop(e.target.value as CropType)}
              style={{ fontSize: 14, fontWeight: 700, padding: "10px 14px" }}
            >
              <option value="sugarcane">🎋 {isMr ? "ऊस (Sugarcane)" : "Sugarcane"}</option>
              <option value="cotton">🌾 {isMr ? "कापूस (Cotton)" : "Cotton"}</option>
              <option value="onion">🧅 {isMr ? "कांदा (Onion)" : "Onion"}</option>
            </select>
          </div>

          {/* Farm Size Acreage Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                📐 {isMr ? "शेती क्षेत्र (एकरामध्ये)" : "Farm Acreage (Acres)"}
              </label>
              <span
                style={{
                  background: "var(--primary-100)",
                  color: "var(--primary-700)",
                  padding: "2px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: 800
                }}
              >
                {acres} {isMr ? "एकर" : "Acres"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--primary-700)", height: 8, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              <span>1 {isMr ? "एकर" : "Acre"}</span>
              <span>10 {isMr ? "एकर" : "Acres"}</span>
              <span>20 {isMr ? "एकर" : "Acres"}</span>
            </div>
          </div>
        </div>

        {/* Feature Checkboxes Selection Bar */}
        <div style={{ paddingTop: 16, borderTop: "1px dashed var(--border-strong)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-main)", textTransform: "uppercase", marginBottom: 10 }}>
            ⚡ {isMr ? "वापरलेली कृषी सेतू वैशिष्ट्ये निवडा (Tick Features Used):" : "Select Krishi Setu Features Followed:"}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { key: "groundwaterRules", label: isMr ? "💧 भूजल व माती नियम" : "💧 Groundwater & Soil Rules" },
              { key: "cropDoctor", label: isMr ? "🐛 एआय पीक डॉक्टर" : "🐛 AI Crop Doctor" },
              { key: "weatherAlerts", label: isMr ? "🌦️ हवामान व कोरडे दिवस" : "🌦️ Weather & Dry Spells" },
              { key: "govSchemes", label: isMr ? "🏛️ शासकीय योजना" : "🏛️ Gov Schemes" },
              { key: "machinerySharing", label: isMr ? "🚜 यंत्रसामग्री भाडे" : "🚜 Machinery Sharing" }
            ].map((f) => {
              const active = features[f.key as keyof ImpactFeatureSelection];
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key as keyof ImpactFeatureSelection)}
                  className={`filter-chip ${active ? "active" : ""}`}
                  style={{
                    padding: "6px 14px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  {active ? <CheckSquare size={16} /> : <Square size={16} />}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TOP 4 IMPACT HEADLINE GAINS (PERFECTLY ALIGNED IN A STRAIGHT LINE) */}
      <div className="grid-4" style={{ gap: 16, marginBottom: 24, alignItems: "stretch" }}>
        {/* Cost Saved (Box 1 shifted slightly downwards for pixel-perfect straight line alignment) */}
        <div
          className="card"
          style={{
            padding: 18,
            borderTop: "4px solid var(--primary-700)",
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            minHeight: 125,
            marginTop: 4
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isMr ? "अपेक्षित खर्च बचत" : "EXPECTED COST SAVED"}
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "var(--primary-700)", marginTop: 6, marginBottom: 6, fontFamily: "var(--font-mono)", lineHeight: 1.2 }}>
              ₹{impact.costSavedRupees.toLocaleString("en-IN")}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isMr ? "रासायनिक फवारणी व वीज बचत" : "Spray & electricity reduction"}
          </div>
        </div>

        {/* Water Preserved (Box 2) */}
        <div
          className="card"
          style={{
            padding: 18,
            borderTop: "4px solid var(--water-600)",
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            minHeight: 125,
            marginTop: 4
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isMr ? "जतन केलेले भूजल" : "WATER PRESERVED"}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "var(--water-600)", marginTop: 6, marginBottom: 6, fontFamily: "var(--font-mono)", lineHeight: 1.2, whiteSpace: "nowrap" }}>
              {formatLiters(impact.waterPreservedLiters)}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            ⚡ <strong>{impact.waterPreservedPct}%</strong> {isMr ? "पाण्याची बचत" : "water preserved"}
          </div>
        </div>

        {/* Yield Increase (Box 3) */}
        <div
          className="card"
          style={{
            padding: 18,
            borderTop: "4px solid var(--turmeric-600)",
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            minHeight: 125,
            marginTop: 4
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isMr ? "उत्पन्नात वाढ" : "EXPECTED YIELD GAIN"}
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "var(--turmeric-600)", marginTop: 6, marginBottom: 6, fontFamily: "var(--font-mono)", lineHeight: 1.2 }}>
              +{impact.yieldGainPct}%
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            +{impact.extraYieldTons} {isMr ? "टन अतिरिक्त पीक" : "extra tons produced"}
          </div>
        </div>

        {/* Subsidies Unlocked (Box 4) */}
        <div
          className="card"
          style={{
            padding: 18,
            borderTop: "4px solid #8e44ad",
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            minHeight: 125,
            marginTop: 4
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {isMr ? "शासकीय अनुदान प्राप्त" : "SUBSIDIES UNLOCKED"}
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#8e44ad", marginTop: 6, marginBottom: 6, fontFamily: "var(--font-mono)", lineHeight: 1.2 }}>
              ₹{impact.subsidiesUnlockedRupees.toLocaleString("en-IN")}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isMr ? "PMKSY ठिबक व PM-KISAN हप्ते" : "PMKSY drip & PM-KISAN"}
          </div>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE COMPARISON CARDS (TRADITIONAL VS KRISHI SETU GUIDED - STRICT HORIZONTAL ALIGNMENT) */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 28, alignItems: "stretch" }}>
        {/* CARD A: TRADITIONAL FARMING */}
        <div
          className="card"
          style={{
            padding: 24,
            border: "2px solid rgba(220, 38, 38, 0.3)",
            background: "rgba(254, 242, 242, 0.3)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            marginTop: 0
          }}
        >
          <div style={{ minHeight: 64, display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: 16 }}>
            <div>
              <span className="badge badge-urgent" style={{ fontSize: 11, padding: "4px 10px" }}>
                🔴 {isMr ? "पारंपारिक शेती (अनियंत्रित)" : "TRADITIONAL FARMING"}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: "6px 0 0 0" }}>
                {isMr ? "केवळ स्वतःच्या अनुभवावर आधारित" : "Unassisted Traditional Practice"}
              </h3>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "space-between" }}>
            {/* Row 1: Water Usage */}
            <div style={{ padding: 12, background: "var(--surface-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>WATER USAGE (FLOOD IRRIGATION)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
                💧 {formatLiters(traditional.waterUsageLiters)}
              </div>
              <div style={{ fontSize: 12, color: "var(--alert-red)", marginTop: 2 }}>
                ⚠️ {isMr ? "पाट पाण्याने सिंचन, पाण्याचा मोठा अपव्यय" : "Heavy flood irrigation, high evaporation loss"}
              </div>
            </div>

            {/* Row 2: Input Cost */}
            <div style={{ padding: 12, background: "var(--surface-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>INPUT COST (SEEDS, SPRAY, WATER PUMPING)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
                💸 ₹{traditional.inputCostRupees.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: "var(--alert-red)", marginTop: 2 }}>
                ⚠️ {isMr ? "लक्षणे न तपासता अनावश्य रासायनिक फवारणी" : "Uncalibrated chemical & pesticide expenditure"}
              </div>
            </div>

            {/* Row 3: Total Yield */}
            <div style={{ padding: 12, background: "var(--surface-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>TOTAL YIELD HARVESTED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
                🌾 {traditional.totalYieldTons} {isMr ? "टन" : "Tons"} ({traditional.yieldPerAcreTons} {isMr ? "टन/एकर" : "Tons/Acre"})
              </div>
              <div style={{ fontSize: 12, color: "var(--alert-red)", marginTop: 2 }}>
                ⚠️ {isMr ? "उशिरा रोग निदानामुळे २२% पिकाचे नुकसान" : "~22% crop loss from delayed disease action"}
              </div>
            </div>

            {/* Row 4: Subsidies Claimed */}
            <div style={{ padding: 12, background: "var(--surface-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>GOVERNMENT SUBSIDIES CLAIMED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
                🏛️ ₹{traditional.subsidiesClaimedRupees}
              </div>
              <div style={{ fontSize: 12, color: "var(--alert-red)", marginTop: 2 }}>
                ⚠️ {isMr ? "योजनांची माहिती नसल्याने अनुदान हुकले" : "Missed PMKSY drip subsidies due to lack of match"}
              </div>
            </div>

            {/* Row 5: Estimated Net Profit */}
            <div style={{ padding: 14, background: "rgba(220, 38, 38, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid var(--alert-red)", minHeight: 76, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 12, color: "var(--alert-red)", fontWeight: 800 }}>ESTIMATED NET PROFIT</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--alert-red)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                ₹{traditional.netProfitRupees.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* CARD B: KRISHI SETU GUIDED FARMING */}
        <div
          className="card"
          style={{
            padding: 24,
            border: "2px solid var(--primary-500)",
            background: "var(--surface-card)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            height: "100%",
            marginTop: 0
          }}
        >
          <div style={{ minHeight: 64, display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: 16 }}>
            <div>
              <span className="badge badge-healthy" style={{ fontSize: 11, padding: "4px 10px" }}>
                🟢 {isMr ? "कृषी सेतू मार्गदर्शित शेती" : "KRISHI SETU GUIDED"}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--primary-700)", margin: "6px 0 0 0" }}>
                {isMr ? "एआय व अचूक निर्णय तंत्रज्ञान" : "AI & Precision Guided Farming"}
              </h3>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "space-between" }}>
            {/* Row 1: Water Usage */}
            <div style={{ padding: 12, background: "var(--primary-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-500)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--primary-700)", fontWeight: 800 }}>WATER USAGE (MICRO-IRRIGATION)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-900)", marginTop: 2 }}>
                💧 {formatLiters(guided.waterUsageLiters)}
              </div>
              <div style={{ fontSize: 12, color: "var(--primary-700)", fontWeight: 700, marginTop: 2 }}>
                ✓ {formatLiters(impact.waterPreservedLiters)} {isMr ? "पाण्याची बचत झाली" : "water preserved"} ({impact.waterPreservedPct}%)
              </div>
            </div>

            {/* Row 2: Input Cost */}
            <div style={{ padding: 12, background: "var(--primary-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-500)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--primary-700)", fontWeight: 800 }}>INPUT COST SAVINGS</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-900)", marginTop: 2 }}>
                💸 ₹{guided.inputCostRupees.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: "var(--primary-700)", fontWeight: 700, marginTop: 2 }}>
                ✓ ₹{impact.costSavedRupees.toLocaleString("en-IN")} {isMr ? "बचत झाली" : "saved on fertilizer/sprays"}
              </div>
            </div>

            {/* Row 3: Total Yield */}
            <div style={{ padding: 12, background: "var(--primary-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-500)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--primary-700)", fontWeight: 800 }}>TOTAL YIELD HARVESTED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-900)", marginTop: 2 }}>
                🌾 {guided.totalYieldTons} {isMr ? "टन" : "Tons"} ({guided.yieldPerAcreTons} {isMr ? "टन/एकर" : "Tons/Acre"})
              </div>
              <div style={{ fontSize: 12, color: "var(--primary-700)", fontWeight: 700, marginTop: 2 }}>
                ✓ +{impact.yieldGainPct}% {isMr ? "उत्पन्नात वाढ" : "extra yield harvest"} (+{impact.extraYieldTons} {isMr ? "टन" : "tons"})
              </div>
            </div>

            {/* Row 4: Subsidies Unlocked */}
            <div style={{ padding: 12, background: "var(--primary-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-500)", minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--primary-700)", fontWeight: 800 }}>GOVERNMENT SUBSIDIES UNLOCKED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-900)", marginTop: 2 }}>
                🏛️ ₹{guided.subsidiesClaimedRupees.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: "var(--primary-700)", fontWeight: 700, marginTop: 2 }}>
                ✓ {isMr ? "PMKSY ठिबक अनुदान + PM-KISAN अर्थसहाय्य प्राप्त" : "MahaDBT PMKSY drip subsidy unlocked"}
              </div>
            </div>

            {/* Row 5: Estimated Net Profit */}
            <div style={{ padding: 14, background: "var(--primary-700)", color: "#ffffff", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", minHeight: 76, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", opacity: 0.9 }}>ESTIMATED NET PROFIT</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2, fontFamily: "var(--font-mono)" }}>
                ₹{guided.netProfitRupees.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 4 }}>
                🚀 +₹{impact.extraProfitRupees.toLocaleString("en-IN")} {isMr ? "अतिरिक्त निव्वळ नफा!" : "extra net profit gain!"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FEATURE CONTRIBUTION BREAKDOWN LIST */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 16 }}>
          <span className="section-label">{isMr ? "वैशिष्ट्य योगदान विश्लेषण" : "FEATURE CONTRIBUTION BREAKDOWN"}</span>
          <h3 className="section-title">{isMr ? "प्रत्येक कृषी सेतू टूलने कसे योगदान दिले?" : "How Each Krishi Setu Feature Contributes to Your Farm ROI"}</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {featureContributions.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: 16,
                borderRadius: "var(--radius-md)",
                background: item.active ? "var(--surface-card)" : "var(--surface-muted)",
                border: item.active ? "1px solid var(--primary-500)" : "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                  {item.active ? <CheckCircle2 size={18} style={{ color: "var(--primary-700)" }} /> : <Square size={18} style={{ color: "var(--text-muted)" }} />}
                  {item.featureName}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                  {item.description}
                </div>
              </div>

              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: item.active ? "var(--primary-100)" : "rgba(100, 116, 139, 0.1)",
                  color: item.active ? "var(--primary-700)" : "var(--text-muted)"
                }}
              >
                {item.valueLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AGRONOMIC METHODOLOGY & DATA VERIFICATION DISCLAIMER */}
      <div
        style={{
          padding: 18,
          background: "var(--surface-muted)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          fontSize: 12.5,
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        ℹ️ <strong>{isMr ? "माहिती व अंदाज स्पष्टीकरण:" : "Methodology & Baseline Disclaimer:"}</strong>{" "}
        {isMr
          ? "पारंपारिक विरुद्ध कृषी सेतू प्रभाव अंदाज केंद्रीय भूजल मंडळ (CGWB कोपरगाव Hydrogeological Survey), ICAR पीक निर्देशांक (Sugarcane 75-125 t/ha, Cotton 0.32-0.5 t/ha, Onion 17-22 t/ha) आणि महाराष्ट्र महाडीबीटी योजना मानकांवर आधारित आहेत."
          : "Traditional vs Krishi Setu impact estimates are derived from CGWB Kopargaon block hydrogeological survey baseline metrics, ICAR yield benchmarks (Sugarcane 75-125 t/ha, Cotton 0.32-0.5 t/ha, Onion 17-22 t/ha), and Maharashtra MahaDBT PMKSY subsidy frameworks."}
      </div>
    </div>
  );
}

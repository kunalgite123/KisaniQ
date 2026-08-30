import { useState } from "react";
import { FarmerProfile, saveFarmerProfile } from "../data/farmerProfile";
import { villages } from "../data/villages";
import { useLanguage } from "../context/LanguageContext";
import { UserCheck, MapPin, Sprout, Layers, Droplets, Target, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  profile: FarmerProfile;
  onSave: (updated: FarmerProfile) => void;
  onClose: () => void;
}

export default function ProfileSetupModal({ profile, onSave, onClose }: Props) {
  const { language } = useLanguage();
  const isMr = language === "mr";

  const [fullName] = useState(profile.fullName || "Kisan Farmer");
  const [email] = useState(profile.email || "farmer@kisansetu.in");
  const [phone] = useState(profile.phone || "+91 98220 12345");

  // Remaining Unfilled Farm Setup Parameters
  const [locationVillage, setLocationVillage] = useState(profile.locationVillage || "Kopargaon");
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop || "Sugarcane");
  const [landArea, setLandArea] = useState<number | "">(profile.landArea || 4.0);
  const [landUnit, setLandUnit] = useState<"acres" | "guntha">(profile.landUnit || "acres");
  const [waterSource, setWaterSource] = useState<FarmerProfile["waterSource"]>(profile.waterSource || "godavari_canal");
  const [soilType, setSoilType] = useState<FarmerProfile["soilType"]>(profile.soilType || "medium_black");
  const [primaryGoal, setPrimaryGoal] = useState<FarmerProfile["primaryGoal"]>(profile.primaryGoal || "yield");

  // Optional Decision Engine Fields
  const [soilMoisture, setSoilMoisture] = useState<FarmerProfile["soilMoisture"]>(profile.soilMoisture || "adequate");
  const [waterAvailability, setWaterAvailability] = useState<FarmerProfile["waterAvailability"]>(profile.waterAvailability || "moderate");
  const [cropStage, setCropStage] = useState<FarmerProfile["cropStage"]>(profile.cropStage || "vegetative");
  const [farmerProblem, setFarmerProblem] = useState<FarmerProfile["farmerProblem"]>(profile.farmerProblem || "general");

  // Extended Soil & Input Parameters
  const [soilPh, setSoilPh] = useState<number | "">(profile.soilPh || 7.5);
  const [organicCarbonPct, setOrganicCarbonPct] = useState<number | "">(profile.organicCarbonPct || 0.48);
  const [fertilizerType, setFertilizerType] = useState<FarmerProfile["fertilizerType"]>(profile.fertilizerType || "chemical_npk");
  const [sowingDate, setSowingDate] = useState<string>(profile.sowingDate || "");
  const [budgetPerAcre, setBudgetPerAcre] = useState<number | "">(profile.budgetPerAcre || 15000);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedProfile: FarmerProfile = {
      ...profile,
      fullName,
      email,
      phone,
      locationVillage,
      district: "Ahilyanagar (Ahmednagar)",
      primaryCrop,
      landArea: Number(landArea) || 1.0,
      landUnit,
      waterSource,
      soilType,
      primaryGoal,
      soilMoisture,
      waterAvailability,
      cropStage,
      farmerProblem,
      soilPh: Number(soilPh) || 7.5,
      organicCarbonPct: Number(organicCarbonPct) || 0.48,
      fertilizerType,
      sowingDate,
      budgetPerAcre: Number(budgetPerAcre) || 15000,
      isCompleted: true,
      completionPercentage: 100
    };

    const saved = await saveFarmerProfile(updatedProfile);
    setIsSubmitting(false);
    onSave(saved);
    onClose();
  }

  return (
    <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(10, 25, 20, 0.55)", backdropFilter: "blur(6px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="modal-content" style={{ maxWidth: 620, padding: "28px 30px", maxHeight: "90vh", overflowY: "auto", borderRadius: 24, background: "#ffffff", boxShadow: "0 20px 50px rgba(0,0,0,0.22)" }}>
        <div className="modal-header" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={16} style={{ color: "var(--primary-700)" }} />
              <span className="section-label" style={{ fontSize: 10 }}>{isMr ? "शेत माहिती व सल्ला वैयक्तिकीकरण" : "FARM SETUP & ADVISORY PERSONALIZATION"}</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, marginTop: 2 }}>
              {isMr ? "शेत माहिती पूर्ण करा व अडचण नोंदवा" : "Complete Farm Setup & Report Issue"}
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
              {isMr ? "अचूक एआय सल्ला मिळवण्यासाठी आपल्या शेताची व पिकाची माहिती भरा." : "Fill in your farm details and current farm conditions to personalize your daily AI decision advisory."}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Pre-filled Identity */}
          <div style={{ background: "rgba(21, 128, 61, 0.06)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid rgba(21, 128, 61, 0.2)", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-900)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} style={{ color: "var(--primary-700)" }} /> 1. Verified Signup Identity (Saved)
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12.5, color: "var(--text-main)" }}>
              <div>👤 <strong>Name:</strong> {fullName}</div>
              <div>📧 <strong>Email:</strong> {email}</div>
              {phone && <div>📞 <strong>Phone:</strong> {phone}</div>}
            </div>
          </div>

          {/* Section 2: Farm Location & Crop */}
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} /> 2. Farm Location &amp; Primary Crop
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Kopargaon Village Location *</label>
                <select
                  className="input-select"
                  value={locationVillage}
                  onChange={(e) => setLocationVillage(e.target.value)}
                >
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>
                      📍 {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Primary Crop Cultivated *</label>
                <select
                  className="input-select"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                >
                  <option value="Sugarcane">🌾 Sugarcane (ऊस)</option>
                  <option value="Onion">🧅 Onion (कांदा)</option>
                  <option value="Pomegranate">🍎 Pomegranate (डाळिंब)</option>
                  <option value="Wheat">🌾 Wheat (गहू)</option>
                  <option value="Cotton">☁️ Cotton (कापूस)</option>
                  <option value="Soyabean">🌱 Soyabean (सोयाबीन)</option>
                  <option value="Rice">🌾 Rice (भात)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Land Size & Unit */}
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Sprout size={14} /> 3. Farm Land Area &amp; Unit
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Land Size Area *</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-text"
                  placeholder="e.g. 4.5"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value ? Number(e.target.value) : "")}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Measurement Unit *</label>
                <select
                  className="input-select"
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                >
                  <option value="acres">Acres (एकड)</option>
                  <option value="guntha">Guntha (गुंठा)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Water & Soil Parameters */}
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Droplets size={14} /> 4. Water Source &amp; Soil Baseline
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Irrigation Water Source *</label>
                <select
                  className="input-select"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value as any)}
                >
                  <option value="godavari_canal">💧 Godavari Canal Reach</option>
                  <option value="borewell_well">🚰 Borewell / Well Dependent</option>
                  <option value="drip_irrigation">🌱 Drip Micro-Irrigation</option>
                  <option value="rainfed">🌧️ Rainfed Only</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Soil Type *</label>
                <select
                  className="input-select"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as any)}
                >
                  <option value="medium_black">🪨 Medium Black Soil (काळी माती)</option>
                  <option value="murrum">🏔️ Murrum Light Soil (मुरूम)</option>
                  <option value="alluvial">🏞️ Alluvial Riverbed Soil</option>
                  <option value="red_clay">🔴 Red Clay Soil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Current Farm Conditions & Reported Problem */}
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} /> 5. Current Conditions &amp; Problem Report (Optional)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Current Soil Moisture</label>
                <select
                  className="input-select"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(e.target.value as any)}
                >
                  <option value="adequate">💧 Adequate (पुरेसा ओलावा)</option>
                  <option value="wet">🌊 Wet / Saturated (दमट)</option>
                  <option value="moderate">⛅ Moderate (मध्यम)</option>
                  <option value="dry">🏜️ Dry (कोरडी)</option>
                  <option value="very_dry">🌵 Very Dry (अति कोरडी)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Water Availability</label>
                <select
                  className="input-select"
                  value={waterAvailability}
                  onChange={(e) => setWaterAvailability(e.target.value as any)}
                >
                  <option value="moderate">💧 Moderate (मध्यम पाणी)</option>
                  <option value="abundant">🌊 Abundant (विपुल पाणी)</option>
                  <option value="limited">⚠️ Limited (मर्यादित पाणी)</option>
                  <option value="critical">🚨 Critical / Drought (पाणी टंचाई)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Crop Growth Stage</label>
                <select
                  className="input-select"
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as any)}
                >
                  <option value="vegetative">🌱 Vegetative Growth (शाकीय वाढ)</option>
                  <option value="sowing">🌾 Sowing / Germination (पेरणी)</option>
                  <option value="flowering">🌸 Flowering Stage (फुलोरा)</option>
                  <option value="fruiting">🍇 Fruit / Boll Formation (फळ धारणा)</option>
                  <option value="harvesting">🌾 Harvesting Stage (काढणी)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Report Active Farm Problem</label>
                <select
                  className="input-select"
                  value={farmerProblem}
                  onChange={(e) => setFarmerProblem(e.target.value as any)}
                >
                  <option value="general">✅ No Problem / Routine Management</option>
                  <option value="water_scarcity">⚠️ Water Scarcity / Less Water</option>
                  <option value="excessive_rain">🌧️ Excessive Rain / Waterlogging</option>
                  <option value="pest">🐛 Pest Attack / Symptoms</option>
                  <option value="disease">🦠 Disease / Leaf Yellowing</option>
                  <option value="low_yield">📉 Low Yield / Poor Growth</option>
                  <option value="crop_loss">🚨 Severe Crop Loss / Damage</option>
                  <option value="drought">🌵 Drought Stress</option>
                  <option value="market">💰 Low Produce Market Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 6: Extended Soil Nutrients & Fertilizer Practice */}
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Layers size={14} /> 6. Extended Soil Nutrients &amp; Budget (Optional)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Soil pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-text"
                  placeholder="e.g. 7.5"
                  value={soilPh}
                  onChange={(e) => setSoilPh(e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Fertilizer Practice</label>
                <select
                  className="input-select"
                  value={fertilizerType}
                  onChange={(e) => setFertilizerType(e.target.value as any)}
                >
                  <option value="chemical_npk">🧪 Chemical NPK Fertilizers</option>
                  <option value="organic_vermicompost">🌿 Organic Vermicompost / FYM</option>
                  <option value="bio_fertilizer">🔬 Bio-Fertilizers &amp; Microbes</option>
                  <option value="mixed">⚖️ Integrated / Mixed Practice</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Organic Carbon %</label>
                <input
                  type="number"
                  step="0.05"
                  className="input-text"
                  placeholder="e.g. 0.48%"
                  value={organicCarbonPct}
                  onChange={(e) => setOrganicCarbonPct(e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Input Budget per Acre (₹)</label>
                <input
                  type="number"
                  step="1000"
                  className="input-text"
                  placeholder="e.g. 15000"
                  value={budgetPerAcre}
                  onChange={(e) => setBudgetPerAcre(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" className="btn-outline-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving Setup..." : "✓ Save Farm Profile (100% Complete)"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

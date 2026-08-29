import { useState } from "react";
import { FarmerProfile, saveFarmerProfile } from "../data/farmerProfile";
import { villages } from "../data/villages";
import { UserCheck, MapPin, Sprout, Layers, Droplets, Target, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  profile: FarmerProfile;
  onSave: (updated: FarmerProfile) => void;
  onClose: () => void;
}

export default function ProfileSetupModal({ profile, onSave, onClose }: Props) {
  const [fullName] = useState(profile.fullName || "Kisan Farmer");
  const [email] = useState(profile.email || "farmer@kisaniq.in");
  const [phone] = useState(profile.phone || "+91 98220 12345");

  // Remaining Unfilled Farm Setup Parameters
  const [locationVillage, setLocationVillage] = useState(profile.locationVillage || "Kopargaon");
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop || "Sugarcane");
  const [landArea, setLandArea] = useState<number | "">(profile.landArea || 4.0);
  const [landUnit, setLandUnit] = useState<"acres" | "guntha">(profile.landUnit || "acres");
  const [waterSource, setWaterSource] = useState<FarmerProfile["waterSource"]>(profile.waterSource || "godavari_canal");
  const [soilType, setSoilType] = useState<FarmerProfile["soilType"]>(profile.soilType || "medium_black");
  const [primaryGoal, setPrimaryGoal] = useState<FarmerProfile["primaryGoal"]>(profile.primaryGoal || "yield");
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
      isCompleted: true,
      completionPercentage: 100
    };

    const saved = await saveFarmerProfile(updatedProfile);
    setIsSubmitting(false);
    onSave(saved);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 580, padding: 24 }}>
        <div className="modal-header" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={16} style={{ color: "var(--primary-700)" }} />
              <span className="section-label" style={{ fontSize: 10 }}>FARM SETUP &amp; ADVISORY PERSONALIZATION</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, marginTop: 2 }}>
              Complete Remaining Farm Parameters
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
              Your account identity is verified. Fill in your village, crop, land size, and soil parameters to reach 100% setup.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Pre-filled & Verified Signup Credentials (Read-only) */}
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
          <div style={{ background: "var(--surface-bg)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
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

import { FarmerProfile } from "../data/farmerProfile";
import { Sparkles, ArrowRight, CheckCircle2, UserCheck, Edit3 } from "lucide-react";

interface Props {
  profile: FarmerProfile;
  onOpenSetup: () => void;
}

export default function ProfileCompletionCard({ profile, onOpenSetup }: Props) {
  const pct = profile.completionPercentage || 35;
  const is100 = pct >= 95;

  if (is100) {
    // Render 100% Completed Verified Card (Always visible on Dashboard!)
    return (
      <div
        style={{
          background: "rgba(21, 128, 61, 0.06)",
          border: "1.5px solid rgba(21, 128, 61, 0.25)",
          borderRadius: "var(--radius-md)",
          padding: "16px 22px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <CheckCircle2 size={16} style={{ color: "var(--primary-700)" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              FARM PROFILE · 100% COMPLETE &amp; VERIFIED
            </span>
          </div>

          <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
            📍 {profile.locationVillage || "Kopargaon"} · {profile.primaryCrop || "Sugarcane"} ({profile.landArea || 4} {profile.landUnit || "acres"})
          </h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              👤 {profile.fullName}
            </span>
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              📧 {profile.email}
            </span>
            {profile.phone && (
              <span className="badge badge-healthy" style={{ fontSize: 11 }}>
                📞 {profile.phone}
              </span>
            )}
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              🌱 Soil: {profile.soilType || "Medium Black"}
            </span>
          </div>
        </div>

        <button
          className="btn-outline-sm"
          onClick={onOpenSetup}
          style={{ fontSize: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Edit3 size={13} />
          <span>Edit Farm Setup</span>
        </button>
      </div>
    );
  }

  // Render Partial Completion Card (< 100%)
  return (
    <div
      style={{
        background: "rgba(217, 119, 6, 0.06)",
        border: "1.5px solid rgba(217, 119, 6, 0.25)",
        borderRadius: "var(--radius-md)",
        padding: "18px 22px",
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}
    >
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Sparkles size={16} style={{ color: "#d97706" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            FARM PROFILE SETUP · {pct}% COMPLETE
          </span>
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
          Complete Your Farm Setup to Personalize Advisories
        </h3>

        {/* Display Pre-filled User Identity Chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <span className="badge badge-healthy" style={{ fontSize: 11 }}>
            ✓ Name: {profile.fullName}
          </span>
          <span className="badge badge-healthy" style={{ fontSize: 11 }}>
            ✓ Email: {profile.email}
          </span>
          {profile.phone && (
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              ✓ Phone: {profile.phone}
            </span>
          )}
        </div>

        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, margin: "6px 0 0 0" }}>
          Your signup identity is saved. Complete the remaining farm details (village location, primary crop, land size in acres, and soil type) to personalize your climate risk warnings and machine service cost calculations.
        </p>

        {/* Progress Bar Track */}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 240,
              height: 7,
              background: "rgba(0,0,0,0.08)",
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "var(--primary-700)",
                borderRadius: 4,
                transition: "width 0.4s ease"
              }}
            />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--primary-900)" }}>
            {pct}% Done
          </span>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={onOpenSetup}
        style={{ fontSize: 13, padding: "9px 20px", display: "flex", alignItems: "center", gap: 6 }}
      >
        <span>Fill Remaining Details →</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

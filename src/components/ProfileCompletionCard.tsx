import { FarmerProfile } from "../data/farmerProfile";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface Props {
  profile: FarmerProfile;
  onOpenSetup: () => void;
}

export default function ProfileCompletionCard({ profile, onOpenSetup }: Props) {
  const pct = profile.completionPercentage || 35;
  const is100 = pct >= 95;

  if (is100) return null; // Hide card when profile is 100% complete

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

        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5, margin: "4px 0 0 0" }}>
          Fill in your Kopargaon village location, primary crop, land size in acres, and soil type to unlock localized climate warnings and automated machine cost calculations.
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
        <span>Complete Profile Now</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

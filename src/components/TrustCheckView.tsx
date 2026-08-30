import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Tab } from "../App";
import { verifyClaim, VerificationResult, VerdictState } from "../services/trust/trustVerificationEngine";
import { saveVerificationRecord, fetchVerificationHistory } from "../services/trust/trustRepository";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink, ArrowRight, RefreshCw, HelpCircle, FileCheck, Layers } from "lucide-react";

interface Props {
  onNavigateTab: (tab: Tab) => void;
  selectedVillageName?: string | null;
}

export default function TrustCheckView({ onNavigateTab, selectedVillageName }: Props) {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const isHi = language === "hi";
  const { user } = useAuth();

  const [inputClaim, setInputClaim] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [activeResult, setActiveResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);

  useEffect(() => {
    const loadedHistory = fetchVerificationHistory();
    setHistory(loadedHistory);
  }, []);

  async function handleVerify(claimToVerify?: string) {
    const targetText = claimToVerify || inputClaim;
    if (!targetText.trim()) return;

    setVerifying(true);
    try {
      const location = selectedVillageName || "Kopargaon";
      const result = await verifyClaim(targetText, location);
      setActiveResult(result);
      await saveVerificationRecord(result, user?.id);
      setHistory(fetchVerificationHistory());
    } catch (e) {
      console.error("Verification engine error:", e);
    } finally {
      setVerifying(false);
    }
  }

  function getVerdictStyle(verdict: VerdictState) {
    switch (verdict) {
      case "SUPPORTED":
        return {
          bg: "var(--primary-100)",
          border: "var(--primary-700)",
          color: "var(--primary-900)",
          icon: <CheckCircle2 size={18} style={{ color: "var(--primary-800)" }} />
        };
      case "CONTRADICTED":
        return {
          bg: "var(--alert-red-bg)",
          border: "var(--alert-red)",
          color: "var(--alert-red)",
          icon: <XCircle size={18} style={{ color: "var(--alert-red)" }} />
        };
      case "OUTDATED":
        return {
          bg: "var(--water-100)",
          border: "var(--water-600)",
          color: "var(--water-600)",
          icon: <Clock size={18} style={{ color: "var(--water-600)" }} />
        };
      case "CONFLICTING":
      case "UNVERIFIED":
      default:
        return {
          bg: "var(--turmeric-100)",
          border: "var(--turmeric-600)",
          color: "var(--turmeric-600)",
          icon: <AlertTriangle size={18} style={{ color: "var(--turmeric-600)" }} />
        };
    }
  }

  // Pre-configured Demo Claims for Judge Demonstration Mode
  const DEMO_CLAIMS = [
    {
      label: isMr ? "🌦️ हवामान दावा" : isHi ? "🌦️ मौसम दावा" : "🌦️ Weather Claim",
      claimText: "उद्या कोपरगावमध्ये 80 mm पाऊस पडणार आहे."
    },
    {
      label: isMr ? "💧 भूजल पातळी दावा" : isHi ? "💧 भूजल स्तर दावा" : "💧 Groundwater Claim",
      claimText: "Groundwater in Kopargaon is only 8 metres deep."
    },
    {
      label: isMr ? "🏛️ योजना बातमी दावा" : isHi ? "🏛️ योजना दावा" : "🏛️ Government Scheme Claim",
      claimText: "PM-KISAN scheme has been stopped by government."
    },
    {
      label: isMr ? "🍃 पीक औषध फवारणी" : isHi ? "🍃 फसल स्प्रे दावा" : "🍃 Crop Spray Remedy",
      claimText: "This forwarded kerosene spray treatment cures sugarcane red rot."
    },
    {
      label: isMr ? "🚫 बनावट योजना तपास" : "🚫 Fake Scheme Check",
      claimText: "PM-MONEY Scheme gives ₹50,000 free cash to farmers."
    }
  ];

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 1. PAGE HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <ShieldCheck size={20} style={{ color: "var(--primary-800)" }} />
          <span className="section-label" style={{ fontSize: 11 }}>
            {isMr ? "माहिती पडताळणी" : isHi ? "सूचना सत्यापन" : "TRUST CHECK & VERIFICATION"}
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
          {isMr ? "माहिती पडताळणी" : isHi ? "ट्रस्ट चेक" : "Trust Check"}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          {isMr
            ? "शेतीविषयक मेसेज, हवामान अफवा किंवा योजनांच्या दाव्यांवर विश्वास ठेवण्यापूर्वी खात्री करा."
            : isHi
            ? "कृषि समाचार, मौसम के दावों या योजनाओं की जानकारी पर अमल करने से पहले पुष्टि करें।"
            : "Verify agricultural information, WhatsApp forwards, or weather rumors before you act."}
        </p>
      </div>

      {/* 2. MAIN SUBMISSION CARD */}
      <div
        className="card"
        style={{
          padding: 24,
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          marginBottom: 24
        }}
      >
        <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main)", display: "block", marginBottom: 8 }}>
          {isMr
            ? "तुम्हाला कोणत्या माहितीची पडताळणी करायची आहे?"
            : isHi
            ? "आप किस जानकारी की पुष्टि करना चाहते हैं?"
            : "What information would you like to verify?"}
        </label>
        <textarea
          rows={3}
          className="input-text"
          placeholder={
            isMr
              ? "उदा: 'उद्या कोपरगावमध्ये ८० मिमी पाऊस पडणार आहे' असा मेसेज आला आहे."
              : isHi
              ? "उदाहरण: 'कल कोपरगांव में 80 मिमी बारिश होगी' ऐसा मैसेज आया है।"
              : "Example: Someone forwarded a message saying tomorrow Kopargaon will receive 80 mm rainfall."
          }
          value={inputClaim}
          onChange={(e) => setInputClaim(e.target.value)}
          style={{ fontSize: 14, lineHeight: 1.5, resize: "vertical" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isMr ? "पडताळणी प्रकार: " : isHi ? "जांच योग्य: " : "Supported categories: "}
            <strong>{isMr ? "हवामान, भूजल, पीक रोग औषध, शासकीय योजना" : "Weather, Groundwater, Crop Spray, Schemes"}</strong>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => handleVerify()}
            disabled={verifying || !inputClaim.trim()}
            style={{
              padding: "10px 22px",
              background: "#1B7A5A",
              color: "#FFFFFF",
              borderColor: "#146147",
              fontWeight: 700
            }}
          >
            {verifying ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>{isMr ? "पडताळणी चालू आहे..." : isHi ? "जांच हो रही है..." : "Verifying Evidence..."}</span>
              </>
            ) : (
              <>
                <Search size={15} />
                <span>{isMr ? "माहिती तपासा" : isHi ? "जानकारी जांचें" : "Verify Information"}</span>
              </>
            )}
          </button>
        </div>

        {/* DEMO CLAIMS BAR (Judge Demo Mode) */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <HelpCircle size={13} style={{ color: "var(--primary-700)" }} />
            <span>{isMr ? "नमुना दाव्याने चाचणी करा (Demo Test):" : "Try a demo claim for verification:"}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DEMO_CLAIMS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-outline-sm"
                style={{ fontSize: 12, padding: "5px 12px" }}
                onClick={() => {
                  setInputClaim(demo.claimText);
                  handleVerify(demo.claimText);
                }}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VERIFICATION RESULT DISPLAY CARD */}
      {activeResult && (
        <div
          className="card"
          style={{
            padding: 24,
            background: "var(--surface-card)",
            border: `1.5px solid ${getVerdictStyle(activeResult.verdict).border}`,
            borderRadius: "var(--radius-md)",
            marginBottom: 28
          }}
        >
          {/* Header Verdict Status & Evidence Quality */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: getVerdictStyle(activeResult.verdict).bg,
                    color: getVerdictStyle(activeResult.verdict).color,
                    fontWeight: 700,
                    fontSize: 13
                  }}
                >
                  {getVerdictStyle(activeResult.verdict).icon}
                  <span>
                    {isMr ? activeResult.verdictLabelMr : isHi ? activeResult.verdictLabelHi : activeResult.verdictLabel}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: activeResult.evidenceQuality === "STRONG" ? "var(--primary-100)" : "var(--turmeric-100)",
                    color: activeResult.evidenceQuality === "STRONG" ? "var(--primary-800)" : "var(--turmeric-600)"
                  }}
                >
                  Evidence Quality: {activeResult.evidenceQuality}
                </span>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                "{activeResult.claimText}"
              </h3>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              📍 {activeResult.location} · {activeResult.timestamp}
            </div>
          </div>

          {/* Comparison Table Metrics (if available) */}
          {activeResult.comparisonData && (
            <div
              style={{
                padding: "12px 16px",
                background: "var(--surface-muted)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
                border: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                fontSize: 13
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Claimed Metric</div>
                <div style={{ fontWeight: 700, color: "var(--alert-red)", fontSize: 16, marginTop: 2 }}>
                  {activeResult.comparisonData.claimed.originalValue} {activeResult.comparisonData.claimed.originalUnit}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Verified Live Data</div>
                <div style={{ fontWeight: 700, color: "var(--primary-800)", fontSize: 16, marginTop: 2 }}>
                  {activeResult.comparisonData.observed.standardValue} {activeResult.comparisonData.observed.standardUnit}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Difference</div>
                <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: 16, marginTop: 2 }}>
                  {activeResult.comparisonData.absoluteDiff} {activeResult.comparisonData.observed.standardUnit}
                </div>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          <div style={{ background: "var(--surface-bg)", padding: 16, borderRadius: "var(--radius-sm)", marginBottom: 16, border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {isMr ? "पडताळणी स्पष्टीकरण" : isHi ? "सत्यापन विवरण" : "Why this result?"}
            </div>
            <p style={{ fontSize: 14, color: "var(--text-main)", marginTop: 4, lineHeight: 1.6, margin: 0 }}>
              {isMr ? activeResult.explanationMr : isHi ? activeResult.explanationHi : activeResult.explanation}
            </p>
          </div>

          {/* Evidence Records List */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {isMr ? "अधिकृत पुरावे व स्रोत नोंदी (Level 1-3 Authority)" : "Retrieved Authoritative Evidence:"}
            </div>
            {activeResult.evidenceList.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-xs)",
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: 13,
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, background: "var(--primary-100)", color: "var(--primary-800)", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                      Level {ev.authorityLevel} Source
                    </span>
                    <span>{ev.sourceName}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {ev.evidenceText}
                  </div>
                </div>

                {ev.sourceUrl && (
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--primary-800)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}
                  >
                    <span>{isMr ? "अधिकृत स्रोत" : "View Source"}</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Action Button to Related Kisan Setu Module */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigateTab(activeResult.relatedModule)}
              style={{ fontSize: 13, padding: "8px 18px" }}
            >
              <span>{isMr ? `${activeResult.relatedModuleLabel}` : activeResult.relatedModuleLabel}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 4. VERIFICATION HISTORY PANEL */}
      {history.length > 0 && (
        <div className="card" style={{ padding: 22, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginBottom: 12 }}>
            {isMr ? "माझ्या नुकत्याच पडताळलेल्या माहिती नोंदी" : isHi ? "हाल ही के सत्यापन रिकॉर्ड" : "My Verification History"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveResult(item)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-xs)",
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  transition: "background 0.15s ease"
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    "{item.claimText}"
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {item.category} · {item.timestamp}
                  </div>
                </div>

                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "var(--radius-xs)",
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: getVerdictStyle(item.verdict).bg,
                    color: getVerdictStyle(item.verdict).color,
                    flexShrink: 0
                  }}
                >
                  {isMr ? item.verdictLabelMr : item.verdictLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

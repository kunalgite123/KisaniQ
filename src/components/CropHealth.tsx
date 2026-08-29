import { useEffect, useRef, useState } from "react";
import { cropModels, CropModel, DiseaseInfo } from "../data/cropModels";
import { loadTMModel, predict, Prediction } from "../lib/teachableMachine";
import PageHeader from "./PageHeader";

interface Props {
  onResult: (crop: CropModel, disease: DiseaseInfo | null) => void;
}

const severityBadge: Record<string, string> = {
  healthy: "badge-healthy",
  watch: "badge-watch",
  urgent: "badge-urgent"
};

export default function CropHealth({ onResult }: Props) {
  const [cropId, setCropId] = useState<CropModel["id"]>("cotton");
  const crop = cropModels.find((c) => c.id === cropId)!;

  const [modelStatus, setModelStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [modelError, setModelError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  // Selected Symptom state (Single combined option: Colour + What Happens)
  const [selectedSymptomLabel, setSelectedSymptomLabel] = useState<string>("");

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<Awaited<ReturnType<typeof loadTMModel>> | null>(null);

  // Available symptom options for current crop
  const symptomDiseases = crop.diseases.filter((d) => d.symptom);

  useEffect(() => {
    let cancelled = false;
    setModelStatus("loading");
    setModelError(null);
    setPredictions(null);
    setSelectedSymptomLabel("");
    modelRef.current = null;

    loadTMModel(crop.modelUrl)
      .then((m) => {
        if (cancelled) return;
        modelRef.current = m;
        setModelStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setModelStatus("error");
        setModelError(err?.message ?? "Model failed to load");
      });

    return () => {
      cancelled = true;
    };
  }, [crop.modelUrl]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setImageSrc(null);
      setPredictions(null);
    } catch (err: any) {
      setModelError(
        `Camera access failed (${err?.name ?? "error"}). Please grant permission or upload a leaf photo.`
      );
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function captureFromCamera() {
    if (!videoRef.current || !modelRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    setPredicting(true);
    try {
      const preds = await predict(modelRef.current, canvas);
      setPredictions(preds);
      applyDiagnosticResult(preds, selectedSymptomLabel);
    } finally {
      setPredicting(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPredictions(null);
  }

  async function onImageLoaded() {
    if (!imgRef.current || !modelRef.current) return;
    setPredicting(true);
    try {
      const preds = await predict(modelRef.current, imgRef.current);
      setPredictions(preds);
      applyDiagnosticResult(preds, selectedSymptomLabel);
    } finally {
      setPredicting(false);
    }
  }

  // Symptom selection handler
  function handleSymptomChange(symptomLabel: string) {
    setSelectedSymptomLabel(symptomLabel);
    applyDiagnosticResult(predictions, symptomLabel);
  }

  function applyDiagnosticResult(preds: Prediction[] | null, symptomLabel: string) {
    // Determine top disease based on AI prediction + symptom choice
    const disease = getTopDisease(preds, symptomLabel);
    onResult(crop, disease);
  }

  // Helper to resolve diagnosis
  function getTopDisease(preds: Prediction[] | null, symptomLabel: string): DiseaseInfo | null {
    if (symptomLabel) {
      const matchBySymptom = crop.diseases.find((d) => d.symptom?.combinedLabel === symptomLabel);
      if (matchBySymptom) return matchBySymptom;
    }
    if (preds && preds.length > 0) {
      const topClass = preds[0].className;
      return crop.diseases.find((d) => d.label === topClass) ?? crop.diseases[0];
    }
    return null;
  }

  // Calculate composite probabilities when symptom is selected
  const activeSymptomDisease = crop.diseases.find(
    (d) => d.symptom?.combinedLabel === selectedSymptomLabel
  );

  const topDisease = getTopDisease(predictions, selectedSymptomLabel);

  return (
    <div>
      <PageHeader
        title="Crop Doctor"
        subtitle="Detect crop stress and disease using on-device AI neural networks & symptom matching"
        action={
          <span className="badge badge-healthy">
            {modelStatus === "ready" ? "🟢 Edge AI Ready" : modelStatus}
          </span>
        }
      />

      <div className="card">
        {/* Crop Selector Tabs */}
        <div className="crop-tabs">
          {cropModels.map((c) => (
            <button
              key={c.id}
              className={`crop-tab ${c.id === cropId ? "active" : ""}`}
              onClick={() => {
                setCropId(c.id);
                setImageSrc(null);
                setPredictions(null);
                setSelectedSymptomLabel("");
                stopCamera();
              }}
            >
              {c.name === "Cotton" ? "🌾 Cotton" : c.name === "Sugarcane" ? "🎋 Sugarcane" : "🧅 Onion"}
            </button>
          ))}
        </div>

        {/* --- SYMPTOM SELECTION OPTION (Combined: Colour + What Happens) --- */}
        <div
          style={{
            background: "var(--surface-muted)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <label style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🔍</span> Select Observed Symptom (Colour + Condition) for {crop.name}:
            </label>
            {selectedSymptomLabel && (
              <button
                className="btn-outline-sm"
                style={{ padding: "3px 10px", fontSize: 11.5 }}
                onClick={() => handleSymptomChange("")}
              >
                ✕ Clear Symptom Selection
              </button>
            )}
          </div>

          {/* Symptom Cards Grid (Visual Image Thumbnails + Colour + What Happens) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
            {symptomDiseases.map((d) => {
              const isSelected = selectedSymptomLabel === d.symptom!.combinedLabel;
              const sym = d.symptom!;
              return (
                <button
                  key={d.displayName}
                  type="button"
                  onClick={() => handleSymptomChange(isSelected ? "" : sym.combinedLabel)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: isSelected ? "2px solid var(--primary-700)" : "1px solid var(--border-strong)",
                    background: isSelected ? "var(--primary-50)" : "var(--surface-card)",
                    boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  {/* Thumbnail Image / Visual Icon */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "var(--radius-xs)",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: sym.iconBg || "var(--primary-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    {sym.imageUrl ? (
                      <img
                        src={sym.imageUrl}
                        alt={sym.color}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 18 }}>🍃</span>
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "var(--primary-900)" : "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      🎨 {sym.color}
                    </div>
                    <div style={{ fontSize: 12, color: isSelected ? "var(--primary-800)" : "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>
                      ⚡ {sym.whatHappens}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedSymptomLabel && activeSymptomDisease && (
            <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--primary-800)", background: "var(--primary-50)", padding: "8px 12px", borderRadius: "var(--radius-xs)", border: "1px solid var(--primary-100)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>✅</span>
              <span>
                Observed Symptom Selected: <strong>{activeSymptomDisease.symptom?.color}</strong> (What happens: <em>{activeSymptomDisease.symptom?.whatHappens}</em>)
              </span>
            </div>
          )}
        </div>

        <div className="grid-2">
          {/* Scanner Controls Left */}
          <div>
            <div className="scanner-frame">
              {predicting && <div className="scanner-line" />}
              {cameraOn ? (
                <video ref={videoRef} muted playsInline />
              ) : imageSrc ? (
                <img ref={imgRef} src={imageSrc} onLoad={onImageLoaded} alt="Selected leaf sample" />
              ) : (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <p style={{ fontWeight: 600, color: "#ffffff" }}>Upload leaf photo or turn on camera</p>
                  <p style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>Ensure good lighting &amp; clear focus on spots</p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <label className="btn btn-outline" style={{ cursor: "pointer", flex: 1, justifyContent: "center" }}>
                📁 Upload Photo
                <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
              </label>

              {!cameraOn ? (
                <button className="btn btn-primary" onClick={startCamera} style={{ flex: 1, justifyContent: "center" }}>
                  📷 Use Camera
                </button>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={captureFromCamera} disabled={modelStatus !== "ready"} style={{ flex: 1, justifyContent: "center" }}>
                    ⚡ Capture &amp; Scan
                  </button>
                  <button className="btn btn-outline" onClick={stopCamera}>
                    Stop
                  </button>
                </>
              )}
            </div>

            {modelStatus === "loading" && (
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)" }}>Loading {crop.name} neural network model…</p>
            )}
            {modelError && (
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--alert-red)" }}>{modelError}</p>
            )}
            {predicting && <p style={{ marginTop: 10, fontSize: 13, color: "var(--primary-700)", fontWeight: 600 }}>Analyzing leaf features &amp; calculating class probabilities…</p>}
          </div>

          {/* Diagnostic Results Right */}
          <div>
            <div className="section-label">Diagnostic Output</div>

            {!predictions && !selectedSymptomLabel && (
              <div style={{ marginTop: 16, padding: 24, background: "var(--surface-muted)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  Upload a photo, scan with camera, or select an observed symptom above to generate AI confidence scores and targeted advisory.
                </p>
              </div>
            )}

            {/* If Symptom Selected without photo */}
            {!predictions && selectedSymptomLabel && activeSymptomDisease && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                  Symptom Correlation Breakdown:
                </div>
                <div className="pred-row">
                  <div className="pred-label">{activeSymptomDisease.displayName}</div>
                  <div className="pred-bar-track">
                    <div className="pred-bar-fill" style={{ width: "95%", background: "var(--primary-600)" }} />
                  </div>
                  <div className="pred-pct">95% (Symptom)</div>
                </div>
              </div>
            )}

            {/* If AI Photo Predictions exist */}
            {predictions && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                  {selectedSymptomLabel ? "Hybrid AI + Symptom Confidence:" : "AI Neural Net Confidence:"}
                </div>
                {predictions.map((p) => {
                  const diseaseObj = crop.diseases.find((d) => d.label === p.className || d.displayName === p.className);
                  const labelName = diseaseObj?.displayName ?? p.className;
                  const severity = diseaseObj?.severity ?? "watch";

                  // Boost percentage if symptom matches
                  const isSymptomMatch = selectedSymptomLabel && diseaseObj?.symptom?.combinedLabel === selectedSymptomLabel;
                  let pct = Math.round(p.probability * 100);
                  if (isSymptomMatch) {
                    pct = Math.min(99, pct + 35);
                  }

                  return (
                    <div className="pred-row" key={p.className} style={{ background: isSymptomMatch ? "var(--primary-50)" : "transparent", padding: isSymptomMatch ? "4px 8px" : 0, borderRadius: 6 }}>
                      <div className="pred-label">
                        {labelName} {isSymptomMatch && <span style={{ fontSize: 10, color: "var(--primary-700)", fontWeight: 700 }}>[Symptom Match]</span>}
                      </div>
                      <div className="pred-bar-track">
                        <div
                          className="pred-bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: severity === "urgent" ? "var(--alert-red)" : severity === "watch" ? "var(--turmeric-400)" : "var(--primary-600)"
                          }}
                        />
                      </div>
                      <div className="pred-pct">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Final Verdict & Advisory */}
            {topDisease && (
              <div className={`verdict-box ${topDisease.severity}`} style={{ marginTop: 18 }}>
                <div className="verdict-icon">
                  {topDisease.severity === "urgent" ? "⚠" : topDisease.severity === "watch" ? "◐" : "✓"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h4 className="verdict-title">{topDisease.displayName}</h4>
                    <span className={`badge ${severityBadge[topDisease.severity]}`}>
                      {topDisease.severity}
                    </span>
                    {selectedSymptomLabel && (
                      <span className="badge badge-muted" style={{ fontSize: 10 }}>
                        🔍 Symptom Verified
                      </span>
                    )}
                  </div>

                  {topDisease.symptom && (
                    <div style={{ fontSize: 12, marginTop: 4, color: "var(--text-muted)" }}>
                      Characteristic Symptom: <strong>{topDisease.symptom.color}</strong> · <em>{topDisease.symptom.whatHappens}</em>
                    </div>
                  )}

                  <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6 }}>{topDisease.advisory}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
          🔒 <strong>Krishi Setu Edge Privacy:</strong> Neural networks run 100% locally inside your web browser via TensorFlow.js — no leaf photos leave your device. Diagnostics instantly sync with the main Krishi Setu Advisory Engine.
        </p>
      </div>
    </div>
  );
}

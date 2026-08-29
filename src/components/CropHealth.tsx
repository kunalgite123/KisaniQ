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

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<Awaited<ReturnType<typeof loadTMModel>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setModelStatus("loading");
    setModelError(null);
    setPredictions(null);
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
      applyTopResult(preds);
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
      applyTopResult(preds);
    } finally {
      setPredicting(false);
    }
  }

  function applyTopResult(preds: Prediction[]) {
    const top = preds[0];
    const disease = crop.diseases.find((d) => d.label === top.className) ?? null;
    onResult(crop, disease);
  }

  const topDisease = predictions
    ? crop.diseases.find((d) => d.label === predictions[0].className) ?? null
    : null;

  return (
    <div>
      <PageHeader
        title="Crop Doctor"
        subtitle="Detect crop stress and disease using on-device AI neural networks"
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
                stopCamera();
              }}
            >
              {c.name === "Cotton" ? "🌾 Cotton" : c.name === "Sugarcane" ? "🎋 Sugarcane" : "🧅 Onion"}
            </button>
          ))}
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
            <div className="section-label">Classification Output</div>
            {!predictions && (
              <div style={{ marginTop: 16, padding: 24, background: "var(--surface-muted)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  Scan a {crop.name.toLowerCase()} leaf to view neural network confidence scores and targeted management advice.
                </p>
              </div>
            )}

            {predictions && (
              <div style={{ marginTop: 12 }}>
                {predictions.map((p) => {
                  const diseaseObj = crop.diseases.find((d) => d.label === p.className);
                  const labelName = diseaseObj?.displayName ?? p.className;
                  const severity = diseaseObj?.severity ?? "watch";
                  const pct = Math.round(p.probability * 100);

                  return (
                    <div className="pred-row" key={p.className}>
                      <div className="pred-label">{labelName}</div>
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

            {topDisease && (
              <div className={`verdict-box ${topDisease.severity}`} style={{ marginTop: 18 }}>
                <div className="verdict-icon">
                  {topDisease.severity === "urgent" ? "⚠" : topDisease.severity === "watch" ? "◐" : "✓"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h4 className="verdict-title">{topDisease.displayName}</h4>
                    <span className={`badge ${severityBadge[topDisease.severity]}`}>
                      {topDisease.severity}
                    </span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6 }}>{topDisease.advisory}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
          🔒 <strong>KisaniQ Edge Privacy:</strong> Neural networks run 100% locally inside your web browser via TensorFlow.js — no leaf photos leave your device. Diagnostics instantly sync with the main KisaniQ Advisory Engine.
        </p>
      </div>
    </div>
  );
}

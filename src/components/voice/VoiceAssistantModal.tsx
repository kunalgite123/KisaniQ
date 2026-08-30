import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useVoiceNavigation } from "../../hooks/useVoiceNavigation";
import { AssistantContext } from "../../services/voice/intentEngine";
import { Tab } from "../../App";
import { Mic, MicOff, Volume2, VolumeX, Globe, X, Send, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  context: AssistantContext;
  onNavigateTab: (tab: Tab) => void;
}

export default function VoiceAssistantModal({ isOpen, onClose, context, onNavigateTab }: Props) {
  const { language, setLanguage, t } = useLanguage();
  const [textInput, setTextInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    transcript,
    messages,
    errorMessage,
    isSupported,
    activeSpeechLang,
    startListening,
    stopListening,
    stopSpeaking,
    processQuery
  } = useVoiceNavigation(context, onNavigateTab);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, transcript]);

  if (!isOpen) return null;

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (textInput.trim()) {
      processQuery(textInput);
      setTextInput("");
    }
  }

  // Context-aware page suggestions in Marathi or English
  const currentTab = context.currentTab || "dashboard";
  const suggestions =
    language === "mr"
      ? [
          { text: "हवामान दाखवा", label: "🌦️ हवामान दाखवा" },
          { text: "मातीची तपासणी", label: "🌱 मातीची तपासणी" },
          { text: "पीक डॉक्टर वर जा", label: "🩺 पीक डॉक्टर" },
          { text: "कांद्यावर करपा आलाय काय करू?", label: "🐛 कांद्यावरील रोग उपाय" },
          { text: "शासकीय योजना कोणत्या आहेत?", label: "🏛️ सरकारी योजना" }
        ]
      : [
          { text: "Show weather forecast", label: "🌦️ Show weather" },
          { text: "Go to Crop Doctor", label: "🩺 Crop Doctor" },
          { text: "Check soil & groundwater", label: "🌱 Soil check" },
          { text: "How to control pest in onion?", label: "🐛 Pest advice" },
          { text: "Show agricultural schemes", label: "🏛️ Government schemes" }
        ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(12, 14, 18, 0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
      onClick={() => {
        stopSpeaking();
        stopListening();
        onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 540,
          width: "100%",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-strong)",
          overflow: "hidden",
          isolation: "isolate"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--surface-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary-700), var(--primary-500))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Kisan Setu Voice Assistant
              </h3>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{language === "mr" ? "द्विभाषिक व्हॉईस एआय" : "Full-Duplex Multilingual Voice AI"}</span>
                <span
                  style={{
                    background: "var(--primary-100)",
                    color: "var(--primary-700)",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-xs)",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {activeSpeechLang}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Language Switcher Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-full)",
                padding: "2px"
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                style={{
                  background: language === "en" ? "var(--primary-700)" : "transparent",
                  color: language === "en" ? "#ffffff" : "var(--text-muted)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("mr")}
                style={{
                  background: language === "mr" ? "var(--primary-700)" : "transparent",
                  color: language === "mr" ? "#ffffff" : "var(--text-muted)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                मराठी
              </button>
            </div>

            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Animated Audio-Wave & Status Bar */}
        <div
          style={{
            padding: "12px 18px",
            fontSize: 13,
            fontWeight: 600,
            textAlign: "center",
            background:
              status === "LISTENING"
                ? "rgba(220, 38, 38, 0.08)"
                : status === "SPEAKING"
                ? "var(--primary-100)"
                : "var(--surface-bg)",
            color:
              status === "LISTENING"
                ? "var(--alert-red)"
                : status === "SPEAKING"
                ? "var(--primary-700)"
                : "var(--text-muted)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10
          }}
        >
          {status === "LISTENING" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot-red" />
              <span>{t("voice_listening")}</span>
              {/* Audio Wave Visualizer Bars */}
              <div className="audio-wave">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {status === "PROCESSING" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>⏳</span>
              <span>{t("voice_processing")}</span>
            </div>
          )}

          {status === "SPEAKING" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Volume2 size={16} className="animate-bounce" />
              <span>{t("voice_speaking")}</span>
            </div>
          )}

          {status === "IDLE" && (
            <span>
              {language === "mr"
                ? "बोला किंवा प्रश्न लिहा — मायक्रोफोन टॅप करा"
                : "Speak or type your farm query — Tap microphone to start"}
            </span>
          )}

          {status === "ERROR" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--alert-red)" }}>
              <AlertCircle size={16} />
              <span>{errorMessage || t("voice_error_try_again")}</span>
            </div>
          )}
        </div>

        {/* Chat History & Transcript Card */}
        <div style={{ flex: 1, padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                background: m.sender === "user" ? "var(--primary-700)" : "var(--surface-muted)",
                color: m.sender === "user" ? "#ffffff" : "var(--text-main)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                lineHeight: 1.6,
                border: m.sender === "user" ? "none" : "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {m.sender === "user" && (
                <div style={{ fontSize: 10.5, opacity: 0.8, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {language === "mr" ? "तुम्ही विचारले:" : "You said:"}
                </div>
              )}
              {m.sender === "assistant" && (
                <div style={{ fontSize: 10.5, color: "var(--primary-500)", fontWeight: 700, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Kisan Setu AI:
                </div>
              )}
              {m.text}
            </div>
          ))}

          {/* Live Transcript Stream */}
          {transcript && status === "LISTENING" && (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                background: "rgba(0, 119, 182, 0.1)",
                border: "1px solid var(--ai-blue)",
                color: "var(--text-main)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: 13.5,
                fontStyle: "italic"
              }}
            >
              "{transcript}..."
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div style={{ padding: "10px 18px", background: "var(--surface-bg)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>
            {language === "mr" ? "विचारून पहा:" : "Quick Commands:"}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="btn-outline-sm"
                style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: "var(--radius-full)" }}
                onClick={() => {
                  stopSpeaking();
                  processQuery(s.text);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control Footer & Floating Mic UI */}
        <div style={{ padding: 16, background: "var(--surface-muted)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {status === "LISTENING" ? (
              <button
                type="button"
                className="btn"
                onClick={stopListening}
                style={{
                  flex: 1,
                  background: "var(--alert-red)",
                  color: "#ffffff",
                  justifyContent: "center",
                  fontWeight: 700,
                  gap: 8
                }}
              >
                <MicOff size={18} /> {language === "mr" ? "थांबवा (Listening)" : "Stop Listening"}
              </button>
            ) : status === "SPEAKING" ? (
              <button
                type="button"
                className="btn"
                onClick={stopSpeaking}
                style={{
                  flex: 1,
                  background: "var(--surface-card)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-strong)",
                  justifyContent: "center",
                  fontWeight: 700,
                  gap: 8
                }}
              >
                <VolumeX size={18} /> {language === "mr" ? "आवाज बंद करा" : "Stop Speaking"}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={startListening}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  gap: 8
                }}
              >
                <Mic size={18} /> {language === "mr" ? "बोलण्यासाठी टॅप करा (मराठी)" : "Tap to Speak (English)"}
              </button>
            )}
          </div>

          {/* Text Fallback Form */}
          <form onSubmit={handleTextSubmit} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              className="input-text"
              placeholder={language === "mr" ? "किंवा तुमचा प्रश्न येथे टाइप करा..." : "Or type your question here..."}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ flex: 1, fontSize: 13 }}
            />
            <button type="submit" className="btn-outline-sm" style={{ padding: "0 14px", display: "flex", alignItems: "center", gap: 4 }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

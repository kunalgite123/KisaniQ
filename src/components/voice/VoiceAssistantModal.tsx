import { useState, useEffect, useRef } from "react";
import { VoiceRecognitionService, isSpeechRecognitionSupported } from "../../services/voice/speechRecognition";
import { VoiceSynthesisService, ResponseLang } from "../../services/voice/speechSynthesis";
import { processVoiceQuery, AssistantContext } from "../../services/voice/intentEngine";
import { Tab } from "../../App";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  context: AssistantContext;
  onNavigateTab: (tab: Tab) => void;
}

interface MessageLog {
  id: string;
  sender: "user" | "assistant";
  text: string;
  lang?: ResponseLang;
  intent?: string;
}

export default function VoiceAssistantModal({ isOpen, onClose, context, onNavigateTab }: Props) {
  const [status, setStatus] = useState<"IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ERROR">("IDLE");
  const [transcript, setTranscript] = useState("");
  const [forcedLang, setForcedLang] = useState<"auto" | ResponseLang>("auto");
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageLog[]>([
    {
      id: "init",
      sender: "assistant",
      text: "Namaste! Speak naturally in English, Marathi, or Hindi, or ask a farm question.",
      lang: "en"
    }
  ]);

  const recognitionRef = useRef<VoiceRecognitionService | null>(null);
  const synthRef = useRef<VoiceSynthesisService | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    recognitionRef.current = new VoiceRecognitionService();
    synthRef.current = new VoiceSynthesisService();

    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  if (!isOpen) return null;

  function handleStartListening() {
    synthRef.current?.stop();
    setErrorMessage(null);
    setTranscript("");

    const speechLang = forcedLang === "mr" ? "mr-IN" : forcedLang === "hi" ? "hi-IN" : forcedLang === "en" ? "en-IN" : "auto";

    recognitionRef.current?.start(speechLang as any, {
      onStart: () => {
        setStatus("LISTENING");
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          recognitionRef.current?.stop();
          handleProcessQuery(text);
        }
      },
      onError: (err) => {
        setStatus("ERROR");
        setErrorMessage(err);
      },
      onEnd: () => {
        if (status === "LISTENING") {
          setStatus("IDLE");
        }
      }
    });
  }

  function handleStopListening() {
    recognitionRef.current?.stop();
    setStatus("IDLE");
  }

  function handleStopSpeaking() {
    synthRef.current?.stop();
    setStatus("IDLE");
  }

  function handleProcessQuery(queryText: string) {
    if (!queryText.trim()) return;

    setStatus("PROCESSING");
    const userMsg: MessageLog = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");

    setTimeout(() => {
      const response = processVoiceQuery(queryText, context, forcedLang === "auto" ? undefined : forcedLang);

      const assistantMsg: MessageLog = {
        id: Date.now().toString() + "-a",
        sender: "assistant",
        text: response.responseText,
        lang: response.detectedLang,
        intent: response.intent
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Navigate if intent requested navigation
      if (response.navigateTab) {
        onNavigateTab(response.navigateTab);
      }

      // Speak response aloud
      if (synthRef.current) {
        setStatus("SPEAKING");
        synthRef.current.speak(response.responseText, response.detectedLang, () => {
          setStatus("IDLE");
        });
      } else {
        setStatus("IDLE");
      }
    }, 400);
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (textInput.trim()) {
      synthRef.current?.stop();
      handleProcessQuery(textInput);
    }
  }

  // Page-aware suggestion prompts
  const currentTab = context.currentTab || "dashboard";
  const suggestions: { text: string; label: string }[] =
    currentTab === "climate"
      ? [
          { text: "आज पाऊस पडेल का?", label: "आज पाऊस पडेल का? (MR)" },
          { text: "Will it rain today?", label: "Will it rain? (EN)" },
          { text: "आज मौसम कैसा है?", label: "आज मौसम कैसा है? (HI)" }
        ]
      : currentTab === "water"
      ? [
          { text: "माझी माती कशी आहे?", label: "माझी माती कशी आहे? (MR)" },
          { text: "Is groundwater low?", label: "Groundwater level? (EN)" },
          { text: "मेरी मिट्टी की स्थिति दिखाओ", label: "मिट्टी की स्थिति (HI)" }
        ]
      : currentTab === "crop"
      ? [
          { text: "माझ्या पिकाला काय झालं?", label: "माझ्या पिकाला काय झालं? (MR)" },
          { text: "Scan crop disease", label: "Scan disease (EN)" },
          { text: "मेरी फसल में क्या बीमारी है?", label: "फसल रोग निदान (HI)" }
        ]
      : currentTab === "schemes"
      ? [
          { text: "माझ्यासाठी कोणत्या योजना आहेत?", label: "कोणत्या योजना आहेत? (MR)" },
          { text: "Which schemes apply to me?", label: "Relevant schemes (EN)" },
          { text: "मेरे लिए कौन सी सरकारी योजनाएं हैं?", label: "सरकारी योजनाएं (HI)" }
        ]
      : [
          { text: "आज हवामान कसं आहे?", label: "हवामान स्थिती (MR)" },
          { text: "Open soil report", label: "Open soil report (EN)" },
          { text: "सरकारी योजना दाखवा", label: "सरकारी योजना दाखवा (MR)" }
        ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 31, 24, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
      onClick={() => {
        synthRef.current?.stop();
        recognitionRef.current?.stop();
        onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 540,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-strong)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--surface-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎙️</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                KisaniQ Voice Assistant
              </h3>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Speak in English, Marathi, or Hindi
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Language Selector */}
            <select
              className="input-text"
              value={forcedLang}
              onChange={(e) => setForcedLang(e.target.value as any)}
              style={{ fontSize: 12, padding: "4px 8px" }}
            >
              <option value="auto">🌐 Auto Detect</option>
              <option value="mr">🇮🇳 मराठी (Marathi)</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="en">🇬🇧 English</option>
            </select>

            <button
              onClick={() => {
                synthRef.current?.stop();
                recognitionRef.current?.stop();
                onClose();
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer",
                color: "var(--text-muted)"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div
          style={{
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            background:
              status === "LISTENING"
                ? "var(--color-urgent-light, #ffebee)"
                : status === "SPEAKING"
                ? "var(--primary-100)"
                : "var(--surface-bg)",
            color:
              status === "LISTENING"
                ? "var(--color-urgent, #c62828)"
                : status === "SPEAKING"
                ? "var(--primary-800)"
                : "var(--text-muted)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          {status === "LISTENING" && <span style={{ animation: "pulse 1s infinite" }}>● Listening... Speak naturally</span>}
          {status === "PROCESSING" && <span>⏳ Analyzing your question...</span>}
          {status === "SPEAKING" && <span>🔊 KisaniQ is speaking...</span>}
          {status === "IDLE" && <span>Ready — Tap microphone or type a question</span>}
          {status === "ERROR" && <span style={{ color: "var(--color-urgent)" }}>⚠️ {errorMessage || "Speech error"}</span>}
        </div>

        {/* Chat History Messages */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: m.sender === "user" ? "var(--primary-800)" : "var(--surface-muted)",
                color: m.sender === "user" ? "#ffffff" : "var(--text-main)",
                padding: "10px 14px",
                borderRadius: m.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                fontSize: 13.5,
                lineHeight: 1.5,
                border: m.sender === "user" ? "none" : "1px solid var(--border-subtle)"
              }}
            >
              {m.text}
            </div>
          ))}

          {/* Live Listening Transcript */}
          {transcript && status === "LISTENING" && (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                background: "rgba(30, 136, 229, 0.15)",
                border: "1px stroke var(--primary-400)",
                color: "var(--primary-900)",
                padding: "8px 12px",
                borderRadius: "12px",
                fontSize: 13,
                fontStyle: "italic"
              }}
            >
              "{transcript}..."
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{ padding: "8px 16px", background: "var(--surface-bg)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Try asking:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="btn-outline-sm"
                style={{ fontSize: 11, padding: "3px 9px", borderRadius: 12 }}
                onClick={() => {
                  synthRef.current?.stop();
                  handleProcessQuery(s.text);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls & Input Section */}
        <div style={{ padding: 14, background: "var(--surface-muted)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {status === "LISTENING" ? (
              <button
                type="button"
                className="btn"
                onClick={handleStopListening}
                style={{
                  flex: 1,
                  background: "var(--color-urgent, #c62828)",
                  color: "#fff",
                  justifyContent: "center"
                }}
              >
                🛑 Stop Listening
              </button>
            ) : status === "SPEAKING" ? (
              <button
                type="button"
                className="btn"
                onClick={handleStopSpeaking}
                style={{
                  flex: 1,
                  background: "var(--surface-bg)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-strong)",
                  justifyContent: "center"
                }}
              >
                🔇 Stop Speaking
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStartListening}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                🎙️ Tap to Speak (EN / MR / HI)
              </button>
            )}
          </div>

          {/* Text Input Fallback */}
          <form onSubmit={handleTextSubmit} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              className="input-text"
              placeholder="Or type a question (e.g. आज पाऊस पडेल का?)..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ flex: 1, fontSize: 12.5 }}
            />
            <button type="submit" className="btn-outline-sm" style={{ padding: "0 14px" }}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

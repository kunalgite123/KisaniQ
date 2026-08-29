import { useState, useEffect, useRef } from "react";
import { VoiceRecognitionService } from "../../services/voice/speechRecognition";
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
      text: "Namaste! I am Kisan Setu. Speak naturally in English, Marathi, or Hindi, or ask a farm question.",
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
        setErrorMessage("Could not understand speech. Please try speaking again.");
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
    }, 350);
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (textInput.trim()) {
      synthRef.current?.stop();
      handleProcessQuery(textInput);
    }
  }

  // Context-aware page suggestions
  const currentTab = context.currentTab || "dashboard";
  const suggestions: { text: string; label: string }[] =
    currentTab === "climate"
      ? [
          { text: "आज पाऊस पडेल का?", label: "आज पाऊस पडेल का?" },
          { text: "Will it rain today?", label: "Will it rain today?" },
          { text: "आज मौसम कैसा है?", label: "आज मौसम कैसा है?" }
        ]
      : currentTab === "water"
      ? [
          { text: "माझी माती कशी आहे?", label: "माझी माती कशी आहे?" },
          { text: "Is groundwater low?", label: "Groundwater level?" },
          { text: "मेरी मिट्टी की स्थिति दिखाओ", label: "मेरी मिट्टी की स्थिति" }
        ]
      : currentTab === "crop"
      ? [
          { text: "माझ्या पिकाला काय झालं?", label: "माझ्या पिकाला काय झालं?" },
          { text: "Scan crop disease", label: "Scan disease" },
          { text: "मेरी फसल में क्या बीमारी है?", label: "फसल रोग निदान" }
        ]
      : currentTab === "schemes"
      ? [
          { text: "माझ्यासाठी कोणत्या योजना आहेत?", label: "माझ्यासाठी कोणत्या योजना आहेत?" },
          { text: "Which schemes apply to me?", label: "Which schemes apply to me?" },
          { text: "मेरे लिए कौन सी सरकारी योजनाएं हैं?", label: "सरकारी योजनाएं" }
        ]
      : [
          { text: "आज हवामान कसं आहे?", label: "आज हवामान कसं आहे?" },
          { text: "Open soil report", label: "Open soil report" },
          { text: "सरकारी योजना दाखवा", label: "सरकारी योजना दाखवा" }
        ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 31, 24, 0.45)",
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
          borderRadius: "var(--radius-md)",
          maxWidth: 520,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
                Kisan Setu Voice Assistant
              </h3>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Talk naturally in English, Marathi, or Hindi
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Language Dropdown */}
            <select
              className="input-text"
              value={forcedLang}
              onChange={(e) => setForcedLang(e.target.value as any)}
              style={{ fontSize: 11.5, padding: "3px 8px" }}
            >
              <option value="auto">🌐 Auto Detect</option>
              <option value="mr">🇮🇳 मराठी</option>
              <option value="hi">🇮🇳 हिन्दी</option>
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
                color: "var(--text-muted)",
                padding: "2px 6px"
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
                ? "rgba(198, 40, 40, 0.08)"
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
          {status === "LISTENING" && <span>● Listening... Speak naturally</span>}
          {status === "PROCESSING" && <span>⏳ Understanding your question...</span>}
          {status === "SPEAKING" && <span>🔊 Kisan Setu is speaking...</span>}
          {status === "IDLE" && <span>Talk to Kisan Setu — Tap microphone or type a question</span>}
          {status === "ERROR" && <span style={{ color: "var(--color-urgent)" }}>⚠️ {errorMessage || "Could not understand speech."}</span>}
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                background: m.sender === "user" ? "var(--primary-800)" : "var(--surface-muted)",
                color: m.sender === "user" ? "#ffffff" : "var(--text-main)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: 13.5,
                lineHeight: 1.5,
                border: m.sender === "user" ? "none" : "1px solid var(--border-subtle)"
              }}
            >
              {m.sender === "user" && <div style={{ fontSize: 10.5, opacity: 0.8, marginBottom: 2 }}>You said:</div>}
              {m.sender === "assistant" && <div style={{ fontSize: 10.5, color: "var(--primary-800)", fontWeight: 700, marginBottom: 2 }}>Kisan Setu:</div>}
              {m.text}
            </div>
          ))}

          {/* Live Transcript Stream */}
          {transcript && status === "LISTENING" && (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                background: "rgba(30, 136, 229, 0.12)",
                border: "1px stroke var(--border-subtle)",
                color: "var(--text-main)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                fontStyle: "italic"
              }}
            >
              "{transcript}..."
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div style={{ padding: "8px 16px", background: "var(--surface-bg)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Try asking:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="btn-outline-sm"
                style={{ fontSize: 11, padding: "3px 8px", borderRadius: "var(--radius-sm)" }}
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

        {/* Control Footer */}
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
                  border: "1px solid var(--border-subtle)",
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
                  fontSize: 13.5,
                  fontWeight: 600
                }}
              >
                🎙️ Tap to Speak (EN / MR / HI)
              </button>
            )}
          </div>

          {/* Text Fallback Form */}
          <form onSubmit={handleTextSubmit} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              className="input-text"
              placeholder="Or type your question here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ flex: 1, fontSize: 12.5 }}
            />
            <button type="submit" className="btn-outline-sm" style={{ padding: "0 12px" }}>
              Send
            </button>
          </form>

          {/* Privacy Hint */}
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
            🔒 Voice is active only when you tap the microphone.
          </div>
        </div>
      </div>
    </div>
  );
}

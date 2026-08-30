import { useState } from "react";
import VoiceAssistantModal from "./VoiceAssistantModal";
import { AssistantContext } from "../../services/voice/intentEngine";
import { Tab } from "../../App";

interface Props {
  context: AssistantContext;
  onNavigateTab: (tab: Tab) => void;
}

export default function VoiceFloatingButton({ context, onNavigateTab }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Start Voice Assistant"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1500,
          background: "var(--primary-800)",
          color: "#ffffff",
          border: "none",
          borderRadius: 28,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 14px rgba(10, 31, 24, 0.25)",
          cursor: "pointer",
          fontSize: 13.5,
          fontWeight: 600,
          transition: "transform 0.15s ease, background 0.15s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      >
        <span style={{ fontSize: 18 }}>🎙️</span>
        <span>Ask Kisan Sarthi</span>
      </button>

      <VoiceAssistantModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
        onNavigateTab={(tab) => {
          onNavigateTab(tab);
        }}
      />
    </>
  );
}

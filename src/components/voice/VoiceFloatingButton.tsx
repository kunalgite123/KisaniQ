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
        title="Ask in Marathi or English"
        className="voice-floating-btn"
        style={{
          background: "var(--primary-800)",
          color: "#ffffff",
          border: "1px solid var(--primary-900)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          transition: "background 0.15s ease"
        }}
      >
        <span style={{ fontSize: 16 }}>🎙️</span>
        <span>Ask Kisan Setu</span>
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

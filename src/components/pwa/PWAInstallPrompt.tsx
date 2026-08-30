import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user previously dismissed
      const dismissed = localStorage.getItem("krishi_pwa_prompt_dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("krishi_pwa_prompt_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 74,
        left: 16,
        right: 16,
        maxWidth: 420,
        margin: "0 auto",
        background: "var(--surface-card)",
        border: "1.5px solid var(--primary-700)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        animation: "slideUp 0.3s ease-out"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "var(--radius-sm)",
            background: "var(--primary-100)",
            color: "var(--primary-800)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <Smartphone size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
            {isMr ? "कृषी सेतू अ‍ॅप इन्स्टॉल करा" : "Install Krishi Setu App"}
          </h4>
          <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "2px 0 0 0" }}>
            {isMr ? "होम स्क्रीनवर त्वरित आणि ऑफलाईन वापरासाठी जोडा." : "Add to home screen for instant & offline access."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleInstallClick}
          className="btn-primary-sm"
          style={{ padding: "6px 12px", fontSize: 12 }}
        >
          <Download size={13} />
          <span>{isMr ? "इन्स्टॉल" : "Install"}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center"
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

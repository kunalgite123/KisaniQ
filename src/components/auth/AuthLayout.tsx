import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Sun, Moon } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="auth-container" style={{ position: "relative" }}>
      {/* Top Right Controls: Light/Dark Mode Switcher + Language Selector */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 100
        }}
      >
        {/* Language Switcher Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-full)",
            padding: 3,
            boxShadow: "var(--shadow-sm)"
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
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            style={{
              background: language === "hi" ? "var(--primary-700)" : "transparent",
              color: language === "hi" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setLanguage("mr")}
            style={{
              background: language === "mr" ? "var(--primary-700)" : "transparent",
              color: language === "mr" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            मराठी
          </button>
        </div>

        {/* Light & Dark Mode Switcher Pill */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: theme === "dark" ? "var(--primary-900)" : "var(--surface-card)",
            color: theme === "dark" ? "var(--primary-500)" : "var(--text-main)",
            border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--radius-full)",
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "var(--shadow-md)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
        </button>
      </div>

      <div className="auth-card-grid">
        {/* Left Branding Side (Desktop) */}
        <div className="auth-brand-side">
          <div className="auth-brand-content">
            <div className="auth-logo-badge" style={{ width: 54, height: 54, borderRadius: 10, overflow: "hidden", border: "2px solid #ffffff", padding: 0 }}>
              <img src="/farmer_logo.jpg" alt="Krishi Setu Farmer" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            </div>
            <h1 className="auth-brand-title">Krishi Setu</h1>
            <p className="auth-brand-sub">AI-Powered Farm Intelligence</p>
            <p style={{ marginTop: 24, fontSize: 14, color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
              Observe • Understand • Decide • Act. Join thousands of farmers optimizing crop health, groundwater, and climate risk.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">{children}</div>
      </div>
    </div>
  );
}

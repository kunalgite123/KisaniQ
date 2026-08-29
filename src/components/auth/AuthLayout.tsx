import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="auth-container">
      <div className="auth-card-grid">
        {/* Left Branding Side (Desktop) */}
        <div className="auth-brand-side">
          <div className="auth-brand-content">
            <div className="auth-logo-badge">Q</div>
            <h1 className="auth-brand-title">KisaniQ</h1>
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

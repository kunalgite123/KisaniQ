import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import { Sprout } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

type AuthView = "login" | "signup" | "forgot" | "reset";

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>("login");

  // Check URL query / hash for reset-password link
  React.useEffect(() => {
    if (window.location.pathname === "/reset-password" || window.location.hash.includes("type=recovery")) {
      setAuthView("reset");
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16
        }}
      >
        <div className="auth-logo-badge" style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", border: "2px solid var(--primary-600)", padding: 0 }}>
          <img src="/farmer_logo.jpg" alt="Kisan Sarthi Farmer" className="brand-logo-img" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary-900)" }}>Kisan Sarthi</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Loading authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === "signup") {
      return <SignupPage onNavigateToLogin={() => setAuthView("login")} />;
    }
    if (authView === "forgot") {
      return <ForgotPasswordPage onNavigateToLogin={() => setAuthView("login")} />;
    }
    if (authView === "reset") {
      return <ResetPasswordPage onSuccess={() => setAuthView("login")} />;
    }
    return (
      <LoginPage
        onNavigateToSignup={() => setAuthView("signup")}
        onNavigateToForgotPassword={() => setAuthView("forgot")}
      />
    );
  }

  return <>{children}</>;
}

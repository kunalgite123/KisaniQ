import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

interface Props {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

export default function LoginPage({ onNavigateToSignup, onNavigateToForgotPassword }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email address and password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-wrapper">
        <h2 className="auth-form-title">Welcome back 👋</h2>
        <p className="auth-form-sub">Sign in to access your Kisan Sarthi farm intelligence dashboard</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="form-link-btn"
                onClick={onNavigateToForgotPassword}
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer-text">
          Don't have an account?{" "}
          <button type="button" className="auth-switch-btn" onClick={onNavigateToSignup}>
            Create account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

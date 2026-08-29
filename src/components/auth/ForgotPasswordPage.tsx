import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

interface Props {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordPage({ onNavigateToLogin }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await resetPassword(email);
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-wrapper">
        <h2 className="auth-form-title">Forgot your password?</h2>
        <p className="auth-form-sub">Enter your email and we'll send you a link to reset your password</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        {submitted ? (
          <div style={{ marginTop: 20 }}>
            <div className="auth-alert auth-alert-success">
              If an account exists for {email}, a password reset link has been sent. Please check your inbox.
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onNavigateToLogin}
              style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={submitting}>
              {submitting ? "Sending reset link..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button type="button" className="auth-switch-btn" onClick={onNavigateToLogin}>
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

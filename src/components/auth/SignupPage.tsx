import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

interface Props {
  onNavigateToLogin: () => void;
}

export default function SignupPage({ onNavigateToLogin }: Props) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!hasMinLen || !hasUpper || !hasLower || !hasNum) {
      setError("Please meet all password requirements before signing up.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await signUp(fullName, email, cleanPhone, password);
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else if (res.needsConfirmation) {
      setSuccessMsg("Account created successfully! Please check your email inbox to confirm your account before logging in.");
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-wrapper">
        <h2 className="auth-form-title">Create your Krishi Setu account</h2>
        <p className="auth-form-sub">Start receiving personalized AI farm advisories today</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. Kunal Gite"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <label className="form-label" htmlFor="phone">
              Mobile Number
            </label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

            <div className="password-rules-box">
              <div className={`rule-item ${hasMinLen ? "valid" : ""}`}>
                {hasMinLen ? "✓" : "○"} At least 8 characters
              </div>
              <div className={`rule-item ${hasUpper ? "valid" : ""}`}>
                {hasUpper ? "✓" : "○"} One uppercase letter (A-Z)
              </div>
              <div className={`rule-item ${hasLower ? "valid" : ""}`}>
                {hasLower ? "✓" : "○"} One lowercase letter (a-z)
              </div>
              <div className={`rule-item ${hasNum ? "valid" : ""}`}>
                {hasNum ? "✓" : "○"} One number (0-9)
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account?{" "}
          <button type="button" className="auth-switch-btn" onClick={onNavigateToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

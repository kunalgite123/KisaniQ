import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

interface Props {
  onSuccess: () => void;
}

export default function ResetPasswordPage({ onSuccess }: Props) {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNum = /[0-9]/.test(newPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasMinLen || !hasUpper || !hasLower || !hasNum) {
      setError("Please meet all password requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await updatePassword(newPassword);
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      onSuccess();
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-wrapper">
        <h2 className="auth-form-title">Reset your password</h2>
        <p className="auth-form-sub">Enter a new secure password for your Kisan Sarthi account</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={submitting}>
            {submitting ? "Updating password..." : "Update Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

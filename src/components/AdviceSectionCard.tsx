import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AdviceReview, saveAdviceCompletion, saveAdviceReview } from "../data/farmerProfile";
import { CheckCircle2, Circle, ThumbsUp, ThumbsDown, Sparkles, X } from "lucide-react";

export interface AdviceItemProps {
  id: string;
  category: string;
  title: string;
  recommendation: string;
  reason: string;
  avoid?: string;
  timeframe: string;
  urgency?: "urgent" | "watch" | "healthy" | "HIGH" | "MEDIUM" | "LOW";
  confidencePct?: number;
  initialCompleted?: boolean;
  initialReview?: AdviceReview | null;
  onCompletionToggle?: (id: string, completed: boolean) => void;
  onReviewSubmit?: (review: AdviceReview) => void;
}

export default function AdviceSectionCard({
  id,
  category,
  title,
  recommendation,
  reason,
  avoid,
  timeframe,
  urgency = "watch",
  confidencePct = 88,
  initialCompleted = false,
  initialReview = null,
  onCompletionToggle,
  onReviewSubmit
}: AdviceItemProps) {
  const { t, language } = useLanguage();
  const isMr = language === "mr";

  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<"helpful" | "unhelpful" | "neutral">(
    initialReview?.rating || "helpful"
  );
  const [stars, setStars] = useState<number>(initialReview?.stars || 5);
  const [comment, setComment] = useState<string>(initialReview?.comment || "");
  const [reviewSaved, setReviewSaved] = useState(!!initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urgencyBadgeClass =
    urgency === "urgent" || urgency === "HIGH"
      ? "badge-urgent"
      : urgency === "watch" || urgency === "MEDIUM"
      ? "badge-watch"
      : "badge-healthy";

  async function handleToggleCompletion() {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    await saveAdviceCompletion(id, nextState);
    if (onCompletionToggle) {
      onCompletionToggle(id, nextState);
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const reviewData: AdviceReview = {
      adviceId: id,
      rating: selectedRating,
      stars,
      comment,
      timestamp: new Date().toISOString()
    };

    await saveAdviceReview(reviewData);
    setIsSubmitting(false);
    setReviewSaved(true);
    setShowReviewModal(false);
    if (onReviewSubmit) {
      onReviewSubmit(reviewData);
    }
  }

  return (
    <div
      style={{
        background: isCompleted ? "rgba(45, 106, 79, 0.04)" : "var(--surface-card)",
        border: isCompleted ? "2px solid var(--primary-700)" : "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        marginBottom: 16,
        boxShadow: isCompleted ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative"
      }}
    >
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`badge ${urgencyBadgeClass}`} style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: "999px" }}>
            {urgency === "urgent" || urgency === "HIGH" ? (isMr ? "उच्च प्राधान्य" : "HIGH PRIORITY") : urgency === "watch" || urgency === "MEDIUM" ? (isMr ? "लक्ष ठेवा" : "MONITOR") : (isMr ? "अनुकूल" : "STABLE")}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {category}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-muted)" }}>
            ⏳ {timeframe}
          </span>
          {confidencePct && (
            <span className="badge badge-healthy" style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px" }}>
              🎯 {confidencePct}% {t("confidence")}
            </span>
          )}
        </div>
      </div>

      {/* Main Action Content */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
        {/* Interactive Completion Toggle Checkbox */}
        <button
          onClick={handleToggleCompletion}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: isCompleted ? "var(--primary-700)" : "var(--text-muted)",
            marginTop: 2,
            transition: "transform 0.2s ease"
          }}
          title={isCompleted ? "Completed" : "Mark as Completed"}
        >
          {isCompleted ? <CheckCircle2 size={28} style={{ color: "var(--primary-700)" }} /> : <Circle size={28} style={{ strokeWidth: 1.5 }} />}
        </button>

        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: isCompleted ? "var(--primary-900)" : "var(--text-main)",
              margin: 0,
              lineHeight: 1.35,
              textDecoration: isCompleted ? "line-through" : "none"
            }}
          >
            {recommendation || title}
          </h4>

          <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-main)" }}>{isMr ? "कारण / तपशील:" : "Why?"}</strong> {reason}
          </p>

          {avoid && (
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--alert-red)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚠️</span> <span>{isMr ? "काय टाळावे:" : "Avoid:"}</span> {avoid}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions: Completion Status + Feedback / Review Control */}
      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 14,
          borderTop: "1px dashed var(--border-subtle)"
        }}
      >
        {/* Action Completion Button */}
        <button
          onClick={handleToggleCompletion}
          className={isCompleted ? "btn-primary" : "btn-outline"}
          style={{
            fontSize: 12.5,
            padding: "6px 16px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          {isCompleted ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {isCompleted ? (isMr ? "पूर्ण झाले ✓" : "Completed ✓") : (isMr ? "पूर्ण झाले म्हणून टिक करा" : "Mark as Completed")}
        </button>

        {/* Advice Feedback & Rating Trigger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>
            {isMr ? "हा सल्ला योग्य वाटला का?" : "Was this advice proper?"}
          </span>
          <button
            onClick={() => { setSelectedRating("helpful"); setShowReviewModal(true); }}
            className="filter-chip"
            style={{
              background: reviewSaved && selectedRating === "helpful" ? "var(--primary-700)" : undefined,
              color: reviewSaved && selectedRating === "helpful" ? "#ffffff" : undefined,
              borderColor: reviewSaved && selectedRating === "helpful" ? "var(--primary-700)" : undefined,
              display: "flex",
              alignItems: "center",
              gap: 5
            }}
          >
            <ThumbsUp size={13} /> {isMr ? "योग्य (होय)" : "Proper"}
          </button>
          <button
            onClick={() => { setSelectedRating("unhelpful"); setShowReviewModal(true); }}
            className="filter-chip"
            style={{
              background: reviewSaved && selectedRating === "unhelpful" ? "rgba(220, 38, 38, 0.1)" : undefined,
              color: reviewSaved && selectedRating === "unhelpful" ? "var(--alert-red)" : undefined,
              borderColor: reviewSaved && selectedRating === "unhelpful" ? "var(--alert-red)" : undefined,
              display: "flex",
              alignItems: "center",
              gap: 5
            }}
          >
            <ThumbsDown size={13} /> {isMr ? "सुधारणा" : "Improve"}
          </button>
          {reviewSaved && (
            <span style={{ fontSize: 11.5, color: "var(--primary-700)", fontWeight: 800 }}>
              ✓ {isMr ? "अभिप्राय सेव्ह झाला" : "Review Saved"}
            </span>
          )}
        </div>
      </div>

      {/* Advice Review & Rating Modal Popup (Aesthetic Farmer-Centric Design) */}
      {showReviewModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 25, 20, 0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justify: "center",
            padding: 16
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              maxWidth: 440,
              width: "100%",
              padding: "28px 30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              border: "1px solid var(--border-subtle)",
              position: "relative",
              animation: "fadeIn 0.2s ease"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  FARMER ADVICE REVIEW
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--primary-900)", margin: 0, marginTop: 4 }}>
                  {isMr ? "सल्ल्याबद्दल तुमचा अभिप्राय द्या" : "Rate & Review Advice Quality"}
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  background: "var(--surface-muted)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justify: "center",
                  cursor: "pointer",
                  color: "var(--text-muted)"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              {/* Pill Selectors for Advice Quality */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: 10 }}>
                  {isMr ? "तुम्हाला हा सल्ला कसा वाटला?" : "How would you rate this advice?"}
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 999,
                      border: selectedRating === "helpful" ? "none" : "1.5px solid var(--border-strong)",
                      background: selectedRating === "helpful" ? "linear-gradient(135deg, #2D6A4F, #1B4332)" : "#ffffff",
                      color: selectedRating === "helpful" ? "#ffffff" : "var(--text-main)",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      gap: 8,
                      boxShadow: selectedRating === "helpful" ? "0 4px 14px rgba(45, 106, 79, 0.3)" : "none",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => setSelectedRating("helpful")}
                  >
                    🔥 {isMr ? "योग्य सल्ला" : "Proper Advice"}
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 999,
                      border: selectedRating === "unhelpful" ? "1.5px solid var(--alert-red)" : "1.5px solid var(--border-strong)",
                      background: selectedRating === "unhelpful" ? "var(--alert-red-bg)" : "#ffffff",
                      color: selectedRating === "unhelpful" ? "var(--alert-red)" : "var(--text-main)",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      gap: 8,
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => setSelectedRating("unhelpful")}
                  >
                    👎 {isMr ? "सुधारणा आवश्यक" : "Needs Improvement"}
                  </button>
                </div>
              </div>

              {/* Star Rating Bar */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: 8 }}>
                  {isMr ? "स्टार रेटिंग (१ ते ५):" : "Star Rating"}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStars(s)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 26,
                        color: s <= stars ? "#F59E0B" : "#E2E8F0",
                        padding: 0,
                        transition: "transform 0.15s ease"
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Note Input */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: 6 }}>
                  {isMr ? "तुमची टिप्पणी (ऐच्छिक):" : "Your Review Note (Optional):"}
                </label>
                <textarea
                  rows={3}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid var(--border-strong)",
                    padding: 12,
                    fontSize: 13.5,
                    fontFamily: "inherit",
                    color: "var(--text-main)",
                    outline: "none",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.03)"
                  }}
                  placeholder={isMr ? "उदा. या सल्ल्याने माझ्या शेताचे पाणी वाचले..." : "e.g. This postponed irrigation saved canal water..."}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid var(--border-strong)",
                    borderRadius: 999,
                    padding: "9px 20px",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: "linear-gradient(135deg, #2D6A4F, #1B4332)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 999,
                    padding: "9px 24px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(45, 106, 79, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  {isSubmitting ? "Saving..." : "✓ Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

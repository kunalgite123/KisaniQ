import { useState, useMemo } from "react";
import PageHeader from "./PageHeader";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { ClimateRisk } from "../lib/weather";
import { GOVERNMENT_SCHEMES } from "../data/schemesData";
import { evaluateSchemeRelevance, SchemeEvaluationResult } from "../lib/schemeMatching";
import { useLanguage } from "../context/LanguageContext";
import SchemeCard from "./schemes/SchemeCard";
import SchemeDetailModal from "./schemes/SchemeDetailModal";

interface Props {
  village?: Village | null;
  cropName?: string | null;
  detectedDisease?: DiseaseInfo | null;
  climateRisk?: ClimateRisk | null;
}

type CategoryFilter = "all" | "income" | "insurance" | "irrigation" | "soil" | "market";

export default function Schemes({ village, cropName, detectedDisease, climateRisk }: Props) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeEvaluationResult | null>(null);

  const locationText = village
    ? `${village.name}, Kopargaon`
    : "Kopargaon Taluka";

  const evaluatedSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES.map((scheme) =>
      evaluateSchemeRelevance(scheme, village ?? null, cropName ?? null, detectedDisease ?? null, climateRisk ?? null)
    );
  }, [village, cropName, detectedDisease, climateRisk]);

  const recommendedSchemes = useMemo(() => {
    return [...evaluatedSchemes].sort((a, b) => {
      const order = { "High Relevance": 3, "Good Match": 2, "Relevant": 1, "Explore": 0 };
      return order[b.relevanceLabel] - order[a.relevanceLabel];
    });
  }, [evaluatedSchemes]);

  const filteredSchemes = useMemo(() => {
    return recommendedSchemes.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.scheme.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.scheme.name.toLowerCase().includes(q) ||
        item.scheme.shortName.toLowerCase().includes(q) ||
        item.scheme.categoryLabel.toLowerCase().includes(q) ||
        item.scheme.summary.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [recommendedSchemes, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Clean Page Title */}
      <PageHeader
        title={t("gov_schemes_title")}
        subtitle={t("gov_schemes_subtitle")}
      />

      {/* Clean Farm Location & Context Banner */}
      <div className="card" style={{ marginBottom: 24, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="section-label">{t("farm_scheme_matching_label")}</span>
              <span className="badge badge-healthy" style={{ fontSize: 11.5, padding: "3px 10px" }}>
                📍 {locationText}
              </span>
              {cropName && (
                <span className="badge badge-watch" style={{ fontSize: 11.5, padding: "3px 10px" }}>
                  🌱 {cropName}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginTop: 6 }}>
              {t("personalized_gov_support")}
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 640 }}>
              {t("matched_against_desc")}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("active_schemes_stat")}</div>
            </div>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("categories_stat")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for Your Farm */}
      <div style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div>
            <span className="section-label">{t("top_recommendations_label")}</span>
            <h3 className="section-title">{t("recommended_for_your_farm")}</h3>
          </div>
        </div>

        <div className="grid-2">
          {recommendedSchemes.slice(0, 2).map((item) => (
            <SchemeCard
              key={item.scheme.id}
              evaluation={item}
              onOpenDetail={() => setActiveModalScheme(item)}
            />
          ))}
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input
              type="text"
              className="form-input"
              placeholder={t("search_schemes_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className={`btn ${selectedCategory === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("all")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              {t("all_schemes_chip")}
            </button>
            <button
              className={`btn ${selectedCategory === "income" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("income")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              💰 {t("income_support_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "insurance" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("insurance")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🛡️ {t("crop_insurance_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "irrigation" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("irrigation")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              💧 {t("irrigation_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "soil" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("soil")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🌱 {t("soil_health_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "market" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("market")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🏪 {t("market_access_tag")}
            </button>
          </div>
        </div>
      </div>

      {/* All Schemes Grid */}
      <div style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <span className="section-label">{t("gov_portal_catalog_label")}</span>
            <h3 className="section-title">{t("explore_all_schemes")} ({filteredSchemes.length})</h3>
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <h4 style={{ fontSize: 18, marginTop: 8 }}>No matching schemes found</h4>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Try adjusting your search query or category filter.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{ marginTop: 14 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {filteredSchemes.map((item) => (
              <SchemeCard
                key={item.scheme.id}
                evaluation={item}
                onOpenDetail={() => setActiveModalScheme(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Government Source & Verification Disclaimer Notice */}
      <div
        style={{
          background: "var(--surface-muted)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: 16,
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        {t("gov_disclaimer_notice")}
      </div>

      {/* Detailed Modal Drawer */}
      {activeModalScheme && (
        <SchemeDetailModal
          evaluation={activeModalScheme}
          onClose={() => setActiveModalScheme(null)}
        />
      )}
    </div>
  );
}

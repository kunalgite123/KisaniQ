import { useState, useMemo } from "react";
import PageHeader from "./PageHeader";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { ClimateRisk } from "../lib/weather";
import { GOVERNMENT_SCHEMES, SchemeCategory } from "../data/schemesData";
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

type CategoryFilter = "all" | SchemeCategory;

export default function Schemes({ village, cropName, detectedDisease, climateRisk }: Props) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeEvaluationResult | null>(null);

  // Interactive Farmer Inputs
  const [interactiveCrop, setInteractiveCrop] = useState<string>(cropName || "all");
  const [interactiveSoil, setInteractiveSoil] = useState<string>("all");
  const [interactiveDisruption, setInteractiveDisruption] = useState<string>("all");

  const locationText = village
    ? `${village.name}, Kopargaon`
    : "Kopargaon Taluka";

  const evaluatedSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES.map((scheme) =>
      evaluateSchemeRelevance(
        scheme,
        village ?? null,
        cropName ?? null,
        detectedDisease ?? null,
        climateRisk ?? null,
        {
          crop: interactiveCrop,
          soil: interactiveSoil,
          disruption: interactiveDisruption
        }
      )
    );
  }, [village, cropName, detectedDisease, climateRisk, interactiveCrop, interactiveSoil, interactiveDisruption]);

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

      // Disruption tag matching if selected in interactive dropdown
      const matchesDisruption =
        interactiveDisruption === "all" ||
        (interactiveDisruption === "side-income" && item.scheme.category === "side-income") ||
        (item.scheme.disruptionTags && item.scheme.disruptionTags.includes(interactiveDisruption));

      return matchesCategory && matchesQuery && (interactiveDisruption === "all" || matchesDisruption);
    });
  }, [recommendedSchemes, selectedCategory, searchQuery, interactiveDisruption]);

  return (
    <div>
      {/* Clean Page Title */}
      <PageHeader
        title={t("gov_schemes_title")}
        subtitle={t("gov_schemes_subtitle")}
      />

      {/* Clean Farm Location & Context Banner */}
      <div className="card" style={{ marginBottom: 20, padding: "20px 24px" }}>
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
              {t("personalized_gov_support")} ({GOVERNMENT_SCHEMES.length} Programmes)
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 640 }}>
              {t("matched_against_desc")} Tailored for crop insurance, drip subsidies, soil health, and side-income businesses (Fisheries, Livestock, Agri-Processing).
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>{GOVERNMENT_SCHEMES.length}</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("active_schemes_stat")}</div>
            </div>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>11</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("categories_stat")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FARMER SELECTION FORM */}
      <div className="card" style={{ marginBottom: 24, border: "1px solid var(--primary-200)", background: "var(--surface-card)" }}>
        <div className="card-header" style={{ marginBottom: 12 }}>
          <div>
            <span className="section-label" style={{ color: "var(--primary-800)" }}>🎯 INTERACTIVE SCHEME FINDER</span>
            <h3 className="section-title" style={{ fontSize: 16 }}>What support does your farm need today?</h3>
          </div>
        </div>

        <div className="grid-3" style={{ gap: 14 }}>
          {/* 1. Crop Selection */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)", display: "block", marginBottom: 4 }}>
              🌾 Select Your Crop
            </label>
            <select
              className="form-input"
              value={interactiveCrop}
              onChange={(e) => setInteractiveCrop(e.target.value)}
              style={{ width: "100%", fontSize: 13 }}
            >
              <option value="all">All Crops</option>
              <option value="Cotton">Cotton (Kharif)</option>
              <option value="Sugarcane">Sugarcane (Perennial)</option>
              <option value="Onion">Onion (Kharif / Late Kharif)</option>
              <option value="Soybean">Soybean</option>
              <option value="Wheat">Wheat (Rabi)</option>
            </select>
          </div>

          {/* 2. Soil Selection */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)", display: "block", marginBottom: 4 }}>
              🌱 Select Soil Type
            </label>
            <select
              className="form-input"
              value={interactiveSoil}
              onChange={(e) => setInteractiveSoil(e.target.value)}
              style={{ width: "100%", fontSize: 13 }}
            >
              <option value="all">All Soil Types</option>
              <option value="Medium Black (Kopargaon)">Medium Black Soil (Kopargaon)</option>
              <option value="Deep Black Soil">Deep Black Soil (Regur)</option>
              <option value="Coarse Shallow Soil">Coarse Shallow Soil</option>
              <option value="Red / Loamy Soil">Red / Loamy Soil</option>
            </select>
          </div>

          {/* 3. Disruption / Support Need */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)", display: "block", marginBottom: 4 }}>
              🚨 Disruption / Need Support For
            </label>
            <select
              className="form-input"
              value={interactiveDisruption}
              onChange={(e) => setInteractiveDisruption(e.target.value)}
              style={{ width: "100%", fontSize: 13, fontWeight: interactiveDisruption === "side-income" ? 700 : 500 }}
            >
              <option value="all">All Support Needs</option>
              <option value="side-income">💼 Side Income &amp; Allied Business Subsidies (Fish/Goat/Dairy/Processing)</option>
              <option value="drought">🌧 Deficit Rain &amp; Drought Risk</option>
              <option value="pest">🐛 Pest &amp; Disease Outbreak</option>
              <option value="water">💧 Groundwater &amp; Water Scarcity</option>
              <option value="inputs">💰 Seed &amp; Fertilizer Input Costs</option>
              <option value="market">🏪 Selling Produce &amp; Mandi Prices</option>
            </select>
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
          {recommendedSchemes.slice(0, 4).map((item) => (
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text"
            className="form-input"
            placeholder={t("search_schemes_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: "auto", paddingBottom: 4 }}>
            <button
              className={`btn ${selectedCategory === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("all")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              {t("all_schemes_chip")}
            </button>
            <button
              className={`btn ${selectedCategory === "side-income" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("side-income")}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700 }}
            >
              💼 Side Income Subsidies (3)
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
              Try adjusting your search query or reset the interactive disruption filter.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setInteractiveDisruption("all");
                setInteractiveSoil("all");
                setInteractiveCrop("all");
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

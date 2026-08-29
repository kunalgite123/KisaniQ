import { useState, useMemo } from "react";
import PageHeader from "./PageHeader";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { ClimateRisk } from "../lib/weather";
import { GOVERNMENT_SCHEMES, SchemeCategory } from "../data/schemesData";
import { evaluateSchemeRelevance, SchemeEvaluationResult } from "../lib/schemeMatching";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeEvaluationResult | null>(null);

  const locationText = village
    ? `${village.name}, Kopargaon Taluka, Ahmednagar`
    : "Kopargaon Taluka (Centre), Ahmednagar, Maharashtra";

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
        title="Government Schemes & Benefits"
        subtitle="Discover official support, insurance, irrigation, groundwater, pest monitoring, and market services for your farm."
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
<<<<<<< HEAD
              {t("personalized_gov_support")}
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 640 }}>
              {t("matched_against_desc")}
=======
              Personalized Government Support ({GOVERNMENT_SCHEMES.length} Programmes &amp; Services)
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 640 }}>
              Matched against your active crop, soil profile, Kopargaon groundwater table, disease diagnostics, and satellite weather forecast.
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
<<<<<<< HEAD
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("active_schemes_stat")}</div>
            </div>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>{t("categories_stat")}</div>
=======
              <div className="readout-value" style={{ fontSize: 20 }}>{GOVERNMENT_SCHEMES.length}</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>Official Programmes</div>
            </div>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>10</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>Categories</div>
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
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
<<<<<<< HEAD
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
=======
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search government schemes, insurance, groundwater or pest monitoring services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: "auto", paddingBottom: 4 }}>
            <button
              className={`btn ${selectedCategory === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("all")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
<<<<<<< HEAD
              {t("all_schemes_chip")}
=======
              All Support ({GOVERNMENT_SCHEMES.length})
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
            </button>
            <button
              className={`btn ${selectedCategory === "income" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("income")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              💰 {t("income_support_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "insurance" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("insurance")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🛡️ {t("crop_insurance_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "climate" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("climate")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🌦️ Climate Risk
            </button>
            <button
              className={`btn ${selectedCategory === "irrigation" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("irrigation")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
<<<<<<< HEAD
              💧 {t("irrigation_tag")}
=======
              💧 Micro-Irrigation
            </button>
            <button
              className={`btn ${selectedCategory === "groundwater" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("groundwater")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              💧 Groundwater
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
            </button>
            <button
              className={`btn ${selectedCategory === "soil" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("soil")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🌱 {t("soil_health_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "pest-disease" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("pest-disease")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🐛 Pest &amp; Disease
            </button>
            <button
              className={`btn ${selectedCategory === "market" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("market")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🏪 {t("market_access_tag")}
            </button>
            <button
              className={`btn ${selectedCategory === "employment" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("employment")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              👷 Labour &amp; Assets
            </button>
            <button
              className={`btn ${selectedCategory === "monitoring" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("monitoring")}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              📡 Pest Surveillance
            </button>
          </div>
        </div>
      </div>

      {/* All Schemes Grid */}
      <div style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
<<<<<<< HEAD
            <span className="section-label">{t("gov_portal_catalog_label")}</span>
            <h3 className="section-title">{t("explore_all_schemes")} ({filteredSchemes.length})</h3>
=======
            <span className="section-label">GOVERNMENT PORTAL CATALOG</span>
            <h3 className="section-title">Explore All Government Schemes &amp; Services ({filteredSchemes.length})</h3>
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <h4 style={{ fontSize: 18, marginTop: 8 }}>No matching government programmes found</h4>
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
<<<<<<< HEAD
        {t("gov_disclaimer_notice")}
=======
        <strong>🏛 Government Source &amp; Verification Notice:</strong> Scheme, programme and digital service information is compiled from official Government of India and Maharashtra portals (pmkisan.gov.in, pmfby.gov.in, pmksy.gov.in, soilhealth.dac.gov.in, enam.gov.in, ppqs.gov.in, gsda.maharashtra.gov.in, nrega.nic.in, nriipm.res.in) for guidance. Eligibility, notified crops/areas, benefits, deadlines, participation conditions and implementation status may change. Always verify the latest information on the official government portal before taking action.
>>>>>>> e5e88cb51fe82e11d22ca87dfe0976716469aa9d
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

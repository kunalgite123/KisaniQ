import { useState, useMemo } from "react";
import PageHeader from "./PageHeader";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { ClimateRisk } from "../lib/weather";
import { GOVERNMENT_SCHEMES } from "../data/schemesData";
import { evaluateSchemeRelevance, SchemeEvaluationResult } from "../lib/schemeMatching";
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
        subtitle="Discover official support, insurance, irrigation, soil health, and market access services for your farm."
      />

      {/* Clean Farm Location & Context Banner */}
      <div className="card" style={{ marginBottom: 24, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="section-label">FARM SCHEME MATCHING</span>
              <span className="badge badge-healthy" style={{ fontSize: 11.5, padding: "3px 10px" }}>
                📍 {locationText}
              </span>
              {cropName && (
                <span className="badge badge-watch" style={{ fontSize: 11.5, padding: "3px 10px" }}>
                  🌱 {cropName} Crop
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginTop: 6 }}>
              Personalized Government Support
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 640 }}>
              Matched against your active crop, soil profile, Kopargaon groundwater table, and satellite weather forecast.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>Active Schemes</div>
            </div>
            <div className="readout" style={{ padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
              <div className="readout-value" style={{ fontSize: 20 }}>5</div>
              <div className="readout-label" style={{ marginTop: 2, fontSize: 11 }}>Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for Your Farm */}
      <div style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div>
            <span className="section-label">TOP RECOMMENDATIONS</span>
            <h3 className="section-title">Recommended for Your Farm</h3>
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
              placeholder="Search government schemes by name, category or keyword..."
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
              All Schemes
            </button>
            <button
              className={`btn ${selectedCategory === "income" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("income")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              💰 Income Support
            </button>
            <button
              className={`btn ${selectedCategory === "insurance" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("insurance")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🛡️ Crop Insurance
            </button>
            <button
              className={`btn ${selectedCategory === "irrigation" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("irrigation")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              💧 Irrigation
            </button>
            <button
              className={`btn ${selectedCategory === "soil" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("soil")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🌱 Soil Health
            </button>
            <button
              className={`btn ${selectedCategory === "market" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory("market")}
              style={{ padding: "6px 14px", fontSize: 12.5 }}
            >
              🏪 Market Access
            </button>
          </div>
        </div>
      </div>

      {/* All Schemes Grid */}
      <div style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <span className="section-label">GOVERNMENT PORTAL CATALOG</span>
            <h3 className="section-title">Explore All Government Schemes ({filteredSchemes.length})</h3>
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
        <strong>🏛 Government Source &amp; Verification Notice:</strong> Scheme information is compiled from official Government of India portals (pmkisan.gov.in, pmfby.gov.in, pmksy.gov.in, soilhealth.dac.gov.in, enam.gov.in) for guidance. Eligibility, benefits, deadlines, notified crops/areas and application requirements may change. Please verify the latest official information on the respective government portal before applying.
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

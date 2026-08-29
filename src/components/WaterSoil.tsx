import { villages, Village, waterSourceLabel } from "../data/villages";
import { kopargaonProfile, cropBenchmarks } from "../data/groundSoil";
import PageHeader from "./PageHeader";

interface Props {
  village: Village | null;
  onSelectVillage: (village: Village | null) => void;
}

export default function WaterSoil({ village, onSelectVillage }: Props) {
  return (
    <div>
      <PageHeader
        title="Water &amp; Soil Intelligence"
        subtitle="Groundwater level trends, canal reach proximity and soil quality profile"
      />

      <div className="card">
        <div className="section-label">Village location selector</div>
        <h3 className="section-title">Select your village in Kopargaon taluka</h3>

        <div style={{ marginTop: 14, maxWidth: 420 }}>
          <select
            className="select"
            value={village?.name ?? ""}
            onChange={(e) => {
              const selected = villages.find((v) => v.name === e.target.value) ?? null;
              onSelectVillage(selected);
            }}
          >
            <option value="">-- Select Village --</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {village && (
          <div className="grid-2" style={{ marginTop: 18 }}>
            <div className="readout">
              <div className="readout-label">Primary Irrigation Source</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                <span className={`tag ${village.waterSourceType}`}>{waterSourceLabel[village.waterSourceType]}</span>
              </div>
              <div className="readout-label" style={{ marginTop: 12 }}>
                Distance to Godavari River
              </div>
              <div className="readout-value" style={{ fontSize: 24, marginTop: 2 }}>
                {village.distanceToGodavariKm.toFixed(1)} km
              </div>
            </div>

            <div className="readout">
              <div className="readout-label">CGWB Artificial Recharge Site</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                {village.proposedRecharge ? "Yes — Listed for Percolation Tank / Recharge Shaft" : "Standard Monitoring Site"}
              </div>
              <div className="readout-label" style={{ marginTop: 12 }}>
                Taluka Groundwater Status
              </div>
              <div style={{ fontSize: 14, marginTop: 2, color: "var(--text-main)", fontWeight: 600 }}>
                ↘ Semi-Critical (-0.41 m/yr post-monsoon decline)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="section-label">CGWB Hydrogeological Survey · Kopargaon Block (2018-19)</div>
        <h3 className="section-title">Block Groundwater &amp; Soil Baseline</h3>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSharePct}%</div>
            <div className="readout-label">Net Cropped Area under Irrigation</div>
          </div>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSourceSplit.wellOrLiftPct}%</div>
            <div className="readout-label">Irrigation from Wells &amp; Borewells</div>
          </div>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSourceSplit.canalPct}%</div>
            <div className="readout-label">Irrigation from Canal System</div>
          </div>
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>Soil Composition Breakdown</h4>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Soil Type</th>
                <th>Coverage Share (%)</th>
                <th>Agronomic Characteristic</th>
              </tr>
            </thead>
            <tbody>
              {kopargaonProfile.soilComposition.map((s) => (
                <tr key={s.type}>
                  <td style={{ fontWeight: 600 }}>{s.type}</td>
                  <td className="mono">{s.sharePct}%</td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>Major Crop Yield Benchmarks</h4>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Current Yield (t/ha)</th>
                <th>Potential Yield (t/ha)</th>
                <th>Yield Gap</th>
                <th>Key Intervention</th>
              </tr>
            </thead>
            <tbody>
              {cropBenchmarks.map((b) => (
                <tr key={b.crop}>
                  <td style={{ fontWeight: 600 }}>{b.crop}</td>
                  <td className="mono">{b.existingTPerHa}</td>
                  <td className="mono">{b.potentialTPerHa}</td>
                  <td className="mono">+{b.gapTPerHa}</td>
                  <td>{b.keyIntervention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

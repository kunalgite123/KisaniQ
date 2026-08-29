import { Village, villages } from "../data/villages";
import { Tab } from "../App";

interface Props {
  currentTab: Tab;
  village: Village | null;
  onSelectVillage: (v: Village | null) => void;
}

const TAB_TITLES: Record<Tab, { title: string; breadcrumb: string }> = {
  dashboard: { title: "Dashboard", breadcrumb: "Home / Dashboard" },
  crop: { title: "Crop Doctor", breadcrumb: "Home / Crop Doctor" },
  climate: { title: "Climate Risk", breadcrumb: "Home / Climate" },
  water: { title: "Water & Soil Intelligence", breadcrumb: "Home / Water & Soil" },
  advisory: { title: "AI Farm Advisory", breadcrumb: "Home / Advisory" },
  schemes: { title: "Agriculture Schemes", breadcrumb: "Home / Schemes" }
};

export default function TopNavbar({ currentTab, village, onSelectVillage }: Props) {
  const currentInfo = TAB_TITLES[currentTab] ?? { title: "KisaniQ", breadcrumb: "Home" };

  return (
    <header className="top-navbar">
      {/* Left Breadcrumb & Page Title */}
      <div className="navbar-left">
        <div>
          <div className="breadcrumb-box">{currentInfo.breadcrumb}</div>
          <div className="breadcrumb-current">{currentInfo.title}</div>
        </div>
      </div>

      {/* Right Location Selector & Live Badge */}
      <div className="navbar-right">
        <div className="location-select-box">
          <span>📍</span>
          <select
            value={village?.name ?? ""}
            onChange={(e) => {
              const sel = villages.find((v) => v.name === e.target.value) ?? null;
              onSelectVillage(sel);
            }}
          >
            <option value="">Kopargaon (Taluka Centre)</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="live-badge">
          <span className="status-dot-green" />
          <span>Live Data</span>
        </div>

        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "var(--surface-muted)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px"
          }}
        >
          👨‍🌾
        </div>
      </div>
    </header>
  );
}

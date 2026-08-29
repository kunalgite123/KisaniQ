import { useState } from "react";
import { Village, villages } from "../data/villages";
import { Tab } from "../App";
import { useAuth } from "../context/AuthContext";

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
  machinery: { title: "Labour & Machinery Monitoring", breadcrumb: "Home / Labour & Machinery" },
  schemes: { title: "Agriculture Schemes", breadcrumb: "Home / Schemes" }
};

export default function TopNavbar({ currentTab, village, onSelectVillage }: Props) {
  const { profile, user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const currentInfo = TAB_TITLES[currentTab] ?? { title: "KisaniQ", breadcrumb: "Home" };

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Farmer";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "KQ";

  return (
    <header className="top-navbar">
      {/* Left Breadcrumb & Page Title */}
      <div className="navbar-left">
        <div>
          <div className="breadcrumb-box">{currentInfo.breadcrumb}</div>
          <div className="breadcrumb-current">{currentInfo.title}</div>
        </div>
      </div>

      {/* Right Location Selector, Live Badge & Profile Menu */}
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

        {/* User Profile Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary-700)",
              color: "#ffffff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)"
            }}
            title={fullName}
          >
            {userInitials}
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu">
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-main)" }}>{fullName}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.email}
                </div>
              </div>

              <div style={{ padding: 4 }}>
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    signOut();
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

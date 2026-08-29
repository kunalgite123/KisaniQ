import { useState } from "react";
import { Village, villages } from "../data/villages";
import { Tab } from "../App";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { MapPin, Sun, Moon, LogOut } from "lucide-react";

interface Props {
  currentTab: Tab;
  village: Village | null;
  onSelectVillage: (v: Village | null) => void;
}

export default function TopNavbar({ currentTab, village, onSelectVillage }: Props) {
  const { profile, user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const titleKey = `title_${currentTab}` as const;
  const currentTitle = t(titleKey as any) || "Krishi Setu";

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Farmer";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "KS";

  return (
    <header className="top-navbar">
      {/* Left Breadcrumb & Page Title */}
      <div className="navbar-left">
        <div>
          <div className="breadcrumb-box">Krishi Setu / {currentTitle}</div>
          <div className="breadcrumb-current">{currentTitle}</div>
        </div>
      </div>

      {/* Right Location Selector, Language Toggle, Live Badge & Profile */}
      <div className="navbar-right">
        {/* Location Selector */}
        <div className="location-select-box">
          <MapPin size={14} style={{ color: "var(--primary-500)" }} />
          <select
            value={village?.name ?? ""}
            onChange={(e) => {
              const sel = villages.find((v) => v.name === e.target.value) ?? null;
              onSelectVillage(sel);
            }}
          >
            <option value="">{t("location_label")}</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector Button beside Location Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface-muted)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-full)",
            padding: "2px",
            fontSize: 12
          }}
        >
          <button
            type="button"
            onClick={() => setLanguage("en")}
            style={{
              background: language === "en" ? "var(--primary-700)" : "transparent",
              color: language === "en" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("mr")}
            style={{
              background: language === "mr" ? "var(--primary-700)" : "transparent",
              color: language === "mr" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            मराठी
          </button>
        </div>

        {/* Dark Mode Theme Switcher Pill beside Language Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: theme === "dark" ? "var(--primary-900)" : "var(--surface-muted)",
            color: theme === "dark" ? "var(--primary-500)" : "var(--text-main)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-full)",
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: theme === "dark" ? "0 0 10px rgba(132, 204, 22, 0.2)" : "none"
          }}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <div className="live-badge">
          <span className="status-dot-green" />
          <span>{t("live_data")}</span>
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
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

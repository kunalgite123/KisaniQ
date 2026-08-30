import { useState } from "react";
import { Village, villages } from "../data/villages";
import { Tab } from "../App";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { MapPin, Sun, Moon, LogOut, Globe, TrendingUp } from "lucide-react";

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
        <div className="location-select-box" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
          <MapPin size={14} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
          <select
            value={village?.name ?? ""}
            onChange={(e) => {
              const sel = villages.find((v) => v.name === e.target.value) ?? null;
              onSelectVillage(sel);
            }}
            style={{ width: "auto", minWidth: 110, textOverflow: "ellipsis" }}
          >
            <option value="">{t("location_label")}</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Market Prices External Link Button */}
        <a
          href="https://kisan-saarthi-jade.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-sm"
          style={{
            textDecoration: "none",
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            background: "#1B7A5A",
            color: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            whiteSpace: "nowrap",
            height: 36,
            borderRadius: "var(--radius-sm)"
          }}
          title={language === "mr" ? "बाजार भाव तपासा" : "Check Live Mandi Market Prices"}
        >
          <TrendingUp size={14} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap" }}>{language === "mr" ? "बाजार भाव" : "Market Prices"} ↗</span>
        </a>

        {/* i18next Language Switcher Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface-muted)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "2px 4px",
            fontSize: 12,
            gap: 2,
            flexShrink: 0,
            whiteSpace: "nowrap",
            height: 36
          }}
          title="Toggle Language / भाषा बदला"
        >
          <Globe size={13} style={{ marginLeft: 4, marginRight: 2, color: "var(--primary-800)", flexShrink: 0 }} />
          <button
            type="button"
            onClick={() => setLanguage("en")}
            style={{
              background: language === "en" ? "var(--primary-800)" : "transparent",
              color: language === "en" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-xs)",
              padding: "4px 8px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            style={{
              background: language === "hi" ? "var(--primary-800)" : "transparent",
              color: language === "hi" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-xs)",
              padding: "4px 8px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setLanguage("mr")}
            style={{
              background: language === "mr" ? "var(--primary-800)" : "transparent",
              color: language === "mr" ? "#ffffff" : "var(--text-muted)",
              border: "none",
              borderRadius: "var(--radius-xs)",
              padding: "4px 8px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
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
            boxShadow: theme === "dark" ? "0 0 10px rgba(132, 204, 22, 0.2)" : "none",
            flexShrink: 0,
            whiteSpace: "nowrap",
            height: 36
          }}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

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

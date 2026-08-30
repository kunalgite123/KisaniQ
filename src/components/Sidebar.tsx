import { Tab } from "../App";
import { useLanguage } from "../context/LanguageContext";
import {
  LayoutGrid,
  Stethoscope,
  CloudSun,
  Droplets,
  Tractor,
  Building2,
  Lightbulb,
  BarChart3,
  ShieldCheck,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Props {
  currentTab: Tab;
  onSelectTab: (tab: Tab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedVillageName: string | null;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  selectedVillageName
}: Props) {
  const { t, language } = useLanguage();

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: "dashboard", label: t("nav_dashboard"), icon: <LayoutGrid size={18} />, description: t("nav_desc_dashboard") },
    { id: "crop", label: t("nav_crop"), icon: <Stethoscope size={18} />, description: t("nav_desc_crop") },
    { id: "climate", label: t("nav_climate"), icon: <CloudSun size={18} />, description: t("nav_desc_climate") },
    { id: "water", label: t("nav_water"), icon: <Droplets size={18} />, description: t("nav_desc_water") },
    { id: "machinery", label: t("nav_machinery"), icon: <Tractor size={18} />, description: t("nav_desc_machinery") },
    { id: "schemes", label: t("nav_schemes"), icon: <Building2 size={18} />, description: t("nav_desc_schemes") },
    { id: "advisory", label: t("nav_advisory"), icon: <Lightbulb size={18} />, description: t("nav_desc_advisory") },
    { id: "impact", label: t("nav_impact"), icon: <BarChart3 size={18} />, description: t("nav_desc_impact") },
    { id: "trust", label: t("nav_trust"), icon: <ShieldCheck size={18} />, description: t("nav_desc_trust") }
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Brand Area */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo-box">
            <img src="/farmer_logo.jpg" alt="Krishi Setu Farmer" className="brand-logo-img" />
          </div>
          {!collapsed && (
            <div className="brand-text-box">
              <span className="brand-name">Krishi Setu</span>
              <span className="brand-subtitle">Farm Intelligence</span>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Body */}
      <div className="sidebar-nav-body">
        <div>
          {!collapsed && <div className="nav-group-label">{t("main_navigation")}</div>}
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-nav-item ${currentTab === item.id ? "active" : ""}`}
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : item.description}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {!collapsed && <span style={{ fontWeight: 600 }}>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Compact Farm Location Widget */}
        {!collapsed && (
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <div className="nav-group-label" style={{ fontSize: 11, letterSpacing: "0.04em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
              {language === "mr" ? "शेत स्थान" : "FARM LOCATION"}
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-muted)",
                border: "1px solid var(--border-subtle)",
                fontSize: 12.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 8
              }}
            >
              <MapPin size={15} style={{ color: "var(--primary-800)", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-main)", lineHeight: 1.3 }}>
                  📍 {selectedVillageName ? selectedVillageName : "Kopargaon"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {language === "mr" ? "तालुका केंद्र · अहिल्यानगर" : "Taluka Centre · Ahilyanagar"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

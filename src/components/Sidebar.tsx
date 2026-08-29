import { Tab } from "../App";
import { useLanguage } from "../context/LanguageContext";
import {
  LayoutDashboard,
  Stethoscope,
  CloudSun,
  Droplets,
  Tractor,
  Landmark,
  Bot,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sprout
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
  const { t } = useLanguage();

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: "dashboard", label: t("nav_dashboard"), icon: <LayoutDashboard size={18} />, description: t("nav_desc_dashboard") },
    { id: "crop", label: t("nav_crop"), icon: <Stethoscope size={18} />, description: t("nav_desc_crop") },
    { id: "climate", label: t("nav_climate"), icon: <CloudSun size={18} />, description: t("nav_desc_climate") },
    { id: "water", label: t("nav_water"), icon: <Droplets size={18} />, description: t("nav_desc_water") },
    { id: "machinery", label: t("nav_machinery"), icon: <Tractor size={18} />, description: t("nav_desc_machinery") },
    { id: "schemes", label: t("nav_schemes"), icon: <Landmark size={18} />, description: t("nav_desc_schemes") },
    { id: "advisory", label: t("nav_advisory"), icon: <Bot size={18} />, description: t("nav_desc_advisory") }
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
              <span className="brand-subtitle">AI Farm Intelligence</span>
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
                  {!collapsed && <span style={{ fontWeight: 700 }}>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Farm Section */}
        {!collapsed && (
          <div>
            <div className="nav-group-label">{t("farm_location")}</div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-muted)",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <MapPin size={16} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {selectedVillageName ? selectedVillageName : "Kopargaon Block"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("district_name")}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer System Status */}
      <div className="sidebar-footer">
        <div className="system-status-box">
          <span className="status-dot-green" />
          {!collapsed ? (
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: 12 }}>{t("system_status_online")}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{t("all_systems_ok")}</div>
            </div>
          ) : (
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--primary-700)" }}>OK</span>
          )}
        </div>
      </div>
    </aside>
  );
}

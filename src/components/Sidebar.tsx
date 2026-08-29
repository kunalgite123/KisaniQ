import { Tab } from "../App";

interface Props {
  currentTab: Tab;
  onSelectTab: (tab: Tab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedVillageName: string | null;
}

interface NavConfig {
  id: Tab;
  label: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", description: "Farm overview & today's intelligence" },
  { id: "crop", label: "Crop Doctor", icon: "🌱", description: "Crop health & disease detection" },
  { id: "climate", label: "Climate", icon: "🌦️", description: "Weather & climate risk" },
  { id: "water", label: "Water & Soil", icon: "💧", description: "Groundwater & soil intelligence" },
  { id: "machinery", label: "Labour & Machinery", icon: "🚜", description: "Rent & list farm equipment & labour" },
  { id: "schemes", label: "Schemes", icon: "🏛️", description: "Government agriculture schemes" },
  { id: "advisory", label: "Advisory", icon: "🤖", description: "AI-powered recommendations" }
];

export default function Sidebar({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  selectedVillageName
}: Props) {
  return (
    <aside className="sidebar">
      {/* Sidebar Brand Area */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo-box">K</div>
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
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Navigation Body */}
      <div className="sidebar-nav-body">
        <div>
          {!collapsed && <div className="nav-group-label">Main Navigation</div>}
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-nav-item ${currentTab === item.id ? "active" : ""}`}
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : item.description}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Farm Section */}
        {!collapsed && (
          <div>
            <div className="nav-group-label">Farm Location</div>
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
              <span>📍</span>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {selectedVillageName ? selectedVillageName : "Kopargaon Block"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Ahilyanagar, MH</div>
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
              <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: 12 }}>Krishi Setu AI Online</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>All systems operational</div>
            </div>
          ) : (
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--primary-700)" }}>OK</span>
          )}
        </div>
      </div>
    </aside>
  );
}

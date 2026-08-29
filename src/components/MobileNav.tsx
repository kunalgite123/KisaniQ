import { Tab } from "../App";

interface Props {
  currentTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

export default function MobileNav({ currentTab, onSelectTab }: Props) {
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn ${currentTab === "dashboard" ? "active" : ""}`}
        onClick={() => onSelectTab("dashboard")}
      >
        <span className="mobile-nav-icon">🏠</span>
        <span>Overview</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "crop" ? "active" : ""}`}
        onClick={() => onSelectTab("crop")}
      >
        <span className="mobile-nav-icon">🌱</span>
        <span>Crop Doctor</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "machinery" ? "active" : ""}`}
        onClick={() => onSelectTab("machinery")}
      >
        <span className="mobile-nav-icon">🚜</span>
        <span>Machinery</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "water" ? "active" : ""}`}
        onClick={() => onSelectTab("water")}
      >
        <span className="mobile-nav-icon">💧</span>
        <span>Water &amp; Soil</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "climate" ? "active" : ""}`}
        onClick={() => onSelectTab("climate")}
      >
        <span className="mobile-nav-icon">🌦️</span>
        <span>Climate</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "advisory" ? "active" : ""}`}
        onClick={() => onSelectTab("advisory")}
      >
        <span className="mobile-nav-icon">🤖</span>
        <span>Advisory</span>
      </button>
    </nav>
  );
}

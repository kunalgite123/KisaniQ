import { Tab } from "../App";
import { useLanguage } from "../context/LanguageContext";
import { LayoutDashboard, Stethoscope, Tractor, Droplets, CloudSun, Bot } from "lucide-react";

interface Props {
  currentTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

export default function MobileNav({ currentTab, onSelectTab }: Props) {
  const { t } = useLanguage();

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn ${currentTab === "dashboard" ? "active" : ""}`}
        onClick={() => onSelectTab("dashboard")}
      >
        <span className="mobile-nav-icon"><LayoutDashboard size={18} /></span>
        <span>{t("nav_dashboard")}</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "crop" ? "active" : ""}`}
        onClick={() => onSelectTab("crop")}
      >
        <span className="mobile-nav-icon"><Stethoscope size={18} /></span>
        <span>{t("nav_crop")}</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "machinery" ? "active" : ""}`}
        onClick={() => onSelectTab("machinery")}
      >
        <span className="mobile-nav-icon"><Tractor size={18} /></span>
        <span>{t("nav_machinery")}</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "water" ? "active" : ""}`}
        onClick={() => onSelectTab("water")}
      >
        <span className="mobile-nav-icon"><Droplets size={18} /></span>
        <span>{t("nav_water")}</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "climate" ? "active" : ""}`}
        onClick={() => onSelectTab("climate")}
      >
        <span className="mobile-nav-icon"><CloudSun size={18} /></span>
        <span>{t("nav_climate")}</span>
      </button>

      <button
        className={`mobile-nav-btn ${currentTab === "advisory" ? "active" : ""}`}
        onClick={() => onSelectTab("advisory")}
      >
        <span className="mobile-nav-icon"><Bot size={18} /></span>
        <span>{t("nav_advisory")}</span>
      </button>
    </nav>
  );
}

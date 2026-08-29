import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import MobileNav from "./components/MobileNav";
import Dashboard from "./components/Dashboard";
import CropHealth from "./components/CropHealth";
import WaterSoil from "./components/WaterSoil";
import ClimateView from "./components/ClimateView";
import AdvisoryPage from "./components/AdvisoryPage";
import Schemes from "./components/Schemes";
import LabourMachinery from "./components/LabourMachinery";
import VoiceFloatingButton from "./components/voice/VoiceFloatingButton";
import { Village } from "./data/villages";
import { CropModel, DiseaseInfo } from "./data/cropModels";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "./lib/weather";

export type Tab = "dashboard" | "crop" | "climate" | "water" | "advisory" | "schemes" | "machinery";

function MainAppContent() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [village, setVillage] = useState<Village | null>(null);
  const [cropName, setCropName] = useState<string | null>(null);
  const [detectedDisease, setDetectedDisease] = useState<DiseaseInfo | null>(null);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [risk, setRisk] = useState<ClimateRisk | null>(null);

  useEffect(() => {
    fetchKopargaonWeather()
      .then((snap) => {
        setWeather(snap);
        setRisk(assessClimateRisk(snap));
      })
      .catch((err) => {
        console.warn("Could not fetch background weather for voice assistant:", err);
      });
  }, []);

  function handleCropResult(crop: CropModel, disease: DiseaseInfo | null) {
    setCropName(crop.name);
    setDetectedDisease(disease);
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Left Sidebar Shell */}
      <Sidebar
        currentTab={tab}
        onSelectTab={setTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedVillageName={village?.name ?? null}
      />

      {/* Main Right Shell Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <TopNavbar
          currentTab={tab}
          village={village}
          onSelectVillage={setVillage}
        />

        {/* Dynamic Page Content View */}
        <main className="page-content-area">
          {tab === "dashboard" && (
            <Dashboard
              village={village}
              detectedDisease={detectedDisease}
              cropName={cropName}
              onNavigateTab={(targetTab) => setTab(targetTab as Tab)}
            />
          )}
          {tab === "crop" && <CropHealth onResult={handleCropResult} />}
          {tab === "climate" && (
            <ClimateView
              village={village}
              cropName={cropName}
              onNavigateTab={(targetTab) => setTab(targetTab as Tab)}
            />
          )}
          {tab === "water" && (
            <WaterSoil
              village={village}
              onSelectVillage={setVillage}
              cropName={cropName}
              onNavigateTab={(targetTab) => setTab(targetTab as Tab)}
            />
          )}
          {tab === "advisory" && (
            <AdvisoryPage
              climateRisk={null}
              village={village}
              detectedDisease={detectedDisease}
              cropName={cropName}
            />
          )}
          {tab === "schemes" && (
            <Schemes
              village={village}
              cropName={cropName}
              detectedDisease={detectedDisease}
            />
          )}
          {tab === "machinery" && <LabourMachinery />}
        </main>

        {/* App Footer */}
        <footer className="app-footer">
          Krishi Setu — Built for Smart India Hackathon Grand Finale 2026 · AI-Powered Farm Intelligence · Observe. Understand. Decide. Act.
        </footer>
      </div>

      {/* Multilingual Voice Navigation & Farm Assistant Floating Control */}
      <VoiceFloatingButton
        context={{
          village,
          cropName,
          detectedDisease,
          weather,
          risk,
          currentTab: tab
        }}
        onNavigateTab={(targetTab) => setTab(targetTab)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav currentTab={tab} onSelectTab={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <MainAppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

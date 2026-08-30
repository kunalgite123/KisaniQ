import { useState, useEffect } from "react";
import PageHeader from "./PageHeader";
import { villages } from "../data/villages";
import { useLanguage } from "../context/LanguageContext";
import {
  EquipmentCategory,
  MachineryListing,
  RentalBooking,
  INITIAL_MACHINERY_LISTINGS
} from "../data/machineryData";
import { PRICING_BENCHMARKS, getBenchmarkForService } from "../data/pricingBenchmarks";

const STORAGE_KEY_LISTINGS = "krishi_setu_machinery_listings_v3";
const STORAGE_KEY_BOOKINGS = "krishi_setu_machinery_bookings_v3";

export default function LabourMachinery() {
  const { t, language } = useLanguage();
  const isMr = language === "mr";

  const [listings, setListings] = useState<MachineryListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
    return saved ? JSON.parse(saved) : INITIAL_MACHINERY_LISTINGS;
  });

  const [bookings, setBookings] = useState<RentalBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Location & Filter States
  const [selectedLocation, setSelectedLocation] = useState("Kopargaon");
  const [selectedRadius, setSelectedRadius] = useState<number | "all">(10);
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeViewTab, setActiveViewTab] = useState<"browse" | "benchmarks" | "my_requests">("browse");

  // Selected Service for Detailed Drawer & Booking Modal
  const [selectedService, setSelectedService] = useState<MachineryListing | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Booking Form State
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterVillage, setRenterVillage] = useState("Kopargaon");
  const [preferredDate, setPreferredDate] = useState("");
  const [landAcres, setLandAcres] = useState<number | "">(4);
  const [bookingNotes, setBookingNotes] = useState("");

  // New Service Onboarding Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<EquipmentCategory>("tractor");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newVillage, setNewVillage] = useState("Kopargaon");
  const [newRate, setNewRate] = useState<number | "">(1000);
  const [newRateUnit, setNewRateUnit] = useState<"acre" | "hour" | "day" | "worker / day">("acre");
  const [newHpOrCapacity, setNewHpOrCapacity] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Persist State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Multilingual Search dictionary matching
  const marathiHindiTerms: Record<string, string[]> = {
    sprayer: ["फवारणी", "छिड़काव", "स्प्रेयर", "sprayer"],
    tractor: ["ट्रॅक्टर", "ट्रेक्टर", "tractor"],
    harvester: ["कापणी", "हार्वेस्टर", "कटाई", "harvester"],
    labour: ["मजूर", "कामगार", "लेबर", "labour", "gang"],
    implement: ["पेरणी", "रोटाव्हेटर", "नांगरणी", "implement", "rotavator"],
    transport: ["वाहतूक", "ट्रान्सपोर्ट", "गाडी", "transport"]
  };

  // Filter listings by category, location radius, and search term
  const filteredListings = listings.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.type === activeCategory;
    const matchesRadius = selectedRadius === "all" || item.distanceKm <= Number(selectedRadius);

    const q = searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (q) {
      const termMatches = Object.entries(marathiHindiTerms).some(([catKey, terms]) => {
        if (item.type === catKey && terms.some((t) => t.includes(q) || q.includes(t))) return true;
        return false;
      });

      matchesSearch =
        termMatches ||
        item.title.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.village.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
    }

    return matchesCategory && matchesRadius && matchesSearch;
  });

  // Calculate price range across nearby listings
  const validRates = filteredListings.map((l) => l.rate).filter((r) => r > 0);
  const minRate = validRates.length > 0 ? Math.min(...validRates) : 0;
  const maxRate = validRates.length > 0 ? Math.max(...validRates) : 0;

  function handleCreateListing(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newOwnerName || !newOwnerPhone || !newRate) {
      alert("Please fill in all required fields.");
      return;
    }

    const iconMap: Record<EquipmentCategory, string> = {
      tractor: "🚜",
      harvester: "🌾",
      implement: "⚙️",
      sprayer: "💨",
      labour: "👨‍🌾",
      irrigation: "💧",
      transport: "🚛"
    };

    const benchmark = getBenchmarkForService(newTitle);

    const newEntry: MachineryListing = {
      id: "custom_" + Date.now(),
      type: newType,
      title: newTitle,
      categoryLabel: newType === "labour" ? "Labour Crew" : `${newType.toUpperCase()} Unit`,
      ownerName: newOwnerName,
      ownerPhone: newOwnerPhone,
      village: newVillage,
      distanceKm: 2.4,
      rate: Number(newRate),
      rateUnit: newRateUnit,
      isProviderRate: true,
      referenceRate: benchmark ? benchmark.referenceRate : undefined,
      availableNow: true,
      isVerified: true,
      hpOrCapacity: newHpOrCapacity || "Standard Agricultural Spec",
      description: newDescription || "Available for farm operations in Kopargaon region.",
      icon: iconMap[newType] || "🚜",
      rating: 5.0,
      totalBookingsCount: 0
    };

    setListings([newEntry, ...listings]);
    setShowAddModal(false);
    triggerToast(`🎉 Listed "${newTitle}" with provider rate ₹${newRate}/${newRateUnit}!`);

    setNewTitle("");
    setNewOwnerName("");
    setNewOwnerPhone("");
    setNewHpOrCapacity("");
    setNewDescription("");
  }

  function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService) return;
    if (!renterName || !renterPhone || !preferredDate) {
      alert("Please enter your name, phone number, and preferred date.");
      return;
    }

    const area = Number(landAcres) || 1;
    const estCost = selectedService.rateUnit === "acre" ? selectedService.rate * area : selectedService.rate;

    const newBooking: RentalBooking = {
      id: "book_" + Date.now(),
      equipmentId: selectedService.id,
      equipmentTitle: selectedService.title,
      farmerName: renterName,
      farmerPhone: renterPhone,
      farmerVillage: renterVillage,
      startDate: preferredDate,
      endDate: preferredDate,
      landAcres: area,
      estimatedCost: estCost,
      notes: bookingNotes,
      status: "Requested",
      createdAt: new Date().toLocaleDateString("en-IN")
    };

    setBookings([newBooking, ...bookings]);
    triggerToast(`✅ Service request sent to ${selectedService.ownerName}! Estimated cost: ₹${estCost.toLocaleString("en-IN")}`);
    setSelectedService(null);

    setRenterName("");
    setRenterPhone("");
    setBookingNotes("");
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 1. Marketplace Header */}
      <PageHeader
        title={isMr ? "मजूर व यंत्रसामग्री शेती सेवा" : "Krishi Setu Farm Services"}
        subtitle={isMr ? "कोपरगाव परिसरातील शेत अवजारे, मजूर व कृषी सेवा पारदर्शक दरात शोधा." : "Find farm machinery, labour and agricultural services near Kopargaon with transparent, research-backed acre rates."}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* 2. Weather & Crop Aware Smart Recommendation Banner */}
      <div
        style={{
          background: "rgba(21, 128, 61, 0.06)",
          border: "1px solid rgba(21, 128, 61, 0.2)",
          borderRadius: "var(--radius-md)",
          padding: 16,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-800)", textTransform: "uppercase" }}>
            {isMr ? "हवामान व पीक सुसंगत यंत्रसामग्री शोधा" : "WEATHER & CROP INTELLIGENCE DISCOVERY"}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
            {isMr ? "🌤️ कोपरगाव परिसरात फवारणी व नांगरणी यंत्रसामग्री उपलब्ध — पॉवर स्प्रेअर ₹३००/एकड व रोटाव्हेटर ₹१,०००/एकड" : "🌤️ Dry Window Forecasted — Power Sprayer @ ₹300/acre & Rotavator @ ₹1,000/acre ready near Kopargaon"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {isMr ? "शासकीय व कृषी संशोधन आधारित प्रमाणित भाडे दर." : "Benchmark rates derived from published Indian agricultural machinery hiring references."}
          </div>
        </div>

        <button
          className="btn-primary-sm"
          onClick={() => {
            setActiveCategory("sprayer");
            setSelectedRadius(10);
          }}
          style={{ fontSize: 12 }}
        >
          {isMr ? "फवारणी सेवा पहा →" : "View Spraying Services →"}
        </button>
      </div>

      {/* 3. Location Selector & Control Bar */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          {/* Location Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>📍 {isMr ? "स्थान:" : "Location:"}</span>
            <select
              className="input-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ width: "auto", fontWeight: 700 }}
            >
              <option value="Kopargaon">📍 {isMr ? "कोपरगाव (मध्यवर्ती बाजार)" : "Kopargaon (Central Mandi)"}</option>
              <option value="Dhamori">📍 {isMr ? "धमोरी (३.० किमी)" : "Dhamori (3.0 km)"}</option>
              <option value="Takli">📍 {isMr ? "टाकळी (३.६ किमी)" : "Takli (3.6 km)"}</option>
              <option value="Ravande">📍 {isMr ? "रवांदे (५.९ किमी)" : "Ravande (5.9 km)"}</option>
              <option value="Shirdi">📍 {isMr ? "शिर्डी (१४ किमी)" : "Shirdi (14 km)"}</option>
            </select>

            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8 }}>{isMr ? "त्रिज्या:" : "Radius:"}</span>
            <select
              className="input-select"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value === "all" ? "all" : Number(e.target.value))}
              style={{ width: "auto" }}
            >
              <option value={5}>{isMr ? "५ किमीच्या आत" : "Within 5 km"}</option>
              <option value={10}>{isMr ? "१० किमीच्या आत" : "Within 10 km"}</option>
              <option value={20}>{isMr ? "२० किमीच्या आत" : "Within 20 km"}</option>
              <option value="all">{isMr ? "सर्व अंतर" : "All Distances"}</option>
            </select>
          </div>

          {/* Views & Subtabs */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "var(--surface-bg)", border: "1px solid var(--border-subtle)", padding: 3, borderRadius: "var(--radius-sm)" }}>
              <button
                className={`btn-subtab ${activeViewTab === "browse" && viewMode === "list" ? "active" : ""}`}
                onClick={() => {
                  setActiveViewTab("browse");
                  setViewMode("list");
                }}
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                📋 {isMr ? "बाजारपेठ यादी" : "Marketplace List"}
              </button>
              <button
                className={`btn-subtab ${activeViewTab === "browse" && viewMode === "map" ? "active" : ""}`}
                onClick={() => {
                  setActiveViewTab("browse");
                  setViewMode("map");
                }}
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                🗺️ {isMr ? "स्थान नकाशा" : "Location Map"}
              </button>
            </div>

            <button
              className={`btn-subtab ${activeViewTab === "benchmarks" ? "active" : ""}`}
              onClick={() => setActiveViewTab("benchmarks")}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              📊 {isMr ? "दर मूल्यमापन" : "Rate Benchmarks"}
            </button>

            <button
              className={`btn-subtab ${activeViewTab === "my_requests" ? "active" : ""}`}
              onClick={() => setActiveViewTab("my_requests")}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              {isMr ? `माझ्या विनंत्या (${bookings.length})` : `My Requests (${bookings.length})`}
            </button>

            <button className="btn-primary-sm" onClick={() => setShowAddModal(true)} style={{ fontSize: 12 }}>
              {isMr ? "+ नवीन सेवा नोंदवा" : "+ List Service"}
            </button>
          </div>
        </div>

        {/* Categories & Search Input Row */}
        {activeViewTab === "browse" && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
              <button
                className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                {isMr ? `सर्व उपकरणे (${filteredListings.length})` : `All (${filteredListings.length})`}
              </button>
              <button
                className={`filter-chip ${activeCategory === "sprayer" ? "active" : ""}`}
                onClick={() => setActiveCategory("sprayer")}
              >
                💨 {isMr ? "पावर स्प्रेअर (₹३००/एकर)" : "Power Sprayer (₹300/acre)"}
              </button>
              <button
                className={`filter-chip ${activeCategory === "tractor" ? "active" : ""}`}
                onClick={() => setActiveCategory("tractor")}
              >
                🚜 {isMr ? "ट्रॅक्टर व कल्टिव्हेटर (₹७००/एकर)" : "Cultivator (₹700/acre)"}
              </button>
              <button
                className={`filter-chip ${activeCategory === "implement" ? "active" : ""}`}
                onClick={() => setActiveCategory("implement")}
              >
                ⚙️ {isMr ? "रोटाव्हेटर (₹१,०००/एकर)" : "Rotavator (₹1,000/acre)"}
              </button>
              <button
                className={`filter-chip ${activeCategory === "harvester" ? "active" : ""}`}
                onClick={() => setActiveCategory("harvester")}
              >
                🌾 {isMr ? "हार्वेस्टर (₹१,९००/एकर)" : "Harvester (₹1,900/acre)"}
              </button>
              <button
                className={`filter-chip ${activeCategory === "labour" ? "active" : ""}`}
                onClick={() => setActiveCategory("labour")}
              >
                👨‍🌾 {isMr ? "मजूर टोळी" : "Labour Crews"}
              </button>
            </div>

            {/* Multilingual Search Bar */}
            <div style={{ width: 240 }}>
              <input
                type="text"
                className="input-text"
                placeholder={isMr ? "शोधा: स्प्रेअर, रोटाव्हेटर, मजूर..." : "Search sprayer, rotavator, मजूर..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: 12, padding: "6px 12px" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN BROWSE MARKETPLACE VIEW */}
      {activeViewTab === "browse" ? (
        viewMode === "list" ? (
          filteredListings.length === 0 ? (
            <div className="card text-center" style={{ padding: "40px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🚜</div>
              <h3>{isMr ? `${selectedLocation} जवळ सध्या कोणत्याही सेवा उपलब्ध नाहीत` : `No matching services near ${selectedLocation} right now`}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 13 }}>
                {isMr ? "कृपया शोधाची त्रिज्या वाढवा किंवा दर तक्ता पहा." : "Try increasing your search radius or view benchmark rates."}
              </p>
              <button
                className="btn-outline-sm"
                style={{ marginTop: 14 }}
                onClick={() => {
                  setActiveCategory("all");
                  setSelectedRadius("all");
                  setSearchQuery("");
                }}
              >
                {isMr ? "शोध फिल्टर रीसेट करा" : "Reset Search Filters"}
              </button>
            </div>
          ) : (
            <div>
              {/* Nearby Listed Range Banner */}
              {minRate > 0 && maxRate > 0 && (
                <div style={{ marginBottom: 14, fontSize: 12, color: "var(--text-muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    {isMr ? `${selectedLocation} जवळ ` : "Showing "}
                    <strong>{filteredListings.length}</strong>
                    {isMr ? " उपलब्ध सेवा दर्शवित आहे" : ` active service listings near ${selectedLocation}`}
                  </span>
                  <span>
                    {isMr ? "दर श्रेणी: " : "Nearby listed rate range: "}
                    <strong style={{ color: "var(--text-main)" }}>₹{minRate.toLocaleString("en-IN")} – ₹{maxRate.toLocaleString("en-IN")}</strong>
                  </span>
                </div>
              )}

              {/* Service Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 32 }}>
                {filteredListings.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)"
                      }}
                    >
                      <div>
                        {/* Category & Verification Badge */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span className="section-label" style={{ fontSize: 10 }}>
                            {isMr ? (item.categoryLabelMr || item.categoryLabel).toUpperCase() : item.categoryLabel.toUpperCase()}
                          </span>
                          {item.isVerified && (
                            <span className="badge badge-healthy" style={{ fontSize: 10, padding: "2px 8px" }}>
                              {isMr ? "✓ प्रमाणित पुरवठादार" : "✓ Verified Provider"}
                            </span>
                          )}
                        </div>

                        {/* Title & Location Distance */}
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                          {isMr ? (item.titleMr || item.title) : item.title}
                        </h3>
                        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                          📍 {item.village} · <strong>{isMr ? `तुमच्यापासून ${item.distanceKm} किमी` : `${item.distanceKm} km from you`}</strong>
                        </div>

                        {/* Provider & Job Count */}
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                          👤 <strong>{item.ownerName}</strong> · ⭐ {item.rating} ({isMr ? `${item.totalBookingsCount} पूर्ण झालेली कामे` : `${item.totalBookingsCount} completed jobs`})
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {isMr ? (item.descriptionMr || item.description) : item.description}
                        </p>

                        {/* Spec Tag */}
                        <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-main)", background: "var(--surface-bg)", padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                          ⚡ <strong>{isMr ? "वैशिष्ट्ये:" : "Spec:"}</strong> {isMr ? (item.hpOrCapacityMr || item.hpOrCapacity) : item.hpOrCapacity}
                        </div>
                      </div>

                      {/* Pricing Section with Transparent Metadata Tag */}
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>{isMr ? "सेवा दर" : "SERVICE RATE"}</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>
                            ₹{item.rate.toLocaleString("en-IN")}{" "}
                            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>
                              / {isMr ? (item.rateUnitMr || (item.rateUnit === "acre" ? "एकर" : item.rateUnit === "day" ? "दिवस" : item.rateUnit)) : item.rateUnit}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: "var(--primary-800)", fontWeight: 600, marginTop: 2 }}>
                            {item.isProviderRate ? (isMr ? "पुरवठादाराने दिलेला दर" : "Provider listed rate") : (isMr ? "मानक संदर्भ दर" : "Typical reference rate")}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                          {item.ownerPhone && (
                            <a
                              href={`tel:${item.ownerPhone}`}
                              className="btn-outline-sm"
                              style={{ fontSize: 12, padding: "5px 10px" }}
                            >
                              📞 {isMr ? "कॉल करा" : "Call"}
                            </a>
                          )}
                          <button
                            className="btn-primary-sm"
                            onClick={() => setSelectedService(item)}
                            style={{ fontSize: 12, padding: "5px 12px" }}
                          >
                            {isMr ? "सेवा मागवा" : "Request Service"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          /* Map View */
          <div className="card" style={{ padding: 20, marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                  Kopargaon Service Location Map
                </h3>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Showing {filteredListings.length} verified providers near Kopargaon
                </span>
              </div>
              <span className="badge badge-healthy" style={{ fontSize: 11 }}>
                📍 Central Reference: Kopargaon Mandi
              </span>
            </div>

            <div
              style={{
                height: 380,
                width: "100%",
                background: "#f0fdf4",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 800 380" style={{ position: "absolute", inset: 0 }}>
                <circle cx="400" cy="190" r="70" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="190" r="140" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="190" r="210" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

                <path d="M 50 140 Q 250 180 400 170 T 750 210" fill="none" stroke="#2563eb" strokeWidth="6" opacity="0.4" />
                <text x="600" y="225" fill="#2563eb" fontSize="11" fontWeight="700" opacity="0.7">
                  ~ Godavari River Basin
                </text>

                <circle cx="400" cy="190" r="8" fill="#064e3b" />
                <text x="412" y="194" fill="#064e3b" fontSize="12" fontWeight="800">
                  📍 Kopargaon (You)
                </text>

                {filteredListings.map((item, idx) => {
                  const angle = (idx * (360 / Math.max(1, filteredListings.length)) * Math.PI) / 180;
                  const radius = Math.min(220, Math.max(50, item.distanceKm * 20));
                  const cx = 400 + radius * Math.cos(angle);
                  const cy = 190 + radius * Math.sin(angle);

                  return (
                    <g key={item.id} style={{ cursor: "pointer" }} onClick={() => setSelectedService(item)}>
                      <circle cx={cx} cy={cy} r="16" fill="#15803d" opacity="0.9" />
                      <text x={cx} y={cy + 5} textAnchor="middle" fill="#ffffff" fontSize="11">
                        {item.icon}
                      </text>
                      <text x={cx} y={cy - 20} textAnchor="middle" fill="#17201b" fontSize="10" fontWeight="700">
                        {item.village} (₹{item.rate}/{item.rateUnit})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )
      ) : activeViewTab === "benchmarks" ? (
        /* 5. RESEARCH-BACKED RATE BENCHMARKS TAB */
        <div className="card" style={{ padding: 22, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <div>
              <span className="section-label" style={{ fontSize: 10 }}>RESEARCH-BACKED REFERENCE BENCHMARKS</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                Indian Agricultural Machinery Custom Hiring Reference Rates
              </h3>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                Indicative benchmarks derived from published Indian farm-machinery hiring references (2026).
              </p>
            </div>
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              Published Market References (2026)
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {PRICING_BENCHMARKS.map((bm) => (
              <div
                key={bm.serviceKey}
                style={{
                  padding: 14,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {bm.category.replace("_", " ")}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                  {bm.serviceName}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--primary-900)", marginTop: 4 }}>
                  ₹{bm.referenceRate.toLocaleString("en-IN")} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)" }}>/ {bm.pricingUnit}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>
                  Source: {bm.sourceNote} ({bm.lastReviewed})
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 6. MY REQUESTS TAB */
        <div className="card" style={{ padding: 22, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                My Service Requests
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Track active requests sent to local service providers near Kopargaon
              </p>
            </div>
            <span className="badge badge-healthy" style={{ fontSize: 12 }}>
              {bookings.length} Total Requests
            </span>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: "40px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No service requests submitted yet. Select a spraying or harvester service from the browse list above!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-bg)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-main)" }}>
                      🚜 {booking.equipmentTitle}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                      Farmer: <strong>{booking.farmerName}</strong> ({booking.farmerPhone}) · 📍 {booking.farmerVillage}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                      🗓️ Preferred Date: <strong>{booking.startDate}</strong> · Field Area: <strong>{booking.landAcres} Acres</strong>
                    </div>
                    {booking.notes && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
                        Note: "{booking.notes}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className="badge badge-healthy" style={{ fontSize: 12, marginBottom: 6 }}>
                      Status: {booking.status}
                    </span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", marginTop: 4 }}>
                      Est. Total: ₹{booking.estimatedCost.toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                      Submitted {booking.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. MARKETPLACE-LEVEL PRICING DISCLAIMER FOOTER */}
      <div style={{ fontSize: 11.5, color: "var(--text-muted)", textAlign: "center", padding: "14px 20px", background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 32, lineHeight: 1.5 }}>
        ℹ️ <strong>Pricing Disclaimer:</strong> Reference rates are indicative benchmarks based on published Indian agricultural machinery hiring references. Actual provider prices may vary by location, crop, field condition, distance, season and service requirements. Payment terms are settled directly between farmers and service providers.
      </div>

      {/* --- MODAL 1: REQUEST SERVICE & FARM-SIZE COST ESTIMATOR --- */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <div>
                <span className="section-label" style={{ fontSize: 10 }}>REQUEST AGRICULTURAL SERVICE</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, marginTop: 2 }}>
                  {selectedService.title}
                </h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedService(null)}>
                ✕
              </button>
            </div>

            <div style={{ background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 16, fontSize: 12.5 }}>
              <div>👤 Provider: <strong>{selectedService.ownerName}</strong> ({selectedService.ownerPhone})</div>
              <div>📍 Location: <strong>{selectedService.village} ({selectedService.distanceKm} km from you)</strong></div>
              <div>
                💰 Service Rate: <strong>₹{selectedService.rate.toLocaleString("en-IN")} / {selectedService.rateUnit}</strong>{" "}
                <span className="badge badge-healthy" style={{ fontSize: 10, marginLeft: 6 }}>
                  {selectedService.isProviderRate ? "Provider listed rate" : "Typical reference rate"}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Kisan Name"
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-text"
                    placeholder="+91 98XXX XXXXX"
                    value={renterPhone}
                    onChange={(e) => setRenterPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    className="input-text"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Field Area (Acres)</label>
                  <input
                    type="number"
                    className="input-text"
                    value={landAcres}
                    onChange={(e) => setLandAcres(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Farm Village</label>
                <select
                  className="input-select"
                  value={renterVillage}
                  onChange={(e) => setRenterVillage(e.target.value)}
                >
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Note for Service Provider</label>
                <textarea
                  className="input-text"
                  rows={2}
                  placeholder="Specify crop type (e.g. Sugarcane, Onion) or field location instructions..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>

              {/* Real Marketplace Estimated Price Calculation */}
              <div style={{ background: "rgba(21, 128, 61, 0.08)", padding: 14, borderRadius: "var(--radius-sm)", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--primary-800)", fontWeight: 700 }}>ESTIMATED SERVICE COST</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {selectedService.rateUnit === "acre"
                      ? `${Number(landAcres) || 1} acres × ₹${selectedService.rate.toLocaleString("en-IN")} / acre`
                      : `Reference rate per ${selectedService.rateUnit}`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-900)" }}>
                    ₹{((selectedService.rateUnit === "acre" ? selectedService.rate * (Number(landAcres) || 1) : selectedService.rate)).toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>*Pending provider confirmation</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" className="btn-outline-sm" onClick={() => setSelectedService(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  📩 Submit Request to Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PROVIDER ONBOARDING --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <div>
                <span className="section-label" style={{ fontSize: 10 }}>PROVIDER ONBOARDING</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, marginTop: 2 }}>
                  List Your Machinery or Labour Crew
                </h3>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing}>
              <div className="form-group">
                <label className="form-label">Service Category</label>
                <select
                  className="input-select"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EquipmentCategory)}
                >
                  <option value="sprayer">💨 Power Sprayer (₹300/acre ref)</option>
                  <option value="tractor">🚜 Tractor &amp; Cultivator (₹700/acre ref)</option>
                  <option value="implement">⚙️ Rotavator (₹1,000/acre ref)</option>
                  <option value="harvester">🌾 Combine Harvester (₹1,900/acre ref)</option>
                  <option value="labour">👨‍🌾 Labour Crew</option>
                  <option value="transport">🚛 Farm Cargo Transport</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service / Machine Title *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Aspee Boom Sprayer 500L"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Owner / Mukadam Name *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Full Name"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-text"
                    placeholder="+91 98XXX XXXXX"
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Village Location</label>
                  <select
                    className="input-select"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                  >
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Rate (₹) *</label>
                  <input
                    type="number"
                    className="input-text"
                    placeholder="1000"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value ? Number(e.target.value) : "")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rate Unit</label>
                  <select
                    className="input-select"
                    value={newRateUnit}
                    onChange={(e) => setNewRateUnit(e.target.value as any)}
                  >
                    <option value="acre">Per Acre</option>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="worker / day">Per Worker / Day</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Capacity / Equipment Specs</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. 500L Tank, 12 Nozzles or 10 Skilled Workers"
                  value={newHpOrCapacity}
                  onChange={(e) => setNewHpOrCapacity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Description</label>
                <textarea
                  className="input-text"
                  rows={2}
                  placeholder="Describe your equipment condition, service radius or field instructions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button type="button" className="btn-outline-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  🚀 Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

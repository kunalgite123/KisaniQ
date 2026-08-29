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

const STORAGE_KEY_LISTINGS = "krishi_setu_machinery_listings_v2";
const STORAGE_KEY_BOOKINGS = "krishi_setu_machinery_bookings_v2";

export default function LabourMachinery() {
  const { t } = useLanguage();
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
  const [activeViewTab, setActiveViewTab] = useState<"browse" | "my_requests">("browse");

  // Selected Service for Detailed Drawer & Booking Modal
  const [selectedService, setSelectedService] = useState<MachineryListing | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Booking Form State
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterVillage, setRenterVillage] = useState("Kopargaon");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (8:00 AM)");
  const [landAcres, setLandAcres] = useState<number | "">(4);
  const [bookingNotes, setBookingNotes] = useState("");

  // New Service Onboarding Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<EquipmentCategory>("tractor");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newVillage, setNewVillage] = useState("Kopargaon");
  const [newRate, setNewRate] = useState<number | "">(600);
  const [newRateUnit, setNewRateUnit] = useState<"hour" | "day" | "acre" | "worker / day">("acre");
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
    triggerToast(`🎉 Listed "${newTitle}" on Kisan Setu!`);

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
        title="Kisan Setu Farm Services"
        subtitle="Find farm machinery, labour and agricultural services near you around Kopargaon."
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
            WEATHER-AWARE SERVICE DISCOVERY
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
            🌤️ 6 of 7 Dry Days Forecasted — Ideal Window for Foliar Spraying &amp; Land Levelling
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Recommended services available within 10 km of Kopargaon.
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
          View Spraying Services →
        </button>
      </div>

      {/* 3. Location Selector & Search Filter Control Bar */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          {/* Location Context Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>📍 Location:</span>
            <select
              className="input-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ width: "auto", fontWeight: 700 }}
            >
              <option value="Kopargaon">📍 Kopargaon (Central Mandi)</option>
              <option value="Dhamori">📍 Dhamori (3.0 km)</option>
              <option value="Takli">📍 Takli (3.6 km)</option>
              <option value="Ravande">📍 Ravande (5.9 km)</option>
              <option value="Shirdi">📍 Shirdi (14 km)</option>
            </select>

            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 10 }}>Radius:</span>
            <select
              className="input-select"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value === "all" ? "all" : Number(e.target.value))}
              style={{ width: "auto" }}
            >
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={20}>Within 20 km</option>
              <option value="all">All Distances</option>
            </select>
          </div>

          {/* List / Map View Toggle & My Requests Tab */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", background: "var(--surface-bg)", border: "1px solid var(--border-subtle)", padding: 3, borderRadius: "var(--radius-sm)" }}>
              <button
                className={`btn-subtab ${activeViewTab === "browse" && viewMode === "list" ? "active" : ""}`}
                onClick={() => {
                  setActiveViewTab("browse");
                  setViewMode("list");
                }}
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                📋 List View
              </button>
              <button
                className={`btn-subtab ${activeViewTab === "browse" && viewMode === "map" ? "active" : ""}`}
                onClick={() => {
                  setActiveViewTab("browse");
                  setViewMode("map");
                }}
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                🗺️ Map View
              </button>
            </div>

            <button
              className={`btn-subtab ${activeViewTab === "my_requests" ? "active" : ""}`}
              onClick={() => setActiveViewTab("my_requests")}
              style={{ fontSize: 12, padding: "6px 14px" }}
            >
              My Requests ({bookings.length})
            </button>

            <button className="btn-primary-sm" onClick={() => setShowAddModal(true)} style={{ fontSize: 12 }}>
              + List Service
            </button>
          </div>
        </div>

        {/* Categories & Search Input Row */}
        {activeViewTab === "browse" && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {/* Category Chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
              <button
                className={`chip ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
                style={{ fontSize: 12 }}
              >
                All Services ({filteredListings.length})
              </button>
              <button
                className={`chip ${activeCategory === "sprayer" ? "active" : ""}`}
                onClick={() => setActiveCategory("sprayer")}
                style={{ fontSize: 12 }}
              >
                💨 Spraying
              </button>
              <button
                className={`chip ${activeCategory === "tractor" ? "active" : ""}`}
                onClick={() => setActiveCategory("tractor")}
                style={{ fontSize: 12 }}
              >
                🚜 Tractor
              </button>
              <button
                className={`chip ${activeCategory === "harvester" ? "active" : ""}`}
                onClick={() => setActiveCategory("harvester")}
                style={{ fontSize: 12 }}
              >
                🌾 Harvesting
              </button>
              <button
                className={`chip ${activeCategory === "labour" ? "active" : ""}`}
                onClick={() => setActiveCategory("labour")}
                style={{ fontSize: 12 }}
              >
                👨‍🌾 Labour Crews
              </button>
              <button
                className={`chip ${activeCategory === "implement" ? "active" : ""}`}
                onClick={() => setActiveCategory("implement")}
                style={{ fontSize: 12 }}
              >
                ⚙️ Land Levelling / Tillage
              </button>
              <button
                className={`chip ${activeCategory === "transport" ? "active" : ""}`}
                onClick={() => setActiveCategory("transport")}
                style={{ fontSize: 12 }}
              >
                🚛 Transport
              </button>
            </div>

            {/* Multilingual Search Bar */}
            <div style={{ width: 260 }}>
              <input
                type="text"
                className="input-text"
                placeholder="Search sprayer, मजूर, ट्रॅक्टर..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: 12.5, padding: "6px 12px" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN BROWSE VIEW (List or Map) */}
      {activeViewTab === "browse" ? (
        viewMode === "list" ? (
          filteredListings.length === 0 ? (
            <div className="card text-center" style={{ padding: "40px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🚜</div>
              <h3>No matching services near {selectedLocation} right now</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 13 }}>
                Try increasing your search radius or clearing category filters.
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
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 32 }}>
              {filteredListings.map((item) => (
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
                    {/* Category Label & Verified Trust Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span className="section-label" style={{ fontSize: 10 }}>
                        {item.categoryLabel.toUpperCase()}
                      </span>
                      {item.isVerified && (
                        <span className="badge badge-healthy" style={{ fontSize: 10, padding: "2px 8px" }}>
                          ✓ Verified Provider
                        </span>
                      )}
                    </div>

                    {/* Title & Distance */}
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                      📍 {item.village} · <strong>{item.distanceKm} km from you</strong>
                    </div>

                    {/* Owner & Hires */}
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                      👤 <strong>{item.ownerName}</strong> · ⭐ {item.rating} ({item.totalBookingsCount} completed jobs)
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </p>

                    {/* Capacity / Spec Tag */}
                    <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-main)", background: "var(--surface-bg)", padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                      ⚡ <strong>Spec:</strong> {item.hpOrCapacity}
                    </div>
                  </div>

                  {/* Pricing & Primary Action CTAs */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Service Rate</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>
                        ₹{item.rate.toLocaleString("en-IN")}{" "}
                        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>
                          / {item.rateUnit}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      {item.ownerPhone && (
                        <a
                          href={`tel:${item.ownerPhone}`}
                          className="btn-outline-sm"
                          style={{ fontSize: 12, padding: "5px 10px" }}
                        >
                          📞 Call
                        </a>
                      )}
                      <button
                        className="btn-primary-sm"
                        onClick={() => setSelectedService(item)}
                        style={{ fontSize: 12, padding: "5px 12px" }}
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* 5. VISUAL MAP VIEW */
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

            {/* Interactive Visual Map SVG */}
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
                {/* Distance Concentric Rings */}
                <circle cx="400" cy="190" r="70" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="190" r="140" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="190" r="210" fill="none" stroke="rgba(21, 128, 61, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Godavari River Blue Line */}
                <path d="M 50 140 Q 250 180 400 170 T 750 210" fill="none" stroke="#2563eb" strokeWidth="6" opacity="0.4" />
                <text x="600" y="225" fill="#2563eb" fontSize="11" fontWeight="700" opacity="0.7">
                  ~ Godavari River Basin
                </text>

                {/* Kopargaon Center Point */}
                <circle cx="400" cy="190" r="8" fill="#064e3b" />
                <text x="412" y="194" fill="#064e3b" fontSize="12" fontWeight="800">
                  📍 Kopargaon (You)
                </text>

                {/* Listing Pin Markers */}
                {filteredListings.map((item, idx) => {
                  const angle = (idx * (360 / Math.max(1, filteredListings.length)) * Math.PI) / 180;
                  const radius = Math.min(220, Math.max(50, item.distanceKm * 20));
                  const cx = 400 + radius * Math.cos(angle);
                  const cy = 190 + radius * Math.sin(angle);

                  return (
                    <g
                      key={item.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedService(item)}
                    >
                      <circle cx={cx} cy={cy} r="16" fill="#15803d" opacity="0.9" />
                      <text x={cx} y={cy + 5} textAnchor="middle" fill="#ffffff" fontSize="11">
                        {item.icon}
                      </text>
                      <text x={cx} y={cy - 20} textAnchor="middle" fill="#17201b" fontSize="10" fontWeight="700">
                        {item.village} ({item.distanceKm}km)
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.9)", padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, color: "var(--text-muted)" }}>
                💡 Click any map marker to view provider details &amp; request service
              </div>
            </div>
          </div>
        )
      ) : (
        /* 6. MY SERVICE REQUESTS VIEW */
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
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginTop: 4 }}>
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

      {/* --- MODAL 1: REQUEST SERVICE FORM --- */}
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
              <div>💰 Reference Rate: <strong>₹{selectedService.rate.toLocaleString("en-IN")} / {selectedService.rateUnit}</strong></div>
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
              <div style={{ background: "rgba(21, 128, 61, 0.08)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--primary-800)", fontWeight: 700 }}>ESTIMATED TOTAL SERVICE COST</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {selectedService.rateUnit === "acre" ? `₹${selectedService.rate} × ${Number(landAcres) || 1} acres` : `Reference rate`}
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--primary-900)" }}>
                  ₹{((selectedService.rateUnit === "acre" ? selectedService.rate * (Number(landAcres) || 1) : selectedService.rate)).toLocaleString("en-IN")}
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

      {/* --- MODAL 2: PROVIDER ONBOARDING / LIST SERVICE FORM --- */}
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
                  <option value="sprayer">💨 High Pressure Sprayer</option>
                  <option value="tractor">🚜 Tractor &amp; Tillage</option>
                  <option value="harvester">🌾 Combine Harvester</option>
                  <option value="labour">👨‍🌾 Labour Crew</option>
                  <option value="implement">⚙️ Land Leveller / Implement</option>
                  <option value="transport">🚛 Farm Cargo Transport</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service / Machine Title *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Aspee Solar Boom Sprayer 500L"
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
                    placeholder="600"
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

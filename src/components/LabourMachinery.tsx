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

const STORAGE_KEY_LISTINGS = "krishi_setu_machinery_listings_v1";
const STORAGE_KEY_BOOKINGS = "krishi_setu_machinery_bookings_v1";

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

  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillageFilter, setSelectedVillageFilter] = useState("");

  // Modals & Active Selections
  const [showAddModal, setShowAddModal] = useState(false);
  const [rentingItem, setRentingItem] = useState<MachineryListing | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<"browse" | "my_bookings">("browse");

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<EquipmentCategory>("tractor");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newVillage, setNewVillage] = useState("Kopargaon");
  const [newRate, setNewRate] = useState<number | "">(800);
  const [newRateUnit, setNewRateUnit] = useState<"hour" | "day" | "acre">("hour");
  const [newHpOrCapacity, setNewHpOrCapacity] = useState("");
  const [newAttachments, setNewAttachments] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Rental Request Form State
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterVillage, setRenterVillage] = useState("Kopargaon");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [landAcres, setLandAcres] = useState<number | "">(2);
  const [bookingNotes, setBookingNotes] = useState("");

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

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.type === activeCategory;
    const matchesVillage = !selectedVillageFilter || item.village === selectedVillageFilter;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVillage && matchesSearch;
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
      labour: "👨‍🌾"
    };

    const newEntry: MachineryListing = {
      id: "custom_" + Date.now(),
      type: newType,
      title: newTitle,
      categoryLabel: newCategoryLabel || (newType === "labour" ? "Labour Crew" : `${newType.toUpperCase()} Unit`),
      ownerName: newOwnerName,
      ownerPhone: newOwnerPhone,
      village: newVillage,
      rate: Number(newRate),
      rateUnit: newRateUnit,
      availableNow: true,
      hpOrCapacity: newHpOrCapacity || "Standard Agricultural Spec",
      attachmentsIncluded: newAttachments ? newAttachments.split(",").map((s) => s.trim()) : [],
      description: newDescription || "Available for farm operations in Kopargaon block.",
      icon: iconMap[newType] || "🚜",
      rating: 5.0,
      totalBookingsCount: 0
    };

    setListings([newEntry, ...listings]);
    setShowAddModal(false);
    triggerToast(`🎉 Successfully listed "${newTitle}"!`);

    setNewTitle("");
    setNewOwnerName("");
    setNewOwnerPhone("");
    setNewHpOrCapacity("");
    setNewAttachments("");
    setNewDescription("");
  }

  function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!rentingItem) return;
    if (!renterName || !renterPhone || !startDate || !endDate) {
      alert("Please provide your name, phone number, start date, and end date.");
      return;
    }

    const newBooking: RentalBooking = {
      id: "book_" + Date.now(),
      equipmentId: rentingItem.id,
      equipmentTitle: rentingItem.title,
      farmerName: renterName,
      farmerPhone: renterPhone,
      farmerVillage: renterVillage,
      startDate,
      endDate,
      landAcres: Number(landAcres) || 1,
      notes: bookingNotes,
      status: "Requested",
      createdAt: new Date().toLocaleDateString("en-IN")
    };

    setBookings([newBooking, ...bookings]);
    triggerToast(`✅ Rental request submitted for ${rentingItem.title}!`);
    setRentingItem(null);

    setRenterName("");
    setRenterPhone("");
    setBookingNotes("");
  }

  const availableCount = listings.filter((l) => l.availableNow).length;
  const harvesterCount = listings.filter((l) => l.type === "harvester").length;
  const labourCount = listings.filter((l) => l.type === "labour").length;

  return (
    <div>
      <PageHeader
        title={t("machinery_title")}
        subtitle={t("machinery_subtitle")}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Top Key Metrics Banner */}
      <div className="metrics-grid" style={{ marginBottom: 24 }}>
        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Equipment Listed</span>
            <span className="metric-icon">🚜</span>
          </div>
          <div className="metric-value">{listings.length} Units</div>
          <div className="metric-subtext">Across {villages.length} Kopargaon Villages</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">{t("available_now")}</span>
            <span className="metric-icon">🟢</span>
          </div>
          <div className="metric-value">{availableCount} Units</div>
          <div className="metric-subtext">Ready for field dispatch</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Combine Harvesters</span>
            <span className="metric-icon">🌾</span>
          </div>
          <div className="metric-value">{harvesterCount} Heavy Units</div>
          <div className="metric-subtext">Sugarcane & Grain Harvesters</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">{t("labour_crews")}</span>
            <span className="metric-icon">👨‍🌾</span>
          </div>
          <div className="metric-value">{labourCount} Gangs</div>
          <div className="metric-subtext">Cutting, Spraying & Sowing Teams</div>
        </div>
      </div>

      {/* Sub-Header Actions & Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, background: "var(--surface-muted)", padding: 4, borderRadius: "var(--radius-sm)" }}>
          <button
            className={`btn-subtab ${activeViewTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveViewTab("browse")}
          >
            {t("browse_tab")}
          </button>
          <button
            className={`btn-subtab ${activeViewTab === "my_bookings" ? "active" : ""}`}
            onClick={() => setActiveViewTab("my_bookings")}
          >
            {t("my_bookings_tab")} ({bookings.length})
          </button>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          {t("list_machine_btn")}
        </button>
      </div>

      {activeViewTab === "browse" ? (
        <>
          {/* Filters and Search Bar */}
          <div className="card" style={{ marginBottom: 20, padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                <button
                  className={`chip ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  {t("all_categories")} ({listings.length})
                </button>
                <button
                  className={`chip ${activeCategory === "tractor" ? "active" : ""}`}
                  onClick={() => setActiveCategory("tractor")}
                >
                  {t("tractors")}
                </button>
                <button
                  className={`chip ${activeCategory === "harvester" ? "active" : ""}`}
                  onClick={() => setActiveCategory("harvester")}
                >
                  {t("harvesters")}
                </button>
                <button
                  className={`chip ${activeCategory === "implement" ? "active" : ""}`}
                  onClick={() => setActiveCategory("implement")}
                >
                  {t("implements")}
                </button>
                <button
                  className={`chip ${activeCategory === "sprayer" ? "active" : ""}`}
                  onClick={() => setActiveCategory("sprayer")}
                >
                  {t("sprayers")}
                </button>
                <button
                  className={`chip ${activeCategory === "labour" ? "active" : ""}`}
                  onClick={() => setActiveCategory("labour")}
                >
                  {t("labour_crews")}
                </button>
              </div>

              {/* Location Select Filter */}
              <div style={{ minWidth: 180 }}>
                <select
                  className="input-select"
                  value={selectedVillageFilter}
                  onChange={(e) => setSelectedVillageFilter(e.target.value)}
                >
                  <option value="">All Villages</option>
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search Input */}
              <div style={{ flex: "1 1 200px", minWidth: 200 }}>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Search machine, model, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="card text-center" style={{ padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚜</div>
              <h3>No machinery or labour listings found</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
                Try adjusting your category or village filter, or list your own machinery for rent!
              </p>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddModal(true)}>
                List Your Machine Now
              </button>
            </div>
          ) : (
            <div className="machinery-grid">
              {filteredListings.map((item) => (
                <div key={item.id} className="card machinery-card">
                  {/* Top Badge & Icon */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="machinery-icon-avatar">{item.icon}</div>
                      <div>
                        <span className="badge badge-muted" style={{ fontSize: 11 }}>
                          {item.categoryLabel}
                        </span>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          📍 {item.village}, Kopargaon
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${item.availableNow ? "badge-healthy" : "badge-warning"}`}>
                      {item.availableNow ? "Available Now" : item.availableFrom || "Booked"}
                    </span>
                  </div>

                  {/* Title & Owner */}
                  <h3 className="machinery-title">{item.title}</h3>
                  <div className="machinery-owner">
                    👤 <strong>{item.ownerName}</strong> · ⭐ {item.rating} ({item.totalBookingsCount} hires)
                  </div>

                  {/* Description */}
                  <p className="machinery-desc">{item.description}</p>

                  {/* Specs & Attachments */}
                  <div className="machinery-specs-list">
                    <div className="spec-tag">⚡ {item.hpOrCapacity}</div>
                    {item.attachmentsIncluded?.map((att, idx) => (
                      <div key={idx} className="spec-tag">
                        🔧 {att}
                      </div>
                    ))}
                  </div>

                  {/* Rate & Rent Action (No payment gateway - direct booking) */}
                  <div className="machinery-footer">
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rental Rate</div>
                      <div className="machinery-rate">
                        ₹{item.rate.toLocaleString("en-IN")}{" "}
                        <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>
                          / {item.rateUnit}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <a
                        href={`tel:${item.ownerPhone}`}
                        className="btn-outline-sm"
                        title="Call Owner Directly"
                      >
                        📞 Call
                      </a>
                      <button
                        className="btn-primary-sm"
                        onClick={() => setRentingItem(item)}
                      >
                        🚜 Rent Machine
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* My Rental Requests View */
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Submitted Rental Requests</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Direct equipment booking requests submitted to local machine owners (No online payment required)
              </p>
            </div>
            <span className="badge badge-healthy">{bookings.length} Total Requests</span>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--text-muted)" }}>
              No rental requests submitted yet. Browse the machinery list above to request a harvester or tractor!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-muted)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-main)" }}>
                      🚜 {booking.equipmentTitle}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                      Farmer: <strong>{booking.farmerName}</strong> ({booking.farmerPhone}) · 📍 {booking.farmerVillage}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                      🗓️ Dates: <strong>{booking.startDate}</strong> to <strong>{booking.endDate}</strong> ({booking.landAcres} Acres)
                    </div>
                    {booking.notes && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
                        Note: "{booking.notes}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className="badge badge-healthy" style={{ marginBottom: 8 }}>
                      Status: {booking.status}
                    </span>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Submitted on {booking.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MODAL 1: LIST YOUR MACHINE / LABOUR --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>List Your Machinery or Labour Crew</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing}>
              <div className="form-group">
                <label className="form-label">Listing Type</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="type"
                      checked={newType === "tractor"}
                      onChange={() => setNewType("tractor")}
                    />
                    🚜 Tractor
                  </label>

                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="type"
                      checked={newType === "harvester"}
                      onChange={() => setNewType("harvester")}
                    />
                    🌾 Harvester
                  </label>

                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="type"
                      checked={newType === "implement"}
                      onChange={() => setNewType("implement")}
                    />
                    ⚙️ Implement
                  </label>

                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="type"
                      checked={newType === "sprayer"}
                      onChange={() => setNewType("sprayer")}
                    />
                    💨 Sprayer
                  </label>

                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="type"
                      checked={newType === "labour"}
                      onChange={() => setNewType("labour")}
                    />
                    👨‍🌾 Labour
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Equipment / Labour Title *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. John Deere 5050D with 4WD or Sugarcane Harvest Crew"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Owner / Manager Name *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Your Full Name"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number *</label>
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
                  <label className="form-label">Rental Rate (₹) *</label>
                  <input
                    type="number"
                    className="input-text"
                    placeholder="e.g. 850"
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
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="acre">Per Acre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Engine HP / Crew Capacity</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. 50 HP Engine or 8 Skilled Workers"
                  value={newHpOrCapacity}
                  onChange={(e) => setNewHpOrCapacity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attachments Included (Comma Separated)</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Rotavator, Reversible Plough, Straw Reaper"
                  value={newAttachments}
                  onChange={(e) => setNewAttachments(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  className="input-text"
                  rows={3}
                  placeholder="Mention equipment condition, operator availability, or field requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
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

      {/* --- MODAL 2: RENT MACHINE / REQUEST BOOKING (NO PAYMENT) --- */}
      {rentingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3>Request Rental: {rentingItem.title}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  Direct owner booking (No online payment required)
                </p>
              </div>
              <button className="modal-close" onClick={() => setRentingItem(null)}>
                ✕
              </button>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-muted)",
                marginBottom: 16,
                fontSize: 13
              }}
            >
              <div>
                👤 Owner: <strong>{rentingItem.ownerName}</strong> ({rentingItem.ownerPhone})
              </div>
              <div>
                📍 Location: {rentingItem.village}, Kopargaon · 💰 Reference Rate: ₹{rentingItem.rate}/{rentingItem.rateUnit}
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Enter your name"
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Phone Number *</label>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="input-text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="input-text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Land Size (Acres)</label>
                  <input
                    type="number"
                    className="input-text"
                    placeholder="2"
                    value={landAcres}
                    onChange={(e) => setLandAcres(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Village Location</label>
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
                <label className="form-label">Note for Machine Owner</label>
                <textarea
                  className="input-text"
                  rows={2}
                  placeholder="Specify soil condition, crop type (e.g. Sugarcane harvest, Wheat rotavator), or field access instructions..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>

              <div style={{ background: "var(--primary-50)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 12.5, color: "var(--primary-900)" }}>
                ℹ️ <strong>Direct Contact Notice:</strong> Submitting this request instantly alerts the equipment owner ({rentingItem.ownerName}). No payment or deposit is collected on Krishi Setu. Payment terms are settled directly between farmers.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" className="btn-outline-sm" onClick={() => setRentingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  📩 Submit Rental Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

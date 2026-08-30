interface Props {
  selectedVillageName: string | null;
}

export default function Header({ selectedVillageName }: Props) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">🛡️</div>
        <div>
          <div className="brand-title">Kisan Setu</div>
          <div className="brand-subtitle">AI Farm Intelligence · SKH 2026</div>
        </div>
      </div>

      <div className="nav-right-controls">
        <div className="location-pill">
          <span>📍</span>
          <span>{selectedVillageName ? `${selectedVillageName}, Kopargaon` : "Kopargaon Taluka"}</span>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          <span>Systems Operational</span>
        </div>
      </div>
    </header>
  );
}

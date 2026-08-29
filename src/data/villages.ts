// Derived from: Kopargaon_Village_Water_Proximity_Brief.pdf and
// Kopargaon_Taluka_CGWB_Extracted_Data.pdf (percolation-tank annexure).
// water_source_type is a hypothesis based on Godavari proximity, NOT a
// verified irrigation record — the UI must say so (see disclaimer in App).

export type WaterSourceType =
  | "canal_godavari"
  | "possible_canal_branch"
  | "groundwater_only";

export interface Village {
  name: string;
  distanceToGodavariKm: number;
  waterSourceType: WaterSourceType;
  proposedRecharge: boolean; // CGWB-listed percolation tank site
}

export const villages: Village[] = [
  // Near the Godavari (< 3 km)
  { name: "Kopargaon (town)", distanceToGodavariKm: 0.0, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Chasnali", distanceToGodavariKm: 0.0, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Wari", distanceToGodavariKm: 0.5, waterSourceType: "canal_godavari", proposedRecharge: false },
  { name: "Vadgaon", distanceToGodavariKm: 0.8, waterSourceType: "canal_godavari", proposedRecharge: false },
  { name: "Murshatpur", distanceToGodavariKm: 1.0, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Kokamthan", distanceToGodavariKm: 1.3, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Suregaon", distanceToGodavariKm: 1.3, waterSourceType: "canal_godavari", proposedRecharge: false },
  { name: "Dharangaon", distanceToGodavariKm: 1.3, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Morvis", distanceToGodavariKm: 1.4, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Manjur", distanceToGodavariKm: 1.7, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Kanhegaon", distanceToGodavariKm: 2.0, waterSourceType: "canal_godavari", proposedRecharge: true },
  { name: "Sanvatsar", distanceToGodavariKm: 2.6, waterSourceType: "canal_godavari", proposedRecharge: true },
  // Moderate distance (3-6 km) - possible canal-branch reach
  { name: "Dhamori", distanceToGodavariKm: 3.0, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Velapur", distanceToGodavariKm: 3.0, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Kolpewadi", distanceToGodavariKm: 3.6, waterSourceType: "possible_canal_branch", proposedRecharge: true },
  { name: "Takali", distanceToGodavariKm: 3.6, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Sonari", distanceToGodavariKm: 3.9, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Sangvi Bhusar", distanceToGodavariKm: 4.1, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Ghari", distanceToGodavariKm: 5.6, waterSourceType: "possible_canal_branch", proposedRecharge: true },
  { name: "Madhi Bk", distanceToGodavariKm: 5.7, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  { name: "Rawande", distanceToGodavariKm: 5.9, waterSourceType: "possible_canal_branch", proposedRecharge: false },
  // Far from the river (> 6 km) - likely well/groundwater-dependent
  { name: "Yesgaon", distanceToGodavariKm: 6.2, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Bramhangaon", distanceToGodavariKm: 7.2, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Karanji Bk", distanceToGodavariKm: 8.3, waterSourceType: "groundwater_only", proposedRecharge: true },
  { name: "Dhotre", distanceToGodavariKm: 8.5, waterSourceType: "groundwater_only", proposedRecharge: true },
  { name: "Padhegaon", distanceToGodavariKm: 9.5, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Pohegaon Bk", distanceToGodavariKm: 10.0, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Kasali", distanceToGodavariKm: 10.6, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Nategaon", distanceToGodavariKm: 10.6, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Ogadi", distanceToGodavariKm: 11.1, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Shahapur", distanceToGodavariKm: 12.7, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Apegaon", distanceToGodavariKm: 13.7, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Tilwani", distanceToGodavariKm: 14.3, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Anjanapur", distanceToGodavariKm: 17.7, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Ranjangaon Deshmukh", distanceToGodavariKm: 20.0, waterSourceType: "groundwater_only", proposedRecharge: true },
  { name: "Kakadi", distanceToGodavariKm: 21.2, waterSourceType: "groundwater_only", proposedRecharge: false },
  { name: "Manegaon", distanceToGodavariKm: 21.5, waterSourceType: "groundwater_only", proposedRecharge: false }
];

export const waterSourceLabel: Record<WaterSourceType, string> = {
  canal_godavari: "Godavari canal command (river-adjacent)",
  possible_canal_branch: "Possible Pravara/canal-branch reach",
  groundwater_only: "Well / borewell dependent (groundwater)"
};

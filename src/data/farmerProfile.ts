import { supabase } from "../lib/supabase";
import { villages, Village } from "./villages";

export interface FarmerProfile {
  id?: string;
  fullName: string;
  phone: string;
  locationVillage: string; // e.g., Kopargaon, Dhamori, Takli, Ravande
  district: string; // Ahilyanagar (Ahmednagar)
  primaryCrop: string; // Sugarcane, Onion, Pomegranate, Wheat, Cotton, Soyabean
  landArea: number;
  landUnit: "acres" | "guntha";
  waterSource: "godavari_canal" | "borewell_well" | "drip_irrigation" | "rainfed";
  soilType: "medium_black" | "murrum" | "alluvial" | "red_clay";
  primaryGoal: "yield" | "water" | "disease" | "machinery";
  isCompleted: boolean;
  completionPercentage: number;
  updatedAt?: string;
}

export const INITIAL_DEFAULT_PROFILE: FarmerProfile = {
  fullName: "Kisan Farmer",
  phone: "+91 98220 12345",
  locationVillage: "Kopargaon",
  district: "Ahilyanagar (Ahmednagar)",
  primaryCrop: "Sugarcane",
  landArea: 4.0,
  landUnit: "acres",
  waterSource: "godavari_canal",
  soilType: "medium_black",
  primaryGoal: "yield",
  isCompleted: false,
  completionPercentage: 35 // Initial primary login completion state (35%)
};

const STORAGE_KEY_PROFILE = "kisaniq_farmer_profile_v1";

/**
 * Calculates profile completion percentage dynamically.
 */
export function calculateCompletionPct(profile: Partial<FarmerProfile>): number {
  let score = 20; // Base score for creating account
  if (profile.fullName && profile.fullName !== "Kisan Farmer") score += 15;
  if (profile.phone && profile.phone.length >= 10) score += 15;
  if (profile.locationVillage) score += 15;
  if (profile.primaryCrop) score += 15;
  if (profile.landArea && profile.landArea > 0) score += 10;
  if (profile.waterSource && profile.soilType) score += 10;

  return Math.min(100, score);
}

/**
 * Loads profile from localStorage with fallback to default state.
 */
export function loadSavedFarmerProfile(): FarmerProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.completionPercentage = calculateCompletionPct(parsed);
      parsed.isCompleted = parsed.completionPercentage >= 90;
      return parsed;
    }
  } catch (err) {
    console.warn("Could not load farmer profile from localStorage:", err);
  }
  return INITIAL_DEFAULT_PROFILE;
}

/**
 * Saves farmer profile to localStorage and syncs with Supabase database.
 */
export async function saveFarmerProfile(profile: FarmerProfile): Promise<FarmerProfile> {
  profile.completionPercentage = calculateCompletionPct(profile);
  profile.isCompleted = profile.completionPercentage >= 90;
  profile.updatedAt = new Date().toISOString();

  // 1. Save to local storage for immediate UI reactivity
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn("Could not save profile to localStorage:", err);
  }

  // 2. Persist to Supabase Database (public.farmer_profiles)
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const dbPayload = {
        user_id: userData.user.id,
        full_name: profile.fullName,
        phone: profile.phone,
        location_village: profile.locationVillage,
        district: profile.district,
        primary_crop: profile.primaryCrop,
        land_area: profile.landArea,
        land_unit: profile.landUnit,
        water_source: profile.waterSource,
        soil_type: profile.soilType,
        primary_goal: profile.primaryGoal,
        is_completed: profile.isCompleted,
        completion_percentage: profile.completionPercentage,
        updated_at: profile.updatedAt
      };

      const { error } = await supabase
        .from("farmer_profiles")
        .upsert(dbPayload, { onConflict: "user_id" });

      if (error) {
        console.warn("Supabase farmer_profiles sync notice:", error.message);
      }
    }
  } catch (err) {
    console.warn("Supabase profile sync skipped (offline mode):", err);
  }

  return profile;
}

/**
 * Helper to resolve village object from profile.
 */
export function getProfileVillage(villageName: string): Village | null {
  return villages.find((v) => v.name.toLowerCase().includes(villageName.toLowerCase())) || villages[0];
}

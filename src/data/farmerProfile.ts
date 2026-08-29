import { supabase } from "../lib/supabase";
import { villages, Village } from "./villages";

export interface FarmerProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  locationVillage: string; // Kopargaon, Dhamori, Takli, Ravande, etc.
  district: string; // Ahilyanagar (Ahmednagar)
  primaryCrop: string; // Sugarcane, Onion, Pomegranate, Wheat, Cotton
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
  email: "farmer@kisaniq.in",
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
  completionPercentage: 35 // Initial signup completion percentage (35%)
};

const STORAGE_KEY_PROFILE = "kisaniq_farmer_profile_v2";

/**
 * Calculates profile completion percentage dynamically.
 * Account signup (Name + Email + Phone) = 35% base.
 * Adding Village + Crop + Land + Water/Soil brings completion to 100%.
 */
export function calculateCompletionPct(profile: Partial<FarmerProfile>): number {
  let score = 35; // Base score for completed signup (Name + Email + Phone)

  if (profile.locationVillage && profile.locationVillage !== "") score += 15;
  if (profile.primaryCrop && profile.primaryCrop !== "") score += 15;
  if (profile.landArea && profile.landArea > 0) score += 15;
  if (profile.waterSource && profile.soilType) score += 20;

  return Math.min(100, score);
}

/**
 * Loads profile from localStorage with fallback and pre-populates authenticated user credentials.
 */
export function loadSavedFarmerProfile(authProfile?: { full_name?: string; email?: string; phone?: string } | null): FarmerProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      const parsed: FarmerProfile = JSON.parse(saved);

      // Pre-fill email/name/phone from auth session if available and missing
      if (authProfile?.email && !parsed.email) parsed.email = authProfile.email;
      if (authProfile?.full_name && parsed.fullName === "Kisan Farmer") parsed.fullName = authProfile.full_name;
      if (authProfile?.phone && !parsed.phone) parsed.phone = authProfile.phone;

      parsed.completionPercentage = calculateCompletionPct(parsed);
      parsed.isCompleted = parsed.completionPercentage >= 95;
      return parsed;
    }
  } catch (err) {
    console.warn("Could not load farmer profile from localStorage:", err);
  }

  // Initial primary signup state (35% complete)
  const initial: FarmerProfile = {
    ...INITIAL_DEFAULT_PROFILE,
    fullName: authProfile?.full_name || "Kisan Farmer",
    email: authProfile?.email || "farmer@kisaniq.in",
    phone: authProfile?.phone || "+91 98220 12345",
    isCompleted: false,
    completionPercentage: 35
  };

  return initial;
}

/**
 * Saves farmer profile to localStorage and syncs with Supabase database.
 */
export async function saveFarmerProfile(profile: FarmerProfile): Promise<FarmerProfile> {
  profile.completionPercentage = calculateCompletionPct(profile);
  profile.isCompleted = profile.completionPercentage >= 95;
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
        email: profile.email,
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

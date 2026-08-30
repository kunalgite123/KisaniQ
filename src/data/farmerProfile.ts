import { supabase } from "../lib/supabase";
import { villages, Village } from "./villages";
import { recordInShadowVault } from "../lib/selfHealingVault";

export interface FarmerProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  locationVillage: string; // Unfilled initially ("")
  district: string; // Ahilyanagar (Ahmednagar)
  primaryCrop: string; // Unfilled initially ("")
  landArea: number; // Unfilled initially (0)
  landUnit: "acres" | "guntha";
  waterSource: "godavari_canal" | "borewell_well" | "drip_irrigation" | "rainfed" | "";
  soilType: "medium_black" | "murrum" | "alluvial" | "red_clay" | "";
  primaryGoal: "yield" | "water" | "disease" | "machinery";
  isCompleted: boolean;
  completionPercentage: number;
  updatedAt?: string;
  // Optional Farmer Intelligence Fields
  cropStage?: "sowing" | "vegetative" | "flowering" | "fruiting" | "harvesting" | "";
  lastIrrigationDate?: string;
  waterAvailability?: "abundant" | "moderate" | "limited" | "critical" | "";
  soilMoisture?: "wet" | "adequate" | "moderate" | "dry" | "very_dry" | "";
  expectedYield?: number;
  actualYield?: number;
  yieldIssue?: boolean;
  cropLoss?: boolean;
  farmerProblem?: "irrigation" | "water_scarcity" | "pest" | "disease" | "low_yield" | "crop_loss" | "excessive_rain" | "drought" | "soil" | "market" | "input_cost" | "machinery" | "general" | "";
  irrigationMethod?: "drip" | "flood" | "sprinkler" | "rainfed" | "";
  pestObserved?: boolean;
  // Extended Farmer Input Fields
  soilPh?: number;
  organicCarbonPct?: number;
  fertilizerType?: "chemical_npk" | "organic_vermicompost" | "bio_fertilizer" | "mixed" | "";
  sowingDate?: string;
  budgetPerAcre?: number;
  pestHistory?: string;
}

export interface AdviceReview {
  adviceId: string;
  rating: "helpful" | "unhelpful" | "neutral";
  stars?: number;
  comment?: string;
  timestamp: string;
}

export interface AdviceState {
  completed: Record<string, boolean>;
  reviews: Record<string, AdviceReview>;
}

export const INITIAL_DEFAULT_PROFILE: FarmerProfile = {
  fullName: "Kisan Farmer",
  email: "farmer@krishisetu.in",
  phone: "+91 98220 12345",
  locationVillage: "",
  district: "Ahilyanagar (Ahmednagar)",
  primaryCrop: "",
  landArea: 0,
  landUnit: "acres",
  waterSource: "",
  soilType: "",
  primaryGoal: "yield",
  isCompleted: false,
  completionPercentage: 35 // Initial signup completion percentage (35%)
};

const STORAGE_KEY_PROFILE = "kisaniq_farmer_profile_v3";

/**
 * Calculates profile completion percentage dynamically.
 * Signup identity (Name + Email + Phone) = 35% base.
 * Adding Village (+15%) + Crop (+15%) + Land Size (+15%) + Water/Soil (+20%) brings completion to 100%.
 */
export function calculateCompletionPct(profile: Partial<FarmerProfile>): number {
  let score = 35; // Base score for completed signup identity

  if (profile.locationVillage && profile.locationVillage.trim() !== "") score += 15;
  if (profile.primaryCrop && profile.primaryCrop.trim() !== "") score += 15;
  if (profile.landArea && profile.landArea > 0) score += 15;
  if (profile.waterSource && profile.soilType && (profile.waterSource as string) !== "" && (profile.soilType as string) !== "") score += 20;

  return Math.min(100, score);
}

/**
 * Loads profile from localStorage with fallback and pre-populates authenticated user credentials.
 */
export function loadSavedFarmerProfile(authProfile?: { id?: string; full_name?: string; email?: string; phone?: string } | null): FarmerProfile {
  try {
    // Check user-scoped localStorage key first
    const userId = authProfile?.id;
    const userScopedKey = userId ? `kisaniq_farmer_profile_${userId}` : null;
    const saved = (userScopedKey && localStorage.getItem(userScopedKey)) || localStorage.getItem(STORAGE_KEY_PROFILE);

    if (saved) {
      const parsed: FarmerProfile = JSON.parse(saved);

      // Pre-fill email/name/phone from auth session if available
      if (authProfile?.email) parsed.email = authProfile.email;
      if (authProfile?.full_name && authProfile.full_name !== "Farmer") parsed.fullName = authProfile.full_name;
      if (authProfile?.phone) parsed.phone = authProfile.phone;

      parsed.completionPercentage = calculateCompletionPct(parsed);
      parsed.isCompleted = parsed.completionPercentage >= 95;
      return parsed;
    }
  } catch (err) {
    console.warn("Could not load farmer profile from localStorage:", err);
  }

  // Initial signup state (35% complete - awaiting remaining farm details)
  const initial: FarmerProfile = {
    ...INITIAL_DEFAULT_PROFILE,
    fullName: authProfile?.full_name || "Kisan Farmer",
    email: authProfile?.email || "farmer@krishisetu.in",
    phone: authProfile?.phone || "+91 98220 12345",
    isCompleted: false,
    completionPercentage: 35
  };

  return initial;
}

/**
 * Fetches saved farmer profile from Supabase PostgreSQL database by user_id and restores it to state & localStorage.
 */
export async function fetchFarmerProfileFromSupabase(userId: string): Promise<FarmerProfile | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("farmer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      const meta = data.metadata || {};
      const restored: FarmerProfile = {
        fullName: data.full_name || "Kisan Farmer",
        email: data.email || "",
        phone: data.phone || "",
        locationVillage: data.location_village || meta.locationVillage || "",
        district: data.district || "Ahilyanagar (Ahmednagar)",
        primaryCrop: data.primary_crop || meta.primaryCrop || "",
        landArea: Number(data.land_area ?? meta.landArea ?? 0),
        landUnit: data.land_unit || meta.landUnit || "acres",
        waterSource: data.water_source || meta.waterSource || "",
        soilType: data.soil_type || meta.soilType || "",
        primaryGoal: data.primary_goal || meta.primaryGoal || "yield",
        isCompleted: data.is_completed ?? meta.isCompleted ?? false,
        completionPercentage: Number(data.completion_percentage ?? meta.completionPercentage ?? 35),
        updatedAt: data.updated_at || new Date().toISOString(),

        // Extended fields from metadata or direct columns
        soilPh: meta.soilPh ?? data.soil_ph,
        organicCarbonPct: meta.organicCarbonPct ?? data.organic_carbon_pct,
        fertilizerType: meta.fertilizerType ?? data.fertilizer_type,
        sowingDate: meta.sowingDate ?? data.sowing_date,
        budgetPerAcre: meta.budgetPerAcre ?? data.budget_per_acre,
        farmerProblem: meta.farmerProblem ?? data.farmer_problem,
        soilMoisture: meta.soilMoisture ?? data.soil_moisture,
        waterAvailability: meta.waterAvailability ?? data.water_availability,
        cropStage: meta.cropStage ?? data.crop_stage,
        pestObserved: meta.pestObserved ?? data.pest_observed,
        irrigationMethod: meta.irrigationMethod ?? data.irrigation_method
      };

      restored.completionPercentage = calculateCompletionPct(restored);
      restored.isCompleted = restored.completionPercentage >= 95;

      // Persist to user-scoped local storage for instant offline access
      localStorage.setItem(`kisaniq_farmer_profile_${userId}`, JSON.stringify(restored));
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(restored));

      return restored;
    }
  } catch (err) {
    console.warn("Supabase farmer profile fetch notice:", err);
  }

  // Fallback to Client Shadow Vault
  try {
    const vault = getShadowVault();
    const vaultRecord = vault.farmerProfiles[userId];
    if (vaultRecord) {
      const restored: FarmerProfile = {
        fullName: vaultRecord.fullName || vaultRecord.full_name || "Kisan Farmer",
        email: vaultRecord.email || "",
        phone: vaultRecord.phone || "",
        locationVillage: vaultRecord.locationVillage || vaultRecord.location_village || "",
        district: vaultRecord.district || "Ahilyanagar (Ahmednagar)",
        primaryCrop: vaultRecord.primaryCrop || vaultRecord.primary_crop || "",
        landArea: Number(vaultRecord.landArea ?? vaultRecord.land_area ?? 0),
        landUnit: vaultRecord.landUnit || vaultRecord.land_unit || "acres",
        waterSource: vaultRecord.waterSource || vaultRecord.water_source || "",
        soilType: vaultRecord.soilType || vaultRecord.soil_type || "",
        primaryGoal: vaultRecord.primaryGoal || vaultRecord.primary_goal || "yield",
        isCompleted: vaultRecord.isCompleted ?? vaultRecord.is_completed ?? false,
        completionPercentage: Number(vaultRecord.completionPercentage ?? vaultRecord.completion_percentage ?? 35),
        updatedAt: vaultRecord.updatedAt || vaultRecord.updated_at || new Date().toISOString(),
        ...(vaultRecord.metadata || vaultRecord)
      };

      restored.completionPercentage = calculateCompletionPct(restored);
      restored.isCompleted = restored.completionPercentage >= 95;
      return restored;
    }
  } catch {}

  return null;
}

/**
 * Saves farmer profile simultaneously to local storage, client shadow vault, and Supabase cloud.
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

  // 2. Dual-Write to Client Shadow Vault & Supabase Database
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const userId = userData.user.id;
      localStorage.setItem(`kisaniq_farmer_profile_${userId}`, JSON.stringify(profile));

      const dbPayload = {
        user_id: userId,
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
        updated_at: profile.updatedAt,
        metadata: {
          soilPh: profile.soilPh,
          organicCarbonPct: profile.organicCarbonPct,
          fertilizerType: profile.fertilizerType,
          sowingDate: profile.sowingDate,
          budgetPerAcre: profile.budgetPerAcre,
          farmerProblem: profile.farmerProblem,
          soilMoisture: profile.soilMoisture,
          waterAvailability: profile.waterAvailability,
          cropStage: profile.cropStage,
          pestObserved: profile.pestObserved,
          irrigationMethod: profile.irrigationMethod
        }
      };

      // DUAL-WRITE STEP: Write to Client Shadow Vault
      recordInShadowVault("farmerProfiles", userId, { ...dbPayload, ...profile });
      recordInShadowVault("profiles", userId, {
        id: userId,
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        updated_at: profile.updatedAt
      });

      // Primary Upsert attempt into Supabase
      const { error } = await supabase
        .from("farmer_profiles")
        .upsert(dbPayload, { onConflict: "user_id" });

      if (error) {
        console.warn("Supabase farmer_profiles upsert notice, trying without metadata:", error.message);
        const fallbackPayload = { ...dbPayload };
        delete (fallbackPayload as any).metadata;
        await supabase.from("farmer_profiles").upsert(fallbackPayload, { onConflict: "user_id" }).catch(() => {});
      }

      // Also ensure profiles table is updated
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        updated_at: profile.updatedAt
      });
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
  if (!villageName) return villages[0];
  return villages.find((v) => v.name.toLowerCase().includes(villageName.toLowerCase())) || villages[0];
}

const STORAGE_KEY_ADVICE_STATE = "kisaniq_advice_state_v1";

export function loadAdviceState(): AdviceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADVICE_STATE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not load advice state from localStorage:", err);
  }
  return { completed: {}, reviews: {} };
}

export async function saveAdviceCompletion(adviceId: string, completed: boolean): Promise<AdviceState> {
  const current = loadAdviceState();
  current.completed[adviceId] = completed;

  try {
    localStorage.setItem(STORAGE_KEY_ADVICE_STATE, JSON.stringify(current));
  } catch (err) {
    console.warn("Could not save advice completion to localStorage:", err);
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const userId = userData.user.id;
      recordInShadowVault("farmerProfiles", `${userId}_advice_${adviceId}`, { adviceId, completed, type: "completion" });
      await supabase.from("farmer_advice_feedback").upsert({
        user_id: userId,
        advice_id: adviceId,
        completed,
        updated_at: new Date().toISOString()
      }).catch(() => {});
    }
  } catch (err) {
    console.warn("Supabase advice completion sync skipped (offline):", err);
  }

  return current;
}

export async function saveAdviceReview(review: AdviceReview): Promise<AdviceState> {
  const current = loadAdviceState();
  current.reviews[review.adviceId] = review;

  try {
    localStorage.setItem(STORAGE_KEY_ADVICE_STATE, JSON.stringify(current));
  } catch (err) {
    console.warn("Could not save advice review to localStorage:", err);
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const userId = userData.user.id;
      recordInShadowVault("farmerProfiles", `${userId}_review_${review.adviceId}`, review);
      await supabase.from("farmer_advice_feedback").upsert({
        user_id: userId,
        advice_id: review.adviceId,
        rating: review.rating,
        stars: review.stars || 5,
        comment: review.comment || "",
        updated_at: review.timestamp
      }).catch(() => {});
    }
  } catch (err) {
    console.warn("Supabase advice review sync skipped (offline):", err);
  }

  return current;
}

import { supabase } from "../../lib/supabase";
import { VerificationResult } from "./trustVerificationEngine";

const STORAGE_KEY_TRUST_HISTORY = "krishi_setu_trust_history_v1";

// 1. Save Verification Result to local storage & Supabase cloud
export async function saveVerificationRecord(
  result: VerificationResult,
  userId?: string | null
): Promise<void> {
  // A. Save to Local Shadow Storage (Offline Resilience)
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY_TRUST_HISTORY);
    const history: VerificationResult[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_TRUST_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Local trust history cache write warning:", e);
  }

  // B. Save to Supabase Cloud Database (if connected & authorized)
  if (supabase) {
    try {
      const { data: claimRow, error: claimErr } = await supabase
        .from("verification_claims")
        .insert({
          user_id: userId || null,
          claim_text: result.claimText,
          language: result.detectedLang,
          claim_type: result.category,
          location: result.location,
          crop: result.crop || null,
          extracted_value: result.extractedValue || null,
          extracted_unit: result.extractedUnit || null,
          status: result.verdict,
          verdict: result.verdict,
          reason: result.explanation,
          related_module: result.relatedModule
        })
        .select()
        .single();

      if (claimErr || !claimRow) {
        return;
      }

      // Insert Evidence Records
      if (result.evidenceList.length > 0) {
        const evidenceRows = result.evidenceList.map((e) => ({
          claim_id: claimRow.id,
          source_name: e.sourceName,
          source_type: e.sourceType,
          authority_level: e.authorityLevel,
          source_url: e.sourceUrl || null,
          evidence_text: e.evidenceText,
          observed_value: e.observedValue || null,
          unit: e.unit || null
        }));
        await supabase.from("verification_evidence").insert(evidenceRows);
      }

      // Insert Verification Results Summary
      await supabase.from("verification_results").insert({
        claim_id: claimRow.id,
        verdict: result.verdict,
        evidence_quality: "HIGH",
        explanation: result.explanation,
        related_module: result.relatedModule
      });
    } catch (err) {
      console.warn("Supabase verification save notice:", err);
    }
  }
}

// 2. Fetch Saved Verification History
export function fetchVerificationHistory(): VerificationResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRUST_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

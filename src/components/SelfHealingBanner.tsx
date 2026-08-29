import { useEffect } from "react";
import { auditAndSelfHeal } from "../lib/selfHealingVault";
import { useAuth } from "../context/AuthContext";

export default function SelfHealingBanner() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Runs silent background self-healing audit without rendering UI elements
      auditAndSelfHeal();
    }
  }, [user]);

  return null; // Return null so no visual cards render on the frontend
}

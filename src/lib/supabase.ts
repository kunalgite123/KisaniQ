import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://cktgyhgapibyekxeiaug.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdGd5aGdhcGlieWVreGVpYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTY5MzksImV4cCI6MjEwMzU3MjkzOX0", "kneGuJLWKZRyIy9eQBqxvabRhjssyFR0ZfJORf8Og44"].join(".");

// Centralized Supabase Client Singleton using Supabase Auth as Source of Truth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "kisaniq-supabase-auth"
  }
});

// Profile interface mapping to auth.users & profiles table
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// User-friendly error message translator for Supabase Auth
export function getFriendlyAuthError(error: any): string {
  if (!error) return "An unexpected error occurred.";
  const message = typeof error === "string" ? error : error.message || "";

  if (
    message.includes("Invalid login credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("Invalid password")
  ) {
    return "Incorrect password or email. Please try again.";
  }
  if (message.includes("User already registered") || message.includes("already_exists")) {
    return "An account with this email address already exists. Try signing in instead.";
  }
  if (message.includes("Password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (message.includes("Email not confirmed")) {
    return "This user account is awaiting email confirmation in Supabase. Disable 'Confirm email' in Supabase Auth Settings or run the SQL auto-confirm script.";
  }
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "We couldn't connect to Supabase authentication service. Please check your network connection.";
  }

  return message || "Authentication failed. Please try again.";
}

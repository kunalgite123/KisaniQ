import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, UserProfile, getFriendlyAuthError } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (fullName: string, email: string, phone: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch farmer profile from Supabase `profiles` table and merge with auth.users data
  async function fetchProfile(currentUser: User) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      const mergedProfile: UserProfile = {
        id: currentUser.id,
        full_name: data?.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Kisan Farmer",
        email: data?.email || currentUser.email || "",
        phone: data?.phone || currentUser.user_metadata?.phone || currentUser.phone || ""
      };

      setProfile(mergedProfile);

      // Auto-backfill NULL email/phone into public.profiles if missing in Supabase
      if (!data || !data.email || !data.phone) {
        const { error } = await supabase.from("profiles").upsert({
          id: currentUser.id,
          full_name: mergedProfile.full_name,
          email: mergedProfile.email,
          phone: mergedProfile.phone,
          updated_at: new Date().toISOString()
        });
        if (error) {
          await supabase.from("profiles").insert({
            id: currentUser.id,
            full_name: mergedProfile.full_name,
            email: mergedProfile.email,
            phone: mergedProfile.phone,
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch {
      const fallbackProfile: UserProfile = {
        id: currentUser.id,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Kisan Farmer",
        email: currentUser.email || "",
        phone: currentUser.user_metadata?.phone || ""
      };
      setProfile(fallbackProfile);
    }
  }

  useEffect(() => {
    // 1. Initial Session Restoration from Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Real-time Supabase Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase Email/Password Login
  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        return { error: getFriendlyAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: getFriendlyAuthError(err) };
    }
  }

  // Real Supabase Signup - Direct Password Auth with Profile Sync
  async function signUp(fullName: string, email: string, phone: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = fullName.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone
          }
        }
      });

      if (error) {
        return { error: getFriendlyAuthError(error) };
      }

      // Upsert full identity into Supabase `public.profiles` table
      if (data.user) {
        try {
          const { error: upsertErr } = await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            updated_at: new Date().toISOString()
          });

          if (upsertErr) {
            await supabase.from("profiles").insert({
              id: data.user.id,
              full_name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              updated_at: new Date().toISOString()
            });
          }
        } catch {}
      }

      // Automatically sign in immediately with email & password
      if (!data.session) {
        const loginRes = await signIn(cleanEmail, password);
        if (loginRes.error && loginRes.error.includes("Email not confirmed")) {
          return { error: null, needsConfirmation: true };
        }
      }

      return { error: null, needsConfirmation: false };
    } catch (err: any) {
      return { error: getFriendlyAuthError(err) };
    }
  }

  // Real Supabase Sign Out
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  // Real Supabase Forgot Password Reset Email
  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) return { error: getFriendlyAuthError(error) };
      return { error: null };
    } catch (err) {
      return { error: getFriendlyAuthError(err) };
    }
  }

  // Real Supabase Update Password
  async function updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: getFriendlyAuthError(error) };
      return { error: null };
    } catch (err) {
      return { error: getFriendlyAuthError(err) };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

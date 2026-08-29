# KisaniQ — Supabase Database & Row Level Security (RLS) Setup Guide

This document defines the SQL schema and strict Row Level Security (RLS) policies for **KisaniQ**.

---

## 1. Profiles Table (`profiles`)

The `profiles` table stores farmer metadata associated with `auth.users.id`.

```sql
-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## 2. User Farm Diagnostics Table (`farm_scans` - Optional)

If storing leaf scans per farmer:

```sql
-- Create Farm Scans Table
CREATE TABLE IF NOT EXISTS public.farm_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  disease_detected TEXT,
  severity TEXT,
  confidence_pct NUMERIC,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.farm_scans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read & write their own scan records
CREATE POLICY "Users can manage own farm scans"
  ON public.farm_scans
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 3. Security Checkpoints

- **Service Role Key**: NEVER used in client-side code (`VITE_SUPABASE_ANON_KEY` is used exclusively).
- **Session Persistence**: Managed automatically by Supabase Auth with PKCE flow.
- **Data Isolation**: Enforced via `auth.uid() = user_id` database policies.

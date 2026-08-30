-- ============================================================
-- KISAN SETU — TRUST & VERIFICATION ENGINE SCHEMA
-- Challenge 2: The Bad Reading
-- ============================================================

-- 1. Claims Table
CREATE TABLE IF NOT EXISTS public.verification_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claim_text TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  claim_type VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  crop VARCHAR(100),
  claim_date TIMESTAMP WITH TIME ZONE,
  extracted_value NUMERIC,
  extracted_unit VARCHAR(50),
  status VARCHAR(50) DEFAULT 'UNVERIFIED',
  verdict VARCHAR(50),
  reason TEXT,
  related_module VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- 2. Evidence Records Table
CREATE TABLE IF NOT EXISTS public.verification_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES public.verification_claims(id) ON DELETE CASCADE,
  source_name VARCHAR(150) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  authority_level INTEGER NOT NULL CHECK (authority_level BETWEEN 1 AND 4),
  source_url TEXT,
  evidence_text TEXT NOT NULL,
  observed_value NUMERIC,
  unit VARCHAR(50),
  observed_at TIMESTAMP WITH TIME ZONE,
  retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  relevance_score NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Verification Results Table
CREATE TABLE IF NOT EXISTS public.verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES public.verification_claims(id) ON DELETE CASCADE,
  verdict VARCHAR(50) NOT NULL,
  evidence_quality VARCHAR(50) NOT NULL,
  explanation TEXT NOT NULL,
  comparison_data JSONB DEFAULT '{}'::jsonb,
  related_module VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.verification_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_results ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Users can view own or public claims"
  ON public.verification_claims FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own claims"
  ON public.verification_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public read evidence"
  ON public.verification_evidence FOR SELECT
  USING (true);

CREATE POLICY "Public read results"
  ON public.verification_results FOR SELECT
  USING (true);

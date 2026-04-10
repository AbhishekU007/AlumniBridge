-- Supabase Database Schema for Alumni Networking Portal

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('alumni', 'student')) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  current_company TEXT,
  job_title TEXT,
  graduation_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Skills Table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Enable RLS for skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are viewable by everyone." ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert skills." ON public.skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Create Profile Skills (Many-to-Many Join Table)
CREATE TABLE public.profile_skills (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

-- Enable RLS for profile_skills
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile skills are viewable by everyone." ON public.profile_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile skills." ON public.profile_skills FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert their own profile skills." ON public.profile_skills FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own profile skills." ON public.profile_skills FOR DELETE USING (auth.uid() = profile_id);

-- 4. Create Events Table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
CREATE POLICY "Alumni can create events." ON public.events FOR INSERT WITH CHECK (
  auth.uid() = author_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'alumni')
);
CREATE POLICY "Users can update their own events." ON public.events FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own events." ON public.events FOR DELETE USING (auth.uid() = author_id);

-- 5. Create Messages Table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages." ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages." ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);


-- Realtime Setup
-- Enable real-time subscriptions for messages table
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Helper Function: Update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Dummy Data for Skills
INSERT INTO public.skills (name) VALUES 
('React'), ('Next.js'), ('Node.js'), ('TypeScript'), 
('Python'), ('Machine Learning'), ('Java'), ('Spring Boot'),
('AWS'), ('UI/UX Design'), ('Figma'), ('Product Management')
ON CONFLICT (name) DO NOTHING;

-- Instruction for Dummy Users:
-- Due to Supabase Auth, you must manually sign up two users via the frontend or Supabase Studio Auth panel.
-- Once registered, you can log in, edit their profiles, and use the portal!

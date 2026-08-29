-- ============================================================
-- PCAS (Project Clean & Seen) — Supabase Migration
-- Run this in the Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. ADMIN USERS ───
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK(role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. CONTENT (key-value per section) ───
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ─── 3. IMPACT STATS ───
CREATE TABLE IF NOT EXISTS impact_stats (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. EVENTS ───
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  type TEXT DEFAULT 'volunteer',
  status TEXT DEFAULT 'upcoming',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. PARTNERS ───
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. PROGRAMS ───
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  details TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. IMAGES (gallery uploads) ───
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  caption TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. VOLUNTEER SIGNUPS ───
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. CONTACT SUBMISSIONS ───
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 10. DONATIONS ───
CREATE TABLE IF NOT EXISTS donations (
  id BIGSERIAL PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount REAL NOT NULL,
  method TEXT DEFAULT 'venmo',
  note TEXT,
  anonymous INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 11. ADMIN PERMISSIONS ───
CREATE TABLE IF NOT EXISTS admin_permissions (
  user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  enabled INTEGER DEFAULT 0,
  UNIQUE(user_id, permission)
);

-- ─── 12. VOLUNTEER HOURS (NEW) ───
CREATE TABLE IF NOT EXISTS volunteer_hours (
  id BIGSERIAL PRIMARY KEY,
  volunteer_name TEXT NOT NULL,
  volunteer_email TEXT NOT NULL,
  hours REAL NOT NULL CHECK (hours > 0),
  activity TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ───
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_sort ON images(sort_order);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_status ON volunteer_hours(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_email ON volunteer_hours(volunteer_email);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);

-- ─── ROW LEVEL SECURITY ───
-- Enable RLS on all tables (service role key bypasses these)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read public content)
CREATE POLICY "Public read content" ON content FOR SELECT USING (true);
CREATE POLICY "Public read impact_stats" ON impact_stats FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read images" ON images FOR SELECT USING (true);
CREATE POLICY "Public read donations_summary" ON donations FOR SELECT USING (true);

-- Public insert policies (anyone can submit forms)
CREATE POLICY "Public insert volunteer_signups" ON volunteer_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert volunteer_hours" ON volunteer_hours FOR INSERT WITH CHECK (true);

-- No public access to admin tables (service role handles all admin ops)
-- admin_users: no public policies = no public access
-- admin_permissions: no public policies = no public access

-- ─── SEED DEFAULT OWNER ───
-- Password: pcas2025admin (bcrypt hash)
-- Only insert if no owner exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'owner') THEN
    INSERT INTO admin_users (username, password_hash, role) VALUES
      ('admin', '$2a$10$rQEY7G1dG1dG1dG1dG1dG.dummyHashForInitialSetup00000000000', 'owner');
  END IF;
END $$;

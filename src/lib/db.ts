import { getSupabase } from './supabase';
import bcrypt from 'bcryptjs';

type SupabaseClient = ReturnType<typeof getSupabase>;

let _initialized = false;

async function ensureInitialized(db: SupabaseClient) {
  if (_initialized) return;
  
  // Check if owner exists
  const { data: owners } = await db
    .from('admin_users')
    .select('id')
    .eq('role', 'owner')
    .limit(1);

  if (!owners || owners.length === 0) {
    const hash = await bcrypt.hash('pcas2026admin123*', 10);
    await db.from('admin_users').insert({
      username: 'admin',
      password_hash: hash,
      role: 'owner',
    });
  }

  // Seed content if empty
  const { count: contentCount } = await db
    .from('content')
    .select('*', { count: 'exact', head: true });

  if (contentCount === 0) {
    await seedContent(db);
  }

  // Seed impact stats if empty
  const { count: statsCount } = await db
    .from('impact_stats')
    .select('*', { count: 'exact', head: true });

  if (statsCount === 0) {
    await seedImpactStats(db);
  }

  // Seed programs if empty
  const { count: programsCount } = await db
    .from('programs')
    .select('*', { count: 'exact', head: true });

  if (programsCount === 0) {
    await seedPrograms(db);
  }

  _initialized = true;
}

async function getDb(): Promise<SupabaseClient> {
  const db = getSupabase();
  await ensureInitialized(db);
  return db;
}

// ═══════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════

async function seedContent(db: SupabaseClient) {
  const rows = [
    ['home', 'hero_title', 'Project Clean & Seen', 'text'],
    ['home', 'hero_subtitle', 'Advancing hygiene equity, one kit at a time.', 'text'],
    ['home', 'hero_description', 'We are a youth-led nonprofit providing essential hygiene products and support to individuals and communities experiencing homelessness, hardship, or limited access to basic necessities.', 'text'],
    ['home', 'mission', 'To advance hygiene equity by providing essential hygiene products and support to individuals and communities experiencing homelessness, hardship, or limited access to basic necessities.', 'text'],
    ['home', 'tension_1', 'Soap. A toothbrush. Deodorant.', 'text'],
    ['home', 'tension_2', 'Things most people never think twice about.', 'text'],
    ['home', 'tension_3', 'But for millions facing homelessness and hardship, these basics are out of reach.', 'text'],
    ['home', 'tension_4', 'No one should have to choose between food and soap.', 'text'],
    ['home', 'response_1', 'Project Clean & Seen was founded in November 2025 by young people in the Bay Area who saw a gap no one was filling.', 'text'],
    ['home', 'response_2', 'We are youth-led, community-driven, and focused on a single mission: making sure everyone has access to the basic necessities that preserve dignity and health.', 'text'],
    ['home', 'response_3', 'From assembling hygiene kits in living rooms to organizing donation drives across schools and shelters, we are building something that lasts.', 'text'],
    ['home', 'close_headline', "Clean isn't a privilege. It's a right.", 'text'],
    ['home', 'close_body', 'Whether you donate, volunteer, or partner with us, every action advances hygiene equity in our communities.', 'text'],

    ['about', 'story', 'Project Clean & Seen (PCAS) was founded in November 2025 by a group of young people passionate about making hygiene products accessible to everyone. Based in the Bay Area, we focus on creating practical, community-driven programs that bridge the gap in hygiene equity.\n\nAs a youth-led organization, we believe that everyone deserves access to basic necessities like soap, toothbrushes, and deodorant. No one should have to choose between food and hygiene.\n\nOur approach combines direct action with community education. We collect donations, assemble hygiene kits, and partner with organizations already serving communities in need.', 'text'],
    ['about', 'why_hygiene', 'Hygiene equity matters because access to basic hygiene products is fundamental to human dignity, health, and opportunity. Without access to soap, toothpaste, or deodorant, individuals face increased health risks, social stigma, and barriers to employment and education.', 'text'],
    ['about', 'youth_led', 'PCAS is proudly youth-led. We believe that young people have the power and responsibility to drive change in their communities.', 'text'],

    ['programs', 'section_title', 'Our Programs', 'text'],
    ['programs', 'section_description', 'Through our programs, we make hygiene products accessible to those who need them most.', 'text'],

    ['impact', 'section_title', 'Our Impact', 'text'],
    ['impact', 'section_description', "Every kit assembled, every product donated, and every volunteer hour contributes to a more equitable community. Here's what we've accomplished together.", 'text'],

    ['events', 'section_title', 'Upcoming Events', 'text'],
    ['events', 'section_description', 'Join us at our upcoming events to make a difference in your community.', 'text'],

    ['partners', 'section_title', 'Our Partners', 'text'],
    ['partners', 'section_description', 'We collaborate with nonprofits, schools, community organizations, student groups, businesses, and other organizations to expand our impact.', 'text'],

    ['contact', 'section_title', 'Get In Touch', 'text'],
    ['contact', 'section_description', "Have questions? Want to get involved? We'd love to hear from you.", 'text'],
    ['contact', 'email', 'projectcleanseen@gmail.com', 'text'],
    ['contact', 'instagram', '@projectcleanseen', 'text'],

    ['get_involved', 'volunteer_title', 'Volunteer', 'text'],
    ['get_involved', 'volunteer_description', 'Join our team and help us assemble hygiene kits, organize drives, and support community events.', 'text'],
    ['get_involved', 'donate_title', 'Donate', 'text'],
    ['get_involved', 'donate_description', 'Support our hygiene programs through product or monetary donations.', 'text'],
    ['get_involved', 'partner_title', 'Partner With Us', 'text'],
    ['get_involved', 'partner_description', 'Organizations can collaborate with us on donation drives, hygiene kits, and community programs.', 'text'],
    ['get_involved', 'request_title', 'Request Support', 'text'],
    ['get_involved', 'request_description', 'Organizations serving communities in need can reach out about potential hygiene-product support.', 'text'],
    ['get_involved', 'venmo_username', '@projectcleanseen', 'text'],
    ['get_involved', 'paypal_email', 'projectcleanseen@gmail.com', 'text'],
    ['get_involved', 'venmo_note', 'After sending your donation, please fill out the form below so we can track and thank you properly.', 'text'],
  ];

  const insertRows = rows.map(([section, key, value, type]) => ({
    section, key, value, type,
  }));

  // Insert in batches of 20 to avoid payload limits
  for (let i = 0; i < insertRows.length; i += 20) {
    const batch = insertRows.slice(i, i + 20);
    await db.from('content').upsert(batch, { onConflict: 'section,key' });
  }
}

async function seedImpactStats(db: SupabaseClient) {
  const stats = [
    { label: 'Hygiene Kits Assembled', value: 150, icon: 'Kit', sort_order: 1 },
    { label: 'Individual Products Collected', value: 2000, icon: 'Col', sort_order: 2 },
    { label: 'People Reached', value: 300, icon: 'Ppl', sort_order: 3 },
    { label: 'Donation Drives Completed', value: 8, icon: 'Drv', sort_order: 4 },
    { label: 'Volunteers Involved', value: 50, icon: 'Vol', sort_order: 5 },
    { label: 'Partner Organizations', value: 10, icon: 'Org', sort_order: 6 },
    { label: 'Volunteer Hours', value: 400, icon: 'Hrs', sort_order: 7 },
  ];

  await db.from('impact_stats').insert(stats);
}

async function seedPrograms(db: SupabaseClient) {
  const programs = [
    {
      title: 'Hygiene Kit Drives',
      description: 'We collect donated hygiene products and assemble them into complete hygiene kits for community organizations and people in need.',
      details: 'Items include soap, shampoo, toothbrushes, toothpaste, deodorant, lotion, hand sanitizer, feminine hygiene products, razors, and new socks.',
      icon: 'Kit',
      sort_order: 1,
    },
    {
      title: 'Community Donation Drives',
      description: 'We organize donation drives for schools, shelters, nonprofits, and community organizations based on their specific needs.',
      details: 'We have organized collections of school and hygiene supplies for elementary school students and are working on future campaigns.',
      icon: 'Col',
      sort_order: 2,
    },
    {
      title: 'Volunteer Programs',
      description: 'Volunteers help us collect and sort donations, assemble hygiene kits, organize drives, and support events.',
      details: 'We want to make it easy for someone to sign up as a volunteer and see upcoming opportunities.',
      icon: 'Ppl',
      sort_order: 3,
    },
    {
      title: 'Community Outreach',
      description: 'We engage with communities through events and awareness campaigns about hygiene equity.',
      details: 'We are currently supporting Stitchers On A Mission through a hygiene-kit drive.',
      icon: 'Out',
      sort_order: 4,
    },
  ];

  await db.from('programs').insert(programs);
}

// ═══════════════════════════════════════════
// CONTENT HELPERS
// ═══════════════════════════════════════════

export async function getContent(section: string): Promise<Record<string, string>> {
  const db = await getDb();
  const { data } = await db
    .from('content')
    .select('key, value')
    .eq('section', section);

  const result: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      result[row.key] = row.value ?? '';
    }
  }
  return result;
}

export async function getAllContent(): Promise<Record<string, Record<string, string>>> {
  const db = await getDb();
  const { data } = await db.from('content').select('section, key, value');

  const result: Record<string, Record<string, string>> = {};
  if (data) {
    for (const row of data) {
      if (!result[row.section]) result[row.section] = {};
      result[row.section][row.key] = row.value ?? '';
    }
  }
  return result;
}

export async function updateContent(section: string, key: string, value: string) {
  const db = await getDb();
  await db
    .from('content')
    .upsert(
      { section, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'section,key' }
    );
}

// ═══════════════════════════════════════════
// IMPACT STATS
// ═══════════════════════════════════════════

export interface ImpactStat {
  id: number;
  label: string;
  value: number;
  icon: string;
  sort_order: number;
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  const db = await getDb();
  const { data } = await db
    .from('impact_stats')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as ImpactStat[];
}

export async function updateImpactStat(id: number, value: number) {
  const db = await getDb();
  await db
    .from('impact_stats')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function createImpactStat(label: string, value: number, icon: string, sort_order: number) {
  const db = await getDb();
  await db.from('impact_stats').insert({ label, value, icon, sort_order });
}

export async function deleteImpactStat(id: number) {
  const db = await getDb();
  await db.from('impact_stats').delete().eq('id', id);
}

// ═══════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
}

export async function getEvents(status?: string): Promise<Event[]> {
  const db = await getDb();
  let query = db.from('events').select('*').order('date', { ascending: true });
  if (status) query = query.eq('status', status);
  const { data } = await query;
  return (data ?? []) as Event[];
}

export async function createEvent(title: string, description: string, date: string, time: string, location: string, type: string) {
  const db = await getDb();
  await db.from('events').insert({ title, description, date, time, location, type });
}

export async function updateEvent(id: number, data: { title?: string; description?: string; date?: string; time?: string; location?: string; type?: string; status?: string }) {
  const db = await getDb();
  const update: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) update[key] = val;
  }
  if (Object.keys(update).length === 0) return;
  await db.from('events').update(update).eq('id', id);
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  await db.from('events').delete().eq('id', id);
}

// ═══════════════════════════════════════════
// PARTNERS
// ═══════════════════════════════════════════

export interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
}

export async function getPartners(): Promise<Partner[]> {
  const db = await getDb();
  const { data } = await db
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as Partner[];
}

export async function createPartner(name: string, description: string, logo_url: string, website_url: string, sort_order: number) {
  const db = await getDb();
  await db.from('partners').insert({ name, description, logo_url, website_url, sort_order });
}

export async function updatePartner(id: number, data: { name?: string; description?: string; logo_url?: string; website_url?: string; sort_order?: number }) {
  const db = await getDb();
  const update: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) update[key] = val;
  }
  if (Object.keys(update).length === 0) return;
  await db.from('partners').update(update).eq('id', id);
}

export async function deletePartner(id: number) {
  const db = await getDb();
  await db.from('partners').delete().eq('id', id);
}

// ═══════════════════════════════════════════
// PROGRAMS
// ═══════════════════════════════════════════

export interface Program {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: string;
  sort_order: number;
}

export async function getPrograms(): Promise<Program[]> {
  const db = await getDb();
  const { data } = await db
    .from('programs')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as Program[];
}

export async function createProgram(title: string, description: string, details: string, icon: string, sort_order: number) {
  const db = await getDb();
  await db.from('programs').insert({ title, description, details, icon, sort_order });
}

export async function updateProgram(id: number, data: { title?: string; description?: string; details?: string; icon?: string; sort_order?: number }) {
  const db = await getDb();
  const update: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) update[key] = val;
  }
  if (Object.keys(update).length === 0) return;
  await db.from('programs').update(update).eq('id', id);
}

export async function deleteProgram(id: number) {
  const db = await getDb();
  await db.from('programs').delete().eq('id', id);
}

// ═══════════════════════════════════════════
// VOLUNTEER SIGNUPS
// ═══════════════════════════════════════════

export interface VolunteerSignup {
  id: number;
  name: string;
  email: string;
  phone: string;
  interests: string;
  message: string;
  created_at: string;
}

export async function createVolunteerSignup(name: string, email: string, phone: string, interests: string, message: string) {
  const db = await getDb();
  await db.from('volunteer_signups').insert({ name, email, phone, interests, message });
}

export async function getVolunteerSignups(): Promise<VolunteerSignup[]> {
  const db = await getDb();
  const { data } = await db
    .from('volunteer_signups')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as VolunteerSignup[];
}

// ═══════════════════════════════════════════
// CONTACT SUBMISSIONS
// ═══════════════════════════════════════════

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  created_at: string;
}

export async function createContactSubmission(name: string, email: string, subject: string, message: string, type: string) {
  const db = await getDb();
  await db.from('contact_submissions').insert({ name, email, subject, message, type });
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const db = await getDb();
  const { data } = await db
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as ContactSubmission[];
}

// ═══════════════════════════════════════════
// DONATIONS
// ═══════════════════════════════════════════

export interface Donation {
  id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  method: string;
  note: string;
  anonymous: number;
  created_at: string;
}

export async function createDonation(donor_name: string, donor_email: string, amount: number, method: string, note: string, anonymous: number) {
  const db = await getDb();
  await db.from('donations').insert({ donor_name, donor_email, amount, method, note, anonymous });
}

export async function getDonations(): Promise<Donation[]> {
  const db = await getDb();
  const { data } = await db
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Donation[];
}

export async function getDonationSummary() {
  const db = await getDb();

  const { data: allAmounts } = await db
    .from('donations')
    .select('amount');

  const { count } = await db
    .from('donations')
    .select('*', { count: 'exact', head: true });

  const { data: recent } = await db
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const total = (allAmounts ?? []).reduce((sum, d) => sum + (d.amount || 0), 0);

  return { total, count: count ?? 0, recent: (recent ?? []) as Donation[] };
}

export async function deleteDonation(id: number) {
  const db = await getDb();
  await db.from('donations').delete().eq('id', id);
}

// ═══════════════════════════════════════════
// VOLUNTEER HOURS
// ═══════════════════════════════════════════

export interface VolunteerHourLog {
  id: number;
  volunteer_name: string;
  volunteer_email: string;
  hours: number;
  activity: string;
  date: string;
  notes: string;
  status: string;
  approved_by: string;
  approved_at: string;
  created_at: string;
}

export async function logVolunteerHours(
  volunteer_name: string,
  volunteer_email: string,
  hours: number,
  activity: string,
  date: string,
  notes: string
) {
  const db = await getDb();
  const { error } = await db.from('volunteer_hours').insert({
    volunteer_name,
    volunteer_email,
    hours,
    activity,
    date,
    notes: notes || '',
    status: 'pending',
  });
  if (error) throw error;
}

export async function getVolunteerHours(status?: string): Promise<VolunteerHourLog[]> {
  const db = await getDb();
  let query = db
    .from('volunteer_hours')
    .select('*')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data } = await query;
  return (data ?? []) as VolunteerHourLog[];
}

export async function getVolunteerHoursByEmail(email: string): Promise<VolunteerHourLog[]> {
  const db = await getDb();
  const { data } = await db
    .from('volunteer_hours')
    .select('*')
    .eq('volunteer_email', email)
    .order('created_at', { ascending: false });
  return (data ?? []) as VolunteerHourLog[];
}

export async function approveVolunteerHours(id: number, approvedBy: string) {
  const db = await getDb();
  const { error } = await db
    .from('volunteer_hours')
    .update({
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function rejectVolunteerHours(id: number) {
  const db = await getDb();
  const { error } = await db
    .from('volunteer_hours')
    .update({ status: 'rejected' })
    .eq('id', id);
  if (error) throw error;
}

export async function getVolunteerHoursStats() {
  const db = await getDb();

  // Total approved hours
  const { data: approved } = await db
    .from('volunteer_hours')
    .select('hours')
    .eq('status', 'approved');

  const totalApproved = (approved ?? []).reduce((sum, r) => sum + (r.hours || 0), 0);

  // Pending count
  const { count: pendingCount } = await db
    .from('volunteer_hours')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Unique volunteers
  const { data: allLogs } = await db
    .from('volunteer_hours')
    .select('volunteer_email')
    .eq('status', 'approved');

  const uniqueVolunteers = new Set((allLogs ?? []).map(r => r.volunteer_email)).size;

  // Total logs
  const { count: totalLogs } = await db
    .from('volunteer_hours')
    .select('*', { count: 'exact', head: true });

  return {
    totalApprovedHours: totalApproved,
    pendingCount: pendingCount ?? 0,
    uniqueVolunteers,
    totalLogs: totalLogs ?? 0,
  };
}

export async function deleteVolunteerHours(id: number) {
  const db = await getDb();
  const { error } = await db.from('volunteer_hours').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// ADMIN AUTH
// ═══════════════════════════════════════════

export async function getAdminUser(username: string) {
  const db = await getDb();
  const { data } = await db
    .from('admin_users')
    .select('id, username, password_hash, role, created_at')
    .eq('username', username)
    .single();
  return data;
}

export async function getAllAdminUsers() {
  const db = await getDb();
  const { data } = await db
    .from('admin_users')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: true });
  return data ?? [];
}

export async function createAdminUser(username: string, password: string, role: 'owner' | 'admin' = 'admin') {
  const db = await getDb();
  const hash = await bcrypt.hash(password, 10);
  const { error } = await db.from('admin_users').insert({
    username,
    password_hash: hash,
    role,
  });
  if (error) throw error;
}

export async function deleteAdminUser(id: number) {
  const db = await getDb();

  // Check: don't allow deleting the last owner
  const { data: user } = await db
    .from('admin_users')
    .select('role')
    .eq('id', id)
    .single();

  if (user?.role === 'owner') {
    const { count } = await db
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'owner');
    if ((count ?? 0) <= 1) {
      throw new Error('Cannot delete the last owner');
    }
  }

  const { error } = await db.from('admin_users').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAdminUserRole(id: number, role: 'owner' | 'admin') {
  const db = await getDb();
  const { error } = await db
    .from('admin_users')
    .update({ role })
    .eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════

export const ALL_PERMISSIONS = [
  { key: 'content_edit', label: 'Edit Site Content', description: 'Edit text, images, and copy on all pages' },
  { key: 'impact_edit', label: 'Edit Impact Stats', description: 'Modify impact numbers and statistics' },
  { key: 'events_edit', label: 'Manage Events', description: 'Create, edit, and delete events' },
  { key: 'partners_edit', label: 'Manage Partners', description: 'Add, edit, and remove partner organizations' },
  { key: 'donations_view', label: 'View Donations', description: 'View donation records and summaries' },
  { key: 'gallery_edit', label: 'Manage Gallery', description: 'Upload, reorder, and delete gallery images' },
  { key: 'live_preview', label: 'Live Preview Editor', description: 'Use the visual inline editor to modify the site' },
  { key: 'user_management', label: 'Manage Users', description: 'Create, edit, and delete admin accounts' },
  { key: 'volunteer_hours', label: 'Manage Volunteer Hours', description: 'Approve, reject, and view volunteer hour logs' },
] as const;

export type PermissionKey = typeof ALL_PERMISSIONS[number]['key'];

export async function getUserPermissions(userId: number): Promise<PermissionKey[]> {
  const db = await getDb();
  const { data } = await db
    .from('admin_permissions')
    .select('permission')
    .eq('user_id', userId)
    .eq('enabled', 1);
  return (data ?? []).map(r => r.permission as PermissionKey);
}

export async function setUserPermissions(userId: number, permissions: PermissionKey[]) {
  const db = await getDb();

  // Delete existing
  await db.from('admin_permissions').delete().eq('user_id', userId);

  // Insert new
  if (permissions.length > 0) {
    const rows = permissions.map(p => ({
      user_id: userId,
      permission: p,
      enabled: 1,
    }));
    await db.from('admin_permissions').insert(rows);
  }
}

export async function hasPermission(userId: number, permission: PermissionKey): Promise<boolean> {
  const db = await getDb();
  const { data } = await db
    .from('admin_permissions')
    .select('enabled')
    .eq('user_id', userId)
    .eq('permission', permission)
    .single();
  return data?.enabled === 1;
}

// ═══════════════════════════════════════════
// IMAGES (GALLERY)
// ═══════════════════════════════════════════

export interface ImageRecord {
  id: number;
  url: string;
  filename: string;
  caption: string;
  alt: string;
  category: string;
  sort_order: number;
  size: number;
  mime_type: string;
  created_at: string;
}

export async function getImages(): Promise<ImageRecord[]> {
  const db = await getDb();
  const { data } = await db
    .from('images')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  return (data ?? []) as ImageRecord[];
}

export async function createImage(url: string, filename: string, caption: string, alt: string, category: string, size: number, mime_type: string) {
  const db = await getDb();

  // Get next sort order
  const { data: maxRow } = await db
    .from('images')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await db
    .from('images')
    .insert({
      url,
      filename,
      caption: caption || '',
      alt: alt || '',
      category: category || 'general',
      sort_order: nextOrder,
      size: size || 0,
      mime_type: mime_type || '',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateImage(id: number, data: { caption?: string; alt?: string; category?: string; sort_order?: number }) {
  const db = await getDb();
  const update: Record<string, unknown> = {};
  if (data.caption !== undefined) update.caption = data.caption;
  if (data.alt !== undefined) update.alt = data.alt;
  if (data.category !== undefined) update.category = data.category;
  if (data.sort_order !== undefined) update.sort_order = data.sort_order;
  if (Object.keys(update).length === 0) return;
  const { error } = await db.from('images').update(update).eq('id', id);
  if (error) throw error;
}

export async function deleteImage(id: number): Promise<ImageRecord | null> {
  const db = await getDb();
  // Get image before deleting (for file cleanup)
  const { data: image } = await db
    .from('images')
    .select('*')
    .eq('id', id)
    .single();
  const { error } = await db.from('images').delete().eq('id', id);
  if (error) throw error;
  return (image ?? null) as ImageRecord | null;
}

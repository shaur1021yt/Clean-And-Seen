import { NextResponse } from 'next/server';
import { getImpactStats, getEvents, getPartners, getVolunteerSignups, getContactSubmissions, getDonationSummary } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [stats, events, partners, volunteers, contacts, donations] = await Promise.all([
    getImpactStats(),
    getEvents(),
    getPartners(),
    getVolunteerSignups(),
    getContactSubmissions(),
    getDonationSummary(),
  ]);

  return NextResponse.json({
    stats,
    events: events.length,
    partners: partners.length,
    volunteers: volunteers.length,
    contacts: contacts.length,
    donations: donations.total,
    donationCount: donations.count,
  });
}

import { NextResponse } from 'next/server';
import { getDonations, getDonationSummary, createDonation, deleteDonation } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';
import { requirePermission } from '@/lib/api-guard';

// GET: Public donation summary / Admin: full list
export async function GET() {
  const user = await getAuthFromCookies();
  
  if (user) {
    const [donations, summary] = await Promise.all([getDonations(), getDonationSummary()]);
    return NextResponse.json({ donations, summary, isAdmin: true });
  }
  
  const summary = await getDonationSummary();
  return NextResponse.json({ summary, isAdmin: false });
}

// POST: Record a donation (public for self-reporting after Venmo)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donor_name, donor_email, amount, method, note, anonymous } = body;

    if (!donor_name || !amount) {
      return NextResponse.json({ error: 'Name and amount are required' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    await createDonation(
      donor_name,
      donor_email || '',
      amount,
      method || 'venmo',
      note || '',
      anonymous ? 1 : 0
    );

    return NextResponse.json({ success: true, message: 'Donation recorded' });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 });
  }
}

// DELETE: Remove a donation (admin with donations_view permission)
export async function DELETE(request: Request) {
  const { error } = await requirePermission('donations_view');
  if (error) return error;

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Donation ID required' }, { status: 400 });
    }
    await deleteDonation(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 });
  }
}

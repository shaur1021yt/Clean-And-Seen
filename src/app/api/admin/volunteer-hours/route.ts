import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/api-guard';
import { getVolunteerHours, approveVolunteerHours, rejectVolunteerHours, getVolunteerHoursStats, deleteVolunteerHours } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

// GET: List all volunteer hours (admin with volunteer_hours permission)
export async function GET() {
  const { error } = await requirePermission('volunteer_hours');
  if (error) return error;

  const [hours, stats] = await Promise.all([
    getVolunteerHours(),
    getVolunteerHoursStats(),
  ]);

  return NextResponse.json({ hours, stats });
}

// PUT: Approve or reject hours
export async function PUT(request: Request) {
  const { error } = await requirePermission('volunteer_hours');
  if (error) return error;

  const user = await getAuthFromCookies();

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
    }

    if (action === 'approve') {
      await approveVolunteerHours(id, user?.username || 'admin');
    } else if (action === 'reject') {
      await rejectVolunteerHours(id);
    } else {
      return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating hours:', err);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}

// DELETE: Remove a hours entry
export async function DELETE(request: Request) {
  const { error } = await requirePermission('volunteer_hours');
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await deleteVolunteerHours(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting hours:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getImpactStats, updateImpactStat, createImpactStat, deleteImpactStat } from '@/lib/db';
import { requirePermission } from '@/lib/api-guard';

export async function GET() {
  const { error } = await requirePermission('impact_edit');
  if (error) return error;

  const stats = await getImpactStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const { error } = await requirePermission('impact_edit');
  if (error) return error;

  try {
    const { label, value, icon, sort_order } = await request.json();
    if (!label) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }
    await createImpactStat(label, value || 0, icon || '▲', sort_order || 0);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requirePermission('impact_edit');
  if (error) return error;

  try {
    const { id, value } = await request.json();
    if (!id || value === undefined) {
      return NextResponse.json({ error: 'ID and value are required' }, { status: 400 });
    }
    await updateImpactStat(id, value);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating stat:', err);
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requirePermission('impact_edit');
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteImpactStat(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/db';
import { requirePermission } from '@/lib/api-guard';

export async function GET() {
  const { error } = await requirePermission('partners_edit');
  if (error) return error;

  const partners = await getPartners();
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  const { error } = await requirePermission('partners_edit');
  if (error) return error;

  try {
    const { name, description, logo_url, website_url, sort_order } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    await createPartner(name, description || '', logo_url || '', website_url || '', sort_order || 0);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requirePermission('partners_edit');
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await updatePartner(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requirePermission('partners_edit');
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deletePartner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}

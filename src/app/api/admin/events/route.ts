import { NextResponse } from 'next/server';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/db';
import { requirePermission } from '@/lib/api-guard';

export async function GET() {
  const { error } = await requirePermission('events_edit');
  if (error) return error;

  const events = await getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const { error } = await requirePermission('events_edit');
  if (error) return error;

  try {
    const { title, description, date, time, location, type } = await request.json();
    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }
    await createEvent(title, description || '', date, time || '', location || '', type || 'volunteer');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requirePermission('events_edit');
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await updateEvent(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requirePermission('events_edit');
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

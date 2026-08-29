import { NextResponse } from 'next/server';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const programs = await getPrograms();
  return NextResponse.json(programs);
}

export async function POST(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, details, icon, sort_order } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    await createProgram(title, description || '', details || '', icon || '◇', sort_order || 0);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await updateProgram(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteProgram(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}

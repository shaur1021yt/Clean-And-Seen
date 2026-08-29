import { NextResponse } from 'next/server';
import { getAllContent, updateContent } from '@/lib/db';
import { requirePermission } from '@/lib/api-guard';

export async function GET() {
  const { user, error } = await requirePermission('content_edit');
  if (error) return error;

  const content = await getAllContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const { user, error } = await requirePermission('content_edit');
  if (error) return error;

  try {
    const { section, data } = await request.json();

    if (!section || !data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(data)) {
      await updateContent(section, key, value as string);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

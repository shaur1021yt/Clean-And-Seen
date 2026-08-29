import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/api-guard';
import { getImages, createImage, updateImage, deleteImage } from '@/lib/db';

export async function GET() {
  const { error } = await requirePermission('gallery_edit');
  if (error) return error;

  const images = await getImages();
  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const { error } = await requirePermission('gallery_edit');
  if (error) return error;

  try {
    const { url, filename, caption, alt, category, size, mime_type } = await request.json();

    if (!url || !filename) {
      return NextResponse.json({ error: 'URL and filename are required' }, { status: 400 });
    }

    const image = await createImage(url, filename, caption || '', alt || '', category || 'general', size || 0, mime_type || '');
    return NextResponse.json({ success: true, id: image?.id });
  } catch (err) {
    console.error('Error saving image:', err);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requirePermission('gallery_edit');
  if (error) return error;

  try {
    const { id, caption, alt, category, sort_order } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await updateImage(id, { caption, alt, category, sort_order });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating image:', err);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requirePermission('gallery_edit');
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteImage(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting image:', err);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

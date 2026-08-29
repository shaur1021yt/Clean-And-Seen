import { NextResponse } from 'next/server';
import { getImages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await getImages();
    // Public endpoint — only return what's needed
    const publicImages = images.map(img => ({
      id: img.id,
      url: img.url,
      caption: img.caption,
      alt: img.alt,
      category: img.category,
      created_at: img.created_at,
    }));
    return NextResponse.json(publicImages);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json([]);
  }
}

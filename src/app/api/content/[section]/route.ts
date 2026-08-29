import { NextResponse } from 'next/server';
import { getContent } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const content = await getContent(section);
  return NextResponse.json(content);
}

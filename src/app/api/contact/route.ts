import { NextResponse } from 'next/server';
import { createContactSubmission } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    await createContactSubmission(name, email, subject || '', message, type || 'general');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

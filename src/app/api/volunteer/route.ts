import { NextResponse } from 'next/server';
import { createVolunteerSignup } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, interests, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    await createVolunteerSignup(
      name,
      email,
      phone || '',
      Array.isArray(interests) ? interests.join(', ') : interests || '',
      message || ''
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating volunteer signup:', error);
    return NextResponse.json({ error: 'Failed to submit volunteer signup' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { logVolunteerHours, getVolunteerHoursByEmail } from '@/lib/db';

// POST: Log volunteer hours (public - anyone can submit)
export async function POST(request: Request) {
  try {
    const { volunteer_name, volunteer_email, hours, activity, date, notes } = await request.json();

    if (!volunteer_name || !volunteer_email || !hours || !activity || !date) {
      return NextResponse.json(
        { error: 'Name, email, hours, activity, and date are required' },
        { status: 400 }
      );
    }

    if (hours <= 0 || hours > 24) {
      return NextResponse.json(
        { error: 'Hours must be between 0.5 and 24' },
        { status: 400 }
      );
    }

    await logVolunteerHours(volunteer_name, volunteer_email, hours, activity, date, notes || '');

    return NextResponse.json({
      success: true,
      message: 'Hours submitted for approval',
    });
  } catch (error) {
    console.error('Error logging volunteer hours:', error);
    return NextResponse.json(
      { error: 'Failed to submit hours' },
      { status: 500 }
    );
  }
}

// GET: Get hours by email (public - volunteers can check their own status)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  const hours = await getVolunteerHoursByEmail(email);
  return NextResponse.json(hours);
}

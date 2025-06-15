import { NextResponse } from 'next/server';
import { GOOGLE_MAPS_API_KEY } from '@/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Origin and destination are required' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin,
      )}&destinations=${encodeURIComponent(
        destination,
      )}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'Failed to calculate distance');
    }

    const distanceInMeters = data.rows[0].elements[0].distance.value;
    const distanceInKm = distanceInMeters / 1000;

    return NextResponse.json({ distance: distanceInKm });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 },
    );
  }
}

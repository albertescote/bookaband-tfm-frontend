import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isoDateToday = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `https://api.precioil.es/precioMedioDiario?idFuelType=10&fechaInicio=${isoDateToday}&fechaFin=${isoDateToday}`,
    );

    const data = await response.json();

    if (!data || !data[0]['PrecioMedio']) {
      throw new Error('Failed to fetch gas price');
    }

    const priceInEUR = parseFloat(data[0]['PrecioMedio']);

    return NextResponse.json({ price: priceInEUR });
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gas price' },
      { status: 500 },
    );
  }
}

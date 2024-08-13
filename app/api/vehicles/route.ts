import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const allVehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        fuel_type: true,
        drive: true,
        transmission: true,
        cylinders: true,
        displacement: true,
        city_mpg: true,
        highway_mpg: true,
        combination_mpg: true,
        class: true,
        image: true,
      },
    });

    return NextResponse.json({
      message: 'Car Data Fetched',
      CarData: allVehicles,
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

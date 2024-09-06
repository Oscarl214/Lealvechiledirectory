import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { vehicleId } = await request.json();

    if (!vehicleId) {
      return NextResponse.json({ error: 'No Such VehicleId' });
    }

    const allMaintenance = await prisma.maintenance.findMany({
      where: {
        vehicleId: vehicleId,
      },
    });

    if (!allMaintenance || allMaintenance.length === 0) {
      return NextResponse.json(
        { error: 'No maintenance records found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { maintenanceData: allMaintenance },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

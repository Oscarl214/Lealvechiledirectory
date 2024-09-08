import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { email, VehicleID } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        vehicles: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const vehicleExists = existingUser.vehicles.some(
      (vehicle: any) => vehicle.id === VehicleID
    );

    if (!vehicleExists) {
      return NextResponse.json(
        { message: "Vehicle not found in user's vehicles" },
        { status: 404 }
      );
    }

    await prisma.vehicle.update({
      where: { id: VehicleID },
      data: {
        user: {
          disconnect: true,
        },
      },
    });

    return NextResponse.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error removing vehicle' },
      { status: 500 }
    );
  }
}

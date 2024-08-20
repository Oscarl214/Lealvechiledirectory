import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, vehicleId } = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, vehicles: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the vehicle is already associated with the user
    const isVehicleAlreadyAdded = user.vehicles.some(
      (vehicle) => vehicle.id === vehicleId
    );

    if (isVehicleAlreadyAdded) {
      return NextResponse.json(
        { error: 'Vehicle already added to profile' },
        { status: 400 }
      );
    }

    // Add the vehicle to the user's profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        vehicles: {
          connect: { id: vehicleId },
        },
      },
    });

    return NextResponse.json({
      message: 'Vehicle added to profile successfully',
    });
  } catch (error) {
    console.error('Error adding vehicle to profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

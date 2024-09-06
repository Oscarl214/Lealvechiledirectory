import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import dayjs, { Dayjs } from 'dayjs';

export async function POST(request: Request) {
  try {
    const { type, description, vehicleId } = await request.json();

    if (!type || !vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMaintenance = await prisma.maintenance.create({
      data: {
        type,
        description,
        date: dayjs().toDate(),
        vehicle: {
          connect: { id: vehicleId },
        },
      },
    });

    return NextResponse.json({ maintenance: newMaintenance }, { status: 201 });
  } catch (error) {
    console.error('Error adding maintenance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

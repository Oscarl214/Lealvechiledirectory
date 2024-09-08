import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { maintenanceId } = await request.json();

    if (!maintenanceId) {
      return NextResponse.json(
        { error: 'Maintenance ID is required' },
        { status: 400 }
      );
    }

    const maintenanceExists = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
    });

    if (!maintenanceExists) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      );
    }

    const deletedMaintenance = await prisma.maintenance.delete({
      where: {
        id: maintenanceId,
      },
    });

    return NextResponse.json(
      {
        message: 'Maintenance record deleted successfully',
        maintenance: deletedMaintenance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { requireGarageSession } from '@/lib/garage-session';

export async function POST(request: Request) {
  const auth = await requireGarageSession();
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const { type, description, datedone, vehicleId } = body;

    if (!type || !vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let mileage: number | null = null;
    if (body.mileage !== undefined && body.mileage !== null && body.mileage !== '') {
      const parsed = Number(body.mileage);
      if (!Number.isInteger(parsed) || parsed < 0) {
        return NextResponse.json(
          { error: 'Mileage must be a whole number' },
          { status: 400 }
        );
      }
      mileage = parsed;
    }

    let cost: number | null = null;
    if (body.cost !== undefined && body.cost !== null && body.cost !== '') {
      const parsed = Number(body.cost);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return NextResponse.json({ error: 'Cost must be a dollar amount' }, { status: 400 });
      }
      cost = Math.round(parsed * 100) / 100;
    }

    const products = Array.isArray(body.products)
      ? body.products.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [];

    function life(value: unknown) {
      if (value === undefined || value === null || value === '') return null;
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) return undefined;
      return parsed;
    }

    const tireHealth = life(body.tireHealth);
    const batteryHealth = life(body.batteryHealth);
    if (tireHealth === undefined || batteryHealth === undefined) {
      return NextResponse.json({ error: 'Life must be a whole number from 0 to 100' }, { status: 400 });
    }

    const currentDate = dayjs().toISOString();

    const newMaintenance = await prisma.maintenance.create({
      data: {
        type,
        description,
        datedone,
        mileage,
        cost,
        products,
        tireHealth,
        batteryHealth,
        tiresReplaced: Boolean(body.tiresReplaced),
        batteryReplaced: Boolean(body.batteryReplaced),
        date: currentDate,
        vehicle: {
          connect: { id: vehicleId },
        },
      },
    });

    if (mileage != null) {
      const prior = await prisma.maintenance.findMany({
        where: { vehicleId, id: { not: newMaintenance.id } },
        select: { mileage: true },
      });
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        select: { odometer: true },
      });
      const readings = prior
        .map((entry) => entry.mileage)
        .filter((value): value is number => value != null);
      if (vehicle?.odometer != null) readings.push(vehicle.odometer);
      const currentHigh = readings.length === 0 ? null : Math.max(...readings);
      if (currentHigh == null || mileage > currentHigh) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { odometer: mileage },
        });
      }
    }

    return NextResponse.json({ maintenance: newMaintenance }, { status: 201 });
  } catch (error) {
    console.error('Error adding maintenance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireGarageSession();
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const maintenanceId = body.maintenanceId;
    if (!maintenanceId || typeof maintenanceId !== 'string') {
      return NextResponse.json({ error: 'Missing service entry' }, { status: 400 });
    }
    const parsed = Number(body.cost);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NextResponse.json({ error: 'Cost must be a dollar amount' }, { status: 400 });
    }
    const cost = Math.round(parsed * 100) / 100;

    const existing = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { vehicle: true },
    });
    const vehicle = existing?.vehicle;
    const isK5 =
      vehicle &&
      vehicle.make.trim().toLowerCase() === 'kia' &&
      vehicle.model.trim().toLowerCase().replace(/\s+/g, '') === 'k5';
    if (!existing || !isK5) {
      return NextResponse.json({ error: 'Service entry not found' }, { status: 404 });
    }

    const maintenance = await prisma.maintenance.update({
      where: { id: maintenanceId },
      data: { cost },
    });
    return NextResponse.json({ maintenance });
  } catch (error) {
    console.error('Error updating maintenance cost:', error);
    return NextResponse.json({ error: 'Could not update that cost' }, { status: 500 });
  }
}

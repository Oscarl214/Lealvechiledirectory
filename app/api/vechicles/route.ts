import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Assuming you're querying for vehicles of all users
    const usersWithVehicles = await prisma.user.findMany({
      select: {
        id: true,
        vehicles: true, // assuming `vehicles` is the array of vehicle objects
      },
    });

    const allVehicles = usersWithVehicles.flatMap((user: { vehicles: any; }) => users.vehicles);

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

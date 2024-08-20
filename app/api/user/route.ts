import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password length must be more than 6 characters' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, // Only select what you need
        email: true,
      },
    });

    // If user already exists, return an error
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists. Please log in.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with an empty vehicles array
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        vehicles: {
          create: [],
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    return NextResponse.json({
      userId: user.id,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

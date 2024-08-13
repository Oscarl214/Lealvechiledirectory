import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password length must be more than 6 characters' },
        { status: 400 }
      );
    }

    // If user already exists, return an error
    if (user) {
      return NextResponse.json(
        { error: 'User already exists. Please log in.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      userId: user.id,
      message: 'User created successfully',
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

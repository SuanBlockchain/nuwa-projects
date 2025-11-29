'use server';

import { prisma } from '@/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function signUp(data: { name: string; email: string; password: string }) {
  try {
    // Validate input
    const validatedData = SignUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return { error: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with default GESTOR role
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        role: 'GESTOR', // Default role
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Sign up error:', error);
    return { error: 'An error occurred during sign up' };
  }
}

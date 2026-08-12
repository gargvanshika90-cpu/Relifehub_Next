import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
    } = body;

    // ================================
    // VALIDATION
    // ================================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    // ================================
    // CHECK EXISTING USER
    // ================================

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: cleanEmail,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // ================================
    // HASH PASSWORD
    // ================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ================================
    // CREATE USER
    // ================================

    await prisma.user.create({
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        password: hashedPassword,
      },
    });

    // ================================
    // SUCCESS
    // ================================

    return NextResponse.json(
      {
        message:
          "Account Created Successfully",
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "Signup API Error:",
      error
    );

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
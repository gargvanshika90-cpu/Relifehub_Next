import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Email not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Check password
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return NextResponse.json(
        {
          message: "Incorrect password.",
        },
        {
          status: 401,
        }
      );
    }

    // Return user information
    return NextResponse.json({
      message: "Login Successful",

      user: {
          id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    image: user.image,
      },
    });

  } catch (error) {

    console.error("Login API Error:", error);

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

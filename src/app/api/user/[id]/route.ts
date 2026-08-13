import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("USER ID FROM URL:", id);

    // ID is STRING, so DON'T use Number(id)
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load user",
      },
      { status: 500 }
    );
  }
}
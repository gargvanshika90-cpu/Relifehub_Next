import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request:Request) {
  try {
    const body = await request.json();

    console.log("DONATION REQUEST:", body);

    const {
      userId,

      itemName,
      brand,
      category,
      quantity,
      condition,

      price,
      originalPrice,

      description,

      images,
      details,

      address,
      city,
      state,
      pincode,
      phone,

      date,
      time,
    } = body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!itemName) {
      return NextResponse.json(
        {
          success: false,
          message: "Item name is required",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity is required",
        },
        { status: 400 }
      );
    }

    if (!condition) {
      return NextResponse.json(
        {
          success: false,
          message: "Condition is required",
        },
        { status: 400 }
      );
    }

    if (!address || !city || !state || !pincode || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Pickup details are required",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CHECK USER
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please login again.",
        },
        { status: 404 }
      );
    }

    console.log("DONOR FOUND:", user.email);

    // ==========================================
    // CREATE DONATION
    // ==========================================

    const donation = await prisma.donation.create({
      data: {
        itemName: itemName.trim(),

        brand:
          brand && brand.trim()
            ? brand.trim()
            : null,

        category,

        quantity: String(quantity),

        condition,

        price:
          price !== null &&
          price !== undefined &&
          price !== ""
            ? Number(price)
            : null,

        originalPrice:
          originalPrice !== null &&
          originalPrice !== undefined &&
          originalPrice !== ""
            ? Number(originalPrice)
            : null,

        description:
          description && description.trim()
            ? description.trim()
            : null,

        // MongoDB Json
        images: images || [],

        details: details || {},

        // Pickup
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),

        date: date || null,
        time: time || null,

        status: "Active",

        // IMPORTANT
        donor: {
          connect: {
            id: userId,
          },
        },
      },

      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    console.log("DONATION CREATED:", donation.id);

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Donation created successfully",
        donation,
      },
      { status: 201 }
    );
  }
 catch (error) {
  return NextResponse.json(
    {
      success: false,
      message: "Failed to load dashboard statistics",
      error: err.message,
    },
    { status: 500 }

    );
  }
}
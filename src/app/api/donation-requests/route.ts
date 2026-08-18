import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// =====================================================
// POST - BUYER SENDS DONATION REQUEST
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      donationId,
      requesterId,
      quantity,
      message,
    } = body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (!donationId || !requesterId) {
      return NextResponse.json(
        {
          success: false,
          message: "Donation ID and requester ID are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Find donation
    // -----------------------------------------------

    const donation = await prisma.donation.findUnique({
      where: {
        id: String(donationId),
      },
      include: {
        donor: true,
      },
    });

    if (!donation) {
      return NextResponse.json(
        {
          success: false,
          message: "Donation not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // Do not allow donor to request own item
    // -----------------------------------------------

    if (donation.donorId === String(requesterId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot request your own donation",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Item already sold/approved
    // -----------------------------------------------

    if (
      donation.status === "SOLD" ||
      donation.status === "Sold" ||
      donation.status === "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This item is no longer available",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Check existing request
    // -----------------------------------------------

    const existingRequest =
      await prisma.donationRequest.findFirst({
        where: {
          donationId: String(donationId),
          requesterId: String(requesterId),
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already requested this item",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Create request
    // -----------------------------------------------

    const donationRequest =
      await prisma.donationRequest.create({
        data: {
          donationId: String(donationId),
          requesterId: String(requesterId),
          quantity: quantity ? String(quantity) : null,
          message: message || null,
          status: "PENDING",
        },
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          donation: {
            include: {
              donor: {
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
                },
              },
            },
          },
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Donation request sent successfully",
        request: donationRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE DONATION REQUEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create donation request",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}


// =====================================================
// GET - GET REQUESTS
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    // =================================================
    // BUYER REQUESTS
    // =================================================

    if (type === "buyer") {
      const requests =
        await prisma.donationRequest.findMany({
          where: {
            requesterId: userId,
          },
          include: {
            donation: {
              include: {
                donor: {
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
                  },
                },
              },
            },
            requester: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return NextResponse.json({
        success: true,
        requests,
      });
    }

    // =================================================
    // DONOR REQUESTS
    // =================================================

    const requests =
      await prisma.donationRequest.findMany({
        where: {
          donation: {
            donorId: userId,
          },
        },
        include: {
          requester: {
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
            },
          },
          donation: {
            include: {
              donor: {
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
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("GET DONATION REQUESTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch donation requests",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
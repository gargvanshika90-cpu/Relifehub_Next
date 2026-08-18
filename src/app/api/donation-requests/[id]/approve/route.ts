import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// =====================================================
// APPROVE REQUEST
// =====================================================

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const donorId = body.donorId;

    if (!id || !donorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Request ID and donor ID are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Find request
    // -----------------------------------------------

    const donationRequest =
      await prisma.donationRequest.findUnique({
        where: {
          id,
        },
        include: {
          donation: true,
          requester: true,
        },
      });

    if (!donationRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Donation request not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // Check donor ownership
    // -----------------------------------------------

    if (donationRequest.donation.donorId !== donorId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not the donor of this item",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------------
    // Request must be pending
    // -----------------------------------------------

    if (donationRequest.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: `Request is already ${donationRequest.status}`,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Donation must still be active
    // -----------------------------------------------

    if (
      donationRequest.donation.status === "SOLD" ||
      donationRequest.donation.status === "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This donation has already been approved",
        },
        { status: 400 }
      );
    }

    // =================================================
    // APPROVE REQUEST
    // =================================================
const result = await prisma.$transaction(
  async (tx: Prisma.TransactionClient) => {
        // ---------------------------------------------
        // Approve selected request
        // ---------------------------------------------

        const approvedRequest =
          await tx.donationRequest.update({
            where: {
              id,
            },
            data: {
              status: "APPROVED",
            },
          });

        // ---------------------------------------------
        // Mark donation as SOLD
        // ---------------------------------------------

        await tx.donation.update({
          where: {
            id: donationRequest.donationId,
          },
          data: {
            status: "SOLD",
          },
        });

        // ---------------------------------------------
        // Reject all other pending requests
        // ---------------------------------------------

        await tx.donationRequest.updateMany({
          where: {
            donationId: donationRequest.donationId,
            id: {
              not: id,
            },
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });

        return approvedRequest;
      }
    );

    // -----------------------------------------------
    // Get complete information
    // -----------------------------------------------

    const finalRequest =
      await prisma.donationRequest.findUnique({
        where: {
          id: result.id,
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
      });

    return NextResponse.json({
      success: true,
      message: "Request approved successfully",
      request: finalRequest,
    });
  } catch (error) {
    console.error("APPROVE REQUEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve request",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
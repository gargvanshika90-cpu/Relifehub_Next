import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Request ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const donorId = body?.donorId;

    if (!donorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Donor ID is required",
        },
        { status: 400 }
      );
    }

    console.log("APPROVE REQUEST ID:", id);
    console.log("DONOR ID:", donorId);

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // ==========================================
        // 1. Find request
        // ==========================================

        const existingRequest =
          await tx.donationRequest.findUnique({
            where: {
              id,
            },
            include: {
              donation: true,
            },
          });

        if (!existingRequest) {
          throw new Error(
            "Donation request not found"
          );
        }

        // ==========================================
        // 2. Verify donor owns this donation
        // ==========================================

        if (
          existingRequest.donation.donorId !==
          donorId
        ) {
          throw new Error(
            "You are not the donor of this item"
          );
        }

        // ==========================================
        // 3. Check request status
        // ==========================================

        if (
          existingRequest.status !==
          "PENDING"
        ) {
          throw new Error(
            `Request is already ${existingRequest.status}`
          );
        }

        // ==========================================
        // 4. Check donation status
        // ==========================================

        if (
          existingRequest.donation.status !==
          "Active"
        ) {
          throw new Error(
            "This donation is no longer available"
          );
        }

        // ==========================================
        // 5. Approve selected request
        // ==========================================

        const approvedRequest =
          await tx.donationRequest.update({
            where: {
              id,
            },
            data: {
              status: "APPROVED",
            },
            include: {
              requester: true,
              donation: {
                include: {
                  donor: true,
                },
              },
            },
          });

        // ==========================================
        // 6. Mark donation as sold
        // ==========================================

        const updatedDonation =
          await tx.donation.update({
            where: {
              id: existingRequest.donationId,
            },
            data: {
              status: "Sold",
            },
          });

        // ==========================================
        // 7. Reject all other pending requests
        //    for the same donation
        // ==========================================

        await tx.donationRequest.updateMany({
          where: {
            donationId:
              existingRequest.donationId,

            id: {
              not: id,
            },

            status: "PENDING",
          },

          data: {
            status: "REJECTED",
          },
        });

        return {
          approvedRequest,
          updatedDonation,
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Donation request approved successfully",
      request: result.approvedRequest,
      donation: result.updatedDonation,
    });
  } catch (error) {
    console.error(
      "APPROVE REQUEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to approve request",
      },
      {
        status: 500,
      }
    );
  }
}
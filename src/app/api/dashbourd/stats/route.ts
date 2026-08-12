import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    console.log("Dashboard userId:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // DONOR DATA

    const totalDonations = await prisma.donation.count({
      where: {
        donorId: userId,
      },
    });

    const requestsReceived = await prisma.donationRequest.count({
      where: {
        donation: {
          donorId: userId,
        },
      },
    });

    const requestsFulfilled = await prisma.donationRequest.count({
      where: {
        donation: {
          donorId: userId,
        },
        status: "COMPLETED",
      },
    });

    const approvedRequests = await prisma.donationRequest.count({
      where: {
        donation: {
          donorId: userId,
        },
        status: "APPROVED",
      },
    });

    // BUYER DATA

    const totalRequests = await prisma.donationRequest.count({
      where: {
        requesterId: userId,
      },
    });

    const pendingRequests = await prisma.donationRequest.count({
      where: {
        requesterId: userId,
        status: "PENDING",
      },
    });

    const buyerApprovedRequests = await prisma.donationRequest.count({
      where: {
        requesterId: userId,
        status: "APPROVED",
      },
    });

    const buyerCompletedRequests = await prisma.donationRequest.count({
      where: {
        requesterId: userId,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      success: true,

      donor: {
        totalDonations,
        requestsReceived,
        requestsFulfilled,
        approvedRequests,
        impactPoints: totalDonations * 10,
      },

      buyer: {
        itemsPurchased: totalRequests,
        activeOrders: pendingRequests,
        itemsDelivered: buyerCompletedRequests,
        approvedRequests: buyerApprovedRequests,
        impactPoints: buyerCompletedRequests * 10,
      },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics",
      },
      {
        status: 500,
      }
    );
  }
}
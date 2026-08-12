import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";




export async function GET(request:Request) {
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

    // =====================================================
    // DONOR DATA
    // =====================================================

    // Number of donations created by this user
    const totalDonations =
      await prisma.donation.count({
        where: {
          donorId: userId,
        },
      });


    // Requests received on this user's donations
    const requestsReceived =
      await prisma.donationRequest.count({
        where: {
          donation: {
            donorId: userId,
          },
        },
      });


    // Completed requests received by donor
    const requestsFulfilled =
      await prisma.donationRequest.count({
        where: {
          donation: {
            donorId: userId,
          },
          status: "COMPLETED",
        },
      });


    // Approved requests received
    const approvedRequests =
      await prisma.donationRequest.count({
        where: {
          donation: {
            donorId: userId,
          },
          status: "APPROVED",
        },
      });


    // =====================================================
    // BUYER DATA
    // =====================================================

    // Total requests made by this user
    const totalRequests =
      await prisma.donationRequest.count({
        where: {
          requesterId: userId,
        },
      });


    // Pending requests
    const pendingRequests =
      await prisma.donationRequest.count({
        where: {
          requesterId: userId,
          status: "PENDING",
        },
      });


    // Approved requests
    const buyerApprovedRequests =
      await prisma.donationRequest.count({
        where: {
          requesterId: userId,
          status: "APPROVED",
        },
      });


    // Completed requests
    const buyerCompletedRequests =
      await prisma.donationRequest.count({
        where: {
          requesterId: userId,
          status: "COMPLETED",
        },
      });


    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      donor: {
        totalDonations,
        requestsReceived,
        requestsFulfilled,
        approvedRequests,

        impactPoints:
          totalDonations * 10,
      },

      buyer: {
        itemsPurchased: totalRequests,
        activeOrders: pendingRequests,
        itemsDelivered: buyerCompletedRequests,
        approvedRequests: buyerApprovedRequests,

        impactPoints:
          buyerCompletedRequests * 10,
      },
    });

  } catch (error) {
    console.error(
      "DASHBOARD STATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load dashboard statistics",
        
      },
      {
        status: 500,
      }
    );
  }
}
// import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     message: "Hello World",
//   });
// }



import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// ==========================================
// GET USER
// ==========================================

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    console.log("GET USER ID FROM URL:", id);

    if (!id || id === "undefined" || id === "null") {
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
        id: String(id),
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
  } catch (error: any) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to load user",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PATCH USER
// ==========================================

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    console.log("PATCH USER ID FROM URL:", id);

    // ----------------------------------------
    // CHECK ID
    // ----------------------------------------

    if (
      !id ||
      id === "undefined" ||
      id === "null"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // READ REQUEST BODY
    // ----------------------------------------

    const body = await request.json();

    console.log("PATCH BODY:", body);

    // ----------------------------------------
    // UPDATE USER
    // ----------------------------------------

    const updatedUser =
      await prisma.user.update({
        where: {
          id: String(id),
        },

        data: {
          firstName:
            body.firstName?.trim() || "",

          lastName:
            body.lastName?.trim() || "",

          email:
            body.email
              ?.trim()
              .toLowerCase() || "",

          phone:
            body.phone?.trim() || null,

          address:
            body.address?.trim() || null,

          city:
            body.city?.trim() || null,

          state:
            body.state?.trim() || null,

          pincode:
            body.pincode?.trim() || null,

          image:
            body.image || null,
        },
      });

    console.log(
      "UPDATED USER:",
      updatedUser
    );

    // ----------------------------------------
    // RETURN JSON
    // ----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(
      "PATCH USER ERROR:",
      error
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "META:",
      error?.meta
    );

    // ----------------------------------------
    // DUPLICATE EMAIL
    // ----------------------------------------

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already registered with another account.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------
    // USER NOT FOUND
    // ----------------------------------------

    if (error?.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found. Please login again.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------
    // OTHER ERROR
    // ----------------------------------------

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update user",
      },
      { status: 500 }
    );
  }
}
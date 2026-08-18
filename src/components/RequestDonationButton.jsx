"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function RequestDonationButton({
  donationId,
}) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login before requesting a donation.",
        });

        return;
      }

      const user = JSON.parse(savedUser);

      if (!user?.id) {
        Swal.fire({
          icon: "error",
          title: "User Not Found",
          text: "Please login again.",
        });

        return;
      }

      setLoading(true);

      const response = await fetch(
        "/api/donation-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donationId: String(donationId),
            requesterId: String(user.id),
            quantity: "1",
            message:
              "I would like to receive this donation.",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Request failed"
        );
      }

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Your donation request has been sent to the donor.",
        confirmButtonText: "View Requests",
      }).then(() => {
        window.location.href =
          "/dashboard/requests";
      });
    } catch (error) {
      console.error("REQUEST ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Sending Request..."
        : "Request Donation"}
    </button>
  );
}
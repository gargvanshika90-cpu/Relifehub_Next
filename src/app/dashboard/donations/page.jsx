"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Package,
  Shirt,
  ToyBrick,
  BookOpen,
  Armchair,
  Laptop,
  Utensils,
  MapPin,
  CalendarDays,
  Clock,
  Phone,
  User,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

export default function DonationPage() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedDonation, setSelectedDonation] =
    useState(null);

  // ==========================================
  // LOAD USER + DONATIONS
  // ==========================================

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return;
    }

    const currentUser =
      JSON.parse(savedUser);

    setUser(currentUser);

    loadDonations(currentUser);

    const handleDonationChange = () => {
      loadDonations(currentUser);
    };

    window.addEventListener(
      "donationsChanged",
      handleDonationChange
    );

    return () => {
      window.removeEventListener(
        "donationsChanged",
        handleDonationChange
      );
    };
  }, []);

  // ==========================================
  // LOAD USER'S DONATIONS
  // ==========================================

  const loadDonations = (currentUser) => {
    const saved =
      JSON.parse(
        localStorage.getItem("donations")
      ) || [];

    const userDonations = saved.filter(
      (donation) =>
        donation.userId === currentUser.id ||
        donation.userId === currentUser.email
    );

    setDonations(userDonations);
  };

  // ==========================================
  // CATEGORY ICON
  // ==========================================

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food":
        return <Utensils size={22} />;

      case "Clothes":
        return <Shirt size={22} />;

      case "Toys":
        return <ToyBrick size={22} />;

      case "Books":
        return <BookOpen size={22} />;

      case "Furniture":
        return <Armchair size={22} />;

      case "Electronics":
        return <Laptop size={22} />;

      default:
        return <Package size={22} />;
    }
  };

  // ==========================================
  // DELETE DONATION
  // ==========================================

  const deleteDonation = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Donation?",
      text: "This donation will be removed from your dashboard.",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) {
      return;
    }

    const saved =
      JSON.parse(
        localStorage.getItem("donations")
      ) || [];

    const updated = saved.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "donations",
      JSON.stringify(updated)
    );

    setDonations(
      updated.filter(
        (item) =>
          item.userId === user?.id ||
          item.userId === user?.email
      )
    );

    window.dispatchEvent(
      new Event("donationsChanged")
    );

    Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Donation removed successfully.",
      confirmButtonColor: "#15803d",
    });
  };

  // ==========================================
  // NO LOGIN
  // ==========================================

  if (!user) {
    return (
        
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
          <Package
            size={55}
            className="mx-auto text-green-700 mb-5"
          />

          <h1 className="text-2xl font-bold">
            Login Required
          </h1>

          <p className="text-gray-500 mt-3">
            Please login to view your donations.
          </p>

          <Link
            href="/login"
            className="inline-block mt-6 bg-green-700 text-white px-7 py-3 rounded-xl font-semibold hover:bg-green-800"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
    <Sidebar></Sidebar>
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 ml-64">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-green-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-md p-7 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-green-700 font-semibold">
                My Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                My Donations
              </h1>

              <p className="text-gray-500 mt-2">
                Manage all the items you have donated.
              </p>
            </div>

            <Link
              href="/donate"
              className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800"
            >
              + Donate New Item
            </Link>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Total Donations
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-2">
              {donations.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Active Donations
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-2">
              {
                donations.filter(
                  (item) =>
                    item.status === "Active"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Categories
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-2">
              {
                new Set(
                  donations.map(
                    (item) => item.category
                  )
                ).size
              }
            </h2>
          </div>

        </div>

        {/* DONATIONS */}

        {donations.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-md p-12 text-center">

            <Package
              size={65}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Donations Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start donating unused items and give
              them a new life.
            </p>

            <Link
              href="/donate"
              className="inline-block mt-6 bg-green-700 text-white px-7 py-3 rounded-xl font-semibold"
            >
              Donate an Item
            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {donations.map((donation) => (

              <div
                key={donation.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >

                {/* IMAGE */}

                <div className="h-56 bg-gray-100 relative">

                  {donation.images?.length > 0 ? (

                    <img
                      src={donation.images[0].data}
                      alt={donation.itemName}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="h-full flex items-center justify-center text-gray-300">
                      <Package size={70} />
                    </div>

                  )}

                  <span className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {donation.status}
                  </span>

                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    {getCategoryIcon(
                      donation.category
                    )}

                    {donation.category}
                  </div>

                  <h2 className="text-xl font-bold mt-3">
                    {donation.itemName}
                  </h2>

                  {donation.brand && (
                    <p className="text-gray-500 mt-1">
                      Brand: {donation.brand}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-5 text-sm">

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500">
                        Quantity
                      </span>

                      <p className="font-semibold">
                        {donation.quantity}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500">
                        Condition
                      </span>

                      <p className="font-semibold">
                        {donation.condition}
                      </p>
                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        setSelectedDonation(
                          donation
                        )
                      }
                      className="flex-1 border border-green-700 text-green-700 py-2.5 rounded-xl font-semibold hover:bg-green-50 flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        deleteDonation(
                          donation.id
                        )
                      }
                      className="px-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ==========================================
          DETAIL MODAL
      ========================================== */}

      {selectedDonation && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">

          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  {selectedDonation.itemName}
                </h2>

                <p className="text-green-700 font-semibold">
                  {selectedDonation.category}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedDonation(null)
                }
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X />
              </button>

            </div>

            <div className="p-6">

              {/* IMAGES */}

              {selectedDonation.images?.length > 0 && (

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {selectedDonation.images.map(
                    (image, index) => (

                      <img
                        key={index}
                        src={image.data}
                        alt=""
                        className="w-full h-32 object-cover rounded-xl"
                      />

                    )
                  )}

                </div>

              )}

              {/* ITEM DETAILS */}

              <div className="mt-7">

                <h3 className="text-xl font-bold mb-4">
                  Item Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <Detail
                    label="Item Name"
                    value={
                      selectedDonation.itemName
                    }
                  />

                  <Detail
                    label="Brand"
                    value={
                      selectedDonation.brand
                    }
                  />

                  <Detail
                    label="Quantity"
                    value={
                      selectedDonation.quantity
                    }
                  />

                  <Detail
                    label="Condition"
                    value={
                      selectedDonation.condition
                    }
                  />

                  <Detail
                    label="Price"
                    value={
                      selectedDonation.price
                        ? `₹${selectedDonation.price}`
                        : "Free Donation"
                    }
                  />

                  <Detail
                    label="Original Price"
                    value={
                      selectedDonation.originalPrice
                        ? `₹${selectedDonation.originalPrice}`
                        : "-"
                    }
                  />

                </div>

              </div>

              {/* CATEGORY DETAILS */}

              {selectedDonation.details && (

                <div className="mt-7">

                  <h3 className="text-xl font-bold mb-4">
                    {selectedDonation.category} Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    {Object.entries(
                      selectedDonation.details
                    ).map(([key, value]) => {

                      if (!value) return null;

                      return (
                        <Detail
                          key={key}
                          label={formatLabel(key)}
                          value={value}
                        />
                      );
                    })}

                  </div>

                </div>

              )}

              {/* DESCRIPTION */}

              {selectedDonation.description && (

                <div className="mt-7">

                  <h3 className="text-xl font-bold mb-3">
                    Description
                  </h3>

                  <p className="bg-gray-50 rounded-xl p-4 text-gray-600">
                    {selectedDonation.description}
                  </p>

                </div>

              )}

              {/* DONOR */}

              <div className="mt-7">

                <h3 className="text-xl font-bold mb-4">
                  Donor Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <Detail
                    label="Name"
                    value={
                      selectedDonation.donorName
                    }
                  />

                  <Detail
                    label="Email"
                    value={
                      selectedDonation.donorEmail
                    }
                  />

                  <Detail
                    label="Role"
                    value={
                      selectedDonation.role
                    }
                  />

                </div>

              </div>

              {/* PICKUP */}

              {selectedDonation.pickup && (

                <div className="mt-7">

                  <div className="flex items-center gap-2 mb-4">

                    <MapPin
                      className="text-green-700"
                    />

                    <h3 className="text-xl font-bold">
                      Pickup Details
                    </h3>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4">

                    <Detail
                      label="Address"
                      value={
                        selectedDonation.pickup.address
                      }
                    />

                    <Detail
                      label="City"
                      value={
                        selectedDonation.pickup.city
                      }
                    />

                    <Detail
                      label="State"
                      value={
                        selectedDonation.pickup.state
                      }
                    />

                    <Detail
                      label="Pincode"
                      value={
                        selectedDonation.pickup.pincode
                      }
                    />

                    <Detail
                      label="Phone"
                      value={
                        selectedDonation.pickup.phone
                      }
                    />

                    <Detail
                      label="Preferred Date"
                      value={
                        selectedDonation.pickup.date ||
                        "-"
                      }
                    />

                    <Detail
                      label="Preferred Time"
                      value={
                        selectedDonation.pickup.time ||
                        "-"
                      }
                    />

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
    </>
  );
}


// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold text-gray-800 mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}


// ==========================================
// FORMAT LABEL
// ==========================================

function formatLabel(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) =>
      str.toUpperCase()
    );
}
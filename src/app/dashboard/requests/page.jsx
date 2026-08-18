"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  User,
  Phone,
  MapPin,
  X,
  Check,
  Ban,
  CalendarDays,
  MessageCircle,
  Mail,
} from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("Donor");
  const [actionLoading, setActionLoading] = useState(false);

  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        console.log("No logged-in user found");
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      console.log("CURRENT USER:", user);

      setCurrentUser(user);

      /*
       * Your project may store role as:
       * Donor / Buyer
       * donor / buyer
       */

      const role = String(user.role || "Donor").toLowerCase();

      if (role === "buyer") {
        setUserRole("Buyer");
      } else {
        setUserRole("Donor");
      }

      loadRequests(user);
    } catch (error) {
      console.error("USER LOAD ERROR:", error);
      setLoading(false);
    }
  }, []);

  // =====================================================
  // REQUESTS CHANGED EVENT
  // =====================================================

  useEffect(() => {
    const handleRequestsChanged = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) return;

      try {
        const user = JSON.parse(savedUser);
        loadRequests(user);
      } catch (error) {
        console.error("REQUEST EVENT ERROR:", error);
      }
    };

    window.addEventListener(
      "requestsChanged",
      handleRequestsChanged
    );

    return () => {
      window.removeEventListener(
        "requestsChanged",
        handleRequestsChanged
      );
    };
  }, []);

  // =====================================================
  // LOAD REQUESTS FROM PRISMA API
  // =====================================================

  const loadRequests = async (user = currentUser) => {
    try {
      if (!user?.id) {
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const role = String(
        user.role || userRole || "Donor"
      ).toLowerCase();

      const type = role === "buyer" ? "buyer" : "donor";

      console.log(
        "LOADING REQUESTS:",
        user.id,
        type
      );

      const response = await fetch(
        `/api/donation-requests?userId=${encodeURIComponent(
          user.id
        )}&type=${type}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log("REQUEST API RESPONSE:", data);

      if (!response.ok || !data.success) {
        console.error(
          "REQUEST API ERROR:",
          data.message
        );

        setRequests([]);
        return;
      }

      const apiRequests = Array.isArray(data.requests)
        ? data.requests
        : [];

      setRequests(apiRequests);

      /*
       * If modal is open, update its request data too.
       */
      setSelectedRequest((previous) => {
        if (!previous) return null;

        const updated = apiRequests.find(
          (item) =>
            String(item.id) === String(previous.id)
        );

        return updated || null;
      });
    } catch (error) {
      console.error(
        "LOAD REQUESTS ERROR:",
        error
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATUS NORMALIZER
  // =====================================================

  const normalizeStatus = (status) => {
    const value = String(
      status || "PENDING"
    ).toUpperCase();

    if (value === "APPROVED") return "Approved";
    if (value === "REJECTED") return "Rejected";
    if (value === "COMPLETED") return "Completed";
    if (value === "CANCELLED") return "Cancelled";

    return "Pending";
  };

  // =====================================================
  // GET BUYER NAME
  // =====================================================

  const getBuyerName = (request) => {
    if (request?.requester) {
      const firstName =
        request.requester.firstName || "";

      const lastName =
        request.requester.lastName || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      if (fullName) return fullName;
    }

    return (
      request?.requesterName ||
      request?.buyerName ||
      "Buyer"
    );
  };

  // =====================================================
  // GET BUYER EMAIL
  // =====================================================

  const getBuyerEmail = (request) => {
    return (
      request?.requester?.email ||
      request?.requesterEmail ||
      request?.buyerEmail ||
      ""
    );
  };

  // =====================================================
  // GET BUYER ID
  // =====================================================

  const getBuyerId = (request) => {
    return (
      request?.requesterId ||
      request?.requester?.id ||
      request?.buyerId ||
      getBuyerEmail(request)
    );
  };

  // =====================================================
  // GET BUYER PHONE
  // =====================================================

  const getBuyerPhone = (request) => {
    return (
      request?.requester?.phone ||
      request?.requesterPhone ||
      request?.buyerPhone ||
      request?.phone ||
      "Not provided"
    );
  };

  // =====================================================
  // GET BUYER ADDRESS
  // =====================================================

  const getBuyerAddress = (request) => {
    const requester = request?.requester;

    if (requester) {
      const parts = [
        requester.address,
        requester.city,
        requester.state,
        requester.pincode,
      ].filter(Boolean);

      if (parts.length > 0) {
        return parts.join(", ");
      }
    }

    return (
      request?.fullAddress ||
      [
        request?.address,
        request?.buyerAddress,
        request?.city,
        request?.state,
        request?.pincode,
      ]
        .filter(Boolean)
        .join(", ") ||
      "Not provided"
    );
  };

  // =====================================================
  // GET DONOR NAME
  // =====================================================

  const getDonorName = (request) => {
    const donor =
      request?.donation?.donor;

    if (donor) {
      const firstName =
        donor.firstName || "";

      const lastName =
        donor.lastName || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      if (fullName) return fullName;
    }

    return (
      request?.donorName ||
      "Donor"
    );
  };

  // =====================================================
  // GET DONOR EMAIL
  // =====================================================

  const getDonorEmail = (request) => {
    return (
      request?.donation?.donor?.email ||
      request?.donorEmail ||
      ""
    );
  };

  // =====================================================
  // GET DONOR PHONE
  // =====================================================

  const getDonorPhone = (request) => {
    return (
      request?.donation?.donor?.phone ||
      request?.donorPhone ||
      "Not provided"
    );
  };

  // =====================================================
  // GET DONOR ADDRESS
  // =====================================================

  const getDonorAddress = (request) => {
    const donor =
      request?.donation?.donor;

    if (donor) {
      const parts = [
        donor.address,
        donor.city,
        donor.state,
        donor.pincode,
      ].filter(Boolean);

      if (parts.length > 0) {
        return parts.join(", ");
      }
    }

    return (
      request?.donorAddress ||
      "Not provided"
    );
  };

  // =====================================================
  // GET ITEM NAME
  // =====================================================

  const getItemName = (request) => {
    return (
      request?.donation?.itemName ||
      request?.productName ||
      request?.itemName ||
      "Donation Item"
    );
  };

  // =====================================================
  // GET CATEGORY
  // =====================================================

  const getCategory = (request) => {
    return (
      request?.donation?.category ||
      request?.category ||
      "Donation"
    );
  };

  // =====================================================
  // GET MESSAGE LINK
  // =====================================================

  const getMessageLink = (request) => {
    const buyerId = getBuyerId(request);
    const buyerEmail =
      getBuyerEmail(request);
    const itemName =
      getItemName(request);

    const params = new URLSearchParams();

    if (buyerId) {
      params.set(
        "userId",
        String(buyerId)
      );
    }

    if (buyerEmail) {
      params.set(
        "email",
        buyerEmail
      );
    }

    if (itemName) {
      params.set(
        "item",
        itemName
      );
    }

    return `/dashboard/messages?${params.toString()}`;
  };

  // =====================================================
  // APPROVE REQUEST
  // =====================================================

  const approveRequest = async (request) => {
    if (!currentUser?.id) {
      alert("Please login again.");
      return;
    }

    const confirmApprove =
      window.confirm(
        `Approve donation request for "${getItemName(
          request
        )}"?`
      );

    if (!confirmApprove) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `/api/donation-requests/${request.id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorId: String(currentUser.id),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "APPROVE RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Could not approve request."
        );
        return;
      }

      alert(
        "Request approved successfully. The item is now reserved for this buyer."
      );

      setSelectedRequest(null);

      /*
       * Reload from Prisma.
       */
      await loadRequests(currentUser);

      window.dispatchEvent(
        new Event("requestsChanged")
      );
    } catch (error) {
      console.error(
        "APPROVE REQUEST ERROR:",
        error
      );

      alert(
        "Something went wrong while approving the request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  const rejectRequest = async (request) => {
    if (!currentUser?.id) {
      alert("Please login again.");
      return;
    }

    const confirmReject =
      window.confirm(
        `Reject donation request for "${getItemName(
          request
        )}"?`
      );

    if (!confirmReject) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `/api/donation-requests/${request.id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorId: String(currentUser.id),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "REJECT RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Could not reject request."
        );
        return;
      }

      alert(
        "Request rejected. The item is available for other buyers."
      );

      setSelectedRequest(null);

      /*
       * Reload from Prisma.
       */
      await loadRequests(currentUser);

      window.dispatchEvent(
        new Event("requestsChanged")
      );
    } catch (error) {
      console.error(
        "REJECT REQUEST ERROR:",
        error
      );

      alert(
        "Something went wrong while rejecting the request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter(
          (request) =>
            normalizeStatus(
              request.status
            ) === activeTab
        );

  // =====================================================
  // COUNTS
  // =====================================================

  const allCount =
    requests.length;

  const pendingCount =
    requests.filter(
      (request) =>
        normalizeStatus(
          request.status
        ) === "Pending"
    ).length;

  const approvedCount =
    requests.filter(
      (request) =>
        normalizeStatus(
          request.status
        ) === "Approved"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        normalizeStatus(
          request.status
        ) === "Rejected"
    ).length;

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const StatusBadge = ({
    status,
  }) => {
    const normalizedStatus =
      normalizeStatus(status);

    if (
      normalizedStatus ===
      "Approved"
    ) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
          <CheckCircle size={16} />
          Approved
        </span>
      );
    }

    if (
      normalizedStatus ===
      "Rejected"
    ) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 text-sm font-semibold">
          <XCircle size={16} />
          Rejected
        </span>
      );
    }

    if (
      normalizedStatus ===
      "Completed"
    ) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
          <CheckCircle size={16} />
          Completed
        </span>
      );
    }

    if (
      normalizedStatus ===
      "Cancelled"
    ) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold">
          <XCircle size={16} />
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm font-semibold">
        <Clock size={16} />
        Pending
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Sidebar />

        <main className="min-h-screen bg-slate-50 ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                <Package
                  size={30}
                  className="text-green-600 animate-pulse"
                />
              </div>

              <h2 className="text-xl font-bold mt-5">
                Loading Requests...
              </h2>

              <p className="text-gray-500 mt-2">
                Loading donation requests
                from the database.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-slate-50 ml-64 p-6">
        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <Package
                  size={25}
                  className="text-green-700"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Donation Requests
                </h1>

                <p className="text-gray-500 mt-1">
                  {userRole === "Donor"
                    ? "Review and manage requests received for your donated items."
                    : "Track the donation requests you have sent."}
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

            {/* TOTAL */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-500">
                    Total Requests
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {allCount}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Package
                    size={21}
                    className="text-blue-600"
                  />
                </div>

              </div>
            </div>

            {/* PENDING */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <h2 className="text-2xl font-bold mt-1 text-yellow-600">
                    {pendingCount}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Clock
                    size={21}
                    className="text-yellow-600"
                  />
                </div>

              </div>
            </div>

            {/* APPROVED */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-500">
                    Approved
                  </p>

                  <h2 className="text-2xl font-bold mt-1 text-green-600">
                    {approvedCount}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle
                    size={21}
                    className="text-green-600"
                  />
                </div>

              </div>
            </div>

            {/* REJECTED */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-500">
                    Rejected
                  </p>

                  <h2 className="text-2xl font-bold mt-1 text-red-600">
                    {rejectedCount}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle
                    size={21}
                    className="text-red-600"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-6 shadow-sm">

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  setActiveTab("All")
                }
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                  activeTab === "All"
                    ? "bg-green-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All ({allCount})
              </button>

              <button
                onClick={() =>
                  setActiveTab("Pending")
                }
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                  activeTab === "Pending"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Pending ({pendingCount})
              </button>

              <button
                onClick={() =>
                  setActiveTab("Approved")
                }
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                  activeTab === "Approved"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Approved ({approvedCount})
              </button>

              <button
                onClick={() =>
                  setActiveTab("Rejected")
                }
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                  activeTab === "Rejected"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Rejected ({rejectedCount})
              </button>

            </div>
          </div>

          {/* =================================================
              REQUEST LIST
          ================================================= */}

          {filteredRequests.length === 0 ? (

            <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">

              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                <Package
                  size={30}
                  className="text-gray-400"
                />
              </div>

              <h2 className="text-xl font-bold mt-5">
                No{" "}
                {activeTab.toLowerCase()}{" "}
                requests
              </h2>

              <p className="text-gray-500 mt-2">
                {userRole === "Donor"
                  ? "Donation requests will appear here when buyers request your items."
                  : "Your donation requests will appear here."}
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {filteredRequests.map(
                (request, index) => {

                  const requestKey =
                    request.id ||
                    `${getBuyerId(
                      request
                    )}-${index}`;

                  const status =
                    normalizeStatus(
                      request.status
                    );

                  return (
                    <div
                      key={requestKey}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                    >

                      <div className="p-6">

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                          {/* =================================================
                              LEFT
                          ================================================= */}

                          <div className="flex gap-4 min-w-0">

                            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                              <Package
                                size={25}
                                className="text-green-700"
                              />
                            </div>

                            <div className="min-w-0">

                              <h2 className="text-xl font-bold text-gray-900 truncate">
                                {getItemName(
                                  request
                                )}
                              </h2>

                              <p className="text-gray-500 mt-1">
                                {userRole === "Donor"
                                  ? "Requested by"
                                  : "Requested from"}{" "}
                                <span className="font-semibold text-gray-700">
                                  {userRole === "Donor"
                                    ? getBuyerName(
                                        request
                                      )
                                    : getDonorName(
                                        request
                                      )}
                                </span>
                              </p>

                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">

                                <span>
                                  Category:{" "}
                                  <b>
                                    {getCategory(
                                      request
                                    )}
                                  </b>
                                </span>

                                <span>
                                  Quantity:{" "}
                                  <b>
                                    {request.quantity ||
                                      1}
                                  </b>
                                </span>

                                {request.createdAt && (
                                  <span className="flex items-center gap-1">
                                    <CalendarDays
                                      size={14}
                                    />

                                    {new Date(
                                      request.createdAt
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </span>
                                )}

                              </div>

                            </div>
                          </div>

                          {/* =================================================
                              RIGHT
                          ================================================= */}

                          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">

                            <StatusBadge
                              status={status}
                            />

                            <div className="flex gap-2 flex-wrap">

                              <button
                                onClick={() =>
                                  setSelectedRequest(
                                    request
                                  )
                                }
                                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                              >
                                View Details
                              </button>

                              {/* MESSAGE BUYER */}

                              {userRole ===
                                "Donor" &&
                                getBuyerEmail(
                                  request
                                ) && (
                                  <Link
                                    href={getMessageLink(
                                      request
                                    )}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                  >
                                    <MessageCircle
                                      size={17}
                                    />

                                    Message
                                  </Link>
                                )}

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            QUICK ACTIONS - ONLY DONOR
                        ================================================= */}

                        {userRole ===
                          "Donor" &&
                          status ===
                            "Pending" && (

                            <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row justify-end gap-3">

                              <button
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  rejectRequest(
                                    request
                                  )
                                }
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Ban
                                  size={17}
                                />

                                {actionLoading
                                  ? "Please wait..."
                                  : "Reject Request"}
                              </button>

                              <button
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  approveRequest(
                                    request
                                  )
                                }
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Check
                                  size={17}
                                />

                                {actionLoading
                                  ? "Please wait..."
                                  : "Approve Request"}
                              </button>

                            </div>
                          )}

                      </div>
                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedRequest && (

        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="p-6 border-b flex items-center justify-between">

              <div>

                <p className="text-sm text-green-600 font-semibold">
                  Donation Request
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Request Details
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-5">

              {/* ITEM */}

              <div className="bg-green-50 rounded-2xl p-5">

                <p className="text-sm text-green-700">
                  Requested Item
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {getItemName(
                    selectedRequest
                  )}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Category:{" "}
                  <b>
                    {getCategory(
                      selectedRequest
                    )}
                  </b>
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Quantity:{" "}
                  <b>
                    {selectedRequest.quantity ||
                      1}
                  </b>
                </p>

                <div className="mt-3">
                  <StatusBadge
                    status={
                      selectedRequest.status
                    }
                  />
                </div>

              </div>

              {/* =================================================
                  BUYER DETAILS
              ================================================= */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Buyer Details
                </h3>

                {/* BUYER NAME */}

                <div className="flex gap-4 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <User
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Buyer Name
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getBuyerName(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

                {/* BUYER PHONE */}

                <div className="flex gap-4 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Phone
                      size={20}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Buyer Phone
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getBuyerPhone(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

                {/* BUYER EMAIL */}

                {getBuyerEmail(
                  selectedRequest
                ) && (

                  <div className="flex gap-4 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Mail
                        size={20}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Buyer Email
                      </p>

                      <p className="font-semibold text-gray-900 break-all">
                        {getBuyerEmail(
                          selectedRequest
                        )}
                      </p>
                    </div>

                  </div>
                )}

                {/* BUYER ADDRESS */}

                <div className="flex gap-4">

                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin
                      size={20}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Buyer Address
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getBuyerAddress(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  DONOR DETAILS
              ================================================= */}

              <div className="border border-green-200 rounded-2xl p-5 bg-green-50">

                <h3 className="text-lg font-bold text-green-800 mb-4">
                  Donor Details
                </h3>

                {/* DONOR NAME */}

                <div className="flex gap-4 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <User
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Donor Name
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getDonorName(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

                {/* DONOR PHONE */}

                <div className="flex gap-4 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <Phone
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Donor Phone
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getDonorPhone(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

                {/* DONOR EMAIL */}

                {getDonorEmail(
                  selectedRequest
                ) && (

                  <div className="flex gap-4 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Mail
                        size={20}
                        className="text-green-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Donor Email
                      </p>

                      <p className="font-semibold text-gray-900 break-all">
                        {getDonorEmail(
                          selectedRequest
                        )}
                      </p>
                    </div>

                  </div>
                )}

                {/* DONOR ADDRESS */}

                <div className="flex gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <MapPin
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Donor Address
                    </p>

                    <p className="font-semibold text-gray-900">
                      {getDonorAddress(
                        selectedRequest
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              {selectedRequest.message && (

                <div className="bg-gray-50 rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Buyer's Message
                  </p>

                  <p className="text-gray-700 mt-2">
                    "{selectedRequest.message}"
                  </p>

                </div>
              )}

              {/* =================================================
                  STATUS
              ================================================= */}

              <div className="border-t pt-5 flex items-center justify-between">

                <span className="text-gray-500 font-medium">
                  Current Status
                </span>

                <StatusBadge
                  status={
                    selectedRequest.status
                  }
                />

              </div>

            </div>

            {/* =================================================
                MODAL ACTIONS
            ================================================= */}

            <div className="px-6 pb-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* MESSAGE BUYER */}

                {userRole ===
                  "Donor" &&
                  getBuyerEmail(
                    selectedRequest
                  ) && (

                    <Link
                      href={getMessageLink(
                        selectedRequest
                      )}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                      <MessageCircle
                        size={18}
                      />

                      Message Buyer
                    </Link>
                  )}

                {/* PENDING ACTIONS - DONOR ONLY */}

                {userRole ===
                  "Donor" &&
                normalizeStatus(
                  selectedRequest.status
                ) === "Pending" ? (

                  <>
                    <button
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        rejectRequest(
                          selectedRequest
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition disabled:opacity-50"
                    >
                      <XCircle
                        size={18}
                      />

                      Reject
                    </button>

                    <button
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        approveRequest(
                          selectedRequest
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
                    >
                      <CheckCircle
                        size={18}
                      />

                      Approve
                    </button>
                  </>

                ) : (

                  <button
                    onClick={() =>
                      setSelectedRequest(
                        null
                      )
                    }
                    className="sm:col-span-2 w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold"
                  >
                    Close
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}
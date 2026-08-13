"use client";

import Sidebar from "@/components/dashboard/Sidebar";
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
} from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  useEffect(() => {
    loadRequests();

    const handleRequestsChanged = () => {
      loadRequests();
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
  // LOAD CURRENT DONOR + REQUESTS
  // =====================================================

  const loadRequests = () => {
    try {
      const currentUser =
        JSON.parse(localStorage.getItem("user")) || null;

      const savedRequests =
        JSON.parse(
          localStorage.getItem("donationRequests")
        ) || [];

      if (!currentUser) {
        setRequests([]);
        return;
      }

      // -------------------------------------------------
      // FILTER REQUESTS FOR CURRENT DONOR
      // -------------------------------------------------

      const donorRequests = savedRequests.filter(
        (request) => {
          const donorEmail =
            request.donorEmail ||
            request.ownerEmail ||
            request.donationOwnerEmail ||
            "";

          const donorId =
            request.donorId ||
            request.ownerId ||
            request.donationOwnerId ||
            "";

          const currentEmail =
            currentUser.email || "";

          const currentId =
            currentUser.id || "";

          // If request has donor information
          if (donorEmail || donorId) {
            return (
              (donorEmail &&
                currentEmail &&
                donorEmail.toLowerCase() ===
                  currentEmail.toLowerCase()) ||
              (donorId &&
                currentId &&
                String(donorId) ===
                  String(currentId))
            );
          }

          // ---------------------------------------------
          // FALLBACK
          // If old requests don't have donor information,
          // show them so your existing data doesn't disappear.
          // ---------------------------------------------

          return true;
        }
      );

      setRequests(donorRequests);
    } catch (error) {
      console.error(
        "Error loading donation requests:",
        error
      );

      setRequests([]);
    }
  };

  // =====================================================
  // UPDATE REQUEST STATUS
  // =====================================================

  const updateRequestStatus = (
    requestId,
    newStatus
  ) => {
    try {
      const savedRequests =
        JSON.parse(
          localStorage.getItem("donationRequests")
        ) || [];

      const updatedRequests = savedRequests.map(
        (request) => {
          if (
            String(request.id) ===
            String(requestId)
          ) {
            return {
              ...request,
              status: newStatus,
              updatedAt:
                new Date().toISOString(),
            };
          }

          return request;
        }
      );

      // Save updated requests
      localStorage.setItem(
        "donationRequests",
        JSON.stringify(updatedRequests)
      );

      // Update current page
      setRequests((prev) =>
        prev.map((request) =>
          String(request.id) ===
          String(requestId)
            ? {
                ...request,
                status: newStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : request
        )
      );

      // Update modal
      setSelectedRequest((prev) =>
        prev &&
        String(prev.id) === String(requestId)
          ? {
              ...prev,
              status: newStatus,
              updatedAt:
                new Date().toISOString(),
            }
          : prev
      );

      // Notify other pages
      window.dispatchEvent(
        new Event("requestsChanged")
      );

      // Close modal after action
      setTimeout(() => {
        setSelectedRequest(null);
      }, 500);
    } catch (error) {
      console.error(
        "Error updating request:",
        error
      );
    }
  };

  // =====================================================
  // ACCEPT
  // =====================================================

  const approveRequest = (request) => {
    const confirmApprove = window.confirm(
      `Approve donation request for "${request.productName}"?`
    );

    if (!confirmApprove) return;

    updateRequestStatus(
      request.id,
      "Approved"
    );
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectRequest = (request) => {
    const confirmReject = window.confirm(
      `Reject donation request for "${request.productName}"?`
    );

    if (!confirmReject) return;

    updateRequestStatus(
      request.id,
      "Rejected"
    );
  };

  // =====================================================
  // FILTER REQUESTS
  // =====================================================

  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter(
          (request) =>
            request.status === activeTab
        );

  // =====================================================
  // COUNTS
  // =====================================================

  const allCount = requests.length;

  const pendingCount = requests.filter(
    (request) =>
      request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) =>
      request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) =>
      request.status === "Rejected"
  ).length;

  // =====================================================
  // STATUS COMPONENT
  // =====================================================

  const StatusBadge = ({ status }) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
          <CheckCircle size={16} />
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 text-sm font-semibold">
          <XCircle size={16} />
          Rejected
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
                  Review and manage requests received
                  for your donated items.
                </p>
              </div>
            </div>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

            {/* All */}

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

            {/* Pending */}

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

            {/* Approved */}

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

            {/* Rejected */}

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
                onClick={() => setActiveTab("All")}
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
              NO REQUESTS
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
                No {activeTab.toLowerCase()} requests
              </h2>

              <p className="text-gray-500 mt-2">
                Donation requests will appear here
                when buyers request your items.
              </p>

            </div>
          ) : (

            /* =================================================
                REQUEST LIST
            ================================================= */

            <div className="space-y-4">

              {filteredRequests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                  >

                    <div className="p-6">

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                        {/* LEFT */}

                        <div className="flex gap-4 min-w-0">

                          {/* ITEM ICON */}

                          <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                            <Package
                              size={25}
                              className="text-green-700"
                            />
                          </div>

                          <div className="min-w-0">

                            <h2 className="text-xl font-bold text-gray-900 truncate">
                              {request.productName ||
                                request.itemName ||
                                "Donation Item"}
                            </h2>

                            <p className="text-gray-500 mt-1">
                              Requested by{" "}
                              <span className="font-semibold text-gray-700">
                                {request.requesterName ||
                                  request.buyerName ||
                                  "User"}
                              </span>
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">

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

                        {/* RIGHT */}

                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">

                          <StatusBadge
                            status={
                              request.status ||
                              "Pending"
                            }
                          />

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

                        </div>

                      </div>

                      {/* =================================================
                          QUICK ACTIONS FOR PENDING
                      ================================================= */}

                      {request.status ===
                        "Pending" && (

                        <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row justify-end gap-3">

                          <button
                            onClick={() =>
                              rejectRequest(
                                request
                              )
                            }
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
                          >
                            <Ban size={17} />
                            Reject Request
                          </button>

                          <button
                            onClick={() =>
                              approveRequest(
                                request
                              )
                            }
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                          >
                            <Check size={17} />
                            Approve Request
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                )
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

            {/* MODAL HEADER */}

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
                  setSelectedRequest(null)
                }
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-5">

              {/* PRODUCT */}

              <div className="bg-green-50 rounded-2xl p-5">

                <p className="text-sm text-green-700">
                  Requested Item
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedRequest.productName ||
                    selectedRequest.itemName ||
                    "Donation Item"}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Quantity:{" "}
                  <b>
                    {selectedRequest.quantity ||
                      1}
                  </b>
                </p>

              </div>

              {/* BUYER NAME */}

              <div className="flex gap-4">

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
                    {selectedRequest.requesterName ||
                      selectedRequest.buyerName ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* PHONE */}

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Phone
                    size={20}
                    className="text-purple-600"
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedRequest.requesterPhone ||
                      selectedRequest.buyerPhone ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* ADDRESS */}

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <MapPin
                    size={20}
                    className="text-orange-600"
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Delivery / Pickup Address
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedRequest.address ||
                      selectedRequest.buyerAddress ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* MESSAGE */}

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

              {/* STATUS */}

              <div className="border-t pt-5 flex items-center justify-between">

                <span className="text-gray-500 font-medium">
                  Current Status
                </span>

                <StatusBadge
                  status={
                    selectedRequest.status ||
                    "Pending"
                  }
                />

              </div>

            </div>

            {/* =================================================
                MODAL ACTIONS
            ================================================= */}

            <div className="px-6 pb-6">

              {selectedRequest.status ===
              "Pending" ? (

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={() =>
                      rejectRequest(
                        selectedRequest
                      )
                    }
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      approveRequest(
                        selectedRequest
                      )
                    }
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>

                </div>

              ) : (

                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold"
                >
                  Close
                </button>

              )}

            </div>

          </div>

        </div>
      )}

    </>
  );
}
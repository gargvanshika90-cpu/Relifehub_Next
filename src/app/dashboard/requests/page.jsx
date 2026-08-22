"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("Buyer");

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    loadRequests();

    const handleChange = () => {
      loadRequests();
    };

    window.addEventListener("requestsChanged", handleChange);

    return () => {
      window.removeEventListener("requestsChanged", handleChange);
    };
  }, []);

  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  const loadRequests = () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setCurrentUser(null);
        setRequests([]);
        return;
      }

      const user = JSON.parse(savedUser);

      setCurrentUser(user);

      // User role
      const userRole =
        user.role ||
        user.userRole ||
        "Buyer";

      setRole(userRole);

      const savedRequests =
        JSON.parse(
          localStorage.getItem("donationRequests")
        ) || [];

      // =====================================================
      // CURRENT USER ID / EMAIL
      // =====================================================

      const currentId = String(user.id || "");

      const currentEmail =
        String(user.email || "")
          .trim()
          .toLowerCase();

      // =====================================================
      // DONOR VIEW
      // =====================================================

      if (
        userRole.toLowerCase() === "donor"
      ) {
        const donorRequests =
          savedRequests.filter((request) => {
            const donorId = String(
              request.donorId ||
                request.ownerId ||
                ""
            );

            const donorEmail =
              String(
                request.donorEmail ||
                  request.ownerEmail ||
                  ""
              )
                .trim()
                .toLowerCase();

            const matchId =
              donorId &&
              currentId &&
              donorId === currentId;

            const matchEmail =
              donorEmail &&
              currentEmail &&
              donorEmail === currentEmail;

            return matchId || matchEmail;
          });

        setRequests(donorRequests);
      }

      // =====================================================
      // BUYER VIEW
      // =====================================================

      else {
        const buyerRequests =
          savedRequests.filter((request) => {
            const requesterId = String(
              request.requesterId ||
                request.buyerId ||
                ""
            );

            const requesterEmail =
              String(
                request.requesterEmail ||
                  request.buyerEmail ||
                  ""
              )
                .trim()
                .toLowerCase();

            const matchId =
              requesterId &&
              currentId &&
              requesterId === currentId;

            const matchEmail =
              requesterEmail &&
              currentEmail &&
              requesterEmail === currentEmail;

            return matchId || matchEmail;
          });

        setRequests(buyerRequests);
      }
    } catch (error) {
      console.error(
        "LOAD REQUEST ERROR:",
        error
      );

      setRequests([]);
    }
  };

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const updateRequestStatus = (
    requestId,
    newStatus
  ) => {
    try {
      const savedRequests =
        JSON.parse(
          localStorage.getItem(
            "donationRequests"
          )
        ) || [];

      const now =
        new Date().toISOString();

      const updatedRequests =
        savedRequests.map((request) => {
          if (
            String(request.id) ===
            String(requestId)
          ) {
            return {
              ...request,

              status: newStatus,

              updatedAt: now,

              // When donor approves
              // item becomes unavailable
              itemStatus:
                newStatus === "Approved"
                  ? "Claimed"
                  : "Available",
            };
          }

          return request;
        });

      localStorage.setItem(
        "donationRequests",
        JSON.stringify(updatedRequests)
      );

      // =====================================================
      // IMPORTANT
      // Notify all pages
      // =====================================================

      window.dispatchEvent(
        new Event("requestsChanged")
      );

      // Reload
      loadRequests();

      // Update modal
      setSelectedRequest((previous) => {
        if (
          !previous ||
          String(previous.id) !==
            String(requestId)
        ) {
          return previous;
        }

        return {
          ...previous,
          status: newStatus,
          updatedAt: now,
          itemStatus:
            newStatus === "Approved"
              ? "Claimed"
              : "Available",
        };
      });
    } catch (error) {
      console.error(
        "UPDATE REQUEST ERROR:",
        error
      );
    }
  };

  // =========================================================
  // APPROVE
  // =========================================================

  const approveRequest = (request) => {
    if (
      request.status !== "Pending"
    ) {
      return;
    }

    const confirmApprove =
      window.confirm(
        `Approve request for "${getProductName(
          request
        )}"?`
      );

    if (!confirmApprove) {
      return;
    }

    // =====================================================
    // CHECK IF ANOTHER REQUEST IS ALREADY APPROVED
    // =====================================================

    const allRequests =
      JSON.parse(
        localStorage.getItem(
          "donationRequests"
        )
      ) || [];

    const alreadyApproved =
      allRequests.some(
        (item) =>
          String(
            item.productId
          ) ===
            String(
              request.productId
            ) &&
          String(
            item.category || ""
          ).toLowerCase() ===
            String(
              request.category || ""
            ).toLowerCase() &&
          item.status === "Approved"
      );

    if (alreadyApproved) {
      alert(
        "This item has already been approved for another buyer."
      );

      loadRequests();

      return;
    }

    updateRequestStatus(
      request.id,
      "Approved"
    );

    alert(
      "Donation request approved successfully."
    );
  };

  // =========================================================
  // REJECT
  // =========================================================

  const rejectRequest = (request) => {
    if (
      request.status !== "Pending"
    ) {
      return;
    }

    const confirmReject =
      window.confirm(
        `Reject request for "${getProductName(
          request
        )}"?`
      );

    if (!confirmReject) {
      return;
    }

    updateRequestStatus(
      request.id,
      "Rejected"
    );

    alert(
      "Donation request rejected."
    );
  };

  // =========================================================
  // MESSAGE
  // =========================================================

  const openMessage = (request) => {
    // Save selected conversation information
    localStorage.setItem(
      "openConversation",
      JSON.stringify({
        requestId: request.id,

        productId:
          request.productId,

        category:
          request.category,

        donorId:
          request.donorId,

        donorName:
          request.donorName,

        donorEmail:
          request.donorEmail,

        requesterId:
          request.requesterId,

        requesterName:
          request.requesterName,

        requesterEmail:
          request.requesterEmail,

        productName:
          getProductName(request),
      })
    );

    router.push(
      "/dashboard/messages"
    );
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter(
          (request) =>
            (request.status ||
              "Pending") ===
            activeTab
        );

  // =========================================================
  // COUNTS
  // =========================================================

  const allCount =
    requests.length;

  const pendingCount =
    requests.filter(
      (request) =>
        request.status ===
        "Pending"
    ).length;

  const approvedCount =
    requests.filter(
      (request) =>
        request.status ===
        "Approved"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status ===
        "Rejected"
    ).length;

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!currentUser) {
    return (
      <>
        <Sidebar />

        <main className="min-h-screen bg-slate-50 ml-64 p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-12 text-center border">
            <Package
              size={50}
              className="mx-auto text-gray-400"
            />

            <h1 className="text-2xl font-bold mt-5">
              Please Login
            </h1>

            <p className="text-gray-500 mt-2">
              Login to view your donation requests.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-slate-50 ml-64 p-6">
        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <div className="flex items-center gap-3">

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
                  {role.toLowerCase() === "donor"
                    ? "Manage requests received for your donated items."
                    : "View the donation requests you have sent."}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

            <StatCard
              title="Total Requests"
              count={allCount}
              icon={
                <Package
                  size={21}
                  className="text-blue-600"
                />
              }
              bg="bg-blue-50"
            />

            <StatCard
              title="Pending"
              count={pendingCount}
              icon={
                <Clock
                  size={21}
                  className="text-yellow-600"
                />
              }
              bg="bg-yellow-50"
              text="text-yellow-600"
            />

            <StatCard
              title="Approved"
              count={approvedCount}
              icon={
                <CheckCircle
                  size={21}
                  className="text-green-600"
                />
              }
              bg="bg-green-50"
              text="text-green-600"
            />

            <StatCard
              title="Rejected"
              count={rejectedCount}
              icon={
                <XCircle
                  size={21}
                  className="text-red-600"
                />
              }
              bg="bg-red-50"
              text="text-red-600"
            />

          </div>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="bg-white border rounded-2xl p-2 mb-6 shadow-sm">

            <div className="flex flex-wrap gap-2">

              {[
                ["All", allCount],
                ["Pending", pendingCount],
                ["Approved", approvedCount],
                ["Rejected", rejectedCount],
              ].map(
                ([tab, count]) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(tab)
                    }
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${
                      activeTab === tab
                        ? "bg-green-700 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab} ({count})
                  </button>
                )
              )}

            </div>

          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {filteredRequests.length === 0 ? (
            <div className="bg-white border rounded-2xl p-14 text-center shadow-sm">

              <Package
                size={45}
                className="mx-auto text-gray-400"
              />

              <h2 className="text-xl font-bold mt-5">
                No {activeTab.toLowerCase()} requests
              </h2>

              <p className="text-gray-500 mt-2">
                {role.toLowerCase() ===
                "donor"
                  ? "Requests from buyers will appear here."
                  : "Your donation requests will appear here."}
              </p>

            </div>
          ) : (

            <div className="space-y-4">

              {filteredRequests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                  >

                    <div className="p-6">

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                        {/* LEFT */}

                        <div className="flex gap-4">

                          <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0">

                            {request.productImage ? (
                              <img
                                src={
                                  request.productImage
                                }
                                alt=""
                                className="w-full h-full object-contain rounded-xl"
                              />
                            ) : (
                              <Package
                                size={25}
                                className="text-green-700"
                              />
                            )}

                          </div>

                          <div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {getProductName(
                                request
                              )}
                            </h2>

                            <p className="text-gray-500 mt-1">

                              {role.toLowerCase() ===
                              "donor"
                                ? "Requested by"
                                : "Donor"}

                              {" "}

                              <span className="font-semibold text-gray-800">

                                {role.toLowerCase() ===
                                "donor"
                                  ? request.requesterName ||
                                    "Buyer"
                                  : request.donorName ||
                                    "Donor"}

                              </span>

                            </p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">

                              <span>
                                Quantity:{" "}
                                <b>
                                  {request.quantity ||
                                    1}
                                </b>
                              </span>

                              {request.category && (
                                <span>
                                  Category:{" "}
                                  <b>
                                    {request.category}
                                  </b>
                                </span>
                              )}

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

                        <div className="flex flex-col items-start lg:items-end gap-3">

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
                            className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                          >
                            View Details
                          </button>

                        </div>

                      </div>

                      {/* =================================================
                          DONOR ACTIONS
                      ================================================= */}

                      {role.toLowerCase() ===
                        "donor" &&
                        request.status ===
                          "Pending" && (

                          <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row justify-end gap-3">

                            <button
                              onClick={() =>
                                rejectRequest(
                                  request
                                )
                              }
                              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
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
                              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold"
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
          MODAL
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

            <div className="p-6 border-b flex justify-between">

              <div>

                <p className="text-sm text-green-600 font-semibold">
                  Donation Request
                </p>

                <h2 className="text-2xl font-bold">
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
                <X />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-5">

              {/* PRODUCT */}

              <div className="bg-green-50 rounded-2xl p-5 flex gap-4">

                {selectedRequest.productImage && (
                  <img
                    src={
                      selectedRequest.productImage
                    }
                    alt=""
                    className="w-20 h-20 object-contain bg-white rounded-xl"
                  />
                )}

                <div>

                  <p className="text-sm text-green-700">
                    Requested Item
                  </p>

                  <h3 className="text-xl font-bold">
                    {getProductName(
                      selectedRequest
                    )}
                  </h3>

                  <p className="text-gray-600">
                    Category:{" "}
                    {selectedRequest.category ||
                      "Donation"}
                  </p>

                  <p className="text-gray-600">
                    Quantity:{" "}
                    {selectedRequest.quantity ||
                      1}
                  </p>

                </div>

              </div>

              {/* BUYER */}

              <DetailRow
                icon={
                  <User
                    size={20}
                    className="text-blue-600"
                  />
                }
                title="Buyer Name"
                value={
                  selectedRequest.requesterName ||
                  selectedRequest.buyerName ||
                  "Not provided"
                }
              />

              <DetailRow
                icon={
                  <Mail
                    size={20}
                    className="text-blue-600"
                  />
                }
                title="Buyer Email"
                value={
                  selectedRequest.requesterEmail ||
                  selectedRequest.buyerEmail ||
                  "Not provided"
                }
              />

              <DetailRow
                icon={
                  <Phone
                    size={20}
                    className="text-purple-600"
                  />
                }
                title="Buyer Phone"
                value={
                  selectedRequest.requesterPhone ||
                  selectedRequest.buyerPhone ||
                  "Not provided"
                }
              />

              <DetailRow
                icon={
                  <MapPin
                    size={20}
                    className="text-orange-600"
                  />
                }
                title="Buyer Address"
                value={getAddress(
                  selectedRequest
                )}
              />

              {/* DONOR */}

              <div className="border-t pt-5">

                <h3 className="font-bold text-lg mb-4">
                  Donor Information
                </h3>

                <DetailRow
                  icon={
                    <User
                      size={20}
                      className="text-green-600"
                    />
                  }
                  title="Donor Name"
                  value={
                    selectedRequest.donorName ||
                    "Not provided"
                  }
                />

                <DetailRow
                  icon={
                    <Mail
                      size={20}
                      className="text-green-600"
                    />
                  }
                  title="Donor Email"
                  value={
                    selectedRequest.donorEmail ||
                    "Not provided"
                  }
                />

                <DetailRow
                  icon={
                    <Phone
                      size={20}
                      className="text-green-600"
                    />
                  }
                  title="Donor Phone"
                  value={
                    selectedRequest.donorPhone ||
                    "Not provided"
                  }
                />

              </div>

              {/* MESSAGE */}

              {selectedRequest.message && (
                <div className="bg-gray-50 rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Message
                  </p>

                  <p className="mt-2 text-gray-700">
                    "{selectedRequest.message}"
                  </p>

                </div>
              )}

              {/* STATUS */}

              <div className="border-t pt-5 flex justify-between items-center">

                <span className="font-medium text-gray-500">
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

            {/* ACTIONS */}

            <div className="px-6 pb-6">

              <div className="grid grid-cols-2 gap-3">

                {/* MESSAGE */}

                <button
                  onClick={() =>
                    openMessage(
                      selectedRequest
                    )
                  }
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <MessageCircle
                    size={18}
                  />
                  Message{" "}
                  {role.toLowerCase() ===
                  "donor"
                    ? "Buyer"
                    : "Donor"}
                </button>

                {/* CLOSE */}

                <button
                  onClick={() =>
                    setSelectedRequest(
                      null
                    )
                  }
                  className="bg-gray-900 text-white py-3 rounded-xl font-semibold"
                >
                  Close
                </button>

              </div>

              {/* DONOR ACTIONS */}

              {role.toLowerCase() ===
                "donor" &&
                selectedRequest.status ===
                  "Pending" && (

                  <div className="grid grid-cols-2 gap-3 mt-3">

                    <button
                      onClick={() =>
                        rejectRequest(
                          selectedRequest
                        )
                      }
                      className="border border-red-200 text-red-600 py-3 rounded-xl font-semibold"
                    >
                      <XCircle
                        size={18}
                        className="inline mr-2"
                      />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        approveRequest(
                          selectedRequest
                        )
                      }
                      className="bg-green-600 text-white py-3 rounded-xl font-semibold"
                    >
                      <CheckCircle
                        size={18}
                        className="inline mr-2"
                      />
                      Approve
                    </button>

                  </div>
                )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}

// =========================================================
// PRODUCT NAME
// =========================================================

function getProductName(request) {
  return (
    request.productName ||
    request.itemName ||
    request.name ||
    "Donation Item"
  );
}

// =========================================================
// ADDRESS
// =========================================================

function getAddress(request) {
  const parts = [
    request.address ||
      request.buyerAddress,

    request.city,

    request.state,

    request.pincode,
  ].filter(Boolean);

  return (
    parts.join(", ") ||
    "Not provided"
  );
}

// =========================================================
// STATUS
// =========================================================

function StatusBadge({ status }) {
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
}

// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex gap-4">

      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="font-semibold text-gray-900 break-words">
          {value}
        </p>

      </div>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  count,
  icon,
  bg,
  text = "text-gray-900",
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2
            className={`text-2xl font-bold mt-1 ${text}`}
          >
            {count}
          </h2>

        </div>

        <div
          className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
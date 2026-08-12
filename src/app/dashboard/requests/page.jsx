
"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  User,
  Phone,
  MapPin,
  X,
} from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("donationRequests")) || [];

    setRequests(saved);
  }, []);

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              My Donation Requests
            </h1>

            <p className="text-gray-500 mt-2">
              Track the items you have requested from donors.
            </p>
          </div>

          {/* No Requests */}
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center">
              <Package
                size={50}
                className="mx-auto text-gray-400"
              />

              <h2 className="text-xl font-bold mt-4">
                No requests yet
              </h2>

              <p className="text-gray-500 mt-2">
                Browse available items and request a donation.
              </p>

              <Link
                href="/food"
                className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Browse Food
              </Link>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Request Cards */}
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border shadow-sm p-5"
                >
                  <div className="flex justify-between items-start gap-6">

                    {/* Request Info */}
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold">
                        {request.productName}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Requested from {request.donorName}
                      </p>

                      <p className="text-sm mt-2">
                        Quantity:{" "}
                        <b>{request.quantity}</b>
                      </p>

                      {request.message && (
                        <p className="text-sm text-gray-600 mt-2">
                          "{request.message}"
                        </p>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end gap-3 shrink-0">

                      {/* Status */}
                      {request.status === "Pending" && (
                        <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
                          <Clock size={16} />
                          Pending
                        </span>
                      )}

                      {request.status === "Approved" && (
                        <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
                          <CheckCircle size={16} />
                          Approved
                        </span>
                      )}

                      {request.status === "Rejected" && (
                        <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
                          <XCircle size={16} />
                          Rejected
                        </span>
                      )}

                      {/* Details Button */}
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        View Details
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">
                  Buyer Details
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Donation request information
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Buyer Information */}
            <div className="p-6 space-y-5">

              {/* Buyer Name */}
              <div className="flex items-start gap-4">
                <div className="bg-green-50 text-green-700 p-3 rounded-xl">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Buyer Name
                  </p>

                  <p className="font-semibold">
                    {selectedRequest.requesterName ||
                      selectedRequest.buyerName ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-xl">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>

                  <p className="font-semibold">
                    {selectedRequest.requesterPhone ||
                      selectedRequest.buyerPhone ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-50 text-orange-700 p-3 rounded-xl">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="font-semibold">
                    {selectedRequest.address ||
                      selectedRequest.buyerAddress ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              {/* Product */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Requested Item
                </p>

                <p className="font-bold text-lg">
                  {selectedRequest.productName}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Quantity:{" "}
                  <b>{selectedRequest.quantity}</b>
                </p>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">
                    Message
                  </p>

                  <p className="text-gray-700 mt-1">
                    "{selectedRequest.message}"
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="flex justify-between items-center border-t pt-5">
                <span className="text-gray-500">
                  Request Status
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedRequest.status === "Approved"
                      ? "bg-green-50 text-green-700"
                      : selectedRequest.status === "Rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

            </div>

            {/* Close */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-medium"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}


// "use client";
// import Sidebar from "@/components/dashboard/Sidebar";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   Package,
// } from "lucide-react";

// export default function RequestsPage() {

//   const [requests, setRequests] = useState([]);

//   useEffect(() => {

//     const saved =
//       JSON.parse(localStorage.getItem("donationRequests")) || [];

//     setRequests(saved);

//   }, []);


//   return (
//     <> <Sidebar></Sidebar>
//     <main className="min-h-screen bg-gray-50 p-6 ml-64">

//       <div className="max-w-6xl mx-auto">

//         <div className="mb-8">

//           <h1 className="text-3xl font-bold">
//             My Donation Requests
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Track the items you have requested from donors.
//           </p>

//         </div>


//         {requests.length === 0 ? (

//           <div className="bg-white rounded-2xl border p-10 text-center">

//             <Package
//               size={50}
//               className="mx-auto text-gray-400"
//             />

//             <h2 className="text-xl font-bold mt-4">
//               No requests yet
//             </h2>

//             <p className="text-gray-500 mt-2">
//               Browse available items and request a donation.
//             </p>

//             <Link
//               href="/food"
//               className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-xl"
//             >
//               Browse Food
//             </Link>

//           </div>

//         ) : (

//           <div className="space-y-4">

//             {requests.map((request) => (

//               <div
//                 key={request.id}
//                 className="bg-white rounded-2xl border shadow-sm p-5"
//               >

//                 <div className="flex justify-between">

//                   <div>

//                     <h2 className="text-xl font-bold">
//                       {request.productName}
//                     </h2>

//                     <p className="text-gray-500 mt-1">
//                       Requested from {request.donorName}
//                     </p>

//                     <p className="text-sm mt-2">
//                       Quantity:{" "}
//                       <b>{request.quantity}</b>
//                     </p>

//                     {request.message && (
//                       <p className="text-sm text-gray-600 mt-2">
//                         "{request.message}"
//                       </p>
//                     )}

//                   </div>


//                   <div>

//                     {request.status === "Pending" && (

//                       <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full flex items-center gap-2">
//                         <Clock size={16} />
//                         Pending
//                       </span>

//                     )}

//                     {request.status === "Approved" && (

//                       <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center gap-2">
//                         <CheckCircle size={16} />
//                         Approved
//                       </span>

//                     )}

//                     {request.status === "Rejected" && (

//                       <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full flex items-center gap-2">
//                         <XCircle size={16} />
//                         Rejected
//                       </span>

//                     )}

//                   </div>

//                 </div>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </main>
//     </>
//   );
// }
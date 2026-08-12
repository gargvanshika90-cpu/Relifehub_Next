"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivities from "@/components/dashboard/RecentActivities";
import ImpactOverview from "@/components/dashboard/ImpactOverview";
import BuyerCategories from "@/components/dashboard/BuyerCategories";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("Donor");

  const [stats, setStats] = useState({
    donor: {
      totalDonations: 0,
      requestsReceived: 0,
      requestsFulfilled: 0,
      impactPoints: 0,
    },

    buyer: {
      itemsPurchased: 0,
      activeOrders: 0,
      itemsDelivered: 0,
      impactPoints: 0,
    },
  });

  // =====================================================
  // LOAD USER + DATABASE DATA
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // -----------------------------------------------
        // GET LOGGED-IN USER
        // -----------------------------------------------

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);

        // -----------------------------------------------
        // GET SAVED DASHBOARD MODE
        // -----------------------------------------------

        const savedRole =
          localStorage.getItem("dashboardRole");

        if (
          savedRole === "Donor" ||
          savedRole === "Buyer"
        ) {
          setRole(savedRole);
        } else if (parsedUser.role) {
          setRole(parsedUser.role);
        }

        // -----------------------------------------------
        // USER ID REQUIRED
        // -----------------------------------------------

        if (!parsedUser.id) {
          console.error(
            "User ID is missing from localStorage"
          );

          setLoading(false);
          return;
        }

        // -----------------------------------------------
        // GET REAL DATABASE STATISTICS
        // -----------------------------------------------

        const response = await fetch(
          `/api/dashboard/stats?userId=${parsedUser.id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data.success) {
          setStats({
            donor: data.donor || {
              totalDonations: 0,
              requestsReceived: 0,
              requestsFulfilled: 0,
              impactPoints: 0,
            },

            buyer: data.buyer || {
              itemsPurchased: 0,
              activeOrders: 0,
              itemsDelivered: 0,
              impactPoints: 0,
            },
          });
        } else {
          console.error(
            "Dashboard API error:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =====================================================
  // CHANGE DONOR / BUYER MODE
  // =====================================================

  const changeRole = (newRole) => {
    setRole(newRole);

    localStorage.setItem(
      "dashboardRole",
      newRole
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOGIN REQUIRED
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Please Login First
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access your dashboard.
          </p>

          <Link
            href="/login"
            className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT ROLE DATA
  // =====================================================

  const currentStats =
    role === "Donor"
      ? stats.donor
      : stats.buyer;

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7faf8]">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="ml-64">

        {/* =================================================
            DASHBOARD NAVBAR
        ================================================= */}

        <DashboardNavbar
          role={role}
          setRole={changeRole}
          user={user}
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="p-7">

          {/* =================================================
              WELCOME HEADER
          ================================================= */}


          {/* =================================================
              DASHBOARD MODE
          ================================================= */}

          <div className="bg-white border border-gray-300 rounded-xl p-4 mb-6 flex items-center justify-between">

            {/* LEFT */}

            <div>
              <p className="font-semibold text-gray-800">
                Dashboard Mode
              </p>

              <p className="text-sm text-gray-500">
                Choose Buyer or Donor dashboard
              </p>
            </div>

            {/* RIGHT */}

            <div className="flex gap-2">

              {/* DONOR BUTTON */}

              <button
                type="button"
                onClick={() =>
                  changeRole("Donor")
                }
                className={`
                  px-5 py-2.5
                  rounded-lg
                  font-semibold
                  transition
                  ${
                    role === "Donor"
                      ? "bg-green-700 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                🟢 Donor
              </button>

              {/* BUYER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  changeRole("Buyer")
                }
                className={`
                  px-5 py-2.5
                  rounded-lg
                  font-semibold
                  transition
                  ${
                    role === "Buyer"
                      ? "bg-blue-900 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                🔵 Buyer
              </button>

            </div>

          </div>

          {/* =================================================
              DYNAMIC STATS
          ================================================= */}

          <StatsCards
            role={role}
            stats={currentStats}
          />

          {/* =================================================
              LOWER CONTENT
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

            {/* =================================================
                RECENT ACTIVITIES
            ================================================= */}

            <RecentActivities
              role={role}
              userId={user.id}
            />

            {/* =================================================
                DONOR / BUYER RIGHT SIDE
            ================================================= */}

            {role === "Donor" ? (
              <ImpactOverview
                stats={stats.donor}
              />
            ) : (
              <BuyerCategories
                stats={stats.buyer}
              />
            )}

          </div>

        </main>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// import Sidebar from "@/components/dashboard/Sidebar";
// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
// import StatsCards from "@/components/dashboard/StatsCards";
// import RecentActivities from "@/components/dashboard/RecentActivities";
// import ImpactOverview from "@/components/dashboard/ImpactOverview";
// import BuyerCategories from "@/components/dashboard/BuyerCategories";

// export default function Dashboard() {

//   const [user, setUser] = useState(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [role, setRole] =
//     useState("Donor");


//   useEffect(() => {

//     const savedUser =
//       localStorage.getItem("user");

//     if (savedUser) {

//       try {

//         const parsedUser =
//           JSON.parse(savedUser);

//         setUser(parsedUser);

//         if (parsedUser.role) {
//           setRole(parsedUser.role);
//         }

//       } catch {

//         localStorage.removeItem("user");

//       }

//     }

//     setLoading(false);

//   }, []);


//   /* =========================
//      LOADING
//   ========================= */

//   if (loading) {

//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">

//         <div className="text-center">

//           <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />

//           <p className="mt-4 text-gray-500">
//             Loading dashboard...
//           </p>

//         </div>

//       </div>
//     );

//   }


//   /* =========================
//      LOGIN REQUIRED
//   ========================= */

//   if (!user) {

//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">

//         <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

//           <h1 className="text-2xl font-bold text-gray-800">
//             Please Login First
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Login to access your dashboard.
//           </p>

//           <Link
//             href="/login"
//             className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-lg font-semibold"
//           >
//             Login
//           </Link>

//         </div>

//       </div>
//     );

//   }


//   return (
  
//     <div className="min-h-screen bg-[#f7faf8]">

//       {/* SIDEBAR */}
//       <Sidebar />


//       {/* MAIN */}
//       <div className="ml-64">

//         {/* NAVBAR */}
//         <DashboardNavbar
//           role={role}
//           setRole={setRole}
//         />


//         {/* CONTENT */}
//         <main className="p-7">

//           {/* ROLE SELECTOR */}

//           <div className="bg-white border rounded-xl p-4 mb-6 flex items-center justify-between">

//             <div>

//               <p className="font-semibold text-gray-800">
//                 Dashboard Mode
//               </p>

//               <p className="text-sm text-gray-500">
//                 Choose Buyer or Donor dashboard
//               </p>

//             </div>


//             <div className="flex gap-2">

//               <button
//                 onClick={() => setRole("Donor")}
//                 className={`
//                   px-5 py-2.5
//                   rounded-lg
//                   font-semibold
//                   ${
//                     role === "Donor"
//                       ? "bg-green-700 text-white"
//                       : "bg-gray-100 text-gray-600"
//                   }
//                 `}
//               >
//                 🟢 Donor
//               </button>


//               <button
//                 onClick={() => setRole("Buyer")}
//                 className={`
//                   px-5 py-2.5
//                   rounded-lg
//                   font-semibold
//                   ${
//                     role === "Buyer"
//                       ? "bg-blue-900 text-white"
//                       : "bg-gray-100 text-gray-600"
//                   }
//                 `}
//               >
//                 🔵 Buyer
//               </button>

//             </div>

//           </div>


//           {/* STATS */}

//           <StatsCards
//             role={role}
//           />


//           {/* LOWER CONTENT */}

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

//             {/* ACTIVITIES */}

//             <RecentActivities
//               role={role}
//             />


//             {/* RIGHT */}

//             {role === "Donor" ? (

//               <ImpactOverview />

//             ) : (

//               <BuyerCategories />

//             )}

//           </div>

//         </main>

//       </div>

//     </div>
//   );
// }

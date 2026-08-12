 "use client";

import {
  Gift,
  Users,
  CheckCircle,
  ShoppingBag,
  Package,
} from "lucide-react";

export default function StatsCards({
  role,
  stats,
}) {

  const donorCards = [

    {
      title: "Total Donations",
      value: stats?.totalDonations ?? 0,
      description: "Items you donated",
      icon: Gift,
      bg: "bg-green-100",
      color: "text-green-600",
    },

    {
      title: "Requests Received",
      value: stats?.requestsReceived ?? 0,
      description: "Requests for your items",
      icon: Users,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },

    {
      title: "Requests Fulfilled",
      value: stats?.requestsFulfilled ?? 0,
      description: "Successfully completed",
      icon: CheckCircle,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Impact Points",
      value: stats?.impactPoints ?? 0,
      description: "Your contribution",
      icon: Gift,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },

  ];


  const buyerCards = [

    {
      title: "Items Purchased",
      value: stats?.itemsPurchased ?? 0,
      description: "Accepted requests",
      icon: ShoppingBag,
      bg: "bg-green-100",
      color: "text-green-600",
    },

    {
      title: "Active Orders",
      value: stats?.activeOrders ?? 0,
      description: "Pending or approved",
      icon: Package,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },

    {
      title: "Items Delivered",
      value: stats?.itemsDelivered ?? 0,
      description: "Completed requests",
      icon: CheckCircle,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Impact Points",
      value: stats?.impactPoints ?? 0,
      description: "Your contribution",
      icon: Gift,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },

  ];


  const cards =
    role === "Donor"
      ? donorCards
      : buyerCards;


  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
          >

            <div className="flex items-start justify-between">

              <div
                className={`
                  w-12 h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${card.bg}
                `}
              >

                <Icon
                  size={24}
                  className={card.color}
                />

              </div>


              <span className="text-green-600 text-xl">
                ↗
              </span>

            </div>


            <p className="mt-6 text-gray-500">
              {card.title}
            </p>


            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {card.value}
            </h2>


            <p className="text-sm text-gray-400 mt-3">
              {card.description}
            </p>

          </div>

        );

      })}

    </div>

  );
}// "use client";

// import {
//   Gift,
//   Users,
//   CheckCircle,
//   ShoppingBag,
//   Package,
//   TrendingUp,
//   ArrowUpRight,
// } from "lucide-react";

// export default function StatsCards({ role }) {

//   const donorStats = [
//     {
//       title: "Total Donations",
//       value: "12",
//       change: "20%",
//       icon: Gift,
//       bg: "bg-green-100",
//       color: "text-green-600",
//     },
//     {
//       title: "Requests Received",
//       value: "8",
//       change: "15%",
//       icon: Users,
//       bg: "bg-yellow-100",
//       color: "text-yellow-600",
//     },
//     {
//       title: "Requests Fulfilled",
//       value: "6",
//       change: "10%",
//       icon: CheckCircle,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//     {
//       title: "Impact Points",
//       value: "120",
//       change: "25%",
//       icon: Gift,
//       bg: "bg-purple-100",
//       color: "text-purple-600",
//     },
//   ];


//   const buyerStats = [
//     {
//       title: "Items Purchased",
//       value: "8",
//       change: "18%",
//       icon: ShoppingBag,
//       bg: "bg-green-100",
//       color: "text-green-600",
//     },
//     {
//       title: "Active Orders",
//       value: "4",
//       change: "12%",
//       icon: Package,
//       bg: "bg-yellow-100",
//       color: "text-yellow-600",
//     },
//     {
//       title: "Items Delivered",
//       value: "6",
//       change: "10%",
//       icon: CheckCircle,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//     {
//       title: "Impact Points",
//       value: "120",
//       change: "25%",
//       icon: Gift,
//       bg: "bg-purple-100",
//       color: "text-purple-600",
//     },
//   ];


//   const stats =
//     role === "Donor"
//       ? donorStats
//       : buyerStats;


//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

//       {stats.map((stat) => {

//         const Icon = stat.icon;

//         return (
//           <div
//             key={stat.title}
//             className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
//           >

//             <div className="flex justify-between">

//               <div
//                 className={`
//                   w-11 h-11
//                   rounded-xl
//                   ${stat.bg}
//                   flex
//                   items-center
//                   justify-center
//                 `}
//               >

//                 <Icon
//                   size={22}
//                   className={stat.color}
//                 />

//               </div>

//               <ArrowUpRight
//                 size={18}
//                 className="text-green-500"
//               />

//             </div>


//             <p className="text-sm text-gray-500 mt-5">
//               {stat.title}
//             </p>


//             <h2 className="text-3xl font-bold text-gray-800 mt-1">
//               {stat.value}
//             </h2>


//             <p className="text-xs mt-2">

//               <span className="text-green-600 font-semibold">
//                 ↑ {stat.change}
//               </span>

//               <span className="text-gray-400 ml-1">
//                 from last week
//               </span>

//             </p>

//           </div>
//         );

//       })}

//     </div>
//   );
// }



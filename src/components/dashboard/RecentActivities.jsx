"use client";

import {
  Shirt,
  Package,
  BookOpen,
  Gamepad2,
  Sofa,
  Laptop,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function RecentActivities({ role }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (role === "Donor") {
      // Donor ke actual donations
      const donations =
        JSON.parse(localStorage.getItem("myDonations")) || [];

      const donorItems = donations.map((item) => ({
        title: `You donated "${item.itemName || item.name}".`,
        time: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "Recently",
        icon: getIcon(item.category),
        bg: getBg(item.category),
      }));

      setActivities(donorItems.slice(0, 5));
    } else {
      // Buyer ke actual orders
      const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

      const buyerItems = orders.map((order) => ({
        title: `You ordered "${order.itemName || order.name}".`,
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "Recently",
        icon: getIcon(order.category),
        bg: getBg(order.category),
      }));

      setActivities(buyerItems.slice(0, 5));
    }
  }, [role]);

  function getIcon(category) {
    switch (category?.toLowerCase()) {
      case "clothes":
        return Shirt;

      case "books":
        return BookOpen;

      case "toys":
        return Gamepad2;

      case "furniture":
        return Sofa;

      case "electronics":
        return Laptop;

      default:
        return Package;
    }
  }

  function getBg(category) {
    switch (category?.toLowerCase()) {
      case "clothes":
        return "bg-green-100";

      case "books":
        return "bg-blue-100";

      case "toys":
        return "bg-pink-100";

      case "furniture":
        return "bg-yellow-100";

      case "electronics":
        return "bg-purple-100";

      default:
        return "bg-orange-100";
    }
  }

  return (
    <div className="bg-white border rounded-2xl p-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {role === "Donor"
              ? "Recent Donations"
              : "My Orders"}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {role === "Donor"
              ? "Your latest donation activities"
              : "Your latest purchase activities"}
          </p>
        </div>

        <button className="text-sm text-green-600 font-semibold">
          View All
        </button>

      </div>

      {/* Activities */}
      <div className="mt-5 space-y-4">

        {activities.length === 0 ? (

          <div className="text-center py-8">
            <Package
              size={35}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm text-gray-500 mt-2">
              {role === "Donor"
                ? "No donations yet"
                : "No orders yet"}
            </p>
          </div>

        ) : (

          activities.map((activity, index) => {

            const Icon = activity.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4"
              >

                {/* Icon */}
                <div
                  className={`
                    w-11 h-11
                    rounded-xl
                    ${activity.bg}
                    flex items-center justify-center
                  `}
                >
                  <Icon
                    size={20}
                    className="text-gray-700"
                  />
                </div>

                {/* Item */}
                <div className="flex-1">

                  <p className="text-sm font-medium text-gray-800">
                    {activity.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </p>

                </div>

                {/* Status */}
                <CheckCircle
                  size={17}
                  className="text-green-500"
                />

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}
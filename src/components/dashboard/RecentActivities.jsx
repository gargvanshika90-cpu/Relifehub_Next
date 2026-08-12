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

export default function RecentActivities({
  role,
}) {

  const donorActivities = [
    {
      title: 'Your donation "Winter Jacket" was completed.',
      time: "2 days ago",
      icon: Shirt,
      bg: "bg-green-100",
    },
    {
      title: 'Your request for "Rice Bag 10kg" was accepted.',
      time: "5 days ago",
      icon: Package,
      bg: "bg-orange-100",
    },
    {
      title: 'Your donation "Books Set" was completed.',
      time: "6 days ago",
      icon: BookOpen,
      bg: "bg-yellow-100",
    },
    {
      title: 'Your request for "Teddy Bear" was accepted.',
      time: "1 week ago",
      icon: Gamepad2,
      bg: "bg-pink-100",
    },
  ];


  const buyerActivities = [
    {
      title: 'You purchased "Dining Table".',
      time: "2 days ago",
      icon: Sofa,
      bg: "bg-green-100",
    },
    {
      title: 'Your order "Books Collection" was delivered.',
      time: "4 days ago",
      icon: BookOpen,
      bg: "bg-blue-100",
    },
    {
      title: 'You purchased "Study Chair".',
      time: "6 days ago",
      icon: Sofa,
      bg: "bg-yellow-100",
    },
    {
      title: 'Your order "Tablet Set" is processing.',
      time: "1 week ago",
      icon: Laptop,
      bg: "bg-purple-100",
    },
  ];


  const activities =
    role === "Donor"
      ? donorActivities
      : buyerActivities;


  return (
    <div className="bg-white border rounded-2xl p-6">

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


      <div className="mt-5 space-y-4">

        {activities.map((activity, index) => {

          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4"
            >

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


              <div className="flex-1">

                <p className="text-sm font-medium text-gray-800">
                  {activity.title}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {activity.time}
                </p>

              </div>


              <CheckCircle
                size={17}
                className="text-green-500"
              />

            </div>
          );

        })}

      </div>

    </div>
  );
}
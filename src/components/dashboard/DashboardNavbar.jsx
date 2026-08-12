"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Bell,
  ChevronDown,
  Plus,
} from "lucide-react";

export default function DashboardNavbar({
  role,
  setRole,
}) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }

    }

  }, []);


  if (!user) {
    return null;
  }


  const firstName =
    user.firstName?.trim() || "User";

  const email =
    user.email || "No email";


  const initial =
    firstName.charAt(0).toUpperCase();


  const changeRole = (newRole) => {

    setRole(newRole);

    const updatedUser = {
      ...user,
      role: newRole,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

  };


  return (
    <header className="bg-white border-b border-gray-200 px-7 py-5">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,
          </h1>

          <div className="flex items-center gap-2 mt-1">

            <h2 className="text-2xl font-bold text-green-700">
              {firstName}
            </h2>

            <span className="text-xl">
              👋
            </span>

          </div>

          <p className="text-sm text-gray-500 mt-1">
            {email}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your{" "}
            {role.toLowerCase()} activities.
          </p>

        </div>


        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* ROLE */}
          <div className="flex bg-gray-100 p-1 rounded-xl">

            <button
              onClick={() => changeRole("Donor")}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold
                ${
                  role === "Donor"
                    ? "bg-green-700 text-white"
                    : "text-gray-600 hover:bg-white"
                }
              `}
            >
              Donor
            </button>

            <button
              onClick={() => changeRole("Buyer")}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold
                ${
                  role === "Buyer"
                    ? "bg-blue-900 text-white"
                    : "text-gray-600 hover:bg-white"
                }
              `}
            >
              Buyer
            </button>

          </div>


          {/* NOTIFICATION */}
          <button className="relative">

            <Bell
              size={22}
              className="text-gray-600"
            />

            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />

          </button>


          {/* ACTION */}
          <Link
            href={
              role === "Donor"
                ? "/donate"
                : "/categories"
            }
            className={`
              flex items-center gap-2
              text-white
              px-5 py-3
              rounded-lg
              font-semibold
              ${
                role === "Donor"
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-blue-900 hover:bg-blue-900"
              }
            `}
          >

            <Plus size={18} />

            {role === "Donor"
              ? "Make a Donation"
              : "Find Items"}

          </Link>


          {/* USER */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">

              <span className="font-bold text-green-700">
                {initial}
              </span>

            </div>

            <div>

              <p className="font-semibold text-gray-800">
                {firstName}
              </p>

              <p className="text-xs text-gray-500">
                {email}
              </p>

              <p className="text-xs font-semibold text-green-600">
                {role}
              </p>

            </div>

            <ChevronDown
              size={17}
              className="text-gray-500"
            />

          </div>

        </div>

      </div>

    </header>
  );
}
"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.name ||
    "User";

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Profile
        </h1>

        <p className="text-gray-500 mb-8">
          Manage your account information
        </p>

        <div className="bg-white rounded-2xl shadow-sm border p-8">

          {/* PROFILE HEADER */}
          <div className="flex items-center gap-5 pb-6 border-b">

            <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {fullName}
              </h2>

              <p className="text-gray-500">
                {user.email}
              </p>

              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                {user.role || "Donor"}
              </span>
            </div>

          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <User size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">
                  First Name
                </span>
              </div>

              <p className="font-semibold text-gray-800">
                {user.firstName || "-"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <User size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">
                  Last Name
                </span>
              </div>

              <p className="font-semibold text-gray-800">
                {user.lastName || "-"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">
                  Email
                </span>
              </div>

              <p className="font-semibold text-gray-800">
                {user.email || "-"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">
                  Role
                </span>
              </div>

              <p className="font-semibold text-gray-800">
                {user.role || "Donor"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
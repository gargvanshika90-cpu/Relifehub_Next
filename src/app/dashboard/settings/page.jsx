"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    image: "",
  });

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        // localStorage MUST be inside useEffect
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
          router.push("/login");
          return;
        }

        const loggedInUser = JSON.parse(savedUser);

        if (!loggedInUser?.id) {
          console.error("User ID not found");
          router.push("/login");
          return;
        }

        // Get latest user information from database
        const response = await fetch(
          `/api/user/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load user"
          );
        }

        const dbUser = data.user;

        setUser(dbUser);

        // First name, last name and email
        // automatically come from Signup/Database
        setForm({
          firstName: dbUser.firstName || "",
          lastName: dbUser.lastName || "",
          email: dbUser.email || "",
          phone: dbUser.phone || "",
          address: dbUser.address || "",
          city: dbUser.city || "",
          state: dbUser.state || "",
          pincode: dbUser.pincode || "",
          image: dbUser.image || "",
        });

        // Keep localStorage updated
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...loggedInUser,
            ...dbUser,
          })
        );
      } catch (error) {
        console.error(
          "Error loading settings:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Unable to load profile",
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2
          size={32}
          className="animate-spin text-green-700"
        />
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500 mt-1 mb-8">
          Manage your profile information
        </p>

        <div className="bg-white rounded-2xl shadow-sm border">

          {/* TABS */}

          <div className="border-b px-6">
            <div className="flex gap-8">

              <button
                type="button"
                className="py-4 text-sm font-semibold text-green-700 border-b-2 border-green-700"
              >
                Profile
              </button>

              <button
                type="button"
                className="py-4 text-sm text-gray-500"
              >
                Account
              </button>

              <button
                type="button"
                className="py-4 text-sm text-gray-500"
              >
                Notifications
              </button>

              <button
                type="button"
                className="py-4 text-sm text-gray-500"
              >
                Security
              </button>

            </div>
          </div>


          <form className="p-8">

            <div className="grid md:grid-cols-[1fr_200px] gap-10">

              {/* LEFT */}

              <div className="space-y-5">

                {/* FIRST NAME */}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={form.firstName}
                    readOnly
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                      bg-gray-100
                      text-gray-600
                      cursor-not-allowed
                    "
                  />
                </div>


                {/* LAST NAME */}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={form.lastName}
                    readOnly
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                      bg-gray-100
                      text-gray-600
                      cursor-not-allowed
                    "
                  />
                </div>


                {/* EMAIL */}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                      bg-gray-100
                      text-gray-600
                      cursor-not-allowed
                    "
                  />
                </div>


                {/* PHONE */}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-green-200
                      focus:border-green-600
                    "
                  />
                </div>


                {/* ADDRESS */}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter address"
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      resize-none
                      focus:ring-2
                      focus:ring-green-200
                    "
                  />
                </div>


                {/* CITY STATE PINCODE */}

                <div className="grid grid-cols-3 gap-4">

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="
                        w-full
                        border
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="
                        w-full
                        border
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="
                        w-full
                        border
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                      "
                    />
                  </div>

                </div>

              </div>


              {/* PROFILE IMAGE */}

              <div className="flex flex-col items-center">

                <div className="
                  w-32
                  h-32
                  rounded-full
                  bg-green-100
                  flex items-center
                  justify-center
                  overflow-hidden
                ">

                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="
                      text-4xl
                      font-bold
                      text-green-700
                    ">
                      {form.firstName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </span>
                  )}

                </div>

                <label className="
                  mt-4
                  border
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  cursor-pointer
                  hover:bg-gray-50
                ">
                  <Camera
                    size={15}
                    className="inline mr-2"
                  />

                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>

              </div>

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="
                mt-8
                w-full
                bg-green-700
                hover:bg-green-800
                text-white
                font-semibold
                py-3
                rounded-lg
              "
            >
              <Save
                size={17}
                className="inline mr-2"
              />

              Save Changes
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
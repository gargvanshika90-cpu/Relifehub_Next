"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  ArrowLeft,
 
} from "lucide-react";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // ==========================================
  // STATES
  // ==========================================

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
      const savedUser = localStorage.getItem("user");

      console.log("LOCAL STORAGE USER:", savedUser);

      if (!savedUser) {
        router.replace("/login");
        return;
      }

      let loggedInUser;

      try {
        loggedInUser = JSON.parse(savedUser);
      } catch (error) {
        console.error("INVALID USER JSON:", error);
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      // Get ID from localStorage
      const userId = String(loggedInUser?.id || "").trim();

      console.log("USER ID:", userId);

      if (
        !userId ||
        userId === "undefined" ||
        userId === "null"
      ) {
        await Swal.fire({
          icon: "error",
          title: "Invalid User ID",
          text: "Please login again.",
        });

        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      // ==========================================
      // IMPORTANT: GET REQUEST
      // NO BODY HERE
      // ==========================================

      const response = await fetch(
        `/api/user/${encodeURIComponent(userId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      console.log("GET STATUS:", response.status);

      const data = await response.json();

      console.log("GET USER RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load user"
        );
      }

      const dbUser = data.user;

      if (!dbUser) {
        throw new Error("User not found");
      }

      // ==========================================
      // FILL USER
      // ==========================================

      setUser(dbUser);

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

      // ==========================================
      // UPDATE LOCAL STORAGE
      // ==========================================

      const updatedUser = {
        ...loggedInUser,
        ...dbUser,

        id: String(dbUser.id || userId),

        firstName: dbUser.firstName || "",
        lastName: dbUser.lastName || "",
        email: dbUser.email || "",

        name: `${dbUser.firstName || ""} ${
          dbUser.lastName || ""
        }`.trim(),

        role:
          dbUser.role ||
          loggedInUser.role ||
          "Donor",

        image:
          dbUser.image ||
          loggedInUser.image ||
          "",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      window.dispatchEvent(
        new Event("userChanged")
      );

    } catch (error) {
      console.error(
        "ERROR LOADING SETTINGS:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "Unable to load profile",
        text:
          error?.message ||
          "Something went wrong.",
      });

    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, [router]);
  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CHANGE PROFILE PHOTO
  // ==========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ----------------------------------------
    // CHECK FILE TYPE
    // ----------------------------------------

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid Image",
        text: "Please select an image file.",
      });

      return;
    }

    // ----------------------------------------
    // CHECK FILE SIZE
    // ----------------------------------------

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Image Too Large",
        text: "Please select an image smaller than 2 MB.",
      });

      return;
    }

    // ----------------------------------------
    // CONVERT TO BASE64
    // ----------------------------------------

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

 const handleSave = async (e) => {
  e.preventDefault();

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!form.firstName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "First Name Required",
      text: "Please enter your first name.",
    });
    return;
  }

  if (!form.lastName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Last Name Required",
      text: "Please enter your last name.",
    });
    return;
  }

  if (!form.email.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Email Required",
      text: "Please enter your email.",
    });
    return;
  }

  if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Phone Number",
      text: "Phone number must contain 10 digits.",
    });
    return;
  }

  if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Pincode",
      text: "Pincode must contain 6 digits.",
    });
    return;
  }

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    router.replace("/login");
    return;
  }

  let loggedInUser;

  try {
    loggedInUser = JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid user:", error);

    localStorage.removeItem("user");
    router.replace("/login");
    return;
  }

  const userId = String(loggedInUser?.id || "").trim();

  if (!userId || userId === "undefined" || userId === "null") {
    await Swal.fire({
      icon: "error",
      title: "Invalid User ID",
      text: "Please login again.",
    });

    localStorage.removeItem("user");
    router.replace("/login");
    return;
  }

  try {
    setSaving(true);

    // ==========================================
    // UPDATE USER IN PRISMA
    // ==========================================

    const response = await fetch(
      `/api/user/${encodeURIComponent(userId)}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          image: form.image || null,
        }),
      }
    );

    const data = await response.json();

    console.log("UPDATE USER RESPONSE:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to update profile"
      );
    }

    // ==========================================
    // USER RETURNED FROM PRISMA
    // ==========================================

    const updatedDbUser = data.user;

    setUser(updatedDbUser);

    setForm({
      firstName: updatedDbUser.firstName || "",
      lastName: updatedDbUser.lastName || "",
      email: updatedDbUser.email || "",
      phone: updatedDbUser.phone || "",
      address: updatedDbUser.address || "",
      city: updatedDbUser.city || "",
      state: updatedDbUser.state || "",
      pincode: updatedDbUser.pincode || "",
      image: updatedDbUser.image || "",
    });

    // ==========================================
    // UPDATE LOCAL STORAGE
    // ==========================================

    const newLocalUser = {
      ...loggedInUser,
      ...updatedDbUser,

      id: String(updatedDbUser.id || userId),

      firstName: updatedDbUser.firstName || "",
      lastName: updatedDbUser.lastName || "",
      email: updatedDbUser.email || "",

      name: `${updatedDbUser.firstName || ""} ${
        updatedDbUser.lastName || ""
      }`.trim(),

      role:
        updatedDbUser.role ||
        loggedInUser.role ||
        "Donor",

      image:
        updatedDbUser.image ||
        "",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(newLocalUser)
    );

    // Tell Navbar/dashboard that user changed
    window.dispatchEvent(
      new Event("userChanged")
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    await Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your changes have been saved to the database.",
      timer: 1800,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);

    await Swal.fire({
      icon: "error",
      title: "Update Failed",
      text:
        error.message ||
        "Unable to update profile.",
    });
  } finally {
    setSaving(false);
  }
};

  // ==========================================
  // GET INITIALS
  // ==========================================

  const getInitials = () => {
    const first =
      form.firstName?.trim()?.charAt(0) || "";

    const last =
      form.lastName?.trim()?.charAt(0) || "";

    if (first || last) {
      return `${first}${last}`.toUpperCase();
    }

    return "U";
  };

  // ==========================================
  // LOADING
  // ==========================================
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={38}
          className="animate-spin text-green-700"
        />

        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    </div>
  );
}
  // ==========================================
  // PAGE
  // ==========================================

  return (
   
  <>
    <Sidebar />

    <div className="min-h-screen bg-gray-50 py-10 px-5 ml-64">
  

      <div className="max-w-7xl mx-auto" >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="inline-flex items-center gap-2 text-green-700 font-semibold mb-4 hover:text-green-800"
          >
            <ArrowLeft size={19} />

            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="text-lg text-slate-500 mt-2">
            Manage your profile information
          </p>

        </div>

        {/* =====================================
            SETTINGS CARD
        ===================================== */}

        <div className="bg-white border border-gray-300 rounded-3xl shadow-sm overflow-hidden">

          {/* ===================================
              TABS
          =================================== */}

          <div className="border-b border-gray-300">

            <div className="flex items-center gap-10 px-8">

              <button
                type="button"
                className="py-5 font-semibold text-green-700 border-b-2 border-green-700"
              >
                Profile
              </button>

              <button
                type="button"
                className="py-5 text-gray-500 hover:text-gray-800"
              >
                Account
              </button>

              <button
                type="button"
                className="py-5 text-gray-500 hover:text-gray-800"
              >
                Notifications
              </button>

              <button
                type="button"
                className="py-5 text-gray-500 hover:text-gray-800"
              >
                Security
              </button>

            </div>

          </div>

          {/* ===================================
              PROFILE CONTENT
          =================================== */}

          <form onSubmit={handleSave}>

            <div className="p-8">

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">

                {/* =================================
                    LEFT FORM
                ================================= */}

                <div className="space-y-6">

                  {/* FIRST NAME */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>

                    <div className="relative">

                      <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          pl-12
                          pr-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* LAST NAME */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>

                    <div className="relative">

                      <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          pl-12
                          pr-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          pl-12
                          pr-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        maxLength={10}
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          pl-12
                          pr-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>

                    <div className="relative">

                      <MapPin
                        size={20}
                        className="absolute left-4 top-5 text-gray-400"
                      />

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        rows={3}
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          pl-12
                          pr-4
                          outline-none
                          resize-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* CITY + STATE */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          px-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          px-4
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>

                  </div>

                  {/* PINCODE */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      maxLength={6}
                      className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        py-4
                        px-4
                        outline-none
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />

                  </div>

                </div>

                {/* =================================
                    RIGHT PROFILE PHOTO
                ================================= */}

                <div className="flex flex-col items-center">

                  {/* PHOTO */}

                  <div className="relative">

                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Profile"
                        className="
                          w-40
                          h-40
                          rounded-full
                          object-cover
                          border-4
                          border-white
                          shadow-md
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-40
                          h-40
                          rounded-full
                          bg-green-100
                          flex
                          items-center
                          justify-center
                          text-5xl
                          font-bold
                          text-green-700
                          border-4
                          border-white
                          shadow-md
                        "
                      >
                        {getInitials()}
                      </div>
                    )}

                  </div>

                  {/* HIDDEN FILE INPUT */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {/* CHANGE PHOTO */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      border
                      border-gray-400
                      rounded-xl
                      px-5
                      py-3
                      font-medium
                      text-gray-800
                      hover:bg-gray-50
                      transition
                    "
                  >
                    <Camera size={19} />

                    Change Photo
                  </button>

                  {/* ROLE */}

                  <div className="mt-6 text-center">

                    <p className="text-sm text-gray-500">
                      Account Type
                    </p>

                    <span
                      className="
                        inline-block
                        mt-2
                        px-4
                        py-2
                        rounded-full
                        bg-green-100
                        text-green-700
                        font-semibold
                      "
                    >
                      {user?.role || "Donor"}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================
                  SAVE BUTTON
              ================================= */}

              <div className="border-t border-gray-200 mt-10 pt-6 flex justify-end">

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-green-700
                    hover:bg-green-800
                    disabled:bg-green-400
                    text-white
                    font-semibold
                    px-7
                    py-3
                    rounded-xl
                    transition
                    min-w-[170px]
                  "
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={19} />

                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  </>
  );
}
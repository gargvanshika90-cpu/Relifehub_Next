"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Bell,
  Plus,
  ChevronDown,
  User,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

export default function DashboardNavbar({
  role,
  setRole,
}) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // =====================================================
  // LOAD CURRENT LOGGED-IN USER
  // =====================================================

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Error reading user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for login / signup / user changes
    const handleUserChanged = () => {
      loadUser();
    };

    window.addEventListener("userChanged", handleUserChanged);

    return () => {
      window.removeEventListener(
        "userChanged",
        handleUserChanged
      );
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // WAIT FOR USER
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // USER DETAILS
  // =====================================================

  const firstName =
    user.firstName?.trim() || "";

  const lastName =
    user.lastName?.trim() || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    user.name ||
    "User";

  const email =
    user.email || "No email";

  // Use database/localStorage role first
  const currentRole =
    user.role || role || "Donor";

  const initial =
    fullName.charAt(0).toUpperCase();

  // =====================================================
  // CHANGE ROLE
  // =====================================================

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

    window.dispatchEvent(
      new Event("userChanged")
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.dispatchEvent(
      new Event("userChanged")
    );

    setUser(null);
    setProfileOpen(false);

    router.push("/login");
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header className="bg-white border-b border-gray-200 px-7 py-5">

      <div className="flex items-center justify-between">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,
          </h1>

          <div className="flex items-center gap-2 mt-1">

            <h2 className="text-2xl font-bold text-green-700">
              {firstName || fullName}
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
            {currentRole.toLowerCase()} activities.
          </p>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-5">

          {/* =================================================
              ROLE SWITCH
          ================================================= */}

          <div className="flex bg-gray-100 p-1 rounded-xl">

            <button
              type="button"
              onClick={() => changeRole("Donor")}
              className={`
                px-4 py-2 rounded-lg
                text-sm font-semibold
                transition
                ${
                  currentRole === "Donor"
                    ? "bg-green-700 text-white"
                    : "text-gray-600 hover:bg-white"
                }
              `}
            >
              Donor
            </button>

            <button
              type="button"
              onClick={() => changeRole("Buyer")}
              className={`
                px-4 py-2 rounded-lg
                text-sm font-semibold
                transition
                ${
                  currentRole === "Buyer"
                    ? "bg-blue-900 text-white"
                    : "text-gray-600 hover:bg-white"
                }
              `}
            >
              Buyer
            </button>

          </div>


          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <button
            type="button"
            className="relative"
          >
            <Bell
              size={22}
              className="text-gray-600"
            />

            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>


          {/* =================================================
              ACTION BUTTON
          ================================================= */}

          <Link
            href={
              currentRole === "Donor"
                ? "/donate"
                : "/categories"
            }
            className={`
              flex items-center gap-2
              text-white
              px-5 py-3
              rounded-lg
              font-semibold
              transition
              ${
                currentRole === "Donor"
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-blue-900 hover:bg-blue-950"
              }
            `}
          >

            <Plus size={18} />

            {currentRole === "Donor"
              ? "Make a Donation"
              : "Find Items"}

          </Link>


          {/* =================================================
              USER PROFILE
              ONLY ONE PROFILE SECTION
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >

            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (previous) => !previous
                )
              }
              className="
                flex items-center gap-3
                hover:bg-gray-50
                rounded-xl
                p-2
                transition
                cursor-pointer
              "
            >

              {/* AVATAR */}

              <div className="
                w-11 h-11
                rounded-full
                bg-green-50
                border border-green-200
                flex items-center
                justify-center
              ">
                <span className="
                  font-bold
                  text-green-700
                ">
                  {initial}
                </span>
              </div>


              {/* USER DETAILS */}

              <div className="text-left">

                <p className="
                  font-semibold
                  text-gray-800
                  max-w-[130px]
                  truncate
                ">
                  {fullName}
                </p>

                <p className="
                  text-xs
                  text-gray-500
                  max-w-[150px]
                  truncate
                ">
                  {email}
                </p>

                <p className="
                  text-xs
                  font-semibold
                  text-green-600
                ">
                  {currentRole}
                </p>

              </div>


              {/* ARROW */}

              <ChevronDown
                size={17}
                className={`
                  text-gray-500
                  transition-transform
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (

              <div className="
                absolute
                right-0
                top-full
                mt-2
                w-64
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-xl
                z-[100]
                overflow-hidden
              ">

                {/* PROFILE HEADER */}

                <div className="
                  p-4
                  border-b
                  border-gray-100
                ">

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      w-12 h-12
                      rounded-full
                      bg-green-100
                      flex items-center
                      justify-center
                    ">
                      <span className="
                        text-lg
                        font-bold
                        text-green-700
                      ">
                        {initial}
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="
                        font-semibold
                        text-gray-800
                        truncate
                      ">
                        {fullName}
                      </p>

                      <p className="
                        text-sm
                        text-gray-500
                        truncate
                      ">
                        {email}
                      </p>

                      <p className="
                        text-xs
                        font-semibold
                        text-green-600
                        mt-1
                      ">
                        {currentRole}
                      </p>

                    </div>

                  </div>

                </div>


                {/* MENU */}

                <div className="p-2">

                  {/* MY PROFILE */}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="
                      w-full
                      flex items-center
                      gap-3
                      px-3 py-3
                      rounded-lg
                      hover:bg-gray-100
                      text-gray-700
                      text-sm
                      transition
                    "
                  >

                    <User size={17} />

                    <span>
                      My Profile
                    </span>

                  </button>


                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="
                      w-full
                      flex items-center
                      gap-3
                      px-3 py-3
                      rounded-lg
                      hover:bg-gray-100
                      text-gray-700
                      text-sm
                      transition
                    "
                  >

                    <Settings size={17} />

                    <span>
                      Settings
                    </span>

                  </button>


                  {/* HELP */}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/help");
                    }}
                    className="
                      w-full
                      flex items-center
                      gap-3
                      px-3 py-3
                      rounded-lg
                      hover:bg-gray-100
                      text-gray-700
                      text-sm
                      transition
                    "
                  >

                    <CircleHelp size={17} />

                    <span>
                      Help & Support
                    </span>

                  </button>


                  {/* DIVIDER */}

                  <div className="
                    border-t
                    border-gray-100
                    my-2
                  " />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex items-center
                      gap-3
                      px-3 py-3
                      rounded-lg
                      hover:bg-red-50
                      text-red-600
                      text-sm
                      transition
                    "
                  >

                    <LogOut size={17} />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
}

// "use client";

// import { useEffect, user, useState } from "react";
// import Link from "next/link";

// import { useRouter } from "next/navigation";
// import { ChevronDown } from "lucide-react";

// import {
//   Bell,

//   Plus,
// } from "lucide-react";

// export default function DashboardNavbar({
//   role,
//   setRole,
// }) {

//   const [user, setUser] = useState(null);
  
// const router = useRouter();
//   useEffect(() => {

//     const savedUser =
//       localStorage.getItem("user");

//     if (savedUser) {

//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem("user");
//       }

//     }

//   }, []);


//   if (!user) {
//     return null;
//   }


//   const firstName =
//     user.firstName?.trim() || "User";

//   const email =
//     user.email || "No email";


//   const initial =
//     firstName.charAt(0).toUpperCase();


//   const changeRole = (newRole) => {

//     setRole(newRole);

//     const updatedUser = {
//       ...user,
//       role: newRole,
//     };

//     localStorage.setItem(
//       "user",
//       JSON.stringify(updatedUser)
//     );

//     setUser(updatedUser);

//   };


//   return (
//     <header className="bg-white border-b border-gray-200 px-7 py-5">

//       <div className="flex items-center justify-between">

//         {/* LEFT */}
//         <div>

//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome back,
//           </h1>

//           <div className="flex items-center gap-2 mt-1">

//             <h2 className="text-2xl font-bold text-green-700">
//               {firstName}
//             </h2>

//             <span className="text-xl">
//               👋
//             </span>

//           </div>

//           <p className="text-sm text-gray-500 mt-1">
//             {email}
//           </p>

//           <p className="text-sm text-gray-500 mt-1">
//             Here's what's happening with your{" "}
//             {role.toLowerCase()} activities.
//           </p>

//         </div>


//         {/* RIGHT */}
//         <div className="flex items-center gap-5">

//           {/* ROLE */}
//           <div className="flex bg-gray-100 p-1 rounded-xl">

//             <button
//               onClick={() => changeRole("Donor")}
//               className={`
//                 px-4 py-2 rounded-lg text-sm font-semibold
//                 ${
//                   role === "Donor"
//                     ? "bg-green-700 text-white"
//                     : "text-gray-600 hover:bg-white"
//                 }
//               `}
//             >
//               Donor
//             </button>

//             <button
//               onClick={() => changeRole("Buyer")}
//               className={`
//                 px-4 py-2 rounded-lg text-sm font-semibold
//                 ${
//                   role === "Buyer"
//                     ? "bg-blue-900 text-white"
//                     : "text-gray-600 hover:bg-white"
//                 }
//               `}
//             >
//               Buyer
//             </button>

//           </div>


//           {/* NOTIFICATION */}
//           <button className="relative">

//             <Bell
//               size={22}
//               className="text-gray-600"
//             />

//             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />

//           </button>


//           {/* ACTION */}
//           <Link
//             href={
//               role === "Donor"
//                 ? "/donate"
//                 : "/categories"
//             }
//             className={`
//               flex items-center gap-2
//               text-white
//               px-5 py-3
//               rounded-lg
//               font-semibold
//               ${
//                 role === "Donor"
//                   ? "bg-green-700 hover:bg-green-800"
//                   : "bg-blue-900 hover:bg-blue-900"
//               }
//             `}
//           >

//             <Plus size={18} />

//             {role === "Donor"
//               ? "Make a Donation"
//               : "Find Items"}

//           </Link>


//           {/* USER */}
//           <div className="flex items-center gap-3">

//             <div className="w-11 h-11 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">

//               <span className="font-bold text-green-700">
//                 {initial}
//               </span>

//             </div>

//             <div>

//               <p className="font-semibold text-gray-800">
//                 {firstName}
//               </p>

//               <p className="text-xs text-gray-500">
//                 {email}
//               </p>

//               <p className="text-xs font-semibold text-green-600">
//                 {role}
//               </p>

//             </div>

           
// <button
//   type="button"
//   onClick={() => router.push("/profile")}
//   className="flex items-center gap-2 cursor-pointer"
// >
//   <ChevronDown
//     size={17}
//     className="text-gray-500"
//   />
// </button>

//           </div>

//         </div>

//       </div>

//     </header>
//   );
// }
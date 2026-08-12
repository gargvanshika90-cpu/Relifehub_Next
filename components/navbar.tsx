"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ShoppingCart,
  UserCircle,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);


  // =====================================
  // CHECK USER
  // =====================================

  const checkUser = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      setUser(null);
      return;
    }

    try {

      const userData =
        JSON.parse(savedUser);

      setUser(userData);

    } catch (error) {

      console.error(
        "Invalid user data"
      );

      localStorage.removeItem("user");

      setUser(null);
    }
  };


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    setUser(null);

    // Tell other components
    window.dispatchEvent(
      new Event("userChanged")
    );

    // Go home
    window.location.href = "/";
  };


  // =====================================
  // NAVBAR LOAD
  // =====================================

  useEffect(() => {

    setMounted(true);

    checkUser();

    const handleUserChange = () => {
      checkUser();
    };

    window.addEventListener(
      "userChanged",
      handleUserChange
    );

    return () => {

      window.removeEventListener(
        "userChanged",
        handleUserChange
      );

    };

  }, []);


  return (

    <header className="bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <Image
            src="/logo.png"
            alt="ReLife Hub"
            width={70}
            height={70}
            className="object-contain"
          />

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              ReLife Hub
            </h1>

            <p className="text-green-600 text-sm font-medium">
              Share • Donate • Reuse
            </p>

          </div>

        </Link>


        {/* =====================================
            MENU
        ===================================== */}

        <nav className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">

          <Link
            href="/"
            className="hover:text-green-600 duration-200"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="hover:text-green-600 duration-200"
          >
            About Us
          </Link>

          <Link
            href="/categories"
            className="hover:text-green-600 duration-200"
          >
            Categories
          </Link>

          <Link
            href="/donate"
            className="hover:text-green-600 duration-200"
          >
            Donate
          </Link>

          <Link
            href="/find-items"
            className="hover:text-green-600 duration-200"
          >
            Find Items
          </Link>

          <Link
            href="/contact"
            className="hover:text-green-600 duration-200"
          >
            Contact Us
          </Link>

        </nav>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="flex items-center gap-4">

          {/* CART */}

          <Link
            href="/cart"
            className="relative bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 duration-200"
          >

            <ShoppingCart size={20} />

            <span className="hidden sm:block">
              Cart
            </span>

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>

          </Link>


          {/* =====================================
              AUTH
          ===================================== */}

          {mounted && (

            !user ? (

              /* NOT LOGGED IN */

              <div className="flex items-center gap-3">

                <Link
                  href="/login"
                  className="px-5 py-2 border border-green-600 rounded-lg hover:bg-green-50 duration-200"
                >
                  <span className="text-green-600 font-semibold">
                    Login
                  </span>
                </Link>

                <Link
                  href="/signup"
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 duration-200"
                >
                  Sign Up
                </Link>

              </div>

            ) : (

              /* =================================
                 LOGGED IN
              ================================= */

              <div className="flex items-center gap-3">

               {/* =================================
    PROFILE
================================= */}

<Link
  href="/dashboard"
  title={`Open ${
    user.firstName || user.name || "User"
  }'s Dashboard`}
  className="group flex items-center"
>

  <div
    className="
      w-11
      h-11
      rounded-full
      border-2
      border-green-600
      bg-green-50
      flex
      items-center
      justify-center
      group-hover:bg-green-100
      group-hover:scale-105
      transition
    "
  >

    <span className="text-lg font-bold text-green-700">
      {(
        user.firstName ||
        user.name ||
        "User"
      )
        .trim()
        .charAt(0)
        .toUpperCase()}
    </span>

  </div>

</Link>

                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                >

                  <LogOut size={20} />

                </button>

              </div>

            )

          )}

        </div>

      </div>

    </header>
  );
}










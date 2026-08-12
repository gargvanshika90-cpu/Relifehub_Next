
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =====================================
  // LOGIN
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      email,
      password,
    } = form;


    // =====================================
    // VALIDATION
    // =====================================

    if (!email || !password) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter email and password.",
      });

      return;
    }


    try {

      // =====================================
      // LOADING
      // =====================================

      Swal.fire({
        title: "Logging In...",
        allowOutsideClick: false,

        didOpen: () => {
          Swal.showLoading();
        },
      });


      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email:
              email.trim().toLowerCase(),

            password,
          }),
        }
      );


      const data =
        await response.json();


      Swal.close();


      // =====================================
      // EMAIL NOT FOUND
      // =====================================

      if (response.status === 404) {

        await Swal.fire({
          icon: "error",
          title: "Email Not Found",
          text: data.message,
        });

        return;
      }


      // =====================================
      // WRONG PASSWORD
      // =====================================

      if (response.status === 401) {

        await Swal.fire({
          icon: "error",
          title: "Wrong Password",
          text: data.message,
        });

        return;
      }


      // =====================================
      // OTHER ERROR
      // =====================================

      if (!response.ok) {

        await Swal.fire({
          icon: "error",
          title: "Login Failed",

          text:
            data.message ||
            "Something went wrong.",
        });

        return;
      }


      // =====================================
      // CHECK API USER
      // =====================================

      console.log(
        "API USER:",
        data.user
      );


      // =====================================
      // SAVE USER DATA
      // =====================================

      const loggedInUser = {

        id: data.user.id,

        firstName:
          data.user.firstName || "",

        lastName:
          data.user.lastName || "",

        email:
          data.user.email || "",

        // Full name
        name:
          `${data.user.firstName || ""} ${
            data.user.lastName || ""
          }`.trim(),

        image:
          data.user.image ||
          "/profile.png",

        // Default dashboard role
        role: "Donor",
      };


      console.log(
        "SAVED USER:",
        loggedInUser
      );


      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );


      // =====================================
      // NAVBAR UPDATE
      // =====================================

      window.dispatchEvent(
        new Event("userChanged")
      );


      // =====================================
      // SUCCESS
      // =====================================

      await Swal.fire({

        icon: "success",

        title: "Login Successful",

        text:
          `Welcome ${loggedInUser.firstName}!`,

        timer: 1500,

        showConfirmButton: false,

      });


      // =====================================
      // DASHBOARD
      // =====================================

      router.replace("/dashboard");


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      Swal.close();

      await Swal.fire({

        icon: "error",

        title: "Network Error",

        text:
          "Cannot connect to the server.",

      });
    }
  };


  

  return (
    <div
      className="h-screen w-full bg-cover relative bg-center flex items-center justify-center px-5"
      style={{
        backgroundImage: "url('/login-image.png')",
      }}
    >
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/20"></div>

      {/* Login Card */}

      <div className="absolute right-16 z-10 w-lg  ">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl py-10 shadow-2xl px-6">
          {/* Logo */}

          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="logo" className="w-20 h-12 mb-1" />

            <h1 className="text-3xl font-bold text-green-700">ReLife Hub</h1>

            <p className="text-gray-500 mt-2">Share • Donate • Reuse</p>

            <h2 className="text-2xl font-bold mt-7">Welcome Back!</h2>

            <p className="text-gray-500 text-center mt-2">
              Login to continue and make a difference.
            </p>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-2">
            {/* Email */}

            <div>
              <label className="font-semibold">Email</label>

              <div className="relative mt-2">
                <Mail
                  size={20}
                  className="absolute left-4 top-3 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-2 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="font-semibold">Password</label>

              <div className="relative mt-2">
                <Lock
                  size={20}
                  className="absolute left-4 top-3 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-2 pl-12 pr-12 outline-none focus:ring-2 focus:ring-green-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember */}

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember Me
              </label>

              <button type="button" className="text-green-700 font-semibold">
                Forgot Password?
              </button>
            </div>

            {/* Login */}

           <button
  type="submit"
  className="w-full bg-green-700 hover:bg-green-800 duration-300 text-white rounded-xl py-3 font-bold text-lg shadow-lg"
>
  Login
</button>
            {/* Divider */}

            <div className="flex items-center gap-3">
              <hr className="flex-1" />

              <span className="text-gray-500">OR</span>

              <hr className="flex-1" />
            </div>

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-green-700 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

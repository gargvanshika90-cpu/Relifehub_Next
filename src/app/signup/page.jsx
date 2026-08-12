"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  HeartHandshake,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});
  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
  const { name, value, checked, type } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
  // =====================================
  // SIGNUP
  // =====================================

  const handleSignup = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = form;

    // =====================================
    // EMPTY FIELD VALIDATION
    // =====================================

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields.",
      });

      return;
    }

    // =====================================
    // EMAIL VALIDATION
    // =====================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });

      return;
    }

    // =====================================
    // PASSWORD VALIDATION
    // =====================================

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      await Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text:
          "Password must contain at least 8 characters , one uppercase letter, one number, and one special character.",
      });

      return;
    }

    // =====================================
    // CONFIRM PASSWORD
    // =====================================

    if (password !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
      });

      return;
    }

    try {
      // =====================================
      // LOADING
      // =====================================

      Swal.fire({
        title: "Creating Account...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(
        "/api/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      Swal.close();

      // =====================================
      // EMAIL ALREADY EXISTS
      // =====================================

      if (response.status === 409) {
        await Swal.fire({
          icon: "error",
          title: "Email Already Exists",
          text:
            data.message ||
            "An account with this email already exists.",
        });

        return;
      }

      // =====================================
      // OTHER ERROR
      // =====================================

      if (!response.ok) {
        await Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text:
            data.message ||
            "Something went wrong.",
        });

        return;
      }

      // =====================================
      // SUCCESS
      // =====================================

      await Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been created successfully. Please login.",
        timer: 1800,
        showConfirmButton: false,
      });

      // =====================================
      // CLEAR FORM
      // =====================================

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // =====================================
      // GO TO LOGIN
      // =====================================

      router.push("/login");

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Cannot connect to the server.",
      });
    }
  };


  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/back.png')",
      }}
    >
      {/* ================= Main ================= */}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* LEFT */}

        <div>
          <h1 className="text-xl lg:text-4xl   font-extrabold leading-tight text-gray-900">
            Join
            <span className="text-green-700"> ReLife Hub</span>
            <br />
            Make a Difference
            <br />
            Today!
          </h1>

          <p className="text-base lg:text-md text-gray-600 mt-5 max-w-lg">
            Create an account and become part of a community that shares,
            donates and creates a better tomorrow.
          </p>

          <div className="space-y-2 mt-5">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="text-green-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-700">
                  Connect with Community
                </h3>

                <p className="text-gray-500">
                  Join thousands making a positive impact.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <HeartHandshake className="text-green-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-700">
                  Share & Donate Easily
                </h3>

                <p className="text-gray-500">
                  Donate useful items in just a few clicks.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-green-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-700">
                  Safe & Secure
                </h3>

                <p className="text-gray-500">
                  Your information is protected with top-notch security.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-101 ">
            <Image
              src="/relife.png"
              alt="ReLife Hub Logo"
              width={400}
              height={400}
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-2xl shadow-xl p-6 m-5">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full ">
              <UserPlus className="w-10 h-10 text-green-700" />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-center mt-2">
            Create Your Account
          </h2>

          <p className="text-center text-gray-500 mt-1">
            Sign up to get started with ReLife Hub
          </p>

          {/* Social

          <div className="grid grid-cols-3 gap-4 mt-8">
            <button className="border rounded-xl py-3 hover:bg-gray-100">
              Google
            </button>

            <button className="border rounded-xl py-3 hover:bg-gray-100">
              Facebook
            </button>

            <button className="border rounded-xl py-3 hover:bg-gray-100">
              Apple
            </button>
          </div> */}
          <form onSubmit={handleSignup} className="space-y-3 mt-8">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <User
                  className="absolute left-3 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full border rounded-xl py-3 pl-10 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <User
                  className="absolute left-3 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full border rounded-xl py-3 pl-10 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border rounded-xl py-3 pl-10 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <Lock
                  className="absolute left-3 top-4 text-gray-400"
                  size={20}
                />
               <input
  type={showPassword ? "text" : "password"}
  name="password"
  value={form.password}
  onChange={handleChange}
  placeholder="Password"
  className="w-full border rounded-xl py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-green-500"
/>

<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-3"
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-4 text-gray-400"
                  size={20}
                />
              <input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  value={form.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm Password"
  className="w-full border rounded-xl py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-green-500"
/>

<button
  type="button"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  className="absolute right-3 top-3"
>
  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-5 grid grid-cols-2 gap-3 text-sm">
              <p>✅ At least 8 characters</p>
              <p>✅ One uppercase letter</p>
              <p>✅ One number</p>
              <p>✅ One special character</p>
            </div>

            <label className="flex gap-3 items-center text-sm">
            <input
  type="checkbox"
  name="terms"
  checked={form.terms}
  onChange={(e) =>
    setForm({
      ...form,
      terms: e.target.checked,
    })
  }
  className="h-4 w-4"
/>
              <span>
                I agree to the
                <span className="text-green-700 font-semibold">
                  {" "}
                  Terms of Service{" "}
                </span>
                and
                <span className="text-green-700 font-semibold">
                  {" "}
                  Privacy Policy
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 duration-300 text-white py-4 rounded-xl text-xl font-bold"
            >
              Create Account
            </button>

            <p className="text-center">
              Already have an account?
              <Link href="/login" className="text-green-700 font-bold ml-2">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

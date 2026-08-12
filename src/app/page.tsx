

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UserPlus,
  LogIn,
  HeartHandshake,
} from "lucide-react";

import Navbar from "../../components/navbar";
import Slidebar from "../../components/sildebar";
import Feature from "../../components/feature";
import StatsRow from "../../components/statsrow";
import Categories from "../../components/categories";
import Footer from "../../components/footer";

export default function Home() {
  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("relifeUser");

    // Check if welcome popup was already seen
    const popupSeen = localStorage.getItem("welcomePopupSeen");

    // Show popup only for a new visitor
    if (!user && !popupSeen) {
      setShowWelcome(true);
    }
  }, []);

  // Continue as guest
  const continueAsGuest = () => {
    localStorage.setItem("welcomePopupSeen", "true");
    setShowWelcome(false);
  };

  // Signup
  const handleSignup = () => {
    localStorage.setItem("welcomePopupSeen", "true");
    setShowWelcome(false);

    router.push("/signup");
  };

  // Login
  const handleLogin = () => {
    localStorage.setItem("welcomePopupSeen", "true");
    setShowWelcome(false);

    router.push("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= SLIDEBAR / HERO ================= */}
      <Slidebar />

      {/* ================= FEATURES ================= */}
      <Feature />

      {/* ================= CATEGORIES ================= */}
      <Categories />

      {/* ================= STATS ================= */}
      <StatsRow />

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================================================= */}
      {/*              FIRST VISIT WELCOME POPUP             */}
      {/* ================================================= */}

      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

            {/* Close Button */}

            <button
              onClick={continueAsGuest}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Icon */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <HeartHandshake
                size={42}
                className="text-green-600"
              />
            </div>

            {/* Heading */}

            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Welcome to ReLife Hub! 💚
            </h2>

            {/* Description */}

            <p className="mt-3 text-center leading-6 text-gray-500">
              Join our community to donate useful items, discover things
              you need, and help reduce waste.
            </p>

            {/* Signup Button */}

            <button
              onClick={handleSignup}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              <UserPlus size={20} />
              Create Account
            </button>

            {/* Login Button */}

            <button
              onClick={handleLogin}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-5 py-3.5 font-semibold text-green-700 transition hover:bg-green-50"
            >
              <LogIn size={20} />
              Login
            </button>

            {/* Guest */}

            <button
              onClick={continueAsGuest}
              className="mt-5 w-full text-sm font-medium text-gray-500 transition hover:text-green-600"
            >
              Continue as Guest
            </button>

          </div>
        </div>
      )}
    </>
  );
}



//  import Navbar from "../../components/navbar"
// import Slidebar from "../../components/sildebar"
//  import Feature from "../../components/feature"
//   import StatsRow from "../../components/statsrow"  
//  import Categories from "../../components/categories"  
//    import Footer from "../../components/footer"  
// export default function Home(){
//   return(
//     <>
//      <Navbar></Navbar>
//     <Slidebar></Slidebar>
//     <Feature></Feature>
//     <Categories></Categories>
//      <StatsRow></StatsRow>
//      <Footer></Footer> 
//        </>
//   )
// }
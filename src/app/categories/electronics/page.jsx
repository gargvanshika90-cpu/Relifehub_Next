"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
  import Navbar from "../../../../components/navbar";
import {
  Heart,
  ShoppingCart,
  Zap,
  Laptop,
  Cpu,
  Smartphone,
  ShieldCheck,
  IndianRupee,
  Truck,
  Users,
  Headphones,
  Watch,
  Speaker,
} from "lucide-react";

const electronics = [
  {
    id: 1,
    name: "HP Laptop",
    category: "Computers",
    price: 18000,
    image: "/electronics/laptop.png",
  },
  {
    id: 2,
    name: "Samsung Smartphone",
    category: "Mobile Phones",
    price: 5000,
    image: "/electronics/smartphone.png",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Audio",
    price: 500,
    image: "/electronics/headphones.png",
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Wearables",
    price: 300,
    image: "/electronics/smartwatch.png",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    category: "Speakers",
    price: 200,
    image: "/electronics/speaker.png",
  },
  {
    id: 6,
    name: "Wireless Keyboard",
    category: "Accessories",
    price: 100,
    image: "/electronics/keyboard.png",
  },
];

export default function ElectronicsPage() {
  const [wishlist, setWishlist] = useState([]);

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (item) => {
    if (wishlist.includes(item.id)) {
      setWishlist(wishlist.filter((id) => id !== item.id));

      Swal.fire({
        icon: "info",
        title: "Removed",
        text: `${item.name} removed from wishlist`,
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      setWishlist([...wishlist, item.id]);

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: `${item.name} added successfully`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (item) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const alreadyExists = oldCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (alreadyExists) {
      updatedCart = oldCart.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: (cartItem.quantity || 1) + 1,
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...item,
          quantity: 1,
          type: "Electronics",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${item.name} has been added to your cart.`,
      timer: 1400,
      showConfirmButton: false,
    });
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const buyNow = (item) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const alreadyExists = oldCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (alreadyExists) {
      updatedCart = oldCart;
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...item,
          quantity: 1,
          type: "Electronics",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    window.location.href = `/categories/electronics/${item.id}`;
  };

  return (
    <>
    <Navbar></Navbar>
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-100">

        {/* Decorative Icons */}

        <div className="absolute right-10 top-8 opacity-10">
          <Cpu size={150} className="text-blue-700" />
        </div>

        <div className="absolute bottom-5 left-10 opacity-10">
          <Laptop size={100} className="text-purple-700" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 lg:grid-cols-2">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="z-10">

            <div className="flex items-center gap-5">

              <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Electronics
              </h1>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
                <Laptop
                  size={34}
                  className="text-blue-700"
                />
              </div>

            </div>

            <p className="mt-5 text-xl text-slate-700">
              Share Technology. Connect People.
            </p>

            <p className="mt-2 text-lg text-slate-700">
              Donate electronics and give useful technology a new life.
            </p>

            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="mt-8 flex flex-wrap gap-7">

              {/* FEATURE 1 */}

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-50 shadow-sm">

                  <Cpu
                    size={27}
                    className="text-blue-700"
                  />

                </div>

                <div>

                  <p className="font-bold text-blue-800">
                    Useful Tech
                  </p>

                  <p className="text-sm text-slate-600">
                    For everyone
                  </p>

                </div>

              </div>

              {/* FEATURE 2 */}

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-purple-50 shadow-sm">

                  <Smartphone
                    size={27}
                    className="text-purple-700"
                  />

                </div>

                <div>

                  <p className="font-bold text-purple-800">
                    Reuse Technology
                  </p>

                  <p className="text-sm text-slate-600">
                    Reduce e-waste
                  </p>

                </div>

              </div>

              {/* FEATURE 3 */}

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-50 shadow-sm">

                  <Users
                    size={27}
                    className="text-indigo-700"
                  />

                </div>

                <div>

                  <p className="font-bold text-indigo-800">
                    Community First
                  </p>

                  <p className="text-sm text-slate-600">
                    Technology for all
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

          <div className="relative h-[300px] overflow-hidden rounded-3xl shadow-md">

            <img
              src="/electronics/banner.png"
              alt="Electronics"
              className="h-full w-full object-cover"
            />

            {/* Image Overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/20" />

          </div>

        </div>

      </section>


      {/* =====================================================
          ELECTRONICS COLLECTION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-7">

        {/* TITLE + SORT */}

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Electronics Collection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Discover useful technology shared by our community
            </p>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-sm text-slate-600">
              Sort by:
            </span>

      

          </div>

        </div>


        {/* =====================================================
            ELECTRONICS CARDS
        ===================================================== */}

        <div className="grid grid-cols-3 gap-5">

          {electronics.map((item) => (

            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
            >

              {/* IMAGE */}

              <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">

                <Link
                  href={`/categories/electronics/${item.id}`}
                  className="h-full w-full"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                  />

                </Link>

                {/* CATEGORY BADGE */}

                <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white shadow-sm">
                  {item.category}
                </span>

                {/* WISHLIST */}

                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                >

                  <Heart
                    size={19}
                    className={
                      wishlist.includes(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-500"
                    }
                  />

                </button>

              </div>


              {/* ITEM INFO */}

              <div className="mt-3">

                <h3 className="min-h-[42px] text-sm font-semibold leading-5 text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.category}
                </p>

                <p className="mt-2 text-lg font-bold text-blue-700">
                  ₹{item.price}
                </p>


                {/* BUTTONS */}

                <div className="mt-3 grid grid-cols-2 gap-2">

                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-blue-600 px-2 py-2 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-50"
                  >

                    <ShoppingCart size={14} />

                    Add to Cart

                  </button>
<Link
  href={`/categories/electronics/details?id=${item.id}`}
  className="flex-1 bg-blue-700 text-white rounded-lg py-2 text-center font-semibold hover:bg-blue-500"
>
  ⚡ Buy Now
</Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          BOTTOM FEATURES
      ===================================================== */}

      <section className="mx-auto mb-6 max-w-7xl px-6">

        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* SAFE */}

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">

              <ShieldCheck
                size={26}
                className="text-blue-700"
              />

            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Safe & Trusted
              </h3>

              <p className="text-sm text-slate-600">
                Quality checked electronics
              </p>

            </div>

          </div>


          {/* PRICE */}

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100">

              <IndianRupee
                size={25}
                className="text-purple-700"
              />

            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Affordable
              </h3>

              <p className="text-sm text-slate-600">
                Technology for everyone
              </p>

            </div>

          </div>


          {/* E-WASTE */}

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100">

              <Cpu
                size={26}
                className="text-indigo-700"
              />

            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Reduce E-Waste
              </h3>

              <p className="text-sm text-slate-600">
                Reuse technology responsibly
              </p>

            </div>

          </div>


          {/* DELIVERY */}

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">

              <Truck
                size={26}
                className="text-blue-700"
              />

            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Reliable Delivery
              </h3>

              <p className="text-sm text-slate-600">
                Quick & secure service
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
    </>
  );
}
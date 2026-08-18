"use client";

import Link from "next/link";
import Image from "next/image";
  import Navbar from "../../../../components/navbar";
import {
  Tag,
  Leaf,
  Users,
  Heart,
  ShoppingCart,
  ShieldCheck,
  IndianRupee,
  Truck,
} from "lucide-react";

import Swal from "sweetalert2";

export default function StationeryPage() {
  // ======================================================
  // STATIONERY PRODUCTS
  // ======================================================

  const products = [
    {
      id: 1,
      name: "Notebook",
      category: "Notebooks",
      price: 0,
      image: "/stationery/notebook.png",
    },

    {
      id: 2,
      name: "School Bag",
      category: "Bags",
      price: 0,
      image: "/stationery/bag.png",
    },

    {
      id: 3,
      name: "Pen & Pencil Set",
      category: "Writing",
      price: 0,
      image: "/stationery/pens.png",
    },
  ];

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = (product) => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${product.name} added successfully.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ======================================================
  // WISHLIST
  // ======================================================

  const addWishlist = () => {
    Swal.fire({
      icon: "success",
      title: "Added to Wishlist",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
     <>
        <Navbar></Navbar>
    <main className="min-h-screen bg-[#f5f7ff]">
      {/* ==================================================
          HERO SECTION
      ================================================== */}

   {/* =========================================
    STATIONERY HERO SECTION
========================================= */}

<section className="bg-[#f0efff]">

  <div className="max-w-7xl mx-auto px-6 py-10">

    <div className="grid lg:grid-cols-2 gap-8 items-center">

      {/* =====================================
          LEFT CONTENT
      ===================================== */}

      <div className="py-6">

        {/* TITLE */}

        <div className="flex items-center gap-4">

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-950">
            Stationery
          </h1>

          <span className="text-5xl">
            📚
          </span>

        </div>


        {/* DESCRIPTION */}

        <p className="text-xl text-slate-800 mt-5">
          Find useful stationery ready for a new home.
        </p>

        <p className="text-lg text-slate-600 mt-2">
          Learn more, waste less, and share with others.
        </p>


        {/* =================================
            FEATURES
        ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

          {/* AFFORDABLE */}

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 shrink-0 rounded-full bg-white shadow-md flex items-center justify-center">

              <Tag
                size={25}
                className="text-green-600"
              />

            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Affordable
              </h3>

              <p className="text-sm text-slate-600 leading-5">
                Quality items at low prices
              </p>

            </div>

          </div>


          {/* SUSTAINABLE */}

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 shrink-0 rounded-full bg-white shadow-md flex items-center justify-center">

              <Leaf
                size={25}
                className="text-green-600"
              />

            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Sustainable
              </h3>

              <p className="text-sm text-slate-600 leading-5">
                Reuse & reduce waste
              </p>

            </div>

          </div>


          {/* COMMUNITY */}

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 shrink-0 rounded-full bg-white shadow-md flex items-center justify-center">

              <Users
                size={25}
                className="text-green-600"
              />

            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Community First
              </h3>

              <p className="text-sm text-slate-600 leading-5">
                Help others & build community
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          RIGHT BANNER IMAGE
      ===================================== */}

      <div className="flex justify-end">

        <Image
          src="/stationery/banner.png"
          alt="Stationery items"
          width={900}
          height={600}
          priority
          className="w-full max-w-[780px] h-auto object-contain"
        />

      </div>

    </div>

  </div>

</section>
      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADING */}

        <div className="flex justify-between items-center mb-7">
          <h2 className="text-3xl font-bold text-gray-900">
            Stationery Items
          </h2>

          
        </div>

        {/* ==================================================
            3 CARDS IN ONE LINE
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow border border-[#dfe3f5] hover:shadow-xl transition overflow-hidden group"
            >
              {/* IMAGE */}

              <div className="relative p-6 bg-white">
                {/* WISHLIST */}

                <button
                  onClick={addWishlist}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-red-50 z-10"
                >
                  <Heart
                    size={20}
                    className="text-gray-500"
                  />
                </button>

                {/* CLICKABLE IMAGE */}

                <Link
                  href={`/categories/stationery/details?id=${item.id}`}
                  className="block"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={350}
                    height={280}
                    className="mx-auto h-56 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* CARD DETAILS */}

              <div className="px-6 pb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.category}
                </p>

                <p className="text-2xl font-bold text-green-700 mt-4">
                     ₹{item.price}
                </p>

                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {/* ADD TO CART */}

                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl hover:bg-indigo-600 hover:text-white duration-300"
                  >
                    <ShoppingCart size={18} />

                    Add to Cart
                  </button>

                  {/* BUY NOW */}

                  <Link
                    href={`/categories/stationery/details?id=${item.id}`}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          FOOTER FEATURES
      ================================================== */}

      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
            {/* SAFE */}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck
                  className="text-green-700"
                  size={30}
                />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  100% Safe & Trusted
                </h3>

                <p className="text-gray-500 text-sm">
                  Quality checked stationery
                </p>
              </div>
            </div>

            {/* LOW PRICE */}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <IndianRupee
                  className="text-indigo-600"
                  size={30}
                />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Low Prices
                </h3>

                <p className="text-gray-500 text-sm">
                  Best value for everyone
                </p>
              </div>
            </div>

            {/* SUSTAINABLE */}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf
                  className="text-green-700"
                  size={30}
                />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Sustainable Choice
                </h3>

                <p className="text-gray-500 text-sm">
                  Better for you, better for Earth
                </p>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck
                  className="text-blue-600"
                  size={30}
                />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Fast Delivery
                </h3>

                <p className="text-gray-500 text-sm">
                  Quick & reliable delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
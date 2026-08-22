"use client";

import { useState } from "react";
import Link from "next/link";
 import Navbar from "../../../../components/navbar";

import {
  Heart,
  ShoppingCart,
  Zap,
  Tag,
  Leaf,
  Users,
  ShieldCheck,
  IndianRupee,
  Truck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from "lucide-react";

const toys = [
  {
    id: 1,
    name: "Teddy Bear",
    category: "Soft Toys",
    condition: "Excellent",
    price: 50,
    image: "/toys/teddy.png",
  },
  {
    id: 2,
    name: "Building Blocks Set",
    category: "Building Blocks",
    condition: "Good",
    price: 60,
    image: "/toys/blocks.png",
  },
  {
    id: 3,
    name: "Remote Control Car",
    category: "Remote Toys",
    condition: "Like New",
    price: 100,
    image: "/toys/car.png",
  },
  
];

export default function ToysPage() {
  const [sort, setSort] = useState("Popular");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

const addToCart = (item) => {
  try {
    // Check login
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login before adding items to cart.");
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    // Get old cart
    const oldCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check whether same item is already in cart
    const alreadyInCart = oldCart.some(
      (cartItem) =>
        String(cartItem.id) === String(item.id)
    );

    if (alreadyInCart) {
      alert("This item is already in your cart.");
      return;
    }

    // Create cart item
    const cartItem = {
      id: item.id,

      name: item.name,

      category: "Toys",

      image: item.image,

      price: 0,

      quantity: 1,

      condition: item.condition || "Good",

      description: item.description || "",

      donorName: item.donorName || "",

      donorPhone: item.donorPhone || "",

      donorEmail: item.donorEmail || "",

      address: item.address || "",

      userId: user.id || "",

      addedAt: new Date().toISOString(),
    };

    // Add item
    const updatedCart = [
      ...oldCart,
      cartItem,
    ];

    // Save cart
    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    // Notify navbar/cart
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(
      `${item.name} added to cart successfully! 🛒`
    );
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    alert(
      "Item could not be added to cart."
    );
  }
};

  const buyNow = (toy) => {
    alert(`You selected ${toy.name} for purchase.`);
  };

  const sortedToys = [...toys].sort((a, b) => {
    if (sort === "Price Low") return a.price - b.price;
    if (sort === "Price High") return b.price - a.price;
    if (sort === "Name") return a.name.localeCompare(b.name);

    return 0;
  });

  return (
    <> <Navbar></Navbar>
    <main className="min-h-screen bg-white text-slate-800">

      {/* ================= HERO SECTION ================= */}
     <section className="relative overflow-hidden bg-[#fceff4]">
  
  {/* Decorative circles */}
  <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#f8e5f1]" />

  <div className="absolute right-20 top-8 h-32 w-32 rounded-full bg-[#fff0c9]" />

  <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">

    {/* Breadcrumb */}
    <div className="mb-6 flex items-center gap-3 text-sm text-slate-600">
      <Link href="/" className="hover:text-green-700">
        Home
      </Link>

      <span>/</span>

      <Link href="/categories" className="hover:text-green-700">
        Categories
      </Link>

      <span>/</span>

      <span className="text-blue-600">
        Toys
      </span>
    </div>

    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">

      {/* LEFT */}
      <div>

        <div className="flex items-center gap-5">
          <h1 className="text-6xl font-bold text-slate-900">
            Toys
          </h1>

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <Gamepad2
              size={34}
              className="text-pink-500"
            />
          </div>
        </div>

        <p className="mt-5 text-xl text-slate-700">
          Fun, safe and educational toys for kids of all ages.
        </p>

        <p className="mt-2 text-xl text-slate-700">
          Good for you, good for others, good for the planet.
        </p>

        {/* Benefits */}
        <div className="mt-10 grid grid-cols-2 gap-6 xl:grid-cols-4">

          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Tag className="text-pink-500" size={26} />
            </div>

            <div>
              <h3 className="font-semibold">Affordable</h3>
              <p className="text-sm text-slate-600">
                Great quality at low prices
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Leaf className="text-green-600" size={26} />
            </div>

            <div>
              <h3 className="font-semibold">Sustainable</h3>
              <p className="text-sm text-slate-600">
                Reuse & reduce waste
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Users className="text-orange-500" size={26} />
            </div>

            <div>
              <h3 className="font-semibold">
                Community First
              </h3>
              <p className="text-sm text-slate-600">
                Help others & build a better community
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <ShieldCheck className="text-blue-500" size={26} />
            </div>

            <div>
              <h3 className="font-semibold">
                Safe & Trusted
              </h3>
              <p className="text-sm text-slate-600">
                Checked items for peace of mind
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* RIGHT IMAGE */}
      <div className="flex justify-center lg:justify-end">
        <img
          src="/toys/banner.png"
          alt="Toys collection"
          width={600}
          height={600}
          className="w-full max-w-2xl object-contain"
        />
      </div>

    </div>
  </div>
</section>

      {/* ================= PRODUCTS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Toy Items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Find quality toys at affordable prices
            </p>
          </div>

          {/* SORT */}
          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-gray-600">
              Sort by:
            </span>

            <div className="relative">

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-sm font-medium shadow-sm outline-none transition focus:border-green-500"
              >
                <option value="Popular">
                  Popular
                </option>

                <option value="Price Low">
                  Price Low
                </option>

                <option value="Price High">
                  Price High
                </option>

                <option value="Name">
                  Name
                </option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

          </div>

        </div>

        {/* ================= TOY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {sortedToys.map((item) => (

            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* FAVORITE */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-pink-50"
              >

                <Heart
                  size={18}
                  className={
                    favorites.includes(item.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />

              </button>

              {/* IMAGE */}
              <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg bg-white">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                />

              </div>

              {/* CATEGORY */}
              <div className="mt-3">

                <span className="inline-flex rounded-md bg-pink-50 px-2 py-1 text-[11px] font-semibold text-pink-600">
                  {item.category}
                </span>

              </div>

              {/* NAME */}
              <h3 className="mt-2 min-h-[24px] text-sm font-bold text-gray-900">
                {item.name}
              </h3>

              {/* CONDITION */}
              <p className="mt-1 text-xs text-gray-500">
                {item.condition}
              </p>

              {/* PRICE */}
              <div className="mt-2 flex items-center gap-1">

                <IndianRupee
                  size={16}
                  className="text-green-700"
                />

                <span className="text-lg font-bold text-green-700">
                  ₹{item.price}
                </span>

              </div>

              {/* BUTTONS */}
              <div className="mt-3 grid grid-cols-2 gap-2">

                <button
  onClick={() => addToCart(item)}
  className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold"
>
  <ShoppingCart size={18} />
  Add to Cart
</button>

                
    <Link
                    href={`/categories/toys/details?id=${item.id}`}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 duration-300"
                  >
                    Buy Now
                  </Link>

              </div>

            </div>

          ))}

        </div>

       
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="mx-auto mb-10 max-w-7xl px-6 lg:px-10">

        <div className="grid grid-cols-1 gap-5 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* TRUST */}
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck
                size={27}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-bold">
                100% Safe & Trusted
              </h3>

              <p className="text-xs text-gray-600">
                Quality checked items
              </p>
            </div>

          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
              <IndianRupee
                size={27}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-bold">
                Low Prices
              </h3>

              <p className="text-xs text-gray-600">
                Best prices for everyone
              </p>
            </div>

          </div>

          {/* SUSTAINABLE */}
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Leaf
                size={27}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-bold">
                Sustainable Choice
              </h3>

              <p className="text-xs text-gray-600">
                Better for you, better for Earth
              </p>
            </div>

          </div>

          {/* DELIVERY */}
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Truck
                size={27}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-bold">
                Fast Delivery
              </h3>

              <p className="text-xs text-gray-600">
                Quick & reliable delivery
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
    </>
  );
}
"use client";
  import Navbar from "../../../../components/navbar";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  Heart,
  ShoppingCart,
  Zap,
  BookOpen,
  Leaf,
  Users,
  ShieldCheck,
  IndianRupee,
  Truck,
  ArrowLeft,
} from "lucide-react";

const books = [
  {
    id: 1,
    name: "Atomic Habits",
    category: "Self Help",
    price: 100,
    image: "/books/atomic-habits.png",
  },
  {
    id: 2,
    name: "The 7 Habits of Highly Effective People",
    category: "Personal Growth",
    price: 90,
    image: "/books/7-habits.png",
  },
  {
    id: 3,
    name: "Rich Dad Poor Dad",
    category: "Finance",
    price: 110,
    image: "/books/rich-dad-poor-dad.png",
  },
  {
    id: 4,
    name: "Clean Code",
    category: "Programming",
    price: 0,
    image: "/books/clean-code.png",
  },
  {
    id: 5,
    name: "Think and Grow Rich",
    category: "Motivation",
    price: 0,
    image: "/books/think-grow-rich.png",
  },
  {
    id: 6,
    name: "The Power of Now",
    category: "Mindfulness",
    price: 0,
    image: "/books/power-of-now.png",
  },
];

export default function BooksPage() {
  const [wishlist, setWishlist] = useState([]);

  // -------------------------------
  // WISHLIST
  // -------------------------------
  const toggleWishlist = (book) => {
    if (wishlist.includes(book.id)) {
      setWishlist(wishlist.filter((id) => id !== book.id));

      Swal.fire({
        icon: "info",
        title: "Removed",
        text: `${book.name} removed from wishlist`,
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      setWishlist([...wishlist, book.id]);

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: `${book.name} added successfully`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // -------------------------------
  // ADD TO CART
  // -------------------------------
  const addToCart = (book) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const alreadyExists = oldCart.find((item) => item.id === book.id);

    let updatedCart;

    if (alreadyExists) {
      updatedCart = oldCart.map((item) =>
        item.id === book.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...book,
          quantity: 1,
          type: "Book",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Notify navbar/cart component
    window.dispatchEvent(new Event("cartUpdated"));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${book.name} has been added to your cart.`,
      timer: 1400,
      showConfirmButton: false,
    });
  };

  // -------------------------------
  // BUY NOW
  // -------------------------------
  const buyNow = (book) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const alreadyExists = oldCart.find((item) => item.id === book.id);

    let updatedCart;

    if (alreadyExists) {
      updatedCart = oldCart;
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...book,
          quantity: 1,
          type: "Book",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    window.location.href = `/categories/books/${book.id}`;
  };

  return (
    <>
    <Navbar></Navbar>
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-50 via-white to-green-100">

        {/* Decorative leaves */}
        <div className="absolute right-8 top-8 opacity-20">
          <Leaf size={120} className="text-green-600" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 lg:grid-cols-2">

          {/* LEFT */}
          <div className="z-10">

            <div className="flex items-center gap-5">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Books
              </h1>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <BookOpen
                  size={34}
                  className="text-green-700"
                />
              </div>
            </div>

            <p className="mt-5 text-xl text-slate-700">
              Share Knowledge. Build a Smarter Tomorrow.
            </p>

            <p className="mt-2 text-lg text-slate-700">
              Donate books, give learning a new home.
            </p>

            {/* FEATURES */}
            <div className="mt-8 flex flex-wrap gap-7">

              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-green-50 shadow-sm">
                  <BookOpen
                    size={27}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="font-bold text-green-800">
                    Free Books
                  </p>

                  <p className="text-sm text-slate-600">
                    For everyone
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-green-50 shadow-sm">
                  <Leaf
                    size={27}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="font-bold text-green-800">
                    Sustainable
                  </p>

                  <p className="text-sm text-slate-600">
                    Reuse & reduce waste
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-green-50 shadow-sm">
                  <Users
                    size={27}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="font-bold text-green-800">
                    Community First
                  </p>

                  <p className="text-sm text-slate-600">
                    Help others & build
                  </p>
                </div>
              </div>

            </div>
          </div>
{/* RIGHT IMAGE */}
<div className="relative h-[300px] overflow-hidden rounded-3xl">
  <img
    src="/books/banner.png"
    alt="Books"
    className="h-full w-full object-cover object-right"
  />
</div>

        </div>
      </section>


      {/* =====================================================
          BOOKS COLLECTION
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-7">

        {/* TITLE + SORT */}
        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-900">
            Books Collection
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              Sort by:
            </span>

            <select className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

        </div>


        {/* =====================================================
            BOOK CARDS
        ===================================================== */}
       <div className="grid grid-cols-3 gap-5">

          {books.map((book) => (

            <div
              key={book.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* IMAGE */}
              <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-lg bg-white">

                <Link
  href={`/categories/books/${book.id}`}
  className="block group"
>
  <div className="h-64 w-full bg-white flex items-center justify-center rounded-xl overflow-hidden p-4">
    <img
      src={book.image}
      alt={book.name}
      className="max-h-[230px] max-w-[170px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
    />
  </div>
</Link>

                {/* WISHLIST */}
                <button
                  onClick={() => toggleWishlist(book)}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <Heart
                    size={19}
                    className={
                      wishlist.includes(book.id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-500"
                    }
                  />
                </button>

              </div>


              {/* BOOK INFO */}
              <div className="mt-3">

                <h3 className="min-h-[42px] text-sm font-semibold leading-5 text-slate-900">
                  {book.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {book.category}
                </p>

                <p className="mt-2 text-lg font-bold text-green-700">
                  ₹{book.price}
                </p>


                {/* BUTTONS */}
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <button
                    onClick={() => addToCart(book)}
                    className="flex items-center justify-center gap-1 rounded-md border border-green-700 px-2 py-2 text-[11px] font-semibold text-green-800 transition hover:bg-green-50"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>

               <Link
  href={`/categories/books/details?id=${book.id}`}
  className="flex-1 bg-green-700 text-white rounded-lg py-2 text-center font-semibold hover:bg-green-800"
>
  Buy Now
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

        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-green-50 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* SAFE */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck
                size={26}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                100% Safe & Trusted
              </h3>

              <p className="text-sm text-slate-600">
                Quality checked books
              </p>
            </div>
          </div>


          {/* PRICE */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <IndianRupee
                size={25}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Low Prices
              </h3>

              <p className="text-sm text-slate-600">
                Best value for readers
              </p>
            </div>
          </div>


          {/* SUSTAINABLE */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Leaf
                size={26}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Sustainable Choice
              </h3>

              <p className="text-sm text-slate-600">
                A greener planet through reuse
              </p>
            </div>
          </div>


          {/* DELIVERY */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Truck
                size={26}
                className="text-green-700"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Fast Delivery
              </h3>

              <p className="text-sm text-slate-600">
                Quick & reliable service
              </p>
            </div>
          </div>

        </div>

      </section>

    </main>
    </>
  );
}
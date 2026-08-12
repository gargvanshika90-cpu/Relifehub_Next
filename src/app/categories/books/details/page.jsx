"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Heart,
  Gift,
  MapPin,
  CalendarDays,
  Clock,
  User,
  Phone,
  MessageCircle,
  Package,
  Tag,
  BadgeCheck,
  ShieldCheck,
  Star,
  X,
  ShoppingCart,
  Check,
  BookOpen,
  Languages,
  BookMarked,
} from "lucide-react";

// ======================================================
// BOOK PRODUCTS
// ======================================================

const books = [
  {
    id: 1,
    name: "Atomic Habits",
    category: "Self Help",
    price: 0,
    image: "/books/atomic-habits.png",

    quantity: "1 Book",
    author: "James Clear",
    publisher: "Avery",
    originalPrice: "₹799",

    condition: "Very Good",
    language: "English",
    pages: "320 Pages",
    edition: "1st Edition",
    format: "Paperback",

    postedOn: "5 Aug 2026",

    description:
      "A gently used copy of Atomic Habits in very good condition. The book is clean, complete and suitable for personal development and self-improvement.",

    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",

    preferredDate: "12 Aug 2026",

    preferredTime:
      "10:30 AM - 01:00 PM",

    donorName: "Preeti",

    donorSince: "June 2024",

    donorPhone:
      "+91 98765 43210",
  },

  {
    id: 2,
    name: "The 7 Habits of Highly Effective People",
    category: "Personal Growth",
    price: 0,
    image: "/books/7-habits.png",

    quantity: "1 Book",
    author: "Stephen R. Covey",
    publisher: "Simon & Schuster",
    originalPrice: "₹699",

    condition: "Excellent",
    language: "English",
    pages: "381 Pages",
    edition: "Updated Edition",
    format: "Paperback",

    postedOn: "5 Aug 2026",

    description:
      "A well-maintained book about personal effectiveness, leadership and building positive habits. Clean pages and excellent overall condition.",

    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",

    preferredDate: "12 Aug 2026",

    preferredTime:
      "10:30 AM - 01:00 PM",

    donorName: "Rahul Gupta",

    donorSince: "June 2024",

    donorPhone:
      "+91 98765 43210",
  },

  {
    id: 3,
    name: "Rich Dad Poor Dad",
    category: "Finance",
    price: 0,
    image: "/books/rich-dad-poor-dad.png",

    quantity: "1 Book",
    author: "Robert T. Kiyosaki",
    publisher: "Plata Publishing",
    originalPrice: "₹599",

    condition: "Good",
    language: "English",
    pages: "336 Pages",
    edition: "Revised Edition",
    format: "Paperback",

    postedOn: "5 Aug 2026",

    description:
      "A useful personal finance book in good condition. Perfect for readers interested in financial education, money management and investment basics.",

    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",

    preferredDate: "12 Aug 2026",

    preferredTime:
      "10:30 AM - 01:00 PM",

    donorName: "Rahul Sharma",

    donorSince: "June 2024",

    donorPhone:
      "+91 98765 43210",
  },

  {
    id: 4,
    name: "Clean Code",
    category: "Programming",
    price: 0,
    image: "/books/clean-code.png",

    quantity: "1 Book",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    originalPrice: "₹899",

    condition: "Very Good",
    language: "English",
    pages: "464 Pages",
    edition: "1st Edition",
    format: "Paperback",

    postedOn: "6 Aug 2026",

    description:
      "A valuable programming book for students and developers. This copy is in very good condition with clean pages and a well-maintained cover.",

    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",

    preferredDate: "13 Aug 2026",

    preferredTime:
      "11:00 AM - 02:00 PM",

    donorName: "Aman Verma",

    donorSince: "March 2025",

    donorPhone:
      "+91 98765 12345",
  },

  {
    id: 5,
    name: "Think and Grow Rich",
    category: "Motivation",
    price: 0,
    image: "/books/think-grow-rich.png",

    quantity: "1 Book",
    author: "Napoleon Hill",
    publisher: "Fingerprint Publishing",
    originalPrice: "₹399",

    condition: "Good",
    language: "English",
    pages: "320 Pages",
    edition: "Classic Edition",
    format: "Paperback",

    postedOn: "6 Aug 2026",

    description:
      "A motivational classic in good condition. Suitable for readers interested in mindset, success, motivation and personal growth.",

    address:
      "Sector 18, Noida, Uttar Pradesh - 201301",

    preferredDate: "13 Aug 2026",

    preferredTime:
      "11:00 AM - 02:00 PM",

    donorName: "Neha Singh",

    donorSince: "January 2025",

    donorPhone:
      "+91 87654 32109",
  },

  {
    id: 6,
    name: "The Power of Now",
    category: "Mindfulness",
    price: 0,
    image: "/books/power-of-now.png",

    quantity: "1 Book",
    author: "Eckhart Tolle",
    publisher: "New World Library",
    originalPrice: "₹499",

    condition: "Excellent",
    language: "English",
    pages: "236 Pages",
    edition: "Revised Edition",
    format: "Paperback",

    postedOn: "7 Aug 2026",

    description:
      "A clean and well-maintained book about mindfulness and living in the present moment. Excellent choice for readers interested in personal well-being.",

    address:
      "Sector 18, Noida, Uttar Pradesh - 201301",

    preferredDate: "14 Aug 2026",

    preferredTime:
      "10:00 AM - 01:00 PM",

    donorName: "Riya Mehta",

    donorSince: "April 2025",

    donorPhone:
      "+91 76543 21098",
  },
];

// ======================================================
// PAGE
// ======================================================

export default function BooksDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = Number(searchParams.get("id"));

  const product = books.find(
    (item) => item.id === productId
  );

  const [showRequest, setShowRequest] =
    useState(false);

  const [quantity, setQuantity] =
    useState("1");

  const [message, setMessage] =
    useState("");

  const [addedToCart, setAddedToCart] =
    useState(false);

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-md border p-10 text-center">

          <BookOpen
            size={55}
            className="text-green-700 mx-auto mb-4"
          />

          <h1 className="text-2xl font-bold">
            Book Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The book you are looking for does not exist.
          </p>

          <Link
            href="/categories/books"
            className="inline-flex items-center gap-2 mt-6 bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800"
          >
            <ArrowLeft size={20} />
            Back to Books
          </Link>

        </div>

      </main>
    );
  }

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      alert(
        "Please Login or Signup before adding an item to cart."
      );

      router.push("/login");
      return;
    }

    const oldCart =
      JSON.parse(
        localStorage.getItem("cartItems")
      ) || [];

    const alreadyExists =
      oldCart.some(
        (item) => item.id === product.id
      );

    if (alreadyExists) {

      alert(
        "This book is already in your cart."
      );

      setAddedToCart(true);

      return;
    }

    const cartItem = {

      id: product.id,

      name: product.name,

      category: "Books",

      image: product.image,

      quantity: 1,

      author: product.author,

      language: product.language,

      condition: product.condition,

      format: product.format,

      originalPrice:
        product.originalPrice,

      price: 0,

      donorName:
        product.donorName,

      donorPhone:
        product.donorPhone,

      address:
        product.address,

      preferredDate:
        product.preferredDate,

      preferredTime:
        product.preferredTime,

      addedAt:
        new Date().toISOString(),
    };

    const updatedCart = [
      ...oldCart,
      cartItem,
    ];

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAddedToCart(true);

    alert(
      `${product.name} added to your cart successfully! 🛒`
    );
  };

  // ======================================================
  // REQUEST DONATION
  // ======================================================

  const handleRequestDonation = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      alert(
        "Please Login or Signup before requesting this book."
      );

      router.push("/login");

      return;
    }

    setShowRequest(true);
  };

  // ======================================================
  // SEND REQUEST
  // ======================================================

  const sendRequest = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      alert("Please Login first.");

      router.push("/login");

      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {

      alert(
        "Please enter a valid quantity."
      );

      return;
    }

    // Only one donated book is available
    if (Number(quantity) > 1) {

      alert(
        "Only 1 copy of this donated book is available."
      );

      return;
    }

    const user =
      JSON.parse(savedUser);

    const newRequest = {

      id: Date.now(),

      productId: product.id,

      productName:
        product.name,

      productImage:
        product.image,

      category: "Books",

      donorName:
        product.donorName,

      donorPhone:
        product.donorPhone,

      requesterId:
        user.id,

      requesterName:
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim(),

      requesterEmail:
        user.email,

      quantity: 1,

      author:
        product.author,

      language:
        product.language,

      message: message,

      status: "Pending",

      createdAt:
        new Date().toISOString(),
    };

    const oldRequests =
      JSON.parse(
        localStorage.getItem(
          "donationRequests"
        )
      ) || [];

    localStorage.setItem(
      "donationRequests",
      JSON.stringify([
        ...oldRequests,
        newRequest,
      ])
    );

    setShowRequest(false);

    setQuantity("1");

    setMessage("");

    alert(
      "Book donation request sent successfully! ❤️"
    );

    router.push(
      "/dashboard/requests"
    );
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <main className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-6">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          href="/categories/books"
          className="inline-flex items-center gap-2 text-green-700 font-semibold mb-6 hover:text-green-800"
        >
          <ArrowLeft size={20} />

          Back to Books
        </Link>

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-7">

          {/* IMAGE */}

          <div className="bg-white rounded-3xl shadow-md border p-6">

            <div className="bg-gray-50 rounded-2xl h-[500px] flex items-center justify-center">

              <img
                src={product.image}
                alt={product.name}
                className="max-h-[450px] max-w-full object-contain"
              />

            </div>

          </div>

          {/* INFORMATION */}

          <div className="bg-white rounded-3xl shadow-md border p-7">

            <div className="flex justify-between gap-4">

              <div>

                <h1 className="text-3xl font-bold">
                  {product.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {product.category}
                </p>

                {/* Rating */}

                <div className="flex items-center gap-1 mt-3">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={18}
                        fill="currentColor"
                        className="text-yellow-500"
                      />
                    )
                  )}

                  <span className="text-sm text-gray-500 ml-2">
                    4.9 (45 reviews)
                  </span>

                </div>

              </div>

              <button
                className="w-11 h-11 shrink-0 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50"
              >
                <Heart className="text-gray-400" />
              </button>

            </div>

            {/* TAGS */}

            <div className="flex gap-2 flex-wrap mt-5">

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                📚 {product.category}
              </span>

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                ✓ {product.condition}
              </span>

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                ✓ Available
              </span>

            </div>

            <hr className="my-6" />

            {/* BOOK DETAILS */}

            <div className="space-y-5">

              <Info
                icon={<BookOpen size={18} />}
                title="Book"
                value={product.name}
              />

              <Info
                icon={<User size={18} />}
                title="Author"
                value={product.author}
              />

              <Info
                icon={<Package size={18} />}
                title="Quantity"
                value={product.quantity}
              />

              <Info
                icon={<BookMarked size={18} />}
                title="Publisher"
                value={product.publisher}
              />

              <Info
                icon={<Tag size={18} />}
                title="Pages"
                value={product.pages}
              />

              <Info
                icon={<Tag size={18} />}
                title="Edition"
                value={product.edition}
              />

              <Info
                icon={<Tag size={18} />}
                title="Format"
                value={product.format}
              />

              <Info
                icon={<Languages size={18} />}
                title="Language"
                value={product.language}
              />

              <Info
                icon={<Tag size={18} />}
                title="Original Price"
                value={product.originalPrice}
              />

              <Info
                icon={<Gift size={18} />}
                title="Donation Price"
                value="FREE"
                green
              />

              <Info
                icon={<CalendarDays size={18} />}
                title="Posted On"
                value={product.postedOn}
              />

              <Info
                icon={<BadgeCheck size={18} />}
                title="Condition"
                value={product.condition}
              />

            </div>

            {/* SAFE */}

            <div className="mt-7 bg-green-50 rounded-xl p-4 flex gap-3">

              <ShieldCheck className="text-green-700 shrink-0" />

              <div>

                <p className="font-semibold text-green-800">
                  100% Safe & Secure Donations
                </p>

                <p className="text-sm text-gray-500">
                  Your book donation is protected
                  and trusted.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            DESCRIPTION + PICKUP
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-7 mt-7">

          {/* DESCRIPTION */}

          <div className="bg-white rounded-3xl shadow-md border p-7">

            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen
                className="text-green-700"
                size={22}
              />

              Book Description
            </h2>

            <p className="text-gray-600 leading-7 mt-4">
              {product.description}
            </p>

            <p className="text-green-700 font-medium mt-4">
              Share knowledge and give a book
              a new home. 💚
            </p>

          </div>

          {/* PICKUP */}

          <div className="bg-white rounded-3xl shadow-md border p-7">

            <h2 className="text-xl font-bold flex items-center gap-2">

              <MapPin className="text-green-700" />

              Pickup Details

            </h2>

            <p className="text-sm text-gray-500 mt-5">
              Address
            </p>

            <p className="font-medium mt-1">
              {product.address}
            </p>

            <div className="grid grid-cols-2 gap-5 mt-6">

              <div className="flex gap-3">

                <CalendarDays
                  className="text-green-700 shrink-0"
                />

                <div>

                  <p className="text-sm text-gray-500">
                    Preferred Date
                  </p>

                  <p className="font-medium">
                    {product.preferredDate}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <Clock
                  className="text-green-700 shrink-0"
                />

                <div>

                  <p className="text-sm text-gray-500">
                    Preferred Time
                  </p>

                  <p className="font-medium">
                    {product.preferredTime}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            DONOR
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-md border p-7 mt-7">

          <h2 className="text-xl font-bold flex gap-2">

            <User className="text-green-700" />

            Donor Information

          </h2>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mt-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">

                <User className="text-green-700" />

              </div>

              <div>

                <h3 className="font-bold">
                  {product.donorName}
                </h3>

                <p className="text-sm text-gray-500">
                  Member since {product.donorSince}
                </p>

                <p className="text-sm text-green-700">
                  ✓ Verified Donor
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-50"
              >
                <Phone size={18} />

                {product.donorPhone}

              </button>

              <button
                type="button"
                className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-50"
              >
                <MessageCircle size={18} />

                Chat

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            CART + REQUEST
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-md border p-5 mt-7">

          <div className="grid md:grid-cols-2 gap-4">

            {/* ADD TO CART */}

            <button
              onClick={handleAddToCart}
              className={`w-full rounded-xl py-4 font-bold flex justify-center items-center gap-2 border-2 transition ${
                addedToCart
                  ? "border-green-700 text-green-700 bg-green-50"
                  : "border-green-700 text-green-700 hover:bg-green-50"
              }`}
            >

              {addedToCart ? (
                <>
                  <Check size={21} />

                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={21} />

                  Add to Cart
                </>
              )}

            </button>

            {/* REQUEST */}

            <button
              onClick={handleRequestDonation}
              className="w-full bg-green-700 text-white rounded-xl py-4 font-bold flex justify-center items-center gap-2 hover:bg-green-800"
            >

              <Gift size={20} />

              Request Donation

            </button>

          </div>

          {/* CART */}

          <Link
            href="/cart"
            className="mt-4 w-full flex justify-center items-center gap-2 text-green-700 font-semibold hover:underline"
          >

            <ShoppingCart size={18} />

            View My Cart

          </Link>

        </div>

      </div>

      {/* =================================================
          REQUEST POPUP
      ================================================= */}

      {showRequest && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">

            {/* HEADER */}

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  Request Book
                </h2>

                <p className="text-gray-500">
                  {product.name}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowRequest(false)
                }
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X />
              </button>

            </div>

            {/* BOOK */}

            <div className="bg-green-50 rounded-xl p-4 mt-5 flex gap-4">

              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-contain bg-white rounded-lg"
              />

              <div>

                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Author: {product.author}
                </p>

                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>

                <p className="text-sm text-gray-500">
                  Language: {product.language}
                </p>

                <p className="text-green-700 font-bold mt-1">
                  FREE Donation
                </p>

              </div>

            </div>

            {/* QUANTITY */}

            <div className="mt-5">

              <label className="font-semibold">
                Required Quantity
              </label>

              <input
                type="number"
                min="1"
                max="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Only 1 copy is available for
                this donated book.
              </p>

            </div>

            {/* MESSAGE */}

            <div className="mt-5">

              <label className="font-semibold">
                Message to Donor
              </label>

              <textarea
                rows="4"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Tell the donor why you need this book..."
                className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* SEND */}

            <button
              onClick={sendRequest}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold mt-5 hover:bg-green-800"
            >
              Send Book Donation Request
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

// ======================================================
// INFO COMPONENT
// ======================================================

function Info({
  icon,
  title,
  value,
  green = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-3 text-gray-600">

        <span className="text-green-700">
          {icon}
        </span>

        <span>
          {title}
        </span>

      </div>

      <span
        className={
          green
            ? "font-semibold text-green-700"
            : "font-medium text-gray-800 text-right"
        }
      >
        {value}
      </span>

    </div>
  );
}
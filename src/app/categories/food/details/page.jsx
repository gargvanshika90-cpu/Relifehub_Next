"use client";

import { useSearchParams } from "next/navigation";
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
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Fresh Vegetables",
    category: "Vegetables",
    price: 30,
    image: "/food/vegetables.png",
    quantity: "5 kg",
    brand: "Fresh Farm",
    originalPrice: "₹80",
    condition: "Fresh",
    postedOn: "5 Aug 2026",
    expiryDate: "10 Aug 2026",
    description:
      "Fresh seasonal vegetables. Clean, healthy and suitable for needy families.",
    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",
    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorName: "Rahul Sharma",
    donorSince: "June 2024",
    donorPhone: "+91 98765 43210",
  },

  {
    id: 2,
    name: "Basmati Rice (1kg)",
    category: "Rice & Grains",
    price: 45,
    image: "/food/rice.png",
    quantity: "10 kg",
    brand: "India Gate",
    originalPrice: "₹1200",
    condition: "New",
    postedOn: "5 Aug 2026",
    expiryDate: "15 Jan 2027",
    description:
      "Fresh sealed rice bag. Purchased recently. No damage.",
    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",
    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorName: "Rahul Sharma",
    donorSince: "June 2024",
    donorPhone: "+91 98765 43210",
  },

  {
    id: 3,
    name: "Sunflower Oil (1L)",
    category: "Oils & Ghee",
    price: 75,
    image: "/food/oil.png",
    quantity: "5 L",
    brand: "Fortune",
    originalPrice: "₹700",
    condition: "New",
    postedOn: "5 Aug 2026",
    expiryDate: "20 Dec 2027",
    description:
      "Good quality sunflower oil available for donation. Sealed and unused.",
    address:
      "Sector 15, Noida, Uttar Pradesh - 201301",
    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorName: "Rahul Sharma",
    donorSince: "June 2024",
    donorPhone: "+91 98765 43210",
  },
];

export default function FoodDetailsPage() {
  const searchParams = useSearchParams();

  const productId = Number(searchParams.get("id"));

  const product = products.find(
    (item) => item.id === productId
  );
const [showRequest, setShowRequest] = useState(false);
const [quantity, setQuantity] = useState("1");
const [message, setMessage] = useState("");
const [addedToCart, setAddedToCart] = useState(false);
// ==========================================
// ADD TO CART
// ==========================================

const handleAddToCart = () => {
  try {
    const savedCart = localStorage.getItem("cart");

    const cart = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingIndex = cart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    if (existingIndex !== -1) {
      // Increase quantity if already in cart
      cart[existingIndex].quantity =
        Number(cart[existingIndex].quantity || 1) + 1;
    } else {
      // Add new product
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,

        // IMPORTANT: actual cart price
        price: Number(product.price),

        originalPrice: product.originalPrice,

        condition: product.condition,
        brand: product.brand,

        // Cart quantity
        quantity: 1,

        // Available quantity from donation listing
        availableQuantity: product.quantity,

        donorName: product.donorName,
        donorPhone: product.donorPhone,

        description: product.description,

        address: product.address,
        preferredDate: product.preferredDate,
        preferredTime: product.preferredTime,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    // Tell Navbar / Cart page that cart changed
    window.dispatchEvent(
      new Event("cartChanged")
    );

    setAddedToCart(true);

    alert(
      `${product.name} added to cart successfully!`
    );
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    alert(
      "Something went wrong while adding the item to cart."
    );
  }
};
  // ==========================================
  // PRODUCT NOT FOUND
  // ========================================== 

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <Link
            href="/categories/food"
            className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Back to Food
          </Link>
        </div>
      </main>
    );
  }
  
  

  // ==========================================
  // REQUEST DONATION
  // ==========================================

  const handleRequestDonation = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert(
        "Please Login or Signup before requesting this item."
      );

      window.location.href = "/login";

      return;
    }

    setShowRequest(true);
  };

  // ==========================================
  // SEND REQUEST
  // ==========================================

  const sendRequest = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please Login first.");
      window.location.href = "/login";
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const user = JSON.parse(savedUser);

    const newRequest = {
      id: Date.now(),

      productId: product.id,
      productName: product.name,
      productImage: product.image,

      donorName: product.donorName,
      donorPhone: product.donorPhone,

      requesterId: user.id,
      requesterName:
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim(),

      requesterEmail: user.email,

      quantity: quantity,
      message: message,

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

    const oldRequests =
      JSON.parse(
        localStorage.getItem("donationRequests")
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
      "Donation request sent successfully! ❤️"
    );

    window.location.href =
      "/dashboard/requests";
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-6">

        {/* BACK */}

        <Link
          href="/categories/food"
          className="inline-flex items-center gap-2 text-green-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />

          Back to Food
        </Link>

        {/* =========================================
            PRODUCT DETAILS
        ========================================= */}

        <div className="grid lg:grid-cols-2 gap-7">

          {/* IMAGE */}

          <div className="bg-white rounded-3xl shadow-md border p-6">
  <div className="bg-white rounded-2xl h-[650px] flex items-center justify-center overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-contain"
    />
  </div>
</div>

          {/* INFORMATION */}

          <div className="bg-white rounded-3xl shadow-md border p-7">

            <div className="flex justify-between">

              <div>

                <h1 className="text-3xl font-bold">
                  {product.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {product.category}
                </p>

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

              <Heart className="text-gray-400" />

            </div>

            {/* TAGS */}

            <div className="flex gap-2 flex-wrap mt-5">

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                🌿 {product.category}
              </span>

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                ✓ {product.condition}
              </span>

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                ✓ Available
              </span>

            </div>

            <hr className="my-6" />

            {/* DETAILS */}

            <div className="space-y-5">

              <Info
                icon={<Package size={18} />}
                title="Quantity"
                value={product.quantity}
              />

              <Info
                icon={<Tag size={18} />}
                title="Brand"
                value={product.brand}
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

              <Info
                icon={<CalendarDays size={18} />}
                title="Expiry Date"
                value={product.expiryDate}
              />

            </div>

            {/* SAFE */}

            <div className="mt-7 bg-green-50 rounded-xl p-4 flex gap-3">

              <ShieldCheck
                className="text-green-700"
              />

              <div>

                <p className="font-semibold text-green-800">
                  100% Safe & Secure Donations
                </p>

                <p className="text-sm text-gray-500">
                  Your donation is protected and trusted.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <div className="grid lg:grid-cols-2 gap-7 mt-7">

          <div className="bg-white rounded-3xl shadow-md border p-7">

            <h2 className="text-xl font-bold">
              📄 Description
            </h2>

            <p className="text-gray-600 leading-7 mt-4">
              {product.description}
            </p>

            <p className="text-green-700 font-medium mt-4">
              Let's share and help others. 💚
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

                <CalendarDays />

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

                <Clock />

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

        {/* =========================================
            DONOR
        ========================================= */}

        <div className="bg-white rounded-3xl shadow-md border p-7 mt-7">

          <h2 className="text-xl font-bold flex gap-2">
            <User className="text-green-700" />
            Donor Information
          </h2>

          <div className="flex justify-between items-center mt-5">

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

            <div className="flex gap-3">

              <button className="border rounded-xl px-5 py-3 flex items-center gap-2">
                <Phone size={18} />
                {product.donorPhone}
              </button>

          <Link
  href={`/dashboard/messages?donor=${encodeURIComponent(
    product.donorName
  )}&phone=${encodeURIComponent(
    product.donorPhone
  )}`}
  className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-50"
>
  <MessageCircle size={18} />
  Chat
</Link>

            </div>

          </div>

        </div>

        {/* =========================================
            REQUEST BUTTON
        ========================================= */}

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

            {/* REQUEST DONATION */}

            <button
              onClick={handleRequestDonation}
              className="w-full bg-green-700 text-white rounded-xl py-4 font-bold flex justify-center items-center gap-2 hover:bg-green-800"
            >

              <Gift size={20} />

              Request Donation

            </button>

          </div>

          {/* GO TO CART */}

          <Link
            href="/cart"
            className="mt-4 w-full flex justify-center items-center gap-2 text-green-700 font-semibold hover:underline"
          >
            <ShoppingCart size={18} />
            View My Cart
          </Link>

        </div>

      </div>

      {/* ===========================================
          REQUEST POPUP
      =========================================== */}

      {showRequest && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  Request Donation
                </h2>

                <p className="text-gray-500">
                  {product.name}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowRequest(false)
                }
              >
                <X />
              </button>

            </div>

            {/* PRODUCT */}

            <div className="bg-green-50 rounded-xl p-4 mt-5 flex gap-4">

              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-contain bg-white rounded-lg"
              />

              <div>

                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Available: {product.quantity}
                </p>

                <p className="text-green-700 font-bold">
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
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-500"
              />

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
                placeholder="Tell the donor why you need this item..."
                className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* SEND */}

            <button
              onClick={sendRequest}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold mt-5 hover:bg-green-800"
            >
              Send Donation Request
            </button>

          </div>

        </div>

      )}

    </main>
  );
}


// ==========================================
// INFO COMPONENT
// ==========================================

function Info({
  icon,
  title,
  value,
  green = false,
}) {
  return (
    <div className="flex justify-between items-center">

      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span>{title}</span>
      </div>

      <span
        className={
          green
            ? "font-semibold text-green-700"
            : "font-medium text-gray-800"
        }
      >
        {value}
      </span>

    </div>
  );
}
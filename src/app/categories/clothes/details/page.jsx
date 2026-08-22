"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import RequestDonationButton from "@/components/RequestDonationButton";

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
    name: "Denim Jacket",
    category: "Female",
    price: 129,
    image: "/clothes/jacket.png",

    // IMPORTANT
    donorId: "DONOR_USER_ID",
    donorEmail: "donor@gmail.com",
    donorName: "Preeti",
    donorPhone: "+91 98765 43210",

    address: "Sector 15, Noida, Uttar Pradesh - 201301",

    quantity: "1 Item",
    brand: "Levi's",
    originalPrice: "₹999",
    condition: "Very Good",
    size: "M",
    color: "Blue",
    material: "Denim",
    postedOn: "5 Aug 2026",

    description:
      "Good quality denim jacket in very good condition.",

    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorSince: "June 2024",
  },

  {
    id: 2,
    name: "Hoodie",
    category: "Men",
    price: 200,
    image: "/clothes/hoodie.png",

    donorId: "DONOR_USER_ID_2",
    donorEmail: "rahul@gmail.com",
    donorName: "Rahul Gupta",
    donorPhone: "+91 98765 43210",

    address: "Sector 15, Noida, Uttar Pradesh - 201301",

    quantity: "1 Item",
    brand: "H&M",
    originalPrice: "₹899",
    condition: "Excellent",
    size: "L",
    color: "Light Blue",
    material: "Cotton Blend",
    postedOn: "5 Aug 2026",

    description:
      "Soft and comfortable hoodie suitable for winter.",

    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorSince: "June 2024",
  },

   {
    id: 3,
    name: "Cotton tshirt",
    category: "Men",
    price: 200,
    image: "/clothes/tshirt.png",

    donorId: "DONOR_USER_ID_3",
    donorEmail: "rahul@gmail.com",
    donorName: "isha Gupta",
    donorPhone: "+91 98765 89880",

    address: "Sector 5, Noida, Uttar Pradesh - 201301",

    quantity: "1 Item",
    brand: "H&M",
    originalPrice: "₹899",
    condition: "Excellent",
    size: "L",
    color: "Light Blue",
    material: "Cotton Blend",
    postedOn: "5 Aug 2026",

    description:
      "Soft and comfortable hoodie suitable for summer.",

    preferredDate: "12 Aug 2026",
    preferredTime: "10:30 AM - 01:00 PM",
    donorSince: "June 2024",
  },
];

export default function ClothesDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = Number(searchParams.get("id"));

  const product = products.find(
    (item) => item.id === productId
  );

  const [showRequest, setShowRequest] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-md border p-10 text-center">
          <h1 className="text-2xl font-bold">
            Clothing Item Not Found
          </h1>

          <Link
            href="/categories/clothes"
            className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Back to Clothes
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert(
        "Please Login or Signup before adding an item to cart."
      );

      router.push("/login");
      return;
    }

    const oldCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    // Donation items can only have quantity 1
    const alreadyExists = oldCart.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
      alert("This item is already in your cart.");
      setAddedToCart(true);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,

      // Donation item
      quantity: 1,

      size: product.size,
      color: product.color,
      condition: product.condition,

      originalPrice: product.originalPrice,
      price: 0,

      donorName: product.donorName,
      donorPhone: product.donorPhone,

      address: product.address,
      preferredDate: product.preferredDate,
      preferredTime: product.preferredTime,

      addedAt: new Date().toISOString(),
    };

    const updatedCart = [
      ...oldCart,
      cartItem,
    ];

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    // Notify Navbar / Cart icon
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAddedToCart(true);

    alert(
      `${product.name} added to your cart successfully! 🛒`
    );
  };

  // ==========================================
  // REQUEST DONATION
  // ==========================================

const handleRequestDonation = () => {
  // ==========================================
  // LOGIN CHECK
  // ==========================================

  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    alert("Please Login or Signup first.");
    router.push("/login");
    return;
  }

  // ==========================================
  // CHECK EXISTING REQUESTS
  // ==========================================

  const savedRequests = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );

  // ==========================================
  // CHECK IF THIS ITEM IS ALREADY APPROVED
  // ==========================================

  const approvedRequest = savedRequests.find(
    (request) =>
      String(request.productId) ===
        String(product.id) &&
      request.status === "Approved"
  );

  if (approvedRequest) {
    alert(
      "Sorry! This item has already been donated to another buyer."
    );

    return;
  }

  // ==========================================
  // CHECK IF CURRENT USER ALREADY REQUESTED
  // ==========================================

  const user = JSON.parse(savedUser);

  const currentUserAlreadyRequested =
    savedRequests.find(
      (request) =>
        String(request.productId) ===
          String(product.id) &&
        String(request.requesterId) ===
          String(user.id) &&
        request.status !== "Rejected"
    );

  if (currentUserAlreadyRequested) {
    alert(
      "You have already requested this item."
    );

    return;
  }

  // ==========================================
  // OPEN REQUEST POPUP
  // ==========================================

  setShowRequest(true);
};

  // ==========================================
  // SEND REQUEST
  // ==========================================

// ==========================================
// SEND REQUEST
// ==========================================

const sendRequest = () => {
  try {
    const savedUser = localStorage.getItem("user");

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!savedUser) {
      alert("Please Login first.");
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    // ==========================================
    // QUANTITY CHECK
    // ==========================================

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Clothes = only 1 item
    if (Number(quantity) > 1) {
      alert(
        "This clothing item is available only as one item."
      );
      return;
    }

    // ==========================================
    // BUYER NAME
    // ==========================================

    const requesterName =
      [
        user.firstName,
        user.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      user.name ||
      "Buyer";

    // ==========================================
    // DONOR INFORMATION
    // ==========================================

    const donorName =
      product.donorName ||
      product.ownerName ||
      "Donor";

    const donorEmail =
      product.donorEmail ||
      product.ownerEmail ||
      "";

    const donorId =
      product.donorId ||
      product.ownerId ||
      "";

    // ==========================================
    // GET ALL OLD REQUESTS
    // ==========================================

    const oldRequests =
      JSON.parse(
        localStorage.getItem("donationRequests")
      ) || [];

    // ==========================================
    // IMPORTANT:
    // CHECK IF THIS ITEM IS ALREADY APPROVED
    // ==========================================

    const itemAlreadyApproved =
      oldRequests.some(
        (request) =>
          String(request.productId) ===
            String(product.id) &&
          request.status === "Approved"
      );

    if (itemAlreadyApproved) {
      alert(
        "Sorry! This item has already been donated to another buyer."
      );
      return;
    }

    // ==========================================
    // CHECK IF THIS BUYER ALREADY REQUESTED IT
    // ==========================================

    const alreadyRequested =
      oldRequests.some(
        (request) =>
          String(request.productId) ===
            String(product.id) &&
          (
            String(request.requesterId) ===
              String(user.id) ||
            (
              request.requesterEmail &&
              request.requesterEmail.toLowerCase() ===
                (user.email || "").toLowerCase()
            )
          ) &&
          (
            request.status === "Pending" ||
            request.status === "Approved"
          )
      );

    if (alreadyRequested) {
      alert(
        "You have already requested this item."
      );
      return;
    }

    // ==========================================
    // NEW REQUEST
    // ==========================================

    const newRequest = {
      // Unique request ID
      id: Date.now().toString(),

      // ========================================
      // ITEM DETAILS
      // ========================================

      productId: product.id,

      productName:
        product.name ||
        "Clothes Item",

      itemName:
        product.name ||
        "Clothes Item",

      productImage:
        product.image || "",

      category: "Clothes",

      quantity: 1,

      size:
        product.size || "",

      color:
        product.color || "",

      material:
        product.material || "",

      brand:
        product.brand || "",

      condition:
        product.condition || "",

      originalPrice:
        product.originalPrice || "",

      description:
        product.description || "",

      // ========================================
      // DONOR DETAILS
      // ========================================

      donorId: donorId,

      donorName: donorName,

      donorEmail: donorEmail,

      donorPhone:
        product.donorPhone || "",

      donorImage:
        product.donorImage || null,

      // ========================================
      // BUYER DETAILS
      // ========================================

      requesterId:
        user.id || "",

      requesterName:
        requesterName,

      requesterEmail:
        user.email || "",

      requesterImage:
        user.image || null,

      requesterPhone:
        user.phone || "",

      // Keep buyerPhone also because
      // your request page uses it
      buyerPhone:
        user.phone || "",

      // ========================================
      // BUYER ADDRESS
      // ========================================

      address:
        user.address || "",

      buyerAddress:
        user.address || "",

      city:
        user.city || "",

      state:
        user.state || "",

      pincode:
        user.pincode || "",

      // ========================================
      // BUYER MESSAGE
      // ========================================

      message:
        message.trim() ||
        `Hello ${donorName}, I would like to request "${product.name}".`,

      // ========================================
      // STATUS
      // ========================================

      status: "Pending",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    console.log(
      "NEW DONATION REQUEST:",
      newRequest
    );

    // ==========================================
    // SAVE REQUEST
    // ==========================================

    const updatedRequests = [
      ...oldRequests,
      newRequest,
    ];

    localStorage.setItem(
      "donationRequests",
      JSON.stringify(updatedRequests)
    );

    // ==========================================
    // CHECK SAVE
    // ==========================================

    const verify =
      JSON.parse(
        localStorage.getItem(
          "donationRequests"
        )
      ) || [];

    console.log(
      "REQUESTS SAVED:",
      verify
    );

    // ==========================================
    // NOTIFY REQUEST PAGE
    // ==========================================

    window.dispatchEvent(
      new Event("requestsChanged")
    );

    // ==========================================
    // RESET POPUP
    // ==========================================

    setShowRequest(false);
    setQuantity("1");
    setMessage("");

    // ==========================================
    // SUCCESS
    // ==========================================

    alert(
      "Donation request sent successfully! ❤️"
    );

    // ==========================================
    // OPEN REQUEST PAGE
    // ==========================================

    router.push(
      "/dashboard/requests"
    );

  } catch (error) {
    console.error(
      "SEND REQUEST ERROR:",
      error
    );

    alert(
      "Request could not be sent. Please try again."
    );
  }
};
  return (
    <main className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* =========================================
            BACK
        ========================================= */}

        <Link
          href="/categories/clothes"
          className="inline-flex items-center gap-2 text-green-700 font-semibold mb-6 hover:text-green-800"
        >
          <ArrowLeft size={20} />
          Back to Clothes
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

              <button className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50">
                <Heart className="text-gray-400" />
              </button>

            </div>

            {/* TAGS */}

            <div className="flex gap-2 flex-wrap mt-5">

              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                👕 {product.category}
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
                title="Size"
                value={product.size}
              />

              <Info
                icon={<Tag size={18} />}
                title="Color"
                value={product.color}
              />

              <Info
                icon={<Tag size={18} />}
                title="Material"
                value={product.material}
              />

              <Info
                icon={<Tag size={18} />}
                title="Original Price"
                value={product.originalPrice}
              />

              <Info 
  icon={<Gift size={18} />} 
  title="Donation Price" 
  value={`₹${product.price}`} 
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

              <ShieldCheck className="text-green-700" />

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
            DESCRIPTION + PICKUP
        ========================================= */}

        <div className="grid lg:grid-cols-2 gap-7 mt-7">

          {/* DESCRIPTION */}

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

            <div className="flex gap-3">

              <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-50">

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
            CART + REQUEST BUTTONS
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

      {/* =========================================
          REQUEST POPUP
      ========================================= */}

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
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
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
                  Size: {product.size}
                </p>

                <p className="text-sm text-gray-500">
                  Color: {product.color}
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
                max="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Only 1 quantity is available for this donated clothing item.
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
    <div className="flex items-center justify-between gap-4 text-gray-600">

      <div className="flex items-center gap-3">

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
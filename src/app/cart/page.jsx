"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  Gift,
} from "lucide-react";

import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    loadCart();

    const updateCart = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  // ==========================================
  // LOAD CART FROM LOCAL STORAGE
  // ==========================================

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cartItems")
      );

      if (Array.isArray(savedCart)) {
        setCartItems(savedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) => String(item.id) !== String(id)
    );

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    Swal.fire({
      icon: "success",
      title: "Removed",
      text: "Item removed from cart.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (String(item.id) !== String(id)) {
        return item;
      }

      return {
        ...item,
        quantity: Number(item.quantity || 1) + 1,
      };
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (String(item.id) !== String(id)) {
        return item;
      }

      return {
        ...item,
        quantity: Math.max(
          1,
          Number(item.quantity || 1) - 1
        ),
      };
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "All items will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Clear Cart",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cartItems");

        setCartItems([]);

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        Swal.fire({
          icon: "success",
          title: "Cart Cleared",
          text: "All items have been removed.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = cartItems.reduce(
    (total, item) => {
      return (
        total +
        Number(item.quantity || 1)
      );
    },
    0
  );

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = cartItems.reduce(
    (total, item) => {
      const price = Number(item.price || 0);

      const quantity = Number(
        item.quantity || 1
      );

      return total + price * quantity;
    },
    0
  );

  // ==========================================
  // CHECK IF CART HAS PAID ITEM
  // ==========================================

  const hasPaidItem = cartItems.some(
    (item) => Number(item.price || 0) > 0
  );

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">

        <div className="max-w-5xl mx-auto px-6">

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-green-700 font-semibold mb-8 hover:text-green-800"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border p-12 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">

              <ShoppingCart
                size={45}
                className="text-green-700"
              />

            </div>

            <h1 className="text-3xl font-bold mt-6">
              Your Cart is Empty
            </h1>

            <p className="text-gray-500 mt-3">
              You haven't added any items to your cart yet.
            </p>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 mt-7 bg-green-700 text-white px-7 py-3 rounded-xl font-semibold hover:bg-green-800"
            >
              <ShoppingCart size={20} />
              Start Shopping
            </Link>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================
  // CART PAGE
  // ==========================================

  return (
  

      <main className="min-h-screen bg-gray-50 py-10">

        <div className="max-w-7xl mx-auto px-6">

          {/* =====================================
              HEADER
          ===================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">

                <ShoppingCart
                  className="text-green-700"
                  size={36}
                />

                My Cart

              </h1>

              <p className="text-gray-500 mt-2">
                {totalItems} item
                {totalItems !== 1 ? "s" : ""} in your cart
              </p>

            </div>

            <button
              onClick={clearCart}
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Clear Cart
            </button>

          </div>

          {/* =====================================
              MAIN GRID
          ===================================== */}

          <div className="grid lg:grid-cols-3 gap-7">

            {/* ===================================
                CART ITEMS
            =================================== */}

            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => {

                const itemPrice =
                  Number(item.price || 0);

                const itemQuantity =
                  Number(item.quantity || 1);

                const itemTotal =
                  itemPrice * itemQuantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border shadow-sm p-5"
                  >

                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* IMAGE */}

                      <div className="w-full sm:w-40 h-40 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">

                        <Image
                          src={
                            item.image ||
                            "/placeholder.png"
                          }
                          alt={
                            item.name ||
                            "Cart Item"
                          }
                          width={160}
                          height={160}
                          className="w-full h-full object-contain"
                        />

                      </div>

                      {/* DETAILS */}

                      <div className="flex-1">

                        <div className="flex justify-between gap-4">

                          <div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {item.name ||
                                "Donation Item"}
                            </h2>

                            <p className="text-gray-500 mt-1">
                              {item.category ||
                                "Category"}
                            </p>

                          </div>

                          {/* REMOVE */}

                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>

                        </div>

                        {/* =================================
                            PRICE
                        ================================= */}

                        {itemPrice > 0 ? (

                          <p className="text-xl font-bold text-green-700 mt-4">
                            ₹{itemPrice}
                          </p>

                        ) : (

                          <p className="text-xl font-bold text-green-700 mt-4">
                            FREE
                          </p>

                        )}

                        {/* =================================
                            QUANTITY
                        ================================= */}

                        <div className="flex items-center justify-between mt-5">

                          <div className="flex items-center border rounded-xl overflow-hidden">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="w-12 text-center font-semibold">
                              {itemQuantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>

                          </div>

                          {/* ITEM TOTAL */}

                          {itemPrice > 0 && (

                            <p className="font-bold text-gray-900">
                              ₹{itemTotal}
                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* ===================================
                ORDER SUMMARY
            =================================== */}

            <div>

              <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-6">

                <h2 className="text-2xl font-bold">
                  Order Summary
                </h2>

                {/* ITEMS */}

                <div className="flex justify-between mt-6 text-gray-600">

                  <span>
                    Items
                  </span>

                  <span>
                    {totalItems}
                  </span>

                </div>

                {/* SUBTOTAL */}

                <div className="flex justify-between mt-4 text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span>

                    {hasPaidItem
                      ? `₹${totalPrice}`
                      : "FREE"}

                  </span>

                </div>

                {/* DELIVERY */}

                <div className="flex justify-between mt-4 text-gray-600">

                  <span>
                    Delivery
                  </span>

                  <span className="text-green-700 font-semibold">
                    FREE
                  </span>

                </div>

                <hr className="my-6" />

                {/* TOTAL */}

                <div className="flex justify-between text-xl font-bold">

                  <span>
                    Total
                  </span>

                  <span className="text-green-700">

                    {hasPaidItem
                      ? `₹${totalPrice}`
                      : "FREE"}

                  </span>

                </div>

                {/* CHECKOUT */}

                <button
                  onClick={() => {

                    Swal.fire({
                      icon: "success",
                      title:
                        "Proceeding to Checkout",
                      text:
                        "Your order is ready.",
                      confirmButtonColor:
                        "#15803d",
                    });

                  }}
                  className="w-full bg-green-700 text-white rounded-xl py-4 font-bold mt-7 hover:bg-green-800"
                >
                  Proceed to Checkout
                </button>

                {/* CONTINUE SHOPPING */}

                <Link
                  href="/categories/clothes"
                  className="w-full mt-4 flex justify-center items-center gap-2 border-2 border-green-700 text-green-700 rounded-xl py-3 font-semibold hover:bg-green-50"
                >
                  <ArrowLeft size={18} />
                  Continue Shopping
                </Link>

                {/* TRUST */}

                <div className="bg-green-50 rounded-xl p-4 mt-6">

                  <div className="flex gap-3">

                    <ShieldCheck
                      className="text-green-700 shrink-0"
                      size={24}
                    />

                    <div>

                      <p className="font-semibold text-green-800">
                        Safe & Trusted
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Your cart and donation items are secure.
                      </p>

                    </div>

                  </div>

                </div>

                {/* DONATION */}

                <div className="bg-blue-50 rounded-xl p-4 mt-4">

                  <div className="flex gap-3">

                    <Gift
                      className="text-blue-700 shrink-0"
                      size={24}
                    />

                    <div>

                      <p className="font-semibold text-blue-800">
                        Donation Items
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Donation items are available free of cost.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    
  );
}
"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  ArrowRight,
  Package,
  ShoppingBag,
} from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  // =====================================================
  // LOAD FAVORITES
  // =====================================================

  useEffect(() => {
    loadFavorites();

    const handleFavoritesChanged = () => {
      loadFavorites();
    };

    window.addEventListener(
      "favoritesChanged",
      handleFavoritesChanged
    );

    return () => {
      window.removeEventListener(
        "favoritesChanged",
        handleFavoritesChanged
      );
    };
  }, []);

  const loadFavorites = () => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

      setFavorites(saved);
    } catch (error) {
      console.error(
        "Error loading favorites:",
        error
      );

      setFavorites([]);
    }
  };

  // =====================================================
  // REMOVE FAVORITE
  // =====================================================

  const removeFavorite = (id) => {
    const updatedFavorites =
      favorites.filter(
        (item) => String(item.id) !== String(id)
      );

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );

    setFavorites(updatedFavorites);

    window.dispatchEvent(
      new Event("favoritesChanged")
    );
  };

  // =====================================================
  // OPEN ITEM
  // =====================================================

  const getItemLink = (item) => {
    // If you already save a detailLink, use it
    if (item.detailLink) {
      return item.detailLink;
    }

    // Category based fallback
    switch (
      item.category?.toLowerCase()
    ) {
      case "food":
        return `/categories/food/details?id=${item.id}`;

      case "clothes":
        return `/categories/clothes/details?id=${item.id}`;

      case "books":
        return `/categories/books/${item.id}`;

      case "electronics":
        return `/categories/electronics/details?id=${item.id}`;

      case "furniture":
        return `/categories/furniture/details?id=${item.id}`;

      case "toys":
        return `/categories/toys/details?id=${item.id}`;

      default:
        return `/categories/details?id=${item.id}`;
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  return (
    <>
      <Sidebar />

      <main className="ml-64 min-h-screen bg-slate-50 p-6">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

            <div>
              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Heart
                    size={25}
                    className="text-red-500 fill-red-500"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Favorites
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Items you saved for later.
                  </p>
                </div>

              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3">

              <span className="text-sm text-gray-500">
                Saved Items
              </span>

              <span className="ml-2 font-bold text-gray-900">
                {favorites.length}
              </span>

            </div>

          </div>

          {/* =================================================
              EMPTY FAVORITES
          ================================================= */}

          {favorites.length === 0 ? (

            <div className="bg-white border border-gray-200 rounded-3xl p-14 text-center shadow-sm">

              <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto">

                <Heart
                  size={38}
                  className="text-red-300"
                />

              </div>

              <h2 className="text-2xl font-bold mt-5">
                No Favorites Yet
              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                When you find something you like,
                click the heart ❤️ button to save it
                here.
              </p>

              <Link
                href="/categories/food"
                className="inline-flex items-center gap-2 mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Browse Items
                <ArrowRight size={18} />
              </Link>

            </div>

          ) : (

            /* =================================================
                FAVORITES LIST
            ================================================= */

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {favorites.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  {/* IMAGE */}

                  <div className="relative h-52 bg-gray-100">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={
                          item.name ||
                          item.productName ||
                          "Favorite item"
                        }
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">

                        <Package
                          size={45}
                          className="text-gray-300"
                        />

                      </div>

                    )}

                    {/* REMOVE HEART */}

                    <button
                      onClick={() =>
                        removeFavorite(item.id)
                      }
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition"
                      title="Remove from favorites"
                    >
                      <Heart
                        size={20}
                        className="text-red-500 fill-red-500"
                      />
                    </button>

                  </div>

                  {/* DETAILS */}

                  <div className="p-5">

                    {/* CATEGORY */}

                    {item.category && (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-3">
                        {item.category}
                      </span>
                    )}

                    {/* NAME */}

                    <h2 className="text-lg font-bold text-gray-900">
                      {item.name ||
                        item.productName ||
                        item.itemName ||
                        "Unnamed Item"}
                    </h2>

                    {/* DESCRIPTION */}

                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* DATE */}

                    {item.addedAt && (
                      <p className="text-xs text-gray-400 mt-3">
                        Added on{" "}
                        {formatDate(item.addedAt)}
                      </p>
                    )}

                    {/* BUTTONS */}

                    <div className="flex gap-3 mt-5">

                      <Link
                        href={getItemLink(item)}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl text-center text-sm font-semibold transition"
                      >
                        View Item
                      </Link>

                      <button
                        onClick={() =>
                          removeFavorite(item.id)
                        }
                        className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>
    </>
  );
}
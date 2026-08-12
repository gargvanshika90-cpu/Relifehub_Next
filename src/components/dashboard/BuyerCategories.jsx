"use client";

import Link from "next/link";

import {
  Sofa,
  Laptop,
  BookOpen,
  Shirt,
  Utensils,
  Gamepad2,
} from "lucide-react";

export default function BuyerCategories() {

  const categories = [
    {
      name: "Furniture",
      icon: Sofa,
      count: "24 Items",
    },
    {
      name: "Electronics",
      icon: Laptop,
      count: "18 Items",
    },
    {
      name: "Books",
      icon: BookOpen,
      count: "32 Items",
    },
    {
      name: "Clothes",
      icon: Shirt,
      count: "25 Items",
    },
    {
      name: "Food",
      icon: Utensils,
      count: "15 Items",
    },
    {
      name: "Toys",
      icon: Gamepad2,
      count: "20 Items",
    },
  ];


  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex justify-between">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Popular Categories
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Find items you may like
          </p>

        </div>

        <Link
          href="/categories"
          className="text-sm text-blue-900 font-semibold"
        >
          View All
        </Link>

      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">

        {categories.map((category) => {

          const Icon = category.icon;

          return (
            <Link
              href="/categories"
              key={category.name}
              className="border rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition text-center"
            >

              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center">

                <Icon
                  size={24}
                  className="text-blue-600"
                />

              </div>

              <p className="font-semibold text-sm mt-3">
                {category.name}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {category.count}
              </p>

            </Link>
          );

        })}

      </div>

    </div>
  );
}
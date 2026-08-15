"use client";

import Link from "next/link";
import {
  Apple,
  Shirt,
  BookOpen,
  Monitor,
  Sofa,
  ToyBrick,
  Circle,
  LayoutGrid,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";

const categories = [
  {
    name: "Food",
    items: "90 items",
    href: "/categories/food",
    icon: Apple,
  },
  {
    name: "Clothes",
    items: "95 items",
    href: "/categories/clothes",
    icon: Shirt,
  },
  {
    name: "Books",
    items: "80 items",
    href: "/categories/books",
    icon: BookOpen,
  },
  {
    name: "Electronics",
    items: "60 items",
    href: "/categories/electronics",
    icon: Monitor,
  },
  {
    name: "Furniture",
    items: "45 items",
    href: "/categories/furniture",
    icon: Sofa,
  },
  {
    name: "Toys",
    items: "70 items",
    href: "/categories/toys",
    icon: ToyBrick,
  },
  {
    name: "Others",
    items: "50 items",
    href: "/categories/others",
    icon: Circle,
  },
  {
    name: "All Items",
    items: "500 items",
    href: "/categories",
    icon: LayoutGrid,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex ml-65">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-8 ">
        
        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Browse items by categories.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >
                <div
                  className="
                    bg-white
                    border border-gray-200
                    rounded-xl
                    h-[145px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    transition-all
                    duration-200
                    hover:border-green-500
                    hover:shadow-md
                    hover:-translate-y-1
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                      w-14
                      h-14
                      rounded-xl
                      bg-green-50
                      flex
                      items-center
                      justify-center
                      mb-3
                      group-hover:bg-green-100
                      transition
                    "
                  >
                    <Icon
                      size={30}
                      strokeWidth={1.8}
                      className="text-green-700"
                    />
                  </div>

                  {/* CATEGORY NAME */}
                  <h2 className="font-semibold text-gray-800 text-sm">
                    {category.name}
                  </h2>

                  {/* ITEM COUNT */}
                  <p className="text-xs text-gray-400 mt-1">
                    ({category.items})
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
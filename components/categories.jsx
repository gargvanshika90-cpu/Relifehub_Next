"use client";

import Image from "next/image";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";
const categories = [
  {
    name: "Clothes",
    items: "1500+ Items",
    image: "/clothes.png",
    bg: "bg-green-50",
    link: "/categories/clothes",
  },
  {
    name: "Books",
    items: "1200+ Items",
    image: "/books.png",
    bg: "bg-blue-50",
    link: "/categories/books",
  },
  {
    name: "Furniture",
    items: "800+ Items",
    image: "/furniture.png",
    bg: "bg-yellow-50",
    link: "/categories/furniture",
  },
  {
    name: "Electronics",
    items: "900+ Items",
    image: "/electronics.png",
    bg: "bg-purple-50",
    link: "/categories/electronics",
  },
  {
    name: "Toys",
    items: "700+ Items",
    image: "/toys.png",
    bg: "bg-pink-50",
    link: "/categories/toys",
  },
  {
    name: "Food",
    items: "600+ Items",
    image: "/food.png",
    bg: "bg-emerald-50",
    link: "/categories/food",
  },
  {
    name: "Others",
    items: "500+ Items",
    icon: true,
    bg: "bg-gray-50",
    link: "/categories/others",
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      {/* Heading */}
      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Shop by <span className="text-green-700">Categories</span>
        </h2>

        <button className="flex items-center gap-2 text-green-700 font-semibold hover:gap-3 duration-300">
         <Link href="/categories">View All Categories</Link>
          <ArrowRight size={18} />
        </button>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
  {categories.map((item, index) => (
    <Link key={index} href={item.link}>
      <div
        className={`${item.bg} rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-2 duration-300 p-5 text-center cursor-pointer`}
      >
        {item.icon ? (
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 mx-auto flex items-center justify-center bg-white">
            <Ellipsis size={40} className="text-gray-500" />
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            width={120}
            height={120}
            className="mx-auto object-contain h-24"
          />
        )}

        <h3 className="font-bold text-lg mt-4">
          {item.name}
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          {item.items}
        </p>
      </div>
    </Link>
  ))}
</div>


    </section>
  );
}
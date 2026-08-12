"use client";

import Image from "next/image";
import { Search, Gift } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
            🌿 Small Actions, Big Impact
          </span>

          <h1 className="text-6xl font-bold mt-6 leading-tight text-gray-900">
            Share More.
            <br />
            <span className="text-green-700">Care More.</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Donate items you no longer need or find useful things at very
            affordable prices. Together we can build a better and sustainable
            tomorrow.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-green-700 hover:bg-green-800 text-white px-7 py-4 rounded-xl flex items-center gap-2">
               <Link href="/donate"> Donate an Item</Link>
              <Gift size={18} />
            </button>

            <button className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-7 py-4 rounded-xl flex items-center gap-2">
              <Link href="/find-items"> Find items</Link>
              <Search size={18} />
            </button>
          </div>

        
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <Image
            src="/hero.png"
            alt="Hero"
            width={700}
            height={900}
            priority
          />
        </div>

      </div>
    </section>
  );
}
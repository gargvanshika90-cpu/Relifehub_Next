"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Leaf, ShieldCheck, Truck, IndianRupee } from "lucide-react";
  import Navbar from "../../../../components/navbar";
const products = [
  {
    id: 1,
    name: "Fresh Vegetables",
    category: "Vegetables",
    price: 30,
    image: "/food/vegetables.png",
  },
  {
    id: 2,
    name: "Basmati Rice (1kg)",
    category: "Rice & Grains",
    price: 45,
    image: "/food/rice.png",
  },
  {
    id: 3,
    name: "Sunflower Oil (1L)",
    category: "Oils & Ghee",
    price: 75,
    image: "/food/oil.png",
  },
 
];

export default function FoodPage() {
  return (
    <>
    <Navbar></Navbar>
    <div className="bg-white min-h-screen">

      {/* Hero */}

      <section className="max-w-8xl mx-3 px-10 ">

        <div className="bg-[#eff9da] mx-5 rounded-3xl shadow-md overflow-hidden">

          <div className="grid lg:grid-cols-2 items-center">
               
               

            {/* Left */}

            <div className="p-10">

              <h1 className="text-6xl font-extrabold leading-tight">

                <span className="text-green-700">
                  Good Food,
                </span>

                <br />

                Better Together

              </h1>

              <p className="text-gray-600 mt-6 text-lg">

                Buy quality food at low prices and help
                build a better community.

              </p>

              <div className="grid grid-cols-3 gap-6 mt-10">

                <div className="flex gap-3">

                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">

                    <ShieldCheck className="text-green-700"/>

                  </div>

                  <div>

                    <h3 className="font-bold">
                      Low Prices
                    </h3>

                    <p className="text-sm text-gray-500">
                      Affordable for all
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">

                    <Leaf className="text-green-700"/>

                  </div>

                  <div>

                    <h3 className="font-bold">
                      Fresh
                    </h3>

                    <p className="text-sm text-gray-500">
                      Healthy Food
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">

                    <ShoppingCart className="text-green-700"/>

                  </div>

                  <div>

                    <h3 className="font-bold">
                      Community
                    </h3>

                    <p className="text-sm text-gray-500">
                      Better Together
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="flex justify-center">

              <Image
                src="/food/banner.png"
                alt="Food Banner"
                width={800}
                height={200}
                className="object-contain"
              />

            </div>

          </div>

        </div>

      </section>

      {/* Products */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center">

          <h2 className="text-3xl font-bold">

            Food Items

          </h2>

          <select className="border rounded-xl px-5 py-2">

            <option>Most Popular</option>
            <option>Low Price</option>
            <option>High Price</option>

          </select>

        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {products.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl duration-300 p-4 relative"
            >

              <button className="absolute right-4 top-4">

                <Heart
                  size={20}
                  className="text-gray-400 hover:text-red-500"
                />

              </button>

              <div className="flex justify-center">

                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="object-contain h-40"
                />

              </div>

              <h3 className="font-bold text-lg mt-4">

                {item.name}

              </h3>

              <p className="text-gray-500 text-sm">

                {item.category}

              </p>

              <div className="flex items-center mt-3 text-green-700 font-bold text-xl">

                <IndianRupee size={18}/>
                {item.price}

                <span className="text-gray-500 text-sm ml-2">
                  / kg
                </span>

              </div>

              <div className="flex gap-2 mt-5">

                <button className="flex-1 border border-green-700 text-green-700 rounded-lg py-2 text-sm font-semibold hover:bg-green-50 flex items-center justify-center gap-2">

                  <ShoppingCart size={16}/>
                  Add

                </button>

                <Link
  href={`/categories/food/details?id=${item.id}`}
  className="flex-1 bg-green-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-800 flex items-center justify-center"
>
  Buy
</Link>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Bottom */}

      <section className="max-w-7xl mx-auto px-6 pb-10">

        <div className="bg-green-100 rounded-3xl shadow-md p-8 grid md:grid-cols-4 gap-8">

          <div className="flex gap-4">

            <ShieldCheck className="text-green-700"/>

            <div>

              <h3 className="font-bold">
                100% Safe
              </h3>

              <p className="text-gray-500 text-sm">

                Quality Checked Food

              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <IndianRupee className="text-green-700"/>

            <div>

              <h3 className="font-bold">

                Low Prices

              </h3>

              <p className="text-gray-500 text-sm">

                Affordable for Everyone

              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <Leaf className="text-green-700"/>

            <div>

              <h3 className="font-bold">

                Fresh Food

              </h3>

              <p className="text-gray-500 text-sm">

                Healthy & Organic

              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <Truck className="text-green-700"/>

            <div>

              <h3 className="font-bold">

                Fast Delivery

              </h3>

              <p className="text-gray-500 text-sm">

                Quick Delivery

              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
    </>
  );
}
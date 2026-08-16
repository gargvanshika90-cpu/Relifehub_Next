"use client";
import Link from "next/link";

import Image from "next/image";
import { Tag, Leaf, Users } from "lucide-react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import Swal from "sweetalert2";
 import Navbar from "../../../../components/navbar";
import {
  ShieldCheck,
  IndianRupee,

  Truck,
} from "lucide-react";
export default function ClothesPage() {
  const products = [
  {
    id: 1,
    name: "Denim Jacket",
    category: "Men",
    price: 129,
    image: "/clothes/jacket.png",
  },
  {
    id: 2,
    name: "Hoodie",
    category: "Unisex",
    price: 200,
    image: "/clothes/hoodie.png",
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "Men",
    price: 109,
    image: "/clothes/tshirt.png",
  },


];
const addToCart = (product) => {
  Swal.fire({
    icon: "success",
    title: "Added to Cart",
    text: `${product.name} added successfully.`,
    timer: 1500,
    showConfirmButton: false,
  });
};

const buyNow = (product) => {
  Swal.fire({
    icon: "success",
    title: "Order Confirmed",
    text: `Proceeding to buy ${product.name}.`,
    confirmButtonColor: "#15803d",
  });
};

const addWishlist = () => {
  Swal.fire({
    icon: "success",
    title: "Added to Wishlist",
    timer: 1200,
    showConfirmButton: false,
  });
};
  return (
    <>
    <Navbar></Navbar>
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-blue-50 to-white">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left */}

            <div>

              <h1 className="text-6xl font-extrabold text-gray-900">

                Clothes
                <span className="ml-3 text-blue-500">👕</span>

              </h1>

              <p className="text-xl text-gray-600 mt-6">

                Explore a wide range of gently used clothes.

              </p>

              <p className="text-lg text-gray-500 mt-2">

                Good for you, good for others,
                good for the planet.

              </p>

              {/* Features */}

              <div className="grid md:grid-cols-3 gap-6 mt-10">

                <div className="flex gap-4">

                  <div className="h-14 w-14 rounded-full bg-white shadow flex items-center justify-center">

                    <Tag className="text-green-600" />

                  </div>

                  <div>

                    <h3 className="font-bold">

                      Affordable

                    </h3>

                    <p className="text-sm text-gray-500">

                      Great quality
                      at low prices

                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="h-14 w-14 rounded-full bg-white shadow flex items-center justify-center">

                    <Leaf className="text-green-600" />

                  </div>

                  <div>

                    <h3 className="font-bold">

                      Sustainable

                    </h3>

                    <p className="text-sm text-gray-500">

                      Reuse & reduce waste

                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="h-14 w-14 rounded-full bg-white shadow flex items-center justify-center">

                    <Users className="text-green-600" />

                  </div>

                  <div>

                    <h3 className="font-bold">

                      Community First

                    </h3>

                    <p className="text-sm text-gray-500">

                      Help others &
                      build a better community

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Right */}

            <div>

              <Image
                src="/clothes/banner.png"
                alt="Clothes"
                width={700}
                height={500}
                className="w-full"
              />

            </div>

          </div>

        </div>

      </section>

      {/* Products Heading */}

      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex justify-between items-center">

          <h2 className="text-3xl font-bold">

            Clothing Items

          </h2>

          <select className="border rounded-lg px-4 py-2">

            <option>Most Popular</option>

            <option>Newest</option>

            <option>Price Low to High</option>

            <option>Price High to Low</option>

          </select>

        </div>

        {/* Part 2 Starts Here */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">

  {products.map((item) => (

    <div
      key={item.id}
      className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
    >

      <div className="relative p-6">

        <button
          onClick={addWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-red-50"
        >
          <Heart size={20} />
        </button>

        <Image
          src={item.image}
          alt={item.name}
          width={220}
          height={220}
          className="mx-auto h-56 object-contain"
        />

      </div>

      <div className="px-6 pb-6">

        <h3 className="text-xl font-bold">
          {item.name}
        </h3>

        <p className="text-gray-500 mt-1">
          {item.category}
        </p>

        <p className="text-2xl font-bold text-green-700 mt-4">
          ₹{item.price}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            onClick={() => addToCart(item)}
            className="flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 py-3 rounded-xl hover:bg-green-700 hover:text-white duration-300"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>

                        <Link
  href={`/categories/clothes/details?id=${item.id}`}
  className="flex-1 bg-green-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-800 flex items-center justify-center"
>
  Buy Now
</Link>

        </div>

      </div>

    </div>

  ))}

</div>

{/* ================= Footer Features ================= */}

<section className="max-w-7xl mx-auto px-6 py-12">

  <div className="bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-sm">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">

      {/* Safe */}

      <div className="flex items-center gap-4">

        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">

          <ShieldCheck className="text-green-700" size={30} />

        </div>

        <div>

          <h3 className="font-bold text-lg">
            100% Safe & Trusted
          </h3>

          <p className="text-gray-500 text-sm">
            Quality checked items
          </p>

        </div>

      </div>

      {/* Low Price */}

      <div className="flex items-center gap-4">

        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">

          <IndianRupee className="text-green-700" size={30} />

        </div>

        <div>

          <h3 className="font-bold text-lg">
            Low Prices
          </h3>

          <p className="text-gray-500 text-sm">
            Best prices for everyone
          </p>

        </div>

      </div>

      {/* Eco */}

      <div className="flex items-center gap-4">

        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">

          <Leaf className="text-green-700" size={30} />

        </div>

        <div>

          <h3 className="font-bold text-lg">
            Sustainable Choice
          </h3>

          <p className="text-gray-500 text-sm">
            Better for you, Better for Earth
          </p>

        </div>

      </div>

      {/* Delivery */}

      <div className="flex items-center gap-4">

        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">

          <Truck className="text-green-700" size={30} />

        </div>

        <div>

          <h3 className="font-bold text-lg">
            Fast Delivery
          </h3>

          <p className="text-gray-500 text-sm">
            Quick & Reliable Delivery
          </p>

        </div>

      </div>

    </div>

  </div>

</section>
      </section>

    </div>
    </>
  );
}
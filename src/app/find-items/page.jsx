"use client";
 import Navbar from "../../../components/navbar";
import { Search, MapPin, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
const items = [
  {
    id: 1,
    name: "Winter Jacket",
    category: "Clothes",
    location: "New Delhi",
    time: "2 days ago",
    image: "/images/jacket.png",
  },
  {
    id: 2,
    name: "Study Table",
    category: "Furniture",
    location: "Gurugram",
    time: "1 day ago",
    image: "/images/table.png",
  },
  {
    id: 3,
    name: "Engineering Books",
    category: "Books",
    location: "Noida",
    time: "3 days ago",
    image: "/images/books.png",
  },
  {
    id: 4,
    name: "Microwave Oven",
    category: "Electronics",
    location: "Delhi",
    time: "2 days ago",
    image: "/images/microwave.png",
  },
  {
    id: 5,
    name: "School Bag",
    category: "Others",
    location: "Faridabad",
    time: "1 day ago",
    image: "/images/bag.png",
  },
  {
    id: 6,
    name: "Bicycle",
    category: "Others",
    location: "Ghaziabad",
    time: "3 days ago",
    image: "/images/cycle.png",
  },
  {
    id: 7,
    name: "Sofa Set",
    category: "Furniture",
    location: "Faridabad",
    time: "5 days ago",
    image: "/images/sofa.png",
  },
  {
    id: 8,
    name: "Toys Set",
    category: "Toys",
    location: "Noida",
    time: "2 days ago",
    image: "/images/toys.png",
  },
];

export default function FindItemsPage() {
      const router = useRouter();
  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold">
          Find Items
        </h1>

        <p className="text-gray-500 mt-1">
          Home / Find Items
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-4">

          <div className="lg:col-span-2 relative">

            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Items..."
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
            Search
          </button>

       <select
      className="border rounded-xl px-4 py-3"
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/categories/${e.target.value}`);
        }
      }}
    >
      <option value="">All Categories</option>
      <option value="food">Food</option>
      <option value="clothes">Clothes</option>
       <option value="book">Books</option>
  <option value="furniture">Furniture</option>
  <option value="electronics">Electronics</option>
    <option value="toys">Toys</option>
    </select>

          <select className="border rounded-xl px-4">
            <option>All Locations</option>
            <option>Delhi</option>
            <option>Noida</option>
            <option>Gurugram</option>
            <option>Faridabad</option>
          </select>

        </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl duration-300"
            >

         <div className="relative w-full h-48 bg-white rounded-t-2xl overflow-hidden">
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-contain"
  />

  <button className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center">
    <Heart
      size={20}
      className="text-red-500"
    />
  </button>
</div>

              <div className="p-4">

                <h2 className="font-bold text-lg">
                  {item.name}
                </h2>

                <p className="text-gray-500">
                  {item.category}
                </p>

                <div className="flex justify-between mt-4 text-sm text-gray-500">

                  <span className="flex items-center gap-1">

                    <MapPin size={15} />

                    {item.location}

                  </span>

                  <span>{item.time}</span>

                </div>

              </div>

            </div>

          ))}

        </div>
                
      </div>

    </div>
    </>
  );
}
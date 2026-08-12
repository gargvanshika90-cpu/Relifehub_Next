import Image from "next/image";
  import Navbar from "../../../components/navbar";
import Link from "next/link";

const categories = [
  {
    name: "Food",
    items: "1200+ Items",
    image: "/categories/food1.png",
    bg: "bg-[#c3d8af]",
    link: "/categories/food",
  },
  {
    name: "Clothes",
    items: "1500+ Items",
    image: "/categories/clothes1.png",
    bg: "bg-[#DCEEFF]",
    link: "/categories/clothes",
  },
  {
    name: "Books",
    items: "890+ Items",
    image: "/categories/book1.png",
    bg: "bg-[#FFECCF]",
    link: "/categories/books",
  },
  {
    name: "Electronics",
    items: "750+ Items",
    image: "/electronics.png",
    bg: "bg-[#E9E0FF]",
    link: "/categories/electronics",
  },
  {
    name: "Furniture",
    items: "650+ Items",
    image: "/furniture.png",
    bg: "bg-[#FFE7CF]",
    link: "/categories/furniture",
  },
  {
    name: "Stationery",
    items: "540+ Items",
    image: "/categories/stationary1.png",
    bg: "bg-[#e5f7e4]",
    link: "/categories/stationery",
  },
  {
    name: "Toys",
    items: "420+ Items",
    image: "/toys.png",
    bg: "bg-[#FFDCE8]",
    link: "/categories/toys",
  },
  {
    name: "Others",
    items: "500+ Items",
    image: "/categories/others1.png",
    bg: "bg-[#fde4c6]",
    link: "/categories/others",
  },
];



export default function CategoriesPage() {
  return (
    <> <Navbar></Navbar>
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <p className="text-gray-500 mt-2">
          Choose a category to explore items.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
  {categories.map((category) => (
    <Link href={category.link} key={category.name}>
      <div
        className={`${category.bg} rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 text-center`}
      >
        <div className="relative w-42 h-42 mx-auto">
          {category.icon ? (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              
            </div>
          ) : (
           <img
  src={category.image}
  alt={category.name}
  className="w-42 h-42  mx-auto"
/>
          )}
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          {category.name}
        </h2>

        <p className="text-gray-600">
          {category.items}
        </p>
      </div>
    </Link>
  ))}
</div>
      </div>
    </main>
    </>
  );
}

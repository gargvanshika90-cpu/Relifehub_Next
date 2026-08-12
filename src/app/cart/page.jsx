// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   Trash2,
//   ShoppingBag,
//   ArrowLeft,
// } from "lucide-react";

// import { useCart } from "@/context/CartContext";

// export default function CartPage() {
//   const {
//     cart,
//     removeFromCart,
//     clearCart,
//   } = useCart();

//   return (
//     <main className="max-w-6xl mx-auto px-6 py-10">

//       <Link
//         href="/"
//         className="inline-flex items-center gap-2 text-green-700 font-semibold mb-8"
//       >
//         <ArrowLeft size={20} />
//         Continue Browsing
//       </Link>

//       <div className="flex items-center justify-between mb-8">

//         <div>
//           <h1 className="text-4xl font-bold">
//             My Cart
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Donated items you've selected
//           </p>
//         </div>

//         {cart.length > 0 && (
//           <button
//             onClick={clearCart}
//             className="text-red-600 font-semibold hover:text-red-700"
//           >
//             Clear All
//           </button>
//         )}

//       </div>

//       {cart.length === 0 ? (

//         <div className="text-center py-20 border rounded-2xl">

//           <ShoppingBag
//             size={60}
//             className="mx-auto text-gray-300"
//           />

//           <h2 className="text-2xl font-bold mt-5">
//             Your Cart is Empty
//           </h2>

//           <p className="text-gray-500 mt-2">
//             Browse donated items and add something useful.
//           </p>

//           <Link
//             href="/categories"
//             className="
//               inline-block
//               mt-6
//               bg-green-700
//               text-white
//               px-6
//               py-3
//               rounded-xl
//               font-semibold
//             "
//           >
//             Browse Categories
//           </Link>

//         </div>

//       ) : (

//         <div className="grid lg:grid-cols-3 gap-8">

//           {/* Items */}
//           <div className="lg:col-span-2 space-y-4">

//             {cart.map((item) => (

//               <div
//                 key={item.id}
//                 className="
//                   bg-white
//                   border
//                   border-gray-200
//                   rounded-2xl
//                   p-4
//                   flex
//                   gap-5
//                   items-center
//                 "
//               >

//                 <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100">

//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />

//                 </div>

//                 <div className="flex-1">

//                   <h3 className="font-bold text-lg">
//                     {item.name}
//                   </h3>

//                   <p className="text-green-700">
//                     {item.category}
//                   </p>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {item.location}
//                   </p>

//                   <p className="text-green-700 font-bold mt-2">
//                     FREE
//                   </p>

//                 </div>

//                 {/* NO QUANTITY */}
//                 <div className="text-sm text-gray-500">
//                   1 item
//                 </div>

//                 <button
//                   onClick={() => removeFromCart(item.id)}
//                   className="text-red-500 hover:text-red-700"
//                   title="Remove item"
//                 >
//                   <Trash2 size={20} />
//                 </button>

//               </div>

//             ))}

//           </div>

//           {/* Summary */}
//           <div
//             className="
//               border
//               border-gray-200
//               rounded-2xl
//               p-6
//               h-fit
//               shadow-sm
//             "
//           >

//             <h2 className="text-xl font-bold mb-6">
//               Cart Summary
//             </h2>

//             <div className="flex justify-between mb-3">
//               <span className="text-gray-500">
//                 Total Items
//               </span>

//               <span className="font-bold">
//                 {cart.length}
//               </span>
//             </div>

//             <div className="flex justify-between border-t pt-4">
//               <span className="font-semibold">
//                 Total Price
//               </span>

//               <span className="font-bold text-green-700">
//                 ₹0
//               </span>
//             </div>

//             <button
//               className="
//                 w-full
//                 mt-6
//                 bg-green-700
//                 hover:bg-green-800
//                 text-white
//                 py-3
//                 rounded-xl
//                 font-semibold
//               "
//             >
//               Request Items
//             </button>

//           </div>

//         </div>

//       )}

//     </main>
//   );
// }
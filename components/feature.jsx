"use client";

import {
  Gift,
  Tag,
  MapPin,
  Users,
  Leaf,
} from "lucide-react";

const features = [
  {
    icon: <Gift size={26} />,
    title: "Donate Freely",
    desc: "Give items for free",
  },
  {
    icon: <Tag size={26} />,
    title: "Low Prices",
    desc: "Buy items at very affordable prices",
  },
  {
    icon: <MapPin size={26} />,
    title: "Nearby Pickup",
    desc: "Locate items near you easily",
  },
  {
    icon: <Users size={26} />,
    title: "Trusted Community",
    desc: "Verified users & secure platform",
  },
  {
    icon: <Leaf size={26} />,
    title: "Eco Friendly",
    desc: "Reduce waste & protect environment",
  },
];

export default function Feature() {
  return (
    <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

          {features.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-6 hover:bg-green-50 transition duration-300 ${
                index !== features.length - 1
                  ? "border-r border-gray-200"
                  : ""
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center">
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
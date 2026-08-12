import { Users, PackageOpen, Heart, Clock, Leaf } from "lucide-react";

const stats = [
  { icon: Users, value: "12K+", label: "Active Users" },
  { icon: PackageOpen, value: "8K+", label: "Items Shared" },
  { icon: Heart, value: "5K+", label: "Happy Receivers" },
  { icon: Clock, value: "15K+", label: "Volunteer Hours" },
  { icon: Leaf, value: "20K+", label: "CO2 Saved (kg)" },
];

export default function StatsRow() {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-wrap md:flex-col justify-between gap-3 ">
          <h5 className="text-2xl text-start font-bold text-gray-900 mb-3"> Our Impact So Far </h5>

         <div className="flex justify-center">
           {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex  gap-3">
              <div className="w-12 h-12 rounded-full border border-emerald-300 flex items-center justify-center">
                <Icon className="w-6 h-6 text-emerald-600" strokeWidth={1.75} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">{value}</h3>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
         </div>
        </div>
      </div>
    </div>
  );
}

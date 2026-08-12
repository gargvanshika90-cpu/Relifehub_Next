"use client";

export default function ImpactOverview() {

  return (
    <div className="bg-white border rounded-2xl p-6">

      {/* HEADER */}

      <div className="flex justify-between">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Impact Overview
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Your contribution this month
          </p>

        </div>

        <button className="text-sm text-green-600 font-semibold">
          View Report
        </button>

      </div>


      {/* DONUT */}

      <div className="flex justify-center py-8">

        <div
          className="
            w-44
            h-44
            rounded-full
            bg-[conic-gradient(#22c55e_0_40%,#3b82f6_40%_70%,#a855f7_70%_90%,#f59e0b_90%_100%)]
            flex
            items-center
            justify-center
          "
        >

          <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">

            <span className="text-xs text-gray-500">
              Total Impact
            </span>

            <span className="text-2xl font-bold text-gray-800">
              250 kg
            </span>

          </div>

        </div>

      </div>


      {/* LEGEND */}

      <div className="grid grid-cols-2 gap-4">

        <Legend
          color="bg-green-500"
          name="Food"
          value="40%"
        />

        <Legend
          color="bg-blue-500"
          name="Clothes"
          value="30%"
        />

        <Legend
          color="bg-purple-500"
          name="Books"
          value="20%"
        />

        <Legend
          color="bg-orange-400"
          name="Others"
          value="10%"
        />

      </div>

    </div>
  );
}


function Legend({
  color,
  name,
  value,
}) {

  return (
    <div className="flex items-center gap-2">

      <span
        className={`w-3 h-3 rounded-full ${color}`}
      />

      <span className="text-sm text-gray-600">
        {name}
      </span>

      <b className="ml-auto text-sm">
        {value}
      </b>

    </div>
  );
}
"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Package,
  Recycle,
  Heart,
  ShoppingBag,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function ImpactPage() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadData();

    const refreshData = () => {
      loadData();
    };

    window.addEventListener("donationsChanged", refreshData);
    window.addEventListener("requestsChanged", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("donationsChanged", refreshData);
      window.removeEventListener("requestsChanged", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const loadData = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      const allDonations = JSON.parse(
        localStorage.getItem("donations") || "[]"
      );

      const allRequests = JSON.parse(
        localStorage.getItem("donationRequests") || "[]"
      );

      setUser(savedUser);

      if (!savedUser) {
        setDonations([]);
        setRequests([]);
        return;
      }

      /*
       * DONATIONS BELONGING TO CURRENT USER
       */
      const myDonations = allDonations.filter((item) => {
        return (
          item.donorEmail === savedUser.email ||
          item.userId === savedUser.id ||
          item.donorId === savedUser.id
        );
      });

      /*
       * REQUESTS BELONGING TO CURRENT USER
       */
      const myRequests = allRequests.filter((item) => {
        return (
          item.buyerEmail === savedUser.email ||
          item.requesterEmail === savedUser.email ||
          item.userId === savedUser.id ||
          item.buyerId === savedUser.id ||
          item.requesterId === savedUser.id
        );
      });

      setDonations(myDonations);
      setRequests(myRequests);
    } catch (error) {
      console.error("Impact data error:", error);
    }
  };

  /*
   * ROLE
   */
  const isBuyer =
    user?.role?.toLowerCase() === "buyer" ||
    user?.role?.toLowerCase() === "requester";

  const isDonor = !isBuyer;

  /*
   * DONOR COUNTS
   */
  const donorStats = useMemo(() => {
    const totalItems = donations.length;

    const totalQuantity = donations.reduce((total, item) => {
      const quantity = Number(item.quantity) || 1;
      return total + quantity;
    }, 0);

    /*
     * Estimated environmental impact.
     * You can change these values later according to your project.
     */
    const co2Saved = Math.round(totalQuantity * 2.5);

    const wasteReduced = Math.round(totalQuantity * 1.5);

    const impactPoints = totalQuantity * 10;

    return {
      totalItems,
      totalQuantity,
      co2Saved,
      wasteReduced,
      impactPoints,
    };
  }, [donations]);

  /*
   * BUYER COUNTS
   */
  const buyerStats = useMemo(() => {
    const totalRequests = requests.length;

    const approvedRequests = requests.filter((request) => {
      const status = String(request.status || "").toLowerCase();

      return (
        status === "approved" ||
        status === "accepted" ||
        status === "completed" ||
        status === "received"
      );
    }).length;

    const pendingRequests = requests.filter((request) => {
      const status = String(request.status || "").toLowerCase();

      return (
        status === "pending" ||
        status === "requested"
      );
    }).length;

    const receivedItems = requests.filter((request) => {
      const status = String(request.status || "").toLowerCase();

      return (
        status === "received" ||
        status === "completed"
      );
    }).length;

    const impactPoints = receivedItems * 10;

    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      receivedItems,
      impactPoints,
    };
  }, [requests]);

  /*
   * MONTHLY DONATION DATA
   */
  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const count = donations.reduce((total, donation) => {
        if (!donation.createdAt) return total;

        const date = new Date(donation.createdAt);

        if (
          date.getFullYear() === currentYear &&
          date.getMonth() === index
        ) {
          return total + (Number(donation.quantity) || 1);
        }

        return total;
      }, 0);

      return {
        month,
        count,
      };
    });
  }, [donations]);

  /*
   * Only show months that have data
   */
  const visibleMonths = monthlyData.filter(
    (item) => item.count > 0
  );

  const chartData =
    visibleMonths.length > 0
      ? visibleMonths
      : [
          { month: "Jan", count: 0 },
          { month: "Feb", count: 0 },
          { month: "Mar", count: 0 },
          { month: "Apr", count: 0 },
          { month: "May", count: 0 },
          { month: "Jun", count: 0 },
        ];

  const maxValue = Math.max(
    ...chartData.map((item) => item.count),
    1
  );

  /*
   * NOT LOGGED IN
   */
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <Heart className="mx-auto text-green-600 mb-4" size={45} />

            <h1 className="text-xl font-bold text-gray-800">
              Your Impact
            </h1>

            <p className="text-gray-500 mt-2">
              Please login to see your impact.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * DONOR PAGE
   */
  if (isDonor) {
    return (
        <>
        <Sidebar></Sidebar>
    
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 ml-65">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Impact (Donor)
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              See how your donations are making a difference.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            {/* ITEMS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Package
                    size={21}
                    className="text-green-600"
                  />
                </div>

                <TrendingUp
                  size={17}
                  className="text-green-500"
                />
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                {donorStats.totalQuantity}
              </p>

              <p className="text-xs text-gray-500">
                Items Donated
              </p>
            </div>

            {/* CO2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Leaf
                  size={21}
                  className="text-green-600"
                />
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                {donorStats.co2Saved} kg
              </p>

              <p className="text-xs text-gray-500">
                CO₂ Saved
              </p>
            </div>

            {/* WASTE */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Recycle
                  size={21}
                  className="text-green-600"
                />
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                {donorStats.wasteReduced} kg
              </p>

              <p className="text-xs text-gray-500">
                Waste Reduced
              </p>
            </div>

            {/* POINTS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Heart
                  size={21}
                  className="text-green-600"
                />
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                {donorStats.impactPoints}
              </p>

              <p className="text-xs text-gray-500">
                Impact Points
              </p>
            </div>
          </div>

          {/* MONTHLY CHART */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="mb-5">
              <h2 className="font-semibold text-gray-800">
                Monthly Impact Overview
              </h2>

              <p className="text-xs text-gray-400">
                Items donated per month
              </p>
            </div>

            {/* CHART */}
            <div className="h-64 flex items-end gap-3 md:gap-6 border-b border-gray-200 px-3">

              {chartData.map((item) => {
                const height =
                  item.count === 0
                    ? 4
                    : Math.max(
                        (item.count / maxValue) * 100,
                        8
                      );

                return (
                  <div
                    key={item.month}
                    className="flex-1 h-full flex flex-col justify-end items-center"
                  >
                    {/* VALUE */}
                    {item.count > 0 && (
                      <span className="text-[10px] text-gray-500 mb-1">
                        {item.count}
                      </span>
                    )}

                    {/* BAR */}
                    <div
                      className="w-full max-w-[32px] bg-green-500 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    {/* MONTH */}
                    <span className="text-[10px] text-gray-500 mt-2">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* TOTAL */}
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">
                  Total donations
                </p>

                <p className="font-bold text-gray-800">
                  {donorStats.totalItems}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 text-right">
                  Total quantity
                </p>

                <p className="font-bold text-green-600 text-right">
                  {donorStats.totalQuantity} items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
</>
    );
  }

  /*
   * BUYER PAGE
   */
  return (
    <>
    <Sidebar></Sidebar>
    
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 ml-65">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Impact (Buyer)
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track your donation requests and received items.
          </p>
        </div>

        {/* BUYER STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* REQUESTED */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <ShoppingBag
                size={21}
                className="text-green-600"
              />
            </div>

            <p className="text-2xl font-bold text-gray-800 mt-3">
              {buyerStats.totalRequests}
            </p>

            <p className="text-xs text-gray-500">
              Items Requested
            </p>
          </div>

          {/* APPROVED */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle
                size={21}
                className="text-green-600"
              />
            </div>

            <p className="text-2xl font-bold text-gray-800 mt-3">
              {buyerStats.approvedRequests}
            </p>

            <p className="text-xs text-gray-500">
              Approved Requests
            </p>
          </div>

          {/* PENDING */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock
                size={21}
                className="text-green-600"
              />
            </div>

            <p className="text-2xl font-bold text-gray-800 mt-3">
              {buyerStats.pendingRequests}
            </p>

            <p className="text-xs text-gray-500">
              Pending Requests
            </p>
          </div>

          {/* IMPACT */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Leaf
                size={21}
                className="text-green-600"
              />
            </div>

            <p className="text-2xl font-bold text-gray-800 mt-3">
              {buyerStats.impactPoints}
            </p>

            <p className="text-xs text-gray-500">
              Impact Points
            </p>
          </div>
        </div>

        {/* RECEIVED */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Package
                size={25}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Successfully Received
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {buyerStats.receivedItems} items
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
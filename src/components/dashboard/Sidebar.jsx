 
 

 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Gift,
  ClipboardList,
  Heart,
  MessageCircle,
  Grid3X3,
  Users,
  Leaf,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Donations",
      href: "/dashboard/donations",
      icon: Gift,
    },
    {
      name: "My Requests",
      href: "/dashboard/requests",
      icon: ClipboardList,
    },
    {
      name: "My Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageCircle,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Grid3X3,
    },
    {
      name: "Volunteers",
      href: "/dashboard/volunteers",
      icon: Users,
    },
    {
      name: "Impact",
      href: "/dashboard/impact",
      icon: Leaf,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-gradient-to-b from-green-700 to-green-900 text-white shadow-xl">

      {/* LOGO */}
      <div className="px-6 py-5 border-b border-green-600">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">

            <img
              src="/logo.png"
              alt="ReLife Hub"
              className="w-8 h-8 object-contain"
            />

          </div>

          <div>

            <h1 className="font-bold text-lg">
              ReLife Hub
            </h1>

            <p className="text-[10px] text-green-100">
              Share • Donate • Reuse
            </p>

          </div>

        </Link>

      </div>


      {/* MENU */}
      <nav className="px-3 py-5 space-y-1">

        {menuItems.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-lg
                text-sm
                transition
                ${
                  active
                    ? "bg-green-500 text-white shadow"
                    : "text-green-50 hover:bg-green-600"
                }
              `}
            >

              <Icon size={19} />

              <span>
                {item.name}
              </span>

              {item.name === "Messages" && (
                <span className="ml-auto w-5 h-5 rounded-full bg-white text-green-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
              )}

            </Link>
          );

        })}

      </nav>


      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="absolute bottom-5 left-3 right-3 flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-green-50 hover:bg-green-600 transition"
      >

        <LogOut size={18} />

        Logout

      </button>

    </aside>
  );
}

 
 
 
 
 
 
 
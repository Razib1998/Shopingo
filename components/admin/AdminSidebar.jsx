"use client";

import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShieldCheckIcon,
  StoreIcon,
  TicketPercentIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";

const AdminSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Stores", href: "/admin/stores", icon: StoreIcon },
    { name: "Approve Store", href: "/admin/approve", icon: ShieldCheckIcon },
    { name: "Coupons", href: "/admin/coupons", icon: TicketPercentIcon },
  ];

  // ✅ Dashboard is only active on EXACT "/admin" (or "/admin/").
  // Other links are active for their exact path and any subpaths.
  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className="
        inline-flex h-full flex-col gap-5 sm:min-w-60
        border-r border-slate-200 rounded-sm
        bg-gradient-to-b from-indigo-50 via-white to-rose-50
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-900
      "
    >
      {/* Profile */}
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500">
          <Image
            className="w-14 h-14 rounded-full bg-white"
            src={user?.imageUrl || assets.logo}
            alt="Avatar"
            width={80}
            height={80}
          />
        </div>
        <p className="text-slate-700">
          <span className="font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
            {user?.fullName || "Admin"}
          </span>
        </p>
      </div>

      {/* Links */}
      <div className="max-sm:mt-6">
        {sidebarLinks.map((link, index) => {
          const active = isActive(link.href);
          return (
            <Link
              key={index}
              href={link.href}
              className={[
                "group relative flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                active
                  ? // Active: stronger contrast + brand color text
                    "bg-gradient-to-r from-fuchsia-100 to-indigo-100 text-indigo-700 shadow-sm"
                  : // Hover: gentle gradient wash + brand color text on hover
                    "text-slate-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-rose-50/60 hover:shadow-sm hover:translate-x-0.5",
              ].join(" ")}
            >
              {/* Left active bar */}
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 rounded-r bg-gradient-to-b from-fuchsia-500 to-indigo-500 animate-pulse" />
              )}

              <link.icon
                size={18}
                className={[
                  "sm:ml-5 transition-transform",
                  active
                    ? "scale-110 text-indigo-700"
                    : "group-hover:scale-105",
                ].join(" ")}
              />
              <p
                className={[
                  "max-sm:hidden font-medium",
                  active ? "text-indigo-700" : "",
                ].join(" ")}
              >
                {link.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;

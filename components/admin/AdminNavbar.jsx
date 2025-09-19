"use client";
import { assets } from "@/assets/assets";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const AdminNavbar = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <Image
          src={assets.logo}
          width={100}
          height={100}
          alt="Logo"
          className="rounded"
          priority
        />
        <p className="absolute text-xs font-semibold -top-2 -right-14 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
          Admin
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <p>
          Hi,{" "}
          <span className="font-bold text-[#D50355] ">{user?.lastName}</span>
        </p>
        <UserButton />
      </div>
    </div>
  );
};

export default AdminNavbar;

"use client";

import { assets } from "@/assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Search, ShoppingCart, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
  };

  return (
    <nav className="relative">
      {/* MOBILE HEADER */}
      <div className="sm:hidden bg-black text-white">
        <div className="mx-3">
          <div className="h-14 flex items-center justify-between gap-3">
            {/* Left: Burger + brand */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
              >
                <Menu size={20} />
              </button>

              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={assets.logo}
                  width={100}
                  height={100}
                  alt="Logo"
                  className="rounded"
                  priority
                />
              </Link>
            </div>

            {/* Right: collapsible search (left of profile) + profile/login */}
            <div className="flex items-center gap-2">
              {/* Collapsible search field */}
              <form
                onSubmit={handleSearchSubmit}
                className={[
                  "flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 transition-all",
                  searchOpen
                    ? "w-44 opacity-100"
                    : "w-0 px-0 opacity-0 pointer-events-none",
                ].join(" ")}
              >
                <Search size={16} className="shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => {
                    if (!search) setSearchOpen(false);
                  }}
                  className="w-full bg-transparent text-sm outline-none placeholder-white/70"
                  placeholder="Search"
                  autoComplete="off"
                />
              </form>

              {/* Toggle button for search */}
              <button
                aria-label="Toggle search"
                onClick={() => setSearchOpen((s) => !s)}
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
              >
                <Search size={20} />
              </button>

              {/* Profile / Login */}
              {user ? (
                <UserButton />
              ) : (
                <button
                  onClick={openSignIn}
                  className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10" />
      </div>

      {/* Overlay */}
      <div
        className={`sm:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Panel */}
      <aside
        className={`sm:hidden fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="text-sm font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="rounded-md p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Contact
          </Link>

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 text-white text-[11px] px-1">
              {cartCount}
            </span>
          </Link>

          {user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/orders");
              }}
              className="mt-2 w-full inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
            >
              <PackageIcon size={18} />
              My Orders
            </button>
          )}
        </div>
      </aside>

      {/* DESKTOP HEADER (unchanged but simple) */}
      <div className="hidden sm:block bg-white">
        <div className="mx-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-semibold text-slate-700"
            >
              <Image
                className="rounded-md"
                src={assets.logo}
                width={150}
                height={150}
                alt="Site logo"
              />
            </Link>

            <div className="flex items-center gap-4 lg:gap-8 text-slate-600">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>

              <form
                onSubmit={handleSearchSubmit}
                className="hidden xl:flex items-center w-72 text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full"
              >
                <Search size={18} className="text-slate-600" />
                <input
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                  type="text"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 text-slate-600"
              >
                <ShoppingCart size={18} />
                Cart
                <span className="absolute -top-1 left-3 text-[10px] text-white bg-slate-600 h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>

              {user ? (
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<PackageIcon size={16} />}
                      label="My Orders"
                      onClick={() => router.push("/orders")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <button
                  onClick={openSignIn}
                  className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        <hr className="border-gray-300" />
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  // Safe rating calculation (handles no ratings)
  const ratings = Array.isArray(product?.rating) ? product.rating : [];
  const avg =
    ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + (Number(curr?.rating) || 0), 0) /
        ratings.length
      : 0;
  const rounded = Math.round(avg);

  // First image or fallback
  const imgSrc = product?.images?.[0] || "/placeholder.png";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block w-[15rem]" // was: max-w-[15rem]
    >
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-fuchsia-400 via-violet-400 to-emerald-400 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-fuchsia-200/30">
        <div className="rounded-2xl bg-white h-full">
          {" "}
          {/* ensure full height if you need equal heights */}
          <div className="h-40 sm:h-48 w-full rounded-t-2xl bg-gradient-to-br from-fuchsia-50 via-sky-50 to-amber-50 flex items-center justify-center overflow-hidden">
            <Image
              src={imgSrc}
              width={500}
              height={500}
              alt={product?.name || "Product image"}
              className="h-28 sm:h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[1deg]"
              sizes="240px"
            />
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {product?.name}
                </p>
                <div className="mt-1 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      size={14}
                      className="text-transparent"
                      fill={rounded >= i + 1 ? "#00C950" : "#D1D5DB"}
                    />
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  {currency}
                  {Number(product?.price)?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 transition group-hover:ring-black/10" />
      </div>

      <style jsx>{`
        .group:hover > div {
          transform: translateY(-2px);
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;

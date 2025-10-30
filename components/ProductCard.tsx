import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { productDummyData } from "@/assets/assets";
import { productAverageRatings } from "@/lib/product-review-map";
import { StarIcon } from "lucide-react";

type Product = (typeof productDummyData)[0];

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

const ProductCard = ({ product }: { product: Product }) => {
  const productWithRating = productAverageRatings.find(
    (p) => p.id === product.id
  );

  const rating = productWithRating?.averageRating ?? 0;

  return (
    <Link
      href=""
      className="group max-xl:mx-auto transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="bg-[#F5F5F5] rounded-lg h-40 sm:h-68 sm:w-60 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <Image
          src={product.images[0]}
          width={500}
          height={500}
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-110 duration-300 transition-transform"
          alt={product.name}
        />
      </div>

      <div className="flex justify-between text-sm gap-3 text-slate-800 pt-2 max-w-60">
        <div>
          <p className="font-medium">{product.name}</p>

          <div className="flex items-center gap-1 mt-0.5">
            {Array(5)
              .fill("")
              .map((_, index) => {
                const fillColor =
                  rating >= index + 1
                    ? "#0d97d9"
                    : rating > index && rating < index + 1
                    ? "url(#half-star)"
                    : "#D1D5DB";

                return (
                  <StarIcon
                    key={index}
                    size={16}
                    className="text-transparent transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_3px_rgba(13, 151, 217, 0.5)]"
                    fill={fillColor}
                  />
                );
              })}

            <span className="text-xs text-gray-600 ml-1">{rating}</span>
          </div>
        </div>

        <p className="font-semibold">
          {currency}
          {product.price}
        </p>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="#0d97d9" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
      </svg>
    </Link>
  );
};

export default ProductCard;

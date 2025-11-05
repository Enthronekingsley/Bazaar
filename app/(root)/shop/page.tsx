"use client";

import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/hooks/redux-hook";
import Link from "next/link";
import React, { Suspense } from "react";

const ShopContent = () => {
  const products = useAppSelector((state) => state.product.list);

  return (
    <section
      className="
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
        flex flex-col lg:flex-row gap-6
        min-h-[70vh] my-6
      "
    >
      {/* Filter Sidebar */}
      <aside
        className="
          w-full lg:w-80 
          lg:sticky lg:top-24
          lg:self-start
        "
      >
        <Filter />
      </aside>

      {/* Product Section */}
      <main className="flex-1">
        <Link href="">
          <h1 className="text-xl sm:text-2xl text-slate-500 mb-6 flex items-center gap-2">
            All <span className="text-slate-700 font-medium">Products</span>
          </h1>
        </Link>

        <div
          className="
            grid 
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 
            gap-4 sm:gap-6 xl:gap-10
          "
        >
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </main>
    </section>
  );
};

const page = () => {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
};

export default page;

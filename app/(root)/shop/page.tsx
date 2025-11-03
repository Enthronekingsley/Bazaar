"use client";

import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/hooks/redux-hook";
import Link from "next/link";
import React, { Suspense } from "react";

const ShopContent = () => {
  const products = useAppSelector((state) => state.product.list);

  return (
    <section className="max-w-7xl min-h-[70vh] mx-auto px-6 flex gap-6">
      <div className="my-6">
        <Filter />
      </div>
      <div className="">
        <Link href="">
          <h1 className="text-2xl text-slate-500 my-6 flex items-center gap-2">
            All <span className="text-slate-700 font-medium">Products</span>
          </h1>
        </Link>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-12 mb-32">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
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

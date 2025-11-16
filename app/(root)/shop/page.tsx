"use client";

import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/hooks/redux-hook";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { MobileFilter } from "@/components/MobileFilter";
import { useProductFiltering } from "@/hooks/useProductFiltering";
import { Button } from "@/components/ui/button";

export interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: number[];
  inStock: boolean | null;
}

const ShopContent = () => {
  const products = useAppSelector((state) => state.product.list);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 200 },
    ratings: [],
    inStock: null,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  };

  const handleStockChange = (value: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      inStock: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 200 },
      ratings: [],
      inStock: null,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 200) count++;
    if (filters.ratings.length > 0) count += filters.ratings.length;
    if (filters.inStock !== null) count++;
    return count;
  };

  const filteredProducts = useProductFiltering(
    products,
    debouncedFilters,
    sortBy
  );

  return (
    <section className="max-w-7xl w-full min-h-[70vh] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center sm:items-start justify-between gap-6 lg:gap-8 overflow-x-hidden">
      <div className="my-6 hidden lg:block">
        <Filter
          filters={filters}
          setFilters={setFilters}
          handleCategoryChange={handleCategoryChange}
          handlePriceChange={handlePriceChange}
          handleRatingChange={handleRatingChange}
          handleStockChange={handleStockChange}
          clearAllFilters={clearAllFilters}
          getActiveFiltersCount={getActiveFiltersCount}
        />
      </div>

      <div className="flex-1">
        <Link href="">
          <h1 className="text-2xl text-slate-500 my-6 flex items-center gap-2">
            All <span className="text-slate-700 font-medium">Products</span>
          </h1>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="lg:hidden flex-1">
            <MobileFilter
              filters={filters}
              setFilters={setFilters}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
              handleRatingChange={handleRatingChange}
              handleStockChange={handleStockChange}
              clearAllFilters={clearAllFilters}
              getActiveFiltersCount={getActiveFiltersCount}
            />
          </div>

          <div className="flex items-center justify-end flex-1 gap-3">
            <Sort
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              productCount={filteredProducts.length}
            />
          </div>
        </div>

        <div
          className={`
          mb-32 transition-all duration-300
          ${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-2 xl:gap-12"
              : "flex flex-col items-center gap-6 px-4 sm:px-6 md:px-8"
          }
        `}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No products found
              </div>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearAllFilters} className="text-white mt-4">
                Clear All Filters
              </Button>
            </div>
          )}
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

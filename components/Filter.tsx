import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { categories } from "@/assets/assets";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: number[];
  inStock: boolean | null;
  sortBy: string;
}

const Filter = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [openSection, setOpenSections] = useState({
    categories: true,
    price: true,
    ratings: true,
    availability: true,
  });
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 200 },
    ratings: [],
    inStock: null,
    sortBy: "Featured",
  });

  const toggleSection = (section: keyof typeof openSection) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  return (
    <div className="">
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="flex justify-center items-center w-full p-6 border border-gray-300 bg-white cursor-pointer shadow-lg"
        >
          <span className="font-medium text-slate-500">Filters</span>
          <div>
            {isFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </Button>
      </div>

      <div
        className={`${
          isFilterOpen ? "block" : "hidden"
        } p-6 border border-gray-200 rounded-lg bg-white lg:block lg:w-80 shadow-lg`}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <Button
            onClick={() => toggleSection("categories")}
            variant="ghost"
            className="w-full flex justify-between items-center text-left cursor-pointer"
          >
            <h3 className="font-semibold text-gray-900 text-lg">Categories</h3>
            {openSection.categories ? <ChevronUp size={20} /> : <ChevronDown />}
          </Button>

          {openSection.categories && (
            <div className="flex flex-col space-y-2 mt-4">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-3">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="border border-gray-300  data-[state=checked]:text-white"
                  />
                  <Label htmlFor={category} className="text-sm text-gray-700">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <Button
            variant="ghost"
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between cursor-pointer text-left"
          >
            <h3 className="font-semibold text-gray-900 text-lg">Price Range</h3>
            {openSection.price ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </Button>

          {openSection.price && (
            <div className="flex flex-col w-full mb-2 mt-4">
              <div className="">
                {Array(1)
                  .fill(filters.priceRange)
                  .map((price, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>${price.min}</span>
                      <span>${price.max}</span>
                    </div>
                  ))}
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                />
                <Input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handlePriceChange("max", Number(e.target.value))
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;

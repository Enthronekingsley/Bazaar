import { Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <>
      <div className="relative w-full max-w-sm hidden xl:flex transition">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-4" />
        <Input
          type="text"
          placeholder="Search products"
          className="pl-10 rounded-2xl h-8 border-slate-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 focus:border-gray-400"
        />
      </div>
    </>
  );
};

export default SearchBar;

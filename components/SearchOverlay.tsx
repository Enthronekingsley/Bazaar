import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { History, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { categories } from "@/assets/assets";

const SearchOverlay = () => {
  const {
    closeSearch,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
  } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(recentSearches);

    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery.trim());
      console.log("Searching for:", searchQuery);
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    addToRecentSearches(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 animate-in fade-in duration-300">
      <div className="border border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image
                src={"/bazaar_logo.png"}
                alt="Bazaar"
                height={100}
                width={100}
                className="w-16 h-auto"
              />
              <span className="text-lg font-semibold text-gray-800">
                Search
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={closeSearch}
              className="hover:bg-gray-100 transition-colors"
            >
              <X size={28} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands and categories..."
            className="w-full pl-12 pr-4 text-sm sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:border-transparent"
            autoFocus
          />

          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </Button>
          )}
        </form>

        {searchQuery && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Suggestions
            </h3>

            <div className="flex flex-wrap gap-2">
              {categories.map((suggestion) => (
                <Button
                  key={suggestion}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {recentSearches.length > 0 && !searchQuery && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Recent Searches
              </h3>
              <Button
                variant="ghost"
                onClick={clearRecentSearches}
                className="text-sm text-primary hover:text-primary-100 transition-colors"
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-2 flex gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <History size={16} className="text-gray-400" />
                  <span className="text-gray-700 group-hover:text-gray-900">
                    {search}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Headphones", emoji: "🎧" },
                { name: "Speakers", emoji: "🔊" },
                { name: "Watch", emoji: "⌚" },
                { name: "Earbuds", emoji: "🎵" },
                { name: "Mouse", emoji: "🖱️" },
                { name: "Decoration", emoji: "🏡" },
                { name: "Camera", emoji: "📷" },
                { name: "Pen", emoji: "🖊️" },
                { name: "Theater", emoji: "🎭" },
                { name: "Cleaner", emoji: "🧹" },
              ].map((category) => (
                <Button
                  variant="ghost"
                  key={category.name}
                  onClick={() => setSearchQuery(category.name)}
                  className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">{category.emoji}</span>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;

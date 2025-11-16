"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);
  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const addToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      const searches = prev.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      );
      return [query, ...searches].slice(0, 5);
    });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
        searchQuery,
        setSearchQuery,
        clearRecentSearches,
        recentSearches,
        addToRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

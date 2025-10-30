import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Search, ShoppingCart } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link href="/">
            <Image
              src={"/bazaar_logo.png"}
              alt="bazaar"
              height={100}
              width={100}
            />
          </Link>

          <div className="flex items-center lg:gap-8 gap-4">
            <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
              <Link href="/">Home</Link>
              <Link href="/">Shop</Link>
              <Link href="/">About</Link>
              <Link href="/">Contact</Link>
              <SearchBar />
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
              <Search className="xl:hidden transition" size={18} />

              <Link href="" className="relative">
                <ShoppingCart size={18} />
                <p className="absolute bottom-3 left-3 text-[8px] bg-slate-600 text-white px-1 rounded-full">
                  0
                </p>
              </Link>

              <Button className="px-7 py-2 max-sm:py-1 max-sm:px-5 max-sm:h-8 text-white max-sm:text-sm rounded-full bg-primary hover:bg-primary-100 cursor-pointer transition-all">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

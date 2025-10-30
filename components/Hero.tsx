"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets/assets";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 lg:px-12 py-24">
      <div className="absolute top-0 left-0 w-[70%] h-[90%] bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-br-[4rem] -z-10" />

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-slate-800"></div>
            <p className="uppercase text-xs font-semibold tracking-widest text-slate-600">
              New Arrival 2025
            </p>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
            Redefine your <br /> <span className="text-orange-500">style.</span>
          </h1>

          <p className="text-gray-600 max-w-md text-lg">
            Explore our latest collection designed to merge comfort with modern
            sophistication. Crafted with premium materials for every occasion.
          </p>

          <div className="flex items-center gap-4">
            <Button className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:scale-105 transition">
              Explore Now
            </Button>
            <button className="flex items-center gap-2 text-slate-800 font-medium hover:underline cursor-pointer hover:translate-x-2 duration-500">
              View Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10" />

          {[
            assets.hero_product_img1,
            assets.hero_product_img2,
            assets.product_img5,
            assets.product_img6,
          ].map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl shadow-lg group flex items-center justify-center"
            >
              <Image
                src={src}
                alt={`Product ${index + 1}`}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-6 mt-20 text-slate-500 text-sm opacity-70">
        <p>Trusted by 500+ fashion stores</p>
        <p>Free global shipping</p>
      </div>
    </section>
  );
}

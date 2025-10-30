import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import LatestProducts from "@/components/LatestProducts";
import Newsletter from "@/components/Newsletter";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestProducts />
      <BestSelling />
      <Newsletter />
    </div>
  );
};

export default Home;

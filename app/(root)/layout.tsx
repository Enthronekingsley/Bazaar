import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default RootLayout;

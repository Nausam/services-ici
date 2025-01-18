import React from "react";

import Hero from "@/components/Hero";
import Services from "@/components/Services";

const Home = () => {
  return (
    <div>
      <div
        className="bg-gradient-to-b from-blue-100 to-blue-50  overflow-hidden relative"
        dir="rtl"
      >
        {/* Faded Gradient Glow Effect */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-full blur-2xl opacity-30"></div>
          <div className="absolute -bottom-60 left-72 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
        </div>

        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <Services />
      </div>
    </div>
  );
};

export default Home;

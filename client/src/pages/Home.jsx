import React, { useState } from "react";
import logo from '../assets/images/logo.jpg';
import banner from '../assets/images/banner.jpg';
import About from './About';

const Home = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-3xl font-bold text-indigo-900">
          Modest & Modern - Fashion for Every Woman
        </h2>

        <p className="mt-4 text-lg text-slate-700 max-w-3xl">
          Elegant styles for Hijabi & Non-Hijabi women, crafted for confidence & comfort.
        </p>

        <blockquote className="mt-6 italic text-slate-600 border-l-4 pl-4 border-indigo-300">
          "Timeless Modesty, Effortless Style."
        </blockquote>

        <p className="mt-4 text-slate-700">
          Discover a collection designed for every woman — whether you wear a hijab or not.
          Chic, comfortable, and confidence-boosting fashion that celebrates your unique style.
        </p>

        {/* Banner Image */}
        <div className="mt-8 relative overflow-hidden">
          <img
            src={banner}
            alt="Fashion Collection"
            className="w-full h-[500px] object-cover object-center rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="mt-40">
        <About />
      </div>
    </>
  );
};

export default Home;

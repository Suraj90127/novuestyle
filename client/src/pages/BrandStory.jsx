import React, { useEffect } from "react";
import img1 from "../assets/banner/banmen1.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const BrandStory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f9fafc] text-[#111827] font-sans">
      <Header />

      <div className="mt-[140px]">
        {/* Banner */}
        <div className="relative">
          <img
            src={img1}
            alt="Brand Banner"
            className="w-full h-auto object-cover max-h-[500px]"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white px-4 text-center">
              Our <span className="text-[#5987b8]">Brand Story</span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Crafted With Purpose, Worn With Pride
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            Launched in 2021,{" "}
            <span className="text-[#c0952b] font-semibold">Print Kalvin</span>{" "}
            was born from a simple idea: to redefine everyday fashion by putting
            creativity, comfort, and community first. What started in a small
            garage has grown into a trusted name in bold streetwear and
            personalized tees.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            Each product is crafted with premium cotton, printed with care, and
            designed to tell a story — yours. With more than 50,000 satisfied
            customers and hundreds of daily shipments, our commitment to quality
            and customer satisfaction remains our north star.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            We’re more than just a T-shirt brand. We’re a creative collective.
            Whether you’re expressing your style, building your brand, or
            gifting something unforgettable, Print Kalvin is here to help you
            make your mark — one shirt at a time.
          </p>

          <div className="mt-10">
            <button className="bg-[#c0952b] hover:bg-[#daad39] text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default BrandStory;

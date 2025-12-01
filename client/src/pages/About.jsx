import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import {
  FaTshirt,
  FaLeaf,
  FaPalette,
  FaUsers,
  FaShippingFast,
} from "react-icons/fa";
import { FiCheck, FiUsers, FiAward, FiPackage } from "react-icons/fi";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f9fafc] text-[#111827] font-sans">
      <Header />

      <div className="mt-[100px] md:mt-[140px]">
        {/* Hero Banner */}
        <div className="relative">
          <img
            src="https://i.ibb.co/FLdz9SxX/KELVINBAN7.jpg"
            alt="About Print Kalvin"
            className="w-full h-auto object-cover max-h-[500px]"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
              Our Story, <span className="text-[#5987b8]">Your Style</span>
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 md:px-10 py-12 space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#111827] mb-4">
              About <span className="text-[#c0952b]">Print Kalvin</span>
            </h2>
            <div className="w-24 h-1 bg-[#5987b8] mx-auto"></div>
          </div>

          <div className="space-y-8 text-gray-700 text-lg md:text-xl leading-relaxed">
            <p>
              Welcome to{" "}
              <strong className="text-[#c0952b]">Print Kalvin</strong> — your
              one-stop destination for trendy, bold, and customizable T-shirts
              that express who you are. Born out of a passion for creativity and
              comfort, Print Kalvin was founded with a mission to empower
              individuals through expressive fashion.
            </p>
            <p>
              At Print Kalvin, we believe fashion should be fun, fearless, and
              affordable. Our collections are designed with love in India and
              are made from high-quality, breathable cotton — ensuring you not
              only look great but feel amazing every time you wear one.
            </p>
          </div>

          {/* Values Section */}
          <div className="py-12">
            <h3 className="text-2xl md:text-4xl font-bold text-center mb-12">
              Our Core <span className="text-[#c0952b]">Values</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaTshirt />,
                  color: "#5987b8",
                  title: "Quality Craftsmanship",
                  desc: "Premium fabrics and durable prints that last wash after wash.",
                },
                {
                  icon: <FaLeaf />,
                  color: "#10b981",
                  title: "Eco-Friendly",
                  desc: "Sustainable materials and ethical production practices.",
                },
                {
                  icon: <FaPalette />,
                  color: "#8b5cf6",
                  title: "Creative Freedom",
                  desc: "Endless designs and customization options to match your vibe.",
                },
                {
                  icon: <FaUsers />,
                  color: "#ef4444",
                  title: "Community First",
                  desc: "We listen to our customers and grow together.",
                },
                {
                  icon: <FaShippingFast />,
                  color: "#facc15",
                  title: "Fast & Reliable",
                  desc: "Quick shipping and hassle-free returns.",
                },
              ].map((val, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`text-[${val.color}] text-4xl mb-4`}>
                    {val.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{val.title}</h4>
                  <p className="text-gray-600">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-1 text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-6">
              Join Our <span className="text-[#c0952b]">Community</span>
            </h3>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700 mb-8">
              Be part of our growing family and get exclusive offers, early
              access to new designs, and style tips.
            </p>
            <button className="bg-[#c0952b] hover:bg-[#daad39] text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Join #PrintKalvinTribe
            </button>
          </div>
        </div>
      </div>

      {/* Heritage Section */}
      <div className="relative  ">
        <div className="h-[50vh] min-h-[400px] bg-gray-100"></div>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-normal text-white mb-4">
              Crafting Quality Apparel{" "}
              <span className="font-medium">Since 2015</span>
            </h1>
            <div className="w-20 h-0.5 bg-[#c0952b] mx-auto my-1"></div>
            <p className="text-black text-lg md:text-xl">
              Premium fabrics, ethical production, and timeless designs
            </p>
          </div>
        </div>
      </div>

      {/* Heritage Content */}
      <div className="mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
        <section className="mb-24 md:mb-32">
          <div className="grid items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-normal mb-6">
                Our <span className="font-medium">Heritage</span>
              </h2>
              <div className="w-16 h-0.5 bg-[#c0952b] mb-8"></div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Founded in Mumbai, Print Kalvin began as a passion project
                between two design school graduates. What started as a small
                screen printing studio has grown into a respected apparel brand
                known for its commitment to quality and ethical production.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We maintain direct relationships with our fabric mills and
                manufacturing partners to ensure every garment meets our
                exacting standards. Each collection reflects our philosophy of
                creating versatile, long-lasting pieces.
              </p>
              <ul className="space-y-3 mt-8">
                {[
                  "Ethically sourced materials",
                  "Small batch production",
                  "Quality craftsmanship",
                  "Sustainable packaging",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="text-[#4b5563] mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Our <span className="font-medium">Commitments</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#c0952b] mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Quality",
                description:
                  "Every garment undergoes rigorous quality checks at multiple stages",
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Ethics",
                description:
                  "Fair wages and safe working conditions for all partners",
              },
              {
                icon: <FiPackage className="w-8 h-8" />,
                title: "Sustainability",
                description:
                  "Eco-friendly materials and minimal waste production",
              },
              {
                icon: <FiCheck className="w-8 h-8" />,
                title: "Transparency",
                description:
                  "Clear communication about our materials and processes",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="text-gray-800 mb-4">{item.icon}</div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gray-50 rounded-xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6">
            Ready to experience{" "}
            <span className="font-medium">Print Kalvin</span>?
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust us for their
            wardrobe essentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors">
              Shop Collection
            </button>
            <button className="border border-gray-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default About;

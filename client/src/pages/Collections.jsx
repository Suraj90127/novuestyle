import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img1 from "../assets/banner/banner1.jpg";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../store/reducers/homeReducer";
import { Link } from "react-router-dom";

const Collections = () => {
  const { categorys } = useSelector((state) => state.home);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  return (
    <div className="bg-[#ecf1f2]">
      {/* Header with no margin bottom */}
      <div className="m-0 p-0">
        <Header />
      </div>

      {/* Banner with no margin or padding above */}
      <div className="mt-[120px] p-0">
        <img
          src={img1}
          alt="banner"
          className="w-full h-auto object-cover m-0 p-0"
        />
      </div>

      {/* Category Grid */}
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categorys.map((product, index) => (
            <Link key={index} to={`/category-data/${product.slug}`}>
              <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-500 hover:scale-110"
                />
              </div>
              <p className="text-center text-xs md:text-base font-semibold mt-2">
                {product.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />

      {/* Mobile Footer */}
      <div className="fixed bottom-0 w-full block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default Collections;

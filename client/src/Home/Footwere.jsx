import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getheadingsecond } from "../store/reducers/homeReducer";

const Eveleye = ({ products, openLoginModal, categorys }) => {
  const dispatch = useDispatch();
  // Assuming the data structure from your reducer gives you the category collection
  // structure similar to the image (e.g., Hoodies, T-Shirts, etc.)
  const { secondheading } = useSelector((state) => state.home);

  // Safely access the collection data (assuming it's an array with the first element)
  const data = Array.isArray(secondheading) ? secondheading[0] : secondheading;

  useEffect(() => {
    dispatch(getheadingsecond());
  }, [dispatch]);

  console.log("categorys",categorys);
  

  const ProductRow = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-3">
      {categorys[0]?.subCategory?.map((product, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg  hover:shadow-lg transition-shadow duration-300"
        >
          <div className="w-full md:h-[250px] aspect-square overflow-hidden relative  md:p-1">
            <Link
              to={`/sub-category-data/${categorys[0]?.slug}/${product.sslug}`}
            >
              <img
                src={product.simage}
                alt={product.sname}
                loading="lazy"
                className="w-full h-full object-cover rounded-md"
              />
            </Link>
          </div>

          {/* Category Name */}
          <div className="py-2">
            <h3 className="text-sm md:text-base text-center font-medium text-gray-700 truncate">
              {product.sname}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full sm:w-[95%] md:w-[90%] mx-auto md:px-4 py-8 md:pt-12">
      <div className="text-center mb-8 md:mb-6">
        <h1 className="text-2xl md:text-2xl font-semibold text-heading">
          {/* Use "Shop by Collection" as the default text */}
          Shop by Collection
        </h1>
      </div>

      <ProductRow />
    </div>
  );
};

export default Eveleye;

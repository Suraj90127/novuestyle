import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import {
  get_wishlist_products,
  remove_wishlist,
} from "../store/reducers/cardReducer";
import { customer_login } from "../store/reducers/authReducer";
import { toast } from "react-toastify";

const Whishlist = () => {
  const { wishlist } = useSelector((state) => state.card);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      dispatch(customer_login());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      dispatch(get_wishlist_products({ userId: userInfo.id }));
    }
  }, [dispatch]);

  const removeProduct = () => {
    dispatch(remove_wishlist({ wishlistId: wishlist._id }));
  };

  if (!wishlist) {
    return <div>Loading wishlist...</div>;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#ecf1f2] overflow-hidden">
      <Header />
      <div className="relative">
        <img
          src="https://i.ibb.co/FLdz9SxX/KELVINBAN7.jpg"
          alt="Privacy Banner"
          className="w-full h-auto object-cover mt-28 max-h-[500px]"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white px-4 text-center">
            Whishlist <span className="text-[#5987b8]">Product</span>
          </h1>
        </div>
      </div>
      <div className="font-sans max-w-6xl mx-auto p-6 ">
        <table className="w-full border-collapse overflow-auto">
          <thead>
            <tr className="text-center border border-gray-300">
              <th className=" p-3 text-sm md:text-base ">Product</th>
              <th className=" p-3 text-sm md:text-base ">Unit Price</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item, index) => (
              <tr
                key={index}
                className="text-center border border-gray-300 text-gray-700"
              >
                <Link to={`/product/details/${item.slug}`}>
                  <td className="flex items-center p-3 text-sm ">
                    <img
                      src={item?.image}
                      alt={item.name}
                      className="h-10 w-10 md:w-20 md:h-20 mr-4"
                    />
                    {item.name}
                  </td>
                </Link>
                <td className=" p-3 text-sm ">
                  {" "}
                  ₹{" "}
                  {item.price - Math.floor((item.price * item.discount) / 100)}
                </td>
                <td className="p-3 ">
                  <button
                    onClick={() => dispatch(remove_wishlist(item._id))}
                    className="text-lg font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className='w-full p-4 border border-gray-300 mb-10'>

      <button className="bg-primary text-white px-4 py-2">
        CLEAR CART
      </button>
      </div> */}
      </div>
      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default Whishlist;

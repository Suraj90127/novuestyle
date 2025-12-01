import React, { useEffect, useState } from "react";
import img2 from "../assets/CH_AA_26-06-2024_Gift_Store.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { get_gifts } from "../store/reducers/giftReducer";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  add_to_card,
  messageClear,
  add_to_wishlist,
} from "../store/reducers/cardReducer";


const GiftStore = () => {
  const dispatch = useDispatch();
  const { gifts, totalgift } = useSelector((state) => state.gift);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [hoveredProduct, setHoveredProduct] = useState(null);

  const add_card = async (id) => {
    if (userInfo) {
      try {
        const response = await dispatch(
          add_to_card({
            userId: userInfo.id,
            quantity: 1,
            productId: id,
          })
        ).unwrap();

        // If the response is successful
        if (response.message) {
          toast.success(response.message);
          dispatch(messageClear());
        }
      } catch (error) {
        // If there's an error
        toast.error(error.error || "An error occurred");
        dispatch(messageClear());
      }
    } else {
      openLoginModal();
    }
  };

  const add_wishlist = async (pro) => {
    try {
      // Use unwrap() to handle both success and error cases
      const response = await dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: pro._id,
          name: pro.name,
          price: pro.price,
          image: pro.images[0],
          discount: pro.discount,
          rating: pro.rating,
          slug: pro.slug,
        })
      ).unwrap();

      // Handle success case
      toast.success(response.message);
      dispatch(messageClear());
    } catch (error) {
      // Handle error case
      toast.error(error.error || "An error occurred");
      dispatch(messageClear());
    }
  };

  useEffect(() => {
    dispatch(get_gifts());
  }, [dispatch]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="mt-[140px] md:mt-[140px]">
        <img src={img2} alt="banner" className="w-full h-auto" />
      </div>
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 ">
       
        </div>
      </div>
      <div className="w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 ">
          {gifts.map((p, i) => (
            <div
              key={p._id}
              className="border rounded-lg overflow-hidden transition duration-500 relative"
              onMouseEnter={() => setHoveredProduct(i)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative">
                {p.discount ? (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold">
                    -{p.discount}%
                  </div>
                ) : (
                  ""
                )}

                {/* Heart icon on hover */}
                <div
                  className={`absolute top-4 right-4 shadow rounded-full p-2 transition-opacity duration-300 `}
                >
                  <CiHeart
                    onClick={() => add_wishlist(p)}
                    className=" text-xl cursor-pointer text-yellow-200 z-50"
                  />
                </div>
                <Link to={`/product/details/${p.slug}`}>
                  <img
                    src={hoveredProduct === i ? p.images[1] : p.images[0]}
                    alt={p.name}
                    width={300}
                    height={300}
                    className="w-full  sm:h-[30vh] md:h-[35vh] lg:h-[40vh] object-cover overflow-hidden"
                  />
                </Link>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => add_card(p._id)}
                  className="bg-primary-gradient text-[10px] md:text-sm font-[500] text-white w-full py-2 rounded-md hover:bg-blue-600"
                >
                  ADD TO CART
                </button>
                <h3 className="mb-2 text-sm md:text-base text-text text-center">
                  {p.name}
                </h3>
                <div className="flex justify-center items-center space-x-2 text-sm md:text-base">
                  <span className="text-gray-500 line-through">
                    ₹{p.price.toFixed(2)}
                  </span>
                  <span className="text-red-500 font-[500]">
                    ₹ {p.price - Math.floor((p.price * p.discount) / 100)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-8">
          <button className="text-black border border-black py-2 px-6 hover:text-white hover:bg-black transition-all">
            View More
          </button>
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default GiftStore;

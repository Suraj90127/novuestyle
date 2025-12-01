import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducer";
import { Link, useNavigate } from "react-router-dom";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { messageClear } from "../store/reducers/authReducer";
import Ratings from "./Ratings";
import { CiHeart } from "react-icons/ci";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";

const MayLike = ({ openLoginModal }) => {
  const { products } = useSelector((state) => state.home);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { successMessage, errorMessage } = useSelector((state) => state.card);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_products({ page: 1, limit: 500 }));
  }, [dispatch]);

  const add_wishlist = async (pro) => {
    try {
      // Use unwrap() to handle both success and error cases
      const response = await dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: pro._id,
          name: pro.name,
          price: pro.price,
          image: pro.images[0].url,
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
  // useEffect(() => {
  //   if (successMessage) {
  //     toast.success(successMessage);
  //     dispatch(messageClear());
  //   }
  //   if (errorMessage) {
  //     toast.error(errorMessage);
  //     dispatch(messageClear());
  //   }
  // }, [errorMessage, successMessage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full md:w-[90%] mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Product May You Like
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
        {products?.slice(7, 15).map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 "
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 h-full">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                {i === 1 && (
                  <span className="absolute top-0 left-0 bg-yellow-400 text-xs font-bold px-2 py-1 uppercase z-10">
                    Bestseller
                  </span>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>
                    {p.displayRating} | {Math.floor(Math.random() * 10) + 1}
                  </span>
                </div>
                <Link to={`/product/details/${p.slug}`}>
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => add_wishlist(p)}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100
                      }`}
                >
                  <Heart className={`w-4 h-4 `} strokeWidth={2} />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <Link to={`/product/details/${p.slug}`}>
                  <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                    {p.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold text-gray-900">
                    ₹{p.price - Math.floor((p.price * (p.discount || 0)) / 100)}
                  </span>
                  {p.discount > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{p.price}
                      </span>
                      <span className="text-sm font-semibold text-green-600 ml-1">
                        {p.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Lowest price in last 30 days
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-center items-center mt-8">
                <button className="text-blacktext border border-text py-2 px-6 hover:text-white hover:bg-blacktext transition-all">View More</button>
            </div> */}
    </div>
  );
};

export default MayLike;

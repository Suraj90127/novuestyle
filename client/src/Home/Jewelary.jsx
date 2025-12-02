import React, { useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import {
  add_to_card,
  messageClear,
  add_to_wishlist,
} from "../store/reducers/cardReducer";
import { useEffect } from "react";
import { getheadingfivth } from "../store/reducers/homeReducer";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";

const Jewelary = ({ products, openLoginModal }) => {
  console.log("productssssss",products);
  
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { categorys, fivthheading } = useSelector((state) => state.home);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );

  const scrollContainerRef = useRef(null);
  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    dispatch(getheadingfivth());
  }, [dispatch]);


  const add_wishlist = async (pro) => {
    // ... (Your existing add_wishlist logic)
    if (!userInfo) {
      openLoginModal();
      return;
    }

    try {
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

      toast.success(response.message);
      dispatch(messageClear());
    } catch (error) {
      toast.error(error.error || "An error occurred");
      dispatch(messageClear());
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const hoodieSub = products.filter((p) => p.subCategory === "Sweatshirt");
  const hoodieCat = products.filter((p) => p.category === "Sweatshirt");

  const filteredProducts = [...hoodieSub, ...hoodieCat];

  const ProductRow = () => (
    <div className="relative mt-10">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left", scrollContainerRef)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll("right", scrollContainerRef)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-scroll scrollbar-hide p-1 scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {filteredProducts?.map((p, i) => (
          <div
            key={p._id}
            className="flex-shrink-0 w-[45%] sm:w-[50%] md:w-[23%] lg:w-[24.5%] xl:w-[24.5%]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                {i === 1 && (
                  <span className="absolute top-0 left-0 bg-yellow-400 text-xs font-bold px-2 py-1 uppercase z-10">
                    Bestseller
                  </span>
                )}
                <div className="absolute bottom-2 left-2 bg-gray-300 bg-opacity-70 text-white text-xs font-semibold px-2 py-1  flex items-center gap-1 z-10">
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
                  className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                    isInWishlist(p._id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInWishlist(p._id) ? "fill-current" : ""
                    }`}
                    strokeWidth={2}
                  />
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
                    ₹{p.finalPrice}
                  </span>
                  {p.discount > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{p.price}
                      </span>
                      <span className="text-sm font-semibold text-green-600 ml-1">
                        ₹{p.discount}% OFF
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
        <div className="w-4 flex-shrink-0"></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-gray-200">
        <banner>
          {/* mobile screen */}
          <div className="md:hidden">
            <img
              src="https://i.ibb.co/Hfb1Pswk/banner8.png"
              alt="Promotional Banner"
              className="w-full h-full md:h-[400px] object-cover rounded-lg"
            />
          </div>
          {/* large screen */}
          <div className="hidden md:block">
            <img
              src="https://i.ibb.co/qYXSRrt3/banner7.png"
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </banner>
      </div>
      <div className="w-[100%] md:w-[93%] mx-auto px-2 py-1">
        <div className="text-center mb-3 md:mb-8">
          <h1 className="text-xl md:text-4xl font-semibold text-heading">
            Sweatshirt Collection
          </h1>
        </div>

        <ProductRow />
      </div>
    </div>
  );
};

export default Jewelary;

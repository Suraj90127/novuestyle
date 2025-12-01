import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products, getheadingthird } from "../store/reducers/homeReducer";
import { Link } from "react-router-dom";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { toast } from "react-toastify";
import { messageClear } from "../store/reducers/authReducer";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

// Helper function to simulate a random rating for products that don't have one
const getSimulatedRating = (name) => {
  // Simple hash based on product name to give a consistent "simulated" rating
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (4.0 + (hash % 6) / 10).toFixed(1); // Gives a rating between 4.0 and 4.5
};

const Products1 = ({ openLoginModal }) => {
  const { products, thirdheading } = useSelector((state) => state.home);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);
  const scrollContainerRef1 = useRef(null);
  const scrollContainerRef2 = useRef(null);

  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dispatch = useDispatch();

  const data = Array.isArray(thirdheading) ? thirdheading[0] : thirdheading;

  useEffect(() => {
    dispatch(get_products({ page: 1, limit: 500 }));
    dispatch(getheadingthird());
  }, [dispatch]);

  // --- Card Action Handlers (Kept the same) ---
  const add_card = async (id) => {
    // ... (Your existing add_card logic)
    if (userInfo) {
      try {
        const response = await dispatch(
          add_to_card({
            userId: userInfo.id,
            quantity: 1,
            productId: id,
          })
        ).unwrap();

        if (response.message) {
          toast.success(response.message);
          dispatch(messageClear());
        }
      } catch (error) {
        toast.error(error.error || "An error occurred");
        dispatch(messageClear());
      }
    } else {
      openLoginModal();
    }
  };

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
  let productdata = [];
  const filterProducts = products.filter((product) => product.section === 1);
  if (filterProducts?.length > 1) {
    productdata = filterProducts;
  } else {
    productdata = products;
  }


  const handleProductClick = async (product) => {
    // console.log("product from de", product);

    // Fire meta event
    await sendMetaEventSafe({
      eventType: "AddToCart",
      price: product.price,
      order: null,
      products: product,
      userInfo: userInfo,
    });

    // The Link will handle navigation naturally
  };
  // console.log("products111", productdata);

  return (
    <div className="md:w-[90%] sm:w-[95%] mx-auto md:px-4 py-8 md:pt-12 sm:pt-0">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-10 sm:mb-2">
        <h2 className="text-2xl md:text-2xl font-semibold text-gray-900">
          See the latest
        </h2>
        <p className="text-sm md:text-base text-gray-500">Handpicked for you</p>
      </div>

      {/* --- Slider Container --- */}
      {/* ====== First Slider Section ====== */}
      <div className="relative md:mt-10 sm:pt-2">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left", scrollContainerRef1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right", scrollContainerRef1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef1}
          className="flex md:space-x-4 sm:space-x-2 overflow-x-scroll scrollbar-hide p-1 scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {productdata.slice(0, 16).map((p, i) => (
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
                  <Link onClick={() => handleProductClick(p)}
                    to={`/product/details/${p.slug}`}>
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => add_wishlist(p)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${isInWishlist(p._id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(p._id) ? "fill-current" : ""
                        }`}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <Link onClick={() => handleProductClick(p)}
                    to={`/product/details/${p.slug}`}>
                    <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {p.price -
                        Math.floor((p.price * (p.discount || 0)) / 100)}
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

      {/* ====== Second Slider Section ====== */}
      <div className="relative md:mt-10 mt-5">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left", scrollContainerRef2)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right", scrollContainerRef2)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors hidden md:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef2}
          className="flex md:space-x-4 sm:space-x-2 overflow-x-scroll scrollbar-hide p-1 scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Reuse same product cards */}
          {productdata.slice(10, 32).map((p, i) => (
            <div
              key={p._id + "-second"}
              className="flex-shrink-0 w-[45%] sm:w-[50%] md:w-[23%] lg:w-[24.5%] xl:w-[24.5%]"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* same card design */}
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
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
                  {/* // In your JSX */}
                  <Link
                    onClick={() => handleProductClick(p)}
                    to={`/product/details/${p.slug}`}
                  >
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => add_wishlist(p)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${isInWishlist(p._id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(p._id) ? "fill-current" : ""
                        }`}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <div className="p-3">
                  <Link onClick={() => handleProductClick(p)}
                    to={`/product/details/${p.slug}`}>
                    <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {p.price -
                        Math.floor((p.price * (p.discount || 0)) / 100)}
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

      {/* --- End Slider Container --- */}

      {/* "Shop All Products" Button */}
      <div className="flex justify-center mt-10 md:mt-16">
        <Link to="/product">
          <button className="bg-white border-2 border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 font-medium py-2 px-6 rounded-md text-sm tracking-wide">
            See All Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Products1;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products, getheadingfourth } from "../store/reducers/homeReducer";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { toast } from "react-toastify";
import { messageClear } from "../store/reducers/authReducer";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"; // Import Star for the rating badge
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

// Helper function to simulate a random rating (consistent with the previous design)
const getSimulatedRating = (name) => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (4.0 + (hash % 6) / 10).toFixed(1); // Gives a rating between 4.0 and 4.5
};

const Products1 = ({ openLoginModal }) => {
  const { products, fourthheading } = useSelector((state) => state.home);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  // Using products directly here, as Productsdata was not used to render
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
  const navigate = useNavigate();

  const data = Array.isArray(fourthheading) ? fourthheading[0] : fourthheading;
  // console.log("data", data);

  const hoodieSub = products.filter((p) => p.subCategory === "Hoodie");
  const hoodieCat = products.filter((p) => p.category === "Hoodie");

  const filteredProducts = [...hoodieSub, ...hoodieCat];

  // console.log("products111111", products);

  // console.log("filteredProducts11111", filteredProducts);

  useEffect(() => {
    // Only fetching the necessary products or pagination if applicable
    dispatch(get_products());
    dispatch(getheadingfourth());
  }, [dispatch]);

  // --- Utility Functions ---

  const add_wishlist = async (pro) => {
    if (!userInfo) {
      openLoginModal(); // Ensure user is logged in for wishlist
      return;
    }

    try {
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

  // Prepare products with calculated final price and a display rating

  const processedProducts = filteredProducts.map((p) => ({
    ...p,
    finalPrice: p.price - Math.floor((p.price * (p.discount || 0)) / 100),
    savings: Math.floor((p.price * (p.discount || 0)) / 100),
    // Use actual rating if available, otherwise simulate
    displayRating: p.rating || getSimulatedRating(p.name),
  }));


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

  return (
    <div>
      <div className="bg-gray-200">
        <banner>
          <div className="md:hidden">
            <img
              src="https://i.ibb.co/cc7WRzrG/Banner-9.png"
              alt="Promotional Banner"
              className="w-full h-full md:h-[400px] object-cover rounded-lg"
            />
            <img
              src="https://i.ibb.co/dJjbw8QD/image2.png"
              alt="Promotional Banner"
              className="w-full h-full md:h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="hidden md:block">
            <img
              src="https://i.ibb.co/x8PvbQ8w/banner-5.png"
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <img
              src="https://i.ibb.co/R4ptKW0g/image2.png"
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </banner>
      </div>
      <div className="md:w-[90%] sm:w-[95%] mx-auto md:px-4 md:py-8 sm:py-4 sm:pt-5 md:pt-12">
        {/* Header Section */}
        <div className="text-center sm:mb-3 md:mb-10">
          <h2 className="text-2xl md:text-2xl font-semibold text-gray-900">
            New Arrivals Hoodie
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            Handpicked for you
          </p>
        </div>

        {/* --- Slider Container --- */}
        {/* ====== First Slider Section ====== */}
        <div className="relative sm:mt-2 md:mt-10">
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
            {processedProducts.slice(0, 9).map((p, i) => (
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

        {/* ====== Second Slider Section ====== */}
        <div className="relative mt-10">
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
            {processedProducts.slice(9, 16).map((p, i) => (
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
                  <div className="p-3">
                    <Link onClick={() => handleProductClick(p)}
                      to={`/product/details/${p.slug}`}>
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
    </div>
  );
};

export default Products1;

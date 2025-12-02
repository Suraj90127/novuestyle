

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_category, get_products } from "../store/reducers/homeReducer";
import { add_to_wishlist } from "../store/reducers/cardReducer";
import { messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Star, ShoppingCart, X } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const CategoriesData = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

  // console.log("showComingSoonPopup",showComingSoonPopup);
  // console.log("hasDataLoaded",hasDataLoaded);
  

  const {
    products,
    categorys,
  } = useSelector((state) => state.home);

  console.log("products",products);
  

  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  let img;
  let img2;

  if (slug === "Male") {
    img = "https://i.ibb.co/fzkzKCT1/banner7new.png";
    img2 = "https://i.ibb.co/23HNPKTv/banner7-phone-size.png";
  } else if (slug === "Female") {
    img = "https://i.ibb.co/mCQkS4s5/banner-11.png";
    img2 = "https://i.ibb.co/mC9fvs4g/banner-11-phone-size.png";
  } else if (slug === "Hoodie") {
    img = "https://i.ibb.co/p6mWg0md/banner9.png";
    img2 = "https://i.ibb.co/Q3sDSksK/banner.png";
  } else if (slug === "Sweatshirt") {
    img = "https://i.ibb.co/0yM63wnP/banner-10.png";
    img2 = "https://i.ibb.co/jkRYs5pK/banner-10-phone-size.png";
  } else if (slug === "Jacket") {
    img = "https://i.ibb.co/mCQkS4s5/banner-11.png";
    img2 = "https://i.ibb.co/mC9fvs4g/banner-11-phone-size.png";
  } else if (slug === "Sweetpant") {
    img = "https://i.ibb.co/DP9vJ8c2/banner-12.png";
    img2 = "https://i.ibb.co/p6n2rCWp/banner-12-phone-size.png";
  } else if (slug === "Premium-Hoodie") {
    img = "https://i.ibb.co/rRCs1tJF/PREMIUM-BANNER.png";
    img2 = "https://i.ibb.co/W4h8Srb9/phone-size.png";
  } else {
    img = "https://i.ibb.co/DP9vJ8c2/banner-12.png";
    img2 = "https://i.ibb.co/p6n2rCWp/banner-12-phone-size.png";
  }

  useEffect(() => {
    setIsLoading(true);
    dispatch(get_products({ page: 1, limit: 500 }));
    dispatch(get_category());
  }, [dispatch]);

  // Check when data is loaded
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
      setHasDataLoaded(true);
      
      // Check if products are empty for this category after data loads
      setTimeout(() => {
        if (firstHalfProducts.length === 0) {
          setShowComingSoonPopup(true);
        }
      }, 200);
    }
  }, [products, categorys]);

  const normalizedSlug = slug.replace(/-/g, " ").toLowerCase();

  const subcat = categorys.find(
    (cat) => cat.name.toLowerCase() === normalizedSlug
  );

  const add_wishlist = async (pro) => {
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

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openForgetModal = () => setForgetModalOpen(true);
  const openRegisterModal = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setRegisterModalOpen(false);
  const closeForgetModal = () => setForgetModalOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let firstHalfProducts = [];
  if (slug === "Male" || slug === "Female") {
    firstHalfProducts = products.filter((product) => product.category === slug);
  } else {
    firstHalfProducts = products.filter(
      (product) => product.category === slug || product.subCategory === slug
    );
  }


  console.log("firstHalfProducts",firstHalfProducts);
  

  const handleShopNow = () => {
    setShowComingSoonPopup(false);
    navigate("/");
  };

  const handleClosePopup = () => {
    setShowComingSoonPopup(false);
  };

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-64 bg-gray-200"></div>
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />

      {/* Coming Soon Popup */}
      {showComingSoonPopup && hasDataLoaded && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#5987b8] to-[#2c5e93] p-6">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Coming Soon!</h2>
                <p className="text-blue-100">
                  Exciting products are on their way
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {slug.replace(/-/g, " ")} Products
                </h3>
                <p className="text-gray-600 mb-4">
                  We're working on amazing {slug.replace(/-/g, " ")} products that will be available soon.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Launch Progress</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#5987b8] to-[#2c5e93]  h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleShopNow}
                  className="bg-gradient-to-r from-[#5987b8] to-[#2c5e93]  text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop Other Products</span>
                </button>
              </div>

              {/* Newsletter */}
              {/* <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Get notified when we launch
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap">
                    Notify Me
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      <div className="mt-28">
        <div className="hidden md:block">
          <img src={img} alt="banner" className="w-full h-full" />
        </div>
        <div className="sm:block md:hidden">
          <img src={img2} alt="banner" className="w-full h-full" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="w-full md:w-[90%] lg:w-[90%] mx-auto p-6">
            <div className="text-center mb-8">
              <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
            </div>

            {/* Loading Skeleton for Sub Categories */}
            <div className="mb-12">
              <div className="h-8 bg-gray-200 rounded w-40 mb-6 mx-auto animate-pulse"></div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Skeleton for Products */}
            <div>
              <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-8 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sub Categories Section */}
            {subcat?.subCategory?.length > 0 && (
              <div className="w-full md:w-[90%] lg:w-[90%] mx-auto p-1 md:p-6 mt-4">
                <h3 className="text-xl md:text-4xl font-semibold text-heading text-center mb-4">
                  Sub Categories
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6">
                  {subcat.subCategory.map((item, index) => (
                    <div key={index}>
                      <Link to={`/sub-category-data/${slug}/${item.sslug}`}>
                        <div className="text-center">
                          <div className="h-auto w-auto overflow-hidden relative">
                            <img
                              src={item.simage}
                              alt={item.sname}
                              className="mx-auto w-full rounded-md "
                            />
                            <p className="text-black text-[14px] mt-2">{item.sname}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="w-full mx-auto md:px-2 py-3">
              <h3 className="text-xl md:text-4xl font-semibold text-heading text-center mb-4">
                Products
              </h3>
              
              {firstHalfProducts.length > 0 ? (
                <div className="w-full md:w-[90%] lg:w-[90%] mx-auto p-1 md:p-6 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-6">
                    {firstHalfProducts
                      .slice()
                      .reverse()
                      .map((p, i) => (
                        <ProductCard
                          key={i}
                          product={p}
                          add_wishlist={add_wishlist}
                          isInWishlist={isInWishlist}
                          setHoveredProduct={setHoveredProduct}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No Products Available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Currently no {slug.replace(/-/g, " ")} products are available.
                    </p>
                    <button
                      onClick={handleShopNow}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5987b8] to-[#2c5e93] text-white py-3 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Explore Other Products</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isLoginModalOpen && (
        <LoginModal
          closeModal={closeLoginModal}
          openRegisterModal={openRegisterModal}
          openForgetModal={openForgetModal}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          closeModal={closeRegisterModal}
          openLoginModal={openLoginModal}
        />
      )}
      {isForgetModalOpen && (
        <ForgetModal
          closeModal={closeForgetModal}
          openLoginModal={openLoginModal}
        />
      )}
      <Footer />
      <MobileFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

// Product Card Component (same as before)
const ProductCard = ({
  product,
  add_wishlist,
  isInWishlist,
  setHoveredProduct,
}) => {
  return (
    <div
      className="bg-white md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
      onMouseEnter={() => setHoveredProduct(product._id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className="relative overflow-hidden">
        {product.discount > 0 && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {product.discount}% OFF
            </div>
          </div>
        )}

        <button
          onClick={() => add_wishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(product._id)
            ? "bg-red-50 text-red-500"
            : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
            }`}
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-current" : ""
              }`}
            strokeWidth={2}
          />
        </button>

        <Link to={`/product/details/${product.slug}`}>
          <div className="overflow-hidden">
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.category}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 font-medium">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        <Link to={`/product/details/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="md:text-lg font-bold text-gray-900">
              ₹
              {product.price -
                Math.floor((product.price * product.discount) / 100)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Save ₹{Math.floor((product.price * product.discount) / 100)}
              </span>
              <span className="text-xs text-red-500 font-semibold">
                {product.discount}% off
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesData;

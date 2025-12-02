
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img5 from "../assets/DIWALI10_2100x.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  get_category,
  get_products,
  getSubCatData,
} from "../store/reducers/homeReducer";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Star, ShoppingCart, X } from "lucide-react";
import MobileFooter from "../components/MobileFooter";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

const SubCategoriesData = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [showComingSoonPopup1, setShowComingSoonPopup1] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

    console.log("showComingSoonPopup1",showComingSoonPopup1);
  console.log("hasDataLoaded",hasDataLoaded);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { categorys, subData } = useSelector((state) => state.home);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { slug } = useParams();
  const { category } = useParams();
  const navigate = useNavigate();
  
  // console.log("category, slug", category, slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    dispatch(getSubCatData({ category, slug, page, limit }));
  }, [dispatch, category, slug, page]);

  console.log("subdata",subData);
  

  // Check when data is loaded
 useEffect(() => {
  console.log("subData.length", subData.length);
  console.log("hasDataLoaded1223",hasDataLoaded)
  if (subData.length > 0) { // Only if there are products
    console.log("Data loaded with products");
    setIsLoading(false);
    setHasDataLoaded(true);
    setShowComingSoonPopup1(false); // Hide popup if products exist
  } else if (subData.length === 0) { // Empty but first load
    console.log("Data loaded but empty");
    setIsLoading(false);
    setHasDataLoaded(true);
    
    // Show popup only if data is empty AND this is the first load
    if (subData.length === 0) {
      console.log("Showing coming soon popup");
      setShowComingSoonPopup1(true);
    }
  }
}, [subData, hasDataLoaded]);

  // Check if there are more products to load
  useEffect(() => {
    if (subData.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [subData, limit]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const newLimit = limit + 20;
    setLimit(newLimit);

    await dispatch(getSubCatData({ category, slug, page: 1, limit: newLimit }));
    setIsLoadingMore(false);
  };

  const add_card = async (id) => {
    if (!userInfo) {
      openLoginModal();
      return;
    }
    dispatch(
      add_to_card({
        userId: userInfo?.id,
        quantity: 1,
        productId: id,
      })
    ).then((res) => {
      if (res.payload?.message) {
        toast.success(res.payload.message);
      }
    });
  };

  const add_wishlist = async (pro) => {
    if (!userInfo) {
      openLoginModal();
      return;
    }
    try {
      const response = await dispatch(
        add_to_wishlist({
          userId: userInfo?.id,
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

  const handleProductClick = async (product) => {
    await sendMetaEventSafe({
      eventType: "AddToCart",
      price: product.price,
      order: null,
      products: product,
      userInfo: userInfo,
    });
  };

  const handleShopNow = () => {
    setShowComingSoonPopup1(false);
    navigate("/");
  };

  const handleClosePopup = () => {
    setShowComingSoonPopup1(false);
  };

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <div className="bg-white md:rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
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
      {showComingSoonPopup1 && hasDataLoaded && (
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

             
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#ecf1f2] lg:mt-[130px] md:mt-[100px] sm:mt-[100px]">
        <img
          src="https://i.ibb.co/7tNQ3KQn/ecommban9.jpg"
          alt="banner"
          className="w-full h-[40vh] md:h-[70vh] object-fill "
        />
        
        {/* Loading State */}
        {isLoading ? (
          <div className="w-full mx-auto md:px-2 md:py-8">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto my-4 animate-pulse"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:w-[90%] w-full mx-auto">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
            
            {/* Loading for Load More button area */}
            <div className="flex justify-center mt-8">
              <div className="px-4 py-2 bg-gray-200 rounded w-32 h-10 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto md:px-2 md:py-8">
            <h3 className="text-xl md:text-4xl font-semibold text-heading text-center my-4">
              Products
            </h3>

            {subData.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-6 md:w-[90%] w-full mx-auto">
                  {subData.map((p, i) => (
                    <div
                      key={i}
                      className="bg-white md:rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                      onMouseEnter={() => setHoveredProduct(p._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        {/* Wishlist Button */}
                        <button
                          onClick={() => add_wishlist(p)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            isInWishlist(p._id)
                              ? "bg-red-50 text-red-500"
                              : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${isInWishlist(p._id) ? "fill-current" : ""}`}
                            strokeWidth={2}
                          />
                        </button>

                        <Link 
                          onClick={() => handleProductClick(p)}
                          to={`/product/details/${p.slug}`}
                        >
                          <div className="overflow-hidden">
                            <img
                              src={p.images[0].url}
                              alt={p.name}
                              className="w-full md:h-full sm:h-[220px] transition-transform duration-500"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {p.category}
                          </span>
                          {/* Rating */}
                          {p.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 font-medium">
                                {p.rating}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Name */}
                        <Link to={`/product/details/${p.slug}`}>
                          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Price Section */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="md:text-lg font-bold text-gray-900">
                              ₹{p.price - Math.floor((p.price * p.discount) / 100)}
                            </span>
                            {p.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{p.price}
                              </span>
                            )}
                          </div>

                          {/* Savings */}
                          {p.discount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                Save ₹{Math.floor((p.price * p.discount) / 100)}
                              </span>
                              <span className="text-xs text-red-500 font-semibold">
                                {p.discount}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && subData.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="px-4 py-2 bg-primary text-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </div>
                      ) : (
                        `Load More`
                      )}
                    </button>
                  </div>
                )}

                {/* No more products message */}
                {!hasMore && subData.length > 0 && (
                  <div className="text-center py-6 text-gray-600 border-t mt-8">
                    You've viewed all {subData.length} products
                  </div>
                )}
              </>
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
                    Currently no products are available in this subcategory.
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
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>

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

export default SubCategoriesData;

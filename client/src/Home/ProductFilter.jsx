import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { get_products, messageClear } from "../store/reducers/homeReducer";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { Heart, X, Filter, RotateCcw } from "lucide-react";

const ProductFilter = () => {
  const dispatch = useDispatch();
  const { products, totalProduct, loading } = useSelector(
    (state) => state.home
  );
  const { wishlist } = useSelector((state) => state.card);
  const { userInfo } = useSelector((state) => state.auth);

  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(20); // Fixed limit
  const [initialLoad, setInitialLoad] = useState(true);
  const [allProducts, setAllProducts] = useState([]); // Store all loaded products

  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

  const colorDropdownRef = useRef(null);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const colorMap = {
    Black: "#000000",
    Blue: "#0000ff",
    Gray: "#808080",
    Green: "#008000",
    Red: "#ff0000",
    Orange: "#ffa500",
    White: "#ffffff",
    Purple: "#800080",
    Pink: "#ffc0cb",
    Brown: "#a52a2a",
    Navy: "#000080",
  };
  const colors = Object.keys(colorMap);
  const ratings = [5, 4, 3, 2, 1];
  const priceRanges = [
    { label: "100-500", min: 100, max: 500 },
    { label: "500-1000", min: 500, max: 1000 },
    { label: "1000-2000", min: 1000, max: 2000 },
    { label: "2000-3000", min: 2000, max: 3000 },
    { label: "3000-5000", min: 3000, max: 5000 },
  ];

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedPriceRange("");
    setSelectedRating("");
    setSelectedColors([]);
    setPage(1);
    setAllProducts([]); // Clear products when resetting filters
    setHasMore(true);
  };

  // Check if any filter is active
  const hasActiveFilters =
    selectedPriceRange || selectedRating || selectedColors.length > 0;

  // Handle outside click for color dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(e.target)
      ) {
        setShowColorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    const filters = {
      page,
      limit: limit,
      priceMin: selectedPriceRange?.min,
      priceMax: selectedPriceRange?.max,
      rating: selectedRating,
      color: selectedColors,
    };

    if (page === 1) {
      setInitialLoad(true);
      setAllProducts([]); // Clear products when starting new search
    }

    dispatch(get_products(filters))
      .then((action) => {
        if (action.payload && action.payload.products) {
          if (page === 1) {
            // First page - replace all products
            setAllProducts(action.payload.products);
          } else {
            // Subsequent pages - append products
            setAllProducts((prev) => [...prev, ...action.payload.products]);
          }

          // Check if there are more products to load
          const currentTotal = page * limit;
          setHasMore(currentTotal < action.payload.totalProduct);
        }
      })
      .finally(() => {
        if (page === 1) {
          setInitialLoad(false);
        }
      });
  }, [
    dispatch,
    page,
    selectedPriceRange,
    selectedRating,
    selectedColors,
    limit,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectedPriceRange, selectedRating, selectedColors]);

  // Load more products
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const add_card = async (id) => {
    if (!userInfo) return setLoginModalOpen(true);
    try {
      const res = await dispatch(
        add_to_card({ userId: userInfo.id, quantity: 1, productId: id })
      ).unwrap();
      toast.success(res.message);
      dispatch(messageClear());
    } catch (err) {
      toast.error(err.error || "An error occurred");
      dispatch(messageClear());
    }
  };

  const add_wishlist = async (pro) => {
    if (!userInfo) return setLoginModalOpen(true);
    try {
      const res = await dispatch(
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
      toast.success(res.message);
      dispatch(messageClear());
    } catch (err) {
      toast.error(err.error || "An error occurred");
      dispatch(messageClear());
    }
  };

  const isInWishlist = (id) => wishlist.some((item) => item.productId === id);

  const FilterSection = () => (
    <div className="sticky top-28 h-fit border rounded-lg p-6 bg-gray-50 ">
      {/* Header with Reset Button */}
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-xl font-bold">Filters</h5>
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            <RotateCcw size={16} />
            Reset All
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-lg font-semibold">Price Range</h6>
          {selectedPriceRange && (
            <button
              onClick={() => setSelectedPriceRange("")}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <select
          value={selectedPriceRange ? `₹${selectedPriceRange.label}` : ""}
          onChange={(e) => {
            const range = priceRanges.find(
              (r) => `₹${r.label}` === e.target.value
            );
            setSelectedPriceRange(range || "");
          }}
          className="border w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-black"
        >
          <option value="">Select Price Range</option>
          {priceRanges.map((r) => (
            <option key={r.label}>{`₹${r.label}`}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-lg font-semibold">Customer Rating</h6>
          {selectedRating && (
            <button
              onClick={() => setSelectedRating("")}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {ratings.map((r) => (
          <div
            key={r}
            onClick={() => setSelectedRating(selectedRating === r ? "" : r)}
            className={`flex items-center justify-between cursor-pointer mb-2 px-3 py-2 rounded-md transition-all ${
              selectedRating === r ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`ph-fill ph-star ${
                    i < r ? "text-yellow-400" : "text-gray-300"
                  } text-lg`}
                ></i>
              ))}
              <span className="ml-2 text-sm">{r} & Up</span>
            </div>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div ref={colorDropdownRef} className="relative">
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-lg font-semibold">Color</h6>
          {selectedColors.length > 0 && (
            <button
              onClick={() => setSelectedColors([])}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div
          className="border w-full px-3 py-2 rounded-md bg-white cursor-pointer flex flex-wrap gap-2 min-h-[42px]"
          onClick={() => setShowColorDropdown(!showColorDropdown)}
        >
          {selectedColors.length > 0 ? (
            selectedColors.map((clr, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-2 py-1 rounded-full text-sm border border-gray-400"
                style={{
                  backgroundColor: colorMap[clr],
                  color: clr === "White" || clr === "Yellow" ? "#000" : "#fff",
                }}
              >
                {clr}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select Colors</span>
          )}
        </div>

        {showColorDropdown && (
          <div className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-md w-full max-h-40 overflow-y-auto ">
            {colors.map((clr) => (
              <div
                key={clr}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedColors((prev) =>
                    prev.includes(clr)
                      ? prev.filter((c) => c !== clr)
                      : [...prev, clr]
                  );
                }}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-400"
                  style={{ backgroundColor: colorMap[clr] }}
                ></span>
                <span>{clr}</span>
                {selectedColors.includes(clr) && (
                  <span className="ml-auto text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 p-3 bg-white rounded-lg border">
          <h6 className="font-semibold mb-2">Active Filters:</h6>
          <div className="flex flex-wrap gap-2">
            {selectedPriceRange && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                Price: ₹{selectedPriceRange.label}
              </span>
            )}
            {selectedRating && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                Rating: {selectedRating}+
              </span>
            )}
            {selectedColors.map((color, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-sm border"
                style={{
                  backgroundColor: colorMap[color],
                  color: color === "White" ? "#000" : "#fff",
                }}
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <Header />
      <div className="w-full mt-[72px] md:mt-[100px]">
        <div className="w-full md:w-[90%] mx-auto px-2 md:px-4 py-8 mt-5">
          <section className="shop py-10">
            {/* Mobile Filter Header */}
            <div className="lg:hidden flex justify-between items-center mb-6 p-4 bg-white rounded-lg border">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
              >
                <Filter size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {
                      [
                        selectedPriceRange,
                        selectedRating,
                        selectedColors.length,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>

              <div className="text-sm text-gray-600">
                {allProducts.length} products
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Desktop Sidebar */}
              <div className="lg:col-span-3 col-span-12 hidden lg:block relative">
                <FilterSection />
              </div>

              {/* Mobile Filter Modal */}
              {showMobileFilters && (
                <div className="fixed inset-0 z-[1000] lg:hidden">
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <div className="absolute top-0 left-0 h-full w-80 bg-white overflow-y-auto">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xl font-bold">Filters</h5>
                        <button onClick={() => setShowMobileFilters(false)}>
                          <X size={24} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <FilterSection />
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full mt-4 py-3 bg-black text-white rounded-lg font-semibold"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div className="lg:col-span-9 col-span-12">
                <div className="hidden lg:flex justify-between items-center mb-6">
                  <span className="text-gray-800 font-medium">
                    {allProducts.length}{" "}
                    {allProducts.length === 1 ? "product" : "products"} found
                    {hasActiveFilters && " (filtered)"}
                  </span>

                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Clear All Filters
                    </button>
                  )}
                </div>

                {initialLoad && page === 1 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                      {allProducts.map((p, i) => (
                        <div
                          key={p._id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                          onMouseEnter={() => setHoveredProduct(p._id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                        >
                          {/* Image Container */}
                          <div className="relative overflow-hidden">
                            {/* Discount Badge */}
                            {p.discount > 0 && (
                              <div className="absolute top-3 left-3">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                  {p.discount}% OFF
                                </div>
                              </div>
                            )}

                            {/* Wishlist Button */}
                            <button
                              onClick={() => add_wishlist(p)}
                              className={`absolute top-3 right-3  p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                isInWishlist(p._id)
                                  ? "bg-red-50 text-red-500"
                                  : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isInWishlist(p._id) ? "fill-current" : ""
                                }`}
                                strokeWidth={2}
                              />
                            </button>

                            <Link to={`/product/details/${p.slug}`}>
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={p.images[0].url}
                                  alt={p.name}
                                  className="w-full h-full object-cover  transition-transform duration-500"
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
                                  ₹
                                  {p.price -
                                    Math.floor((p.price * p.discount) / 100)}
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
                                    Save ₹
                                    {Math.floor((p.price * p.discount) / 100)}
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
                    {hasMore && allProducts.length > 0 && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={loadMore}
                          disabled={loading}
                          className="px-4 py-2 bg-primary text-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Loading...
                            </div>
                          ) : (
                            `Load More `
                          )}
                        </button>
                      </div>
                    )}

                    {!hasMore && allProducts.length > 0 && (
                      <p className="text-center text-gray-500 mt-6 py-4 border-t">
                        You've viewed all {totalProduct} products
                      </p>
                    )}

                    {allProducts.length === 0 && !initialLoad && (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
                          No products found
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={resetAllFilters}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal
          closeModal={() => setLoginModalOpen(false)}
          openRegisterModal={() => {
            setLoginModalOpen(false);
            setRegisterModalOpen(true);
          }}
          openForgetModal={() => setForgetModalOpen(true)}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          closeModal={() => setRegisterModalOpen(false)}
          openLoginModal={() => setLoginModalOpen(true)}
        />
      )}
      {isForgetModalOpen && (
        <ForgetModal
          closeModal={() => setForgetModalOpen(false)}
          openLoginModal={() => setLoginModalOpen(true)}
        />
      )}

      <Footer />
      <div className="fixed bottom-0 w-full md:hidden z-50">
        <MobileFooter />
      </div>
    </div>
  );
};

export default ProductFilter;

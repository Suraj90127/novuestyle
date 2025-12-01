// Header.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Typewriter from "typewriter-effect/dist/core";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import CartPopup from "./CartPopup";
import img1 from "../assets/T-shirtimg/plogo.png";
import ForgetModal from "../Authentication/ForgetPassword";
import { useSelector, useDispatch } from "react-redux";
import { messageClear, userDetail } from "../store/reducers/authReducer";
import { user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";
import api from "../api/api";
import NewPassword from "../Authentication/NewPassword";
import { get_category, get_products } from "../store/reducers/homeReducer";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";
import {
  Search as LucideSearch,
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
  Truck,
  ChevronRight,
} from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
  const { products, categorys } = useSelector((state) => state.home);

  // console.log("categorys on header", categorys);

  // refs
  const typewriterRef = useRef(null);
  const cartPopupRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navWrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  // local state
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isCartPopupOpen, setCartPopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [filteredProductName, setFilteredProductName] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);

  // initial fetches
  useEffect(() => {
    dispatch(userDetail())
    dispatch(get_category());
    dispatch(get_products());
  }, [dispatch]);

  // fetch cart/wishlist when user logs in
  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo, dispatch]);

  // click outside cart popup to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartPopupRef.current &&
        !cartPopupRef.current.contains(event.target)
      ) {
        setCartPopupOpen(false);
      }
    };

    if (isCartPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartPopupOpen]);

  // click outside mobile menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen)
      document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Clear timeout function
  const clearHideTimeout = useCallback(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  }, [hideTimeout]);

  // Show dropdown immediately on mouse enter
  const handleNavMouseEnter = useCallback(
    (category) => {
      clearHideTimeout();
      if (category?.subCategory && category.subCategory.length > 0) {
        setHoveredCategory(category);
      }
    },
    [clearHideTimeout]
  );

  // Start hide timeout when mouse leaves nav item
  const handleNavMouseLeave = useCallback(() => {
    clearHideTimeout();
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 1000);
    setHideTimeout(timeout);
  }, [clearHideTimeout]);

  // Clear timeout and keep dropdown visible when mouse enters dropdown
  const handleDropdownMouseEnter = useCallback(() => {
    clearHideTimeout();
  }, [clearHideTimeout]);

  // Start hide timeout when mouse leaves dropdown
  const handleDropdownMouseLeave = useCallback(() => {
    clearHideTimeout();
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 1000);
    setHideTimeout(timeout);
  }, [clearHideTimeout]);

  // Hide dropdown immediately when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navWrapperRef.current &&
        !navWrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setHoveredCategory(null);
        clearHideTimeout();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearHideTimeout]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  // navigation helpers
  const isActive = (path) => location.pathname === path;

  const toggleSearch = useCallback(() => {
    setShowSearchBar((p) => !p);
    if (!showSearchBar) {
      setTimeout(() => searchRef.current?.focus(), 120);
    } else {
      setSearchValue("");
      setFilteredProductName([]);
    }
  }, [showSearchBar]);

  const toggleCartPopup = useCallback(() => {
    // console.log("ppppp",p);
    
    setCartPopupOpen((p) => !p);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((p) => !p);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);
  const openForgetModal = useCallback(() => setForgetModalOpen(true), []);
  const openPasswordModal = useCallback(() => setPasswordModalOpen(true), []);
  const openRegisterModal = useCallback(() => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  }, []);
  const closeRegisterModal = useCallback(() => setRegisterModalOpen(false), []);
  const closeForgetModal = useCallback(() => setForgetModalOpen(false), []);
  const closePasswordModal = useCallback(() => setPasswordModalOpen(false), []);



  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const handleProductNameSelect = useCallback(
    (name) => {
      navigate(`/product?value=${encodeURIComponent(name)}`);
      setShowSearchBar(false);
      setSearchValue("");
      setFilteredProductName([]);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );


  const logout = async () => {
    try {
      const { data } = await api.get("/customer/logout");
      localStorage.removeItem("customerToken");
      toast.success(data.message);
      dispatch(user_reset());
      dispatch(reset_count());
      navigate("/");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Helper function to chunk array into rows of 5
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // marquee text
  const marqueeText =
    "❤️ Love the product. Shop with Confidence. Free returns • Fast delivery • Premium quality";

  return (
    <div className="fixed top-0 w-full z-[9999] flex flex-col">
      {/* Top blue marquee */}
      <div className="h-[32px] overflow-hidden">
        <marquee className="w-full bg-[#5987b8] text-white p-2 text-sm font-[400]">
          {marqueeText}
        </marquee>
      </div>

      {/* Main header */}
      <header className="w-full mx-auto bg-white text-black shadow-sm">
        <div className="mx-auto md:px-16 sm:px-5 py-3 grid grid-cols-3 md:flex items-center justify-between md:justify-between gap-4">
          {/* Left: Hamburger (mobile only) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 p-1"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center justify-center gap-10 w-full">
            {/* Left: Logo (centered on mobile, left-aligned on desktop) */}
            <div className="flex justify-center md:justify-start">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png"
                  alt="Logo"
                  className="h-10 w-[100%]"
                />
              </Link>
            </div>

            {/* Center: Navigation (desktop only) */}
            <nav
              ref={navWrapperRef}
              className="hidden md:flex flex-1 justify-start mt-3"
            >
              <ul className="flex items-center gap-8">
                {(categorys && categorys.length > 0
                  ? categorys.slice(0, 8)
                  : [
                    { name: "Male", slug: "Male" },
                    { name: "Female", slug: "Female" },
                    { name: "Hoodies", slug: "Hoodie" },
                    { name: "Sweatshirt", slug: "Sweatshirt" },
                    { name: "Jacket", slug: "Jacket" },
                    { name: "Sweetpant", slug: "Sweetpant" },
                    { name: "Joggers", slug: "Joggers" },
                    { name: "Premium Hoodie", slug: "Premium-Hoodie" },
                  ]
                ).map((cat, idx) => (
                  <li
                    key={cat._id || idx}
                    className="relative h-full"
                    onMouseEnter={() =>
                      cat?.subCategory?.length > 0 && handleNavMouseEnter(cat)
                    }
                    onMouseLeave={
                      cat?.subCategory?.length > 0
                        ? handleNavMouseLeave
                        : undefined
                    }
                    onFocus={() =>
                      cat?.subCategory?.length > 0 && handleNavMouseEnter(cat)
                    }
                    onClick={() => {
                      setHoveredCategory(null);
                    }}
                  >
                    <Link
                      to={
                        cat.slug ? `/category-data/${cat.slug}` : "/collections"
                      }
                      className={`text-sm font-medium hover:text-[#5987b8] flex h-full transition-colors ${isActive(`/category-data/${cat.slug}`)
                        ? "text-[#5987b8]"
                        : "text-gray-800"
                        } ${cat?.subCategory?.length > 0
                          ? "cursor-pointer"
                          : "cursor-default"
                        }`}
                    >
                      {cat.name}
                    </Link>

                    {/* Subcategory dropdown - only show if category has subcategories */}
                    {hoveredCategory?._id === cat._id &&
                      hoveredCategory?.subCategory?.length > 0 && (
                        <div
                          ref={dropdownRef}
                          className="dropdown-container fixed top-[85px] left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-full p-6 grid grid-cols-12 gap-6"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          <div className="col-span-9 w-[80%]">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                              {hoveredCategory.name} Categories
                            </h3>

                            {/* Chunk subcategories into rows of 5 */}
                            {chunkArray(
                              hoveredCategory.subCategory.slice(0, 10),
                              5
                            ).map((row, rowIndex) => (
                              <div
                                key={rowIndex}
                                className="grid grid-cols-5 gap-4 mb-6 last:mb-0"
                              >
                                {row.slice(0, 10).map((sub) => (
                                  <Link
                                    key={sub._id}
                                    to={
                                      sub.sslug
                                        ? `/sub-category-data/${cat.slug}/${sub.sslug}`
                                        : `/category-data/${cat.slug}`
                                    }
                                    className="flex flex-col items-center text-center group w-full flex-1"
                                    onClick={() => {
                                      setHoveredCategory(null);
                                      clearHideTimeout();
                                    }}
                                  >
                                    <div className="rounded-md overflow-hidden transition-all duration-200 mb-2 flex items-center justify-center">
                                      <img
                                        src={sub.simage}
                                        alt={sub.sname}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src =
                                            "https://via.placeholder.com/64x64?text=Image";
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-[#5987b8] transition-colors line-clamp-2">
                                      {sub.sname}
                                    </span>
                                  </Link>
                                ))}

                                {/* Fill empty spaces if last row has less than 5 items */}
                                {row.length < 5 &&
                                  Array.from({ length: 5 - row.length }).map(
                                    (_, emptyIndex) => (
                                      <div
                                        key={`empty-${emptyIndex}`}
                                        className="w-20 flex-1"
                                      />
                                    )
                                  )}
                              </div>
                            ))}
                          </div>
                          <div className="col-span-3">
                            <div className="flex justify-between items-center border-b p-2">
                              <div className="flex flex-col items-left justify-center p-4 rounded-md">
                                <p className="font-semibold text-sm">
                                  Discover What's New
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Explore the latest arrivals and trending
                                  collections.
                                </p>
                              </div>
                              <div>
                                <ChevronRight className="text-gray-500" />
                              </div>
                            </div>

                            <div className="flex justify-between items-center border-b p-2">
                              <div className="flex flex-col items-left justify-center p-4 rounded-md">
                                <p className="font-semibold text-sm">
                                  Shop Bestsellers
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Browse our most popular styles loved by
                                  customers.
                                </p>
                              </div>
                              <div>
                                <ChevronRight className="text-gray-500" />
                              </div>
                            </div>

                            <div className="flex justify-between items-center border-b p-2">
                              <div className="flex flex-col items-left justify-center p-4 rounded-md">
                                <p className="font-semibold text-sm">
                                  Exclusive Offers
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Don't miss limited-time discounts on your
                                  favorite items.
                                </p>
                              </div>
                              <div>
                                <ChevronRight className="text-gray-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 justify-end flex-1 md:flex-none">
            {/* Search icon (mobile only) */}
            <button
              onClick={() => setShowSearchBar((s) => !s)}
              className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <LucideSearch className="h-5 w-5" />
            </button>
            {/* Search input (desktop only) */}

            <div className="hidden md:flex items-center border rounded-md px-3 py-1 w-[360px]">
              <input
                ref={searchRef}
                onChange={handleSearchChange}
                value={searchValue}
                onClick={() => setShowSearchMenu(true)}
                placeholder="What are you looking for..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800"
              />
              <button
                type="button"
                onClick={() => {
                  const q = searchValue.trim();
                  if (q) {
                    navigate(`/products/search?value=${encodeURIComponent(q)}`);
                  }
                }}
                aria-label="Search"
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <LucideSearch className="h-4 w-4" />
              </button>
            </div>
            {/* // Mobile search overlay (update button onClick) */}

            {showSearchBar && (
              <div className="md:hidden px-4 pb-2 bg-white shadow-md">
                <div className="relative">
                  <input
                    ref={searchRef}
                    onChange={handleSearchChange}
                    value={searchValue}
                    placeholder="Search products..."
                    className="w-full border border-gray-200 rounded-md py-2 pl-4 pr-10 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const q = searchValue.trim();
                      if (q) {
                        navigate(
                          `/products/search?value=${encodeURIComponent(q)}`
                        );
                        setShowSearchBar(false); // hide overlay after navigating (optional)
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label="submit"
                  >
                    <LucideSearch className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {/* Cart icon (always visible) */}
            <button
              onClick={toggleCartPopup}
              className="relative text-gray-700 hover:text-[#5987b8] transition p-1"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {card_product_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#5987b8] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {card_product_count}
                </span>
              )}
            </button>
            {/* Wishlist (desktop only) */}
            <Link
              to="/wishlist"
              className="hidden md:inline relative text-gray-700 hover:text-[#5987b8] transition p-1"
            >
              <FaRegHeart className="h-5 w-5" />
              {wishlist_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#5987b8] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist_count}
                </span>
              )}
            </Link>
            {/* Account / login (desktop only) */}
            <div className="hidden md:inline">
              {userInfo ? (
                <Link
                  to="/dashboard-client"
                  className="flex items-center gap-2 text-sm hover:text-[#5987b8] transition"
                >
                  <FiUser className="h-5 w-5" />
                  <span className="hidden md:inline">{userInfo?.name}</span>
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="text-gray-700 hover:text-[#5987b8] transition p-1"
                >
                  <FiUser className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search overlay */}
        {showSearchBar && (
          <div className="md:hidden px-4 pb-2 bg-white shadow-md">
            <div className="relative">
              <input
                ref={searchRef}
                onChange={handleSearchChange}
                value={searchValue}
                placeholder="Search products..."
                className="w-full border border-gray-200 rounded-md py-2 pl-4 pr-10 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (searchValue.trim())
                    navigate(
                      `/products/search?value=${encodeURIComponent(
                        searchValue.trim()
                      )}`
                    );
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="submit"
              >
                <LucideSearch className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "bg-opacity-40" : "bg-opacity-0"
            }`}
          onClick={closeMobileMenu}
        />

        {/* Drawer */}
        <aside
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-lg transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b">
            <img
              src="https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png"
              alt="Logo"
              className="h-6"
            />
            <button onClick={closeMobileMenu}>
              <FiX className="h-6 w-6 text-gray-800" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {(categorys && categorys.length > 0
                ? categorys.slice(0, 8)
                : [
                  { name: "Male", slug: "Male" },
                  { name: "Female", slug: "Female" },
                  { name: "Hoodies", slug: "Hoodie" },
                  { name: "Sweatshirt", slug: "Sweatshirt" },
                  { name: "Jacket", slug: "Jacket" },
                  { name: "Sweetpant", slug: "Sweetpant" },
                  { name: "Joggers", slug: "Joggers" },
                  { name: "Premium Hoodie", slug: "Premium-Hoodie" },
                ]
              ).map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/category-data/${item.slug || ""}`}
                    onClick={closeMobileMenu}
                    className="block px-6 py-3 text-[15px] text-gray-800 font-medium hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer (Login / Signup) */}
          {userInfo ? (<div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full bg-[#192a56] text-white text-[15px] py-3 rounded-sm font-medium hover:bg-[#243b79] transition"
            >
              Log Out
            </button>
          </div>) :

            (
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    openLoginModal();
                    closeMobileMenu();
                  }}
                  className="w-full bg-[#192a56] text-white text-[15px] py-3 rounded-sm font-medium hover:bg-[#243b79] transition"
                >
                  Log In or Sign Up
                </button>
              </div>
            )}
        </aside>
      </div>

      {/* Modals / popups */}
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
          openPasswordModal={openPasswordModal}
        />
      )}
      {isPasswordModalOpen && (
        <NewPassword
          closeModal={closePasswordModal}
          openLoginModal={openLoginModal}
          openForgetModal={openForgetModal}
        />
      )}

      {isCartPopupOpen && (
        <div ref={cartPopupRef} className="fixed right-4 top-20 z-50">
          <CartPopup onClose={toggleCartPopup} />
        </div>
      )}

      {/* Add CSS for line clamp utility */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Header;

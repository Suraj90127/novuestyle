import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img5 from "../assets/DIWALI10_2100x.jpg";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducer";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const OfferPromotion = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [displayCount, setDisplayCount] = useState(20); // Start with 20 products
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    products,
    totalProduct,
    discount_product,
    latest_product,
    priceRange,
    parPage,
  } = useSelector((state) => state.home);

  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_products({ page: 1, limit: 100 }));
  }, [dispatch]);

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

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 20);
  };

  // Get the products to display based on current displayCount
  const displayedProducts = products.slice(0, displayCount);

  // Check if there are more products to load
  const hasMoreProducts = displayCount < products.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="bg-[#ecf1f2] mt-[90px] md:mt-[123px]">
        <div>
          <img
            src="https://i.ibb.co/7tNQ3KQn/ecommban9.jpg"
            alt="banner"
            className="w-full h-[40vh] md:h-[70vh] object-fill "
          />
        </div>
        <div className="w-full mx-auto px-2 md:px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 ">
            {displayedProducts.map((p, i) => (
              <div
                key={i}
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
          {hasMoreProducts && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="bg-[#e8b32f] text-white px-4 py-2 hover:bg-[#a88225] transition duration-300 font-medium"
              >
                Load More
              </button>
            </div>
          )}

          {/* Show message when all products are loaded */}
          {!hasMoreProducts && products.length > 0 && (
            <div className="text-center mt-8 text-gray-600">
              All products loaded ({products.length} products)
            </div>
          )}
        </div>
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
    </div>
  );
};

export default OfferPromotion;

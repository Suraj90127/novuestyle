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
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import MobileFooter from "../components/MobileFooter";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

const SubCategoriesData = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

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
  console.log("category, slug", category, slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSubCatData({ category, slug, page, limit }));
  }, [dispatch, category, slug, page]);

  useEffect(() => {
    dispatch(getSubCatData({ category, slug, page, limit }));
  }, [dispatch, category, slug, page]);

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
      <Header />
      <div className="bg-[#ecf1f2] lg:mt-[130px] md:mt-[100px] sm:mt-[100px]">
        <img
          src="https://i.ibb.co/7tNQ3KQn/ecommban9.jpg"
          alt="banner"
          className="w-full h-[40vh] md:h-[70vh] object-fill "
        />
        <div className="w-full mx-auto md:px-2 md:py-8">
          <h3 className="text-xl md:text-4xl font-semibold text-heading text-center my-4">
            Products
          </h3>

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
                  {/* Discount Badge */}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => add_wishlist(p)}
                    className={`absolute top-3 right-3  p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(p._id)
                      ? "bg-red-50 text-red-500"
                      : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(p._id) ? "fill-current" : ""
                        }`}
                      strokeWidth={2}
                    />
                  </button>

                  <Link onClick={() => handleProductClick(p)}
                    to={`/product/details/${p.slug}`}>
                    <div className=" overflow-hidden">
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

          {/* No products found */}
          {subData.length === 0 && !isLoadingMore && (
            <div className="text-center py-12 text-gray-600">
              No products found in this category
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

export default SubCategoriesData;

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img5 from "../assets/DIWALI10_2100x.jpg";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_category, get_products } from "../store/reducers/homeReducer";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link, useParams } from "react-router-dom";
import { Heart, ShoppingCart, Star, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const CategoriesData = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

  const {
    products,
    categorys,
    totalProduct,
    latest_product,
    priceRange,
    parPage,
  } = useSelector((state) => state.home);

  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { slug } = useParams();

  // console.log("slug", slug);

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
    dispatch(get_products({ page: 1, limit: 500 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const normalizedSlug = slug.replace(/-/g, " ").toLowerCase();

  const category_products = products.filter(
    (product) => product.category?.toLowerCase() === normalizedSlug
  );

  const subcat = categorys.find(
    (cat) => cat.name.toLowerCase() === normalizedSlug
  );

  // Get current category index
  const currentCategoryIndex = categorys.findIndex(
    (cat) => cat.name.toLowerCase() === normalizedSlug
  );

  // Get next category products for slider
  const nextCategoryIndex = (currentCategoryIndex + 1) % categorys.length;
  const nextCategory = categorys[nextCategoryIndex];
  const nextCategoryProducts = products
    .filter(
      (product) =>
        product.category?.toLowerCase() === nextCategory?.name?.toLowerCase()
    )
    .slice(0, 10); // Limit to 10 products for slider

  const add_card = async (id) => {
    dispatch(
      add_to_card({
        userId: userInfo.id,
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
  // console.log("products", products);

  let firstHalfProducts = [];
  if (slug === "Male" || slug === "Female") {
    firstHalfProducts = products.filter((product) => product.category === slug);
  } else {
    firstHalfProducts = products.filter(
      (product) => product.category === slug || product.subCategory === slug
    );
  }

  return (
    <div>
      <Header />

      <div className="mt-28">
        <div className="hidden md:block">
          <img src={img} alt="banner" className="w-full h-full" />
        </div>
        <div className="sm:block md:hidden">
          <img src={img2} alt="banner" className="w-full h-full" />
        </div>

        {/* Sub Categories Section */}
        {subcat?.subCategory.length > 0 && (
          <div className="w-full md:w-[90%] lg:w-[90%] mx-auto p-1 md:p-6 mt-4">
            <h3 className="text-xl md:text-4xl font-semibold text-heading text-center mb-4">
              Sub Categories
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6">
              {subcat?.subCategory?.map((item, index) => (
                <div key={index}>
                  <Link to={`/sub-category-data/${slug}/${item.sslug}`}>
                    <div className="text-center">
                      <div className="h-auto w-auto overflow-hidden relative">
                        <img
                          src={item.simage}
                          alt={item.sname}
                          className="mx-auto w-full rounded-md "
                        />
                        <p className="text-black text-[14px]">{item.sname}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section - First 15 Products */}
        <div className="w-full mx-auto md:px-2 py-3">
          <h3 className="text-xl md:text-4xl font-semibold text-heading text-center mb-4">
            Products
          </h3>
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
      <MobileFooter />
    </div>
  );
};

// Product Card Component for reusability
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
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.category}
          </span>
          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 font-medium">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/details/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
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

          {/* Savings */}
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

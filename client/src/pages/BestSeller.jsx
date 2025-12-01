// src/pages/BestSeller.jsx  (or wherever your component file is)
import React, { useEffect, useState } from "react";
import bannerDefault from "../assets/banner/banner1.jpg";
import bannerKids from "../assets/banner/banmen1.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import {
  get_product_category,
  search_products,
} from "../store/reducers/homeReducer"; // <- import search_products
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { toast } from "react-toastify";
import { messageClear } from "../store/reducers/authReducer";
import { Link, useSearchParams } from "react-router-dom";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";

const BestSeller = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const subCategory = searchParams.get("subCategory") || "";
  const value = searchParams.get("value") || ""; // general free text (name/desc)
  const searchValue = searchParams.get("searchValue") || ""; // you used this before for gender
  const gender = searchParams.get("searchValue");

  // console.log("gender", value);

  const genderBannerMap = {
    kids: bannerKids,
    male: "https://i.ibb.co/tPPXQrm0/KELVINBAN4-2.jpg",
    pets: "https://i.ibb.co/tpb0C03y/PETSBAN-1.jpg",
    motivation: "https://i.ibb.co/qLwWjfDF/MOTIVATIONBAN.jpg",
    fitness: "https://i.ibb.co/dsWDb1Xq/FITNESSBAN.jpg",
  };
  const bannerImg = genderBannerMap[gender?.toLowerCase()] || bannerDefault;

  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const dispatch = useDispatch();

  // pull product list returned by your search_products thunk
  const { products: allProducts = [], product_cat = [] } = useSelector(
    (state) => state.home
  );

  console.log("allProducts", allProducts);
  console.log("product_cat", product_cat);

  const { products: cartProducts, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  // When query params change, dispatch search to backend
  useEffect(() => {
    const queryObj = {
      searchValue: value || "", // server expects searchValue param for name/desc
      category: category || "",
      subCategory: subCategory || "",
      // you can pass pageNumber & parPage if you support server pagination
      // pageNumber: 1,
      // parPage: 50
    };
    dispatch(search_products(queryObj));
  }, [dispatch, value, category, subCategory]);

  console.log("value", value);

  // still populate categories (product_cat) by gender if needed
  useEffect(() => {
    dispatch(get_product_category(value));
  }, [dispatch, value]);

  const handleViewMore = (count) => setVisibleCount(count);

  // client side filtering in addition to server (server should already filter but this is safe)
  const filteredProducts = allProducts.filter((product) => {
    const matchCategory = category ? product.category === category : true;
    const matchSubCategory = subCategory
      ? product.subCategory === subCategory
      : true;
    const matchSearchValue = value
      ? product.name.toLowerCase().includes(value.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(value.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(value.toLowerCase())) ||
      (product.subCategory &&
        product.subCategory.toLowerCase().includes(value.toLowerCase()))
      : true;
    const matchGender = gender ? product.gender === gender : true;

    return matchCategory && matchSubCategory && matchSearchValue && matchGender;
  });

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
    try {
      const response = await dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: pro._id,
          name: pro.name,
          price: pro.price,
          image: pro.images?.[0]?.url || "",
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="mt-[90px] md:pt-[50px]">
        <div className="w-[100%] mx-auto">
          <img src={bannerImg} alt="banner" className="w-full h-auto" />
        </div>

        <div className="w-[90%] md:w-[90%] my-3 mx-auto flex justify-between">
          <h2 className="text-lg font-normal text-gray-900">{value} Hoodies</h2>
          <p className="text-sm font-normal text-gray-900">
            {filteredProducts?.length} Item
          </p>
        </div>

        <div className="w-[98%] md:w-[90%] mx-auto">


          {/* Products Grid (search results) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-2 ">
            {filteredProducts.slice(0, visibleCount).map((p) => (
              <div key={p._id} className="bg-white rounded shadow-sm">
                <div className="relative">
                  <div className="absolute top-2 right-2 p-1 z-40">
                    <CiHeart
                      onClick={() => add_wishlist(p)}
                      className="text-xl cursor-pointer text-gray-300"
                    />
                  </div>
                  <Link to={`/product/details/${p.slug}`}>
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="w-full sm:h-56 md:h-full object-cover"
                    />
                  </Link>
                </div>
                <div className="mt-2">
                  {/* <p className="text-gray-400 p-2">{p.category}</p> */}
                  <div className="p-3">
                    <Link to={`/product/details/${p.slug}`}>
                      <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items- flex-wrap gap-1">
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
                            ₹ {p.discount}% OFF
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
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center items-center my-8">
              <button
                onClick={() => handleViewMore(visibleCount + 20)}
                className="text-black border border-black py-2 px-6 hover:text-white hover:bg-black transition-all"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </div>

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
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default BestSeller;

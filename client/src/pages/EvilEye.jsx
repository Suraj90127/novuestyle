import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img5 from "../assets/banner/banner2.jpg";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducer";
import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
import { getBanners } from "../store/reducers/bannerReducer";
import { messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link } from "react-router-dom";

const EvilEye = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

  const { products, totalProduct, latest_product, priceRange, parPage } =
    useSelector((state) => state.home);

  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { banners, loading } = useSelector((state) => state.banner);

  const EvilBanners = banners.filter(
    (banner) => banner.category == "Evil Eye Elegance"
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_products());
    dispatch(getBanners());
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Header />
      <div className="bg-[#ecf1f2] mt-[150px] md:mt-[180px]">
        <div>
          {EvilBanners && EvilBanners.length > 0 ? (
            EvilBanners.map((banner) => (
              <div key={banner._id}>
                <img src={banner.url} alt={`Banner for ${banner.category}`} />
              </div>
            ))
          ) : (
            <div>
              <img src={img5} alt="banner" className="w-full h-auto" />
            </div>
          )}
        </div>
        <div className="w-full mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6 ">
            {products.map((product, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden transition duration-500"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold">
                    -{product.discount}%
                  </div>
                  <div
                    className={`absolute top-4 right-4 shadow rounded-full p-2 transition-opacity duration-300 ${
                      hoveredProduct === product._id
                        ? "opacity-100"
                        : "opacity-0"
                    } ${
                      isInWishlist(product._id)
                        ? "bg-primary text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <CiHeart
                      onClick={() => add_wishlist(product)}
                      className=" text-xl cursor-pointer"
                    />
                  </div>
                  <Link to={`/product/details/${product.slug}`}>
                    <img
                      src={
                        hoveredProduct === product._id
                          ? product.images[0].url
                          : product.images[1].url
                      }
                      alt={product.name}
                      width={300}
                      height={300}
                      className={`w-full sm:h-[30vh] md:h-[35vh] lg:h-[40vh] object-cover overflow-hidden transition-transform duration-500 `} // Add scaling for better transition
                    />
                  </Link>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => add_card(product._id)}
                    className="bg-primary-gradient text-[10px] md:text-sm font-[500] text-white w-full py-2 rounded-md hover:bg-blue-600"
                  >
                    ADD TO CART
                  </button>
                  <h3 className="mb-2 text-sm md:text-base text-center text-text">
                    {product?.name}
                  </h3>
                  <div className="flex justify-center items-center space-x-2 text-sm md:text-base">
                    <span className="text-gray-500  line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-red-500 font-[500]">
                      ₹{" "}
                      {product.price -
                        Math.floor((product.price * product.discount) / 100)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className='flex justify-center items-center mt-8'>
        <button className='text-blacktext border border-text py-2 px-6 hover:text-white hover:bg-blacktext transition-all'>View More</button>
      </div> */}
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

export default EvilEye;

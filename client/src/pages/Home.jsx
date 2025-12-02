import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import img2 from "../assets/banner/banner2.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// IMPORT Navigation and Pagination modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Products1 from "../Home/Products1";
import Eveleye from "../Home/Eveleye";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_category, get_products } from "../store/reducers/homeReducer";
import { customer_login, messageClear, userDetail } from "../store/reducers/authReducer";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { Link, useNavigate } from "react-router-dom";
import { getBanners } from "../store/reducers/bannerReducer";
import Footwere from "../Home/Footwere";
import DiwaliOffer from "../Home/DiwaliOffer";
import Jewelary from "../Home/Jewelary";




const Home = () => {
  const navigate = useNavigate();
  const { latest_product } = useSelector((state) => state.home);
  const { categorys } = useSelector((state) => state.home);

  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );

  const { banners, loading } = useSelector((state) => state.banner);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

  const search = (gender) => {
    navigate(`/products/search?gender=${gender}`);
  };

  const homeBanners = Array.isArray(banners)
    ? banners.filter((banner) => banner.category === "Home Page")
    : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userDetail())
    dispatch(get_category());
    dispatch(get_products());
    
    dispatch(userDetail());

    dispatch(customer_login());

    dispatch(getBanners());
  }, [dispatch]);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openForgetModal = () => setForgetModalOpen(true);
  const openRegisterModal = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setRegisterModalOpen(false);
  const closeForgetModal = () => setForgetModalOpen(false);
  

  return (
    <div className="overflow-x-hidden">
      {/* Custom Styles for Swiper Navigation (Square Buttons) and Pagination (Bottom Position) */}
      <style>
        {`
          /* Navigation Buttons: Square and Position */
          .swiper-button-next, .swiper-button-prev {
            width: 44px !important;
            height: 44px !important;
            background-color: white;
            border-radius: 8px; /* Square with rounded corners */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s, opacity 0.2s;
            color: #333 !important; /* Icon color */
            opacity: 0.85;
          }
          
          /* Hide navigation buttons on mobile */
          @media (max-width: 767px) {
            .swiper-button-next, .swiper-button-prev {
              display: none !important;
            }
          }
          .swiper-button-next:hover, .swiper-button-prev:hover {
            background-color: #f0f0f0;
            opacity: 1;
          }
          /* Change arrow color and size (Swiper uses pseudo-elements for arrows) */
          .swiper-button-next::after, .swiper-button-prev::after {
            font-size: 18px !important;
            font-weight: bold;
          }
          /* Adjusting side margins for the 90% container */
          .swiper-button-prev {
            left: 10px !important; /* Keep inside the 90% container */
          }
          .swiper-button-next {
            right: 10px !important; /* Keep inside the 90% container */
          }
          @media (min-width: 768px) {
             .swiper-button-prev {
                left: 20px !important;
              }
              .swiper-button-next {
                right: 20px !important;
              }
          }
          
          /* Pagination Dots: Bottom position */
          .swiper-pagination {
            position: relative !important;
            bottom: -25px !important; /* Move below the banner area */
            padding-top: 15px;
          }
          .swiper-pagination-bullet-active {
            background: #000 !important; /* Active dot color */
          }
        `}
      </style>

      <Header />

      <div className="w-full mt-[100px] md:mt-[120px] ">
        {/* Banner Swiper Container: Added w-11/12 mx-auto for 90% width and centering */}
        <div className="md:w-11/12 w-full mx-auto pt-2 h-full hidden md:block">
          {homeBanners && homeBanners.length > 0 ? (
            <Swiper
              // Added Navigation and Pagination modules
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={20}
              // Enabled navigation and pagination
              navigation={true}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {homeBanners.map((banner) => (
                <SwiperSlide key={banner._id}>
                  <img
                    src={banner.url}
                    alt={`Banner for ${banner.category}`}
                    className="w-full h-[40vh] md:h-[70vh] object-fill "
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Swiper
              // Added Navigation and Pagination modules for placeholder as well
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={20}
              // Enabled navigation and pagination
              navigation={true}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {[img2, img2, img2].map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`Placeholder Banner ${index + 1}`}
                    className="w-full h-[40vh] md:h-full object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="md:w-11/12 w-full mx-auto pt-2 h-full block md:hidden">
          <Swiper
            // Added Navigation and Pagination modules
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            // Enabled navigation and pagination
            navigation={true}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {[
              "https://i.ibb.co/Ngw64mw7/banner8.png",
              "https://i.ibb.co/cSBv1B66/banner-5-phone-size.png",
              "https://i.ibb.co/GvmTvSDg/banner-1-phone-size.png",
              "https://i.ibb.co/jk4hRnbY/banner-3-phone-size.png",
              "https://i.ibb.co/Zp85wF1g/banner-4-phone-size.png",
            ].map((banner, index) => (
              <SwiperSlide key={index}>
                <img
                  src={banner}
                  alt={`Banner`}
                  className="w-full h-[40vh] md:h-[65vh] object-fill "
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* <Coupen /> */}

        {/* Products and Banners */}
        {/* <Eveleye
         
          openLoginModal={openLoginModal}
          closeLoginModal={closeLoginModal}
       
        /> */}

        <Footwere
        
          categorys={categorys}
        />

        <DiwaliOffer
          openLoginModal={openLoginModal}
          closeLoginModal={closeLoginModal}
        />

        {/* <Product2 first={0} second={2} /> */}
        <Products1
          openLoginModal={openLoginModal}
          closeLoginModal={closeLoginModal}
        />

        {/* <GifImages /> */}
        {/* <Product2 first={2} second={4} /> */}
        {/* <Jewelary
          products={latest_product}
          openLoginModal={openLoginModal}
          closeLoginModal={closeLoginModal}
        /> */}
        {/* <Products1 products={products} openLoginModal={openLoginModal} closeLoginModal={closeLoginModal} /> */}

        {/* Blog Section */}
        {/* <BlogSlider /> */}

        {/* <LikedProduct openLoginModal={openLoginModal} closeLoginModal={closeLoginModal} /> */}
      </div>

      {/* Modals */}
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

      <div className="fixed bottom-0 w-full md:hidden z-50">
        <MobileFooter />
      </div>
    </div>
  );
};

export default Home;


// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import img2 from "../assets/banner/banner2.png";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import Products1 from "../Home/Products1";
// import Eveleye from "../Home/Eveleye";
// import MobileFooter from "../components/MobileFooter";
// import { useDispatch, useSelector } from "react-redux";
// import { get_category, get_products } from "../store/reducers/homeReducer";
// import { customer_login, messageClear, userDetail } from "../store/reducers/authReducer";
// import LoginModal from "../Authentication/Login";
// import RegisterModal from "../Authentication/Register";
// import ForgetModal from "../Authentication/ForgetPassword";
// import { Link, useNavigate } from "react-router-dom";
// import { getBanners } from "../store/reducers/bannerReducer";
// import Footwere from "../Home/Footwere";
// import DiwaliOffer from "../Home/DiwaliOffer";
// import Jewelary from "../Home/Jewelary";

// const Home = () => {
//   const navigate = useNavigate();
//   const { latest_product, loading: productsLoading } = useSelector((state) => state.home);
//   const { categorys } = useSelector((state) => state.home);

//   const { loader, successMessage, errorMessage, userInfo } = useSelector(
//     (state) => state.auth
//   );

//   const { banners, loading: bannersLoading } = useSelector((state) => state.banner);

//   const [isLoginModalOpen, setLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
//   const [isForgetModalOpen, setForgetModalOpen] = useState(false);
//   const [showBannerSkeleton, setShowBannerSkeleton] = useState(true);
//   const [showProductSkeleton, setShowProductSkeleton] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   const search = (gender) => {
//     navigate(`/products/search?gender=${gender}`);
//   };

//   const homeBanners = Array.isArray(banners)
//     ? banners.filter((banner) => banner.category === "Home Page")
//     : [];

//   const dispatch = useDispatch();

//   useEffect(() => {
//     setIsInitialLoad(true);
//     dispatch(userDetail());
//     dispatch(get_category());
//     dispatch(get_products());
//     dispatch(customer_login());
//     dispatch(getBanners());
//   }, [dispatch]);

//   // Set a minimum display time for skeletons
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsInitialLoad(false);
//     }, 1000); // Minimum 1 second for skeleton display

//     return () => clearTimeout(timer);
//   }, []);

//   // Check when banners are loaded
//   useEffect(() => {
//     if (homeBanners.length > 0 && !bannersLoading) {
//       const timer = setTimeout(() => {
//         setShowBannerSkeleton(false);
//       }, 500); // Small delay for smooth transition
//       return () => clearTimeout(timer);
//     }
//   }, [homeBanners, bannersLoading]);

//   // Check when products are loaded
//   useEffect(() => {
//     if (latest_product.length > 0) {
//       const timer = setTimeout(() => {
//         setShowProductSkeleton(false);
//       }, 500); // Small delay for smooth transition
//       return () => clearTimeout(timer);
//     }
//   }, [latest_product]);

//   console.log("latest_product",latest_product);
  

//   console.log("showProductSkeleton",showProductSkeleton);
  

//   const openLoginModal = () => setLoginModalOpen(true);
//   const closeLoginModal = () => setLoginModalOpen(false);
//   const openForgetModal = () => setForgetModalOpen(true);
//   const openRegisterModal = () => {
//     setLoginModalOpen(false);
//     setRegisterModalOpen(true);
//   };
//   const closeRegisterModal = () => setRegisterModalOpen(false);
//   const closeForgetModal = () => setForgetModalOpen(false);

//   // Banner Skeleton Component
//   const BannerSkeleton = () => (
//     <div className="w-full h-[40vh] md:h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
//       <div className="w-full h-full animate-pulse">
//         <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
//       </div>
//     </div>
//   );

//   // Product Section Skeleton
//   const ProductSectionSkeleton = () => (
//     <div className="w-11/12 mx-auto py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
//         <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {[...Array(6)].map((_, index) => (
//           <div key={index} className="animate-pulse">
//             <div className="bg-gray-200 rounded-lg h-64 mb-3"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Main loading check
//   const showLoading = isInitialLoad || (showBannerSkeleton && showProductSkeleton);

//   return (
//     <div className="overflow-x-hidden">
//       {/* Custom Styles for Swiper Navigation and Pagination */}
//       <style>
//         {`
//           /* Navigation Buttons */
//           .swiper-button-next, .swiper-button-prev {
//             width: 44px !important;
//             height: 44px !important;
//             background-color: white;
//             border-radius: 8px;
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//             transition: background-color 0.2s, opacity 0.2s;
//             color: #333 !important;
//             opacity: 0.85;
//           }
          
//           @media (max-width: 767px) {
//             .swiper-button-next, .swiper-button-prev {
//               display: none !important;
//             }
//           }
//           .swiper-button-next:hover, .swiper-button-prev:hover {
//             background-color: #f0f0f0;
//             opacity: 1;
//           }
//           .swiper-button-next::after, .swiper-button-prev::after {
//             font-size: 18px !important;
//             font-weight: bold;
//           }
//           .swiper-button-prev {
//             left: 10px !important;
//           }
//           .swiper-button-next {
//             right: 10px !important;
//           }
//           @media (min-width: 768px) {
//              .swiper-button-prev {
//                 left: 20px !important;
//               }
//               .swiper-button-next {
//                 right: 20px !important;
//               }
//           }
          
//           /* Pagination Dots */
//           .swiper-pagination {
//             position: relative !important;
//             bottom: -25px !important;
//             padding-top: 15px;
//           }
//           .swiper-pagination-bullet-active {
//             background: #000 !important;
//           }

//           /* Animation for skeleton loaders */
//           @keyframes pulse {
//             0%, 100% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.5;
//             }
//           }
//           .animate-pulse {
//             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           }
//         `}
//       </style>

//       <Header />

//       <div className="w-full mt-[100px] md:mt-[120px]">
//         {/* Desktop Banner Section */}
//         <div className="md:w-11/12 w-full mx-auto pt-2 h-full hidden md:block">
//           {showBannerSkeleton || homeBanners.length === 0 ? (
//             <BannerSkeleton />
//           ) : (
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               autoplay={{ delay: 3000, disableOnInteraction: false }}
//               loop={true}
//               spaceBetween={0}
//               navigation={true}
//               pagination={{ clickable: true }}
//               className="w-full"
//               speed={800}
//             >
//               {homeBanners.map((banner) => (
//                 <SwiperSlide key={banner._id}>
//                   <img
//                     src={banner.url}
//                     alt={`Banner for ${banner.category}`}
//                     className="w-full h-[40vh] md:h-[70vh] object-fill"
//                     loading="lazy"
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           )}
//         </div>

//         {/* Mobile Banner Section */}
//         <div className="md:w-11/12 w-full mx-auto pt-2 h-full block md:hidden">
//           {showBannerSkeleton ? (
//             <BannerSkeleton />
//           ) : (
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               autoplay={{ delay: 3000, disableOnInteraction: false }}
//               loop={true}
//               spaceBetween={0}
//               navigation={true}
//               pagination={{ clickable: true }}
//               className="w-full"
//               speed={800}
//             >
//               {[
//                 "https://i.ibb.co/Ngw64mw7/banner8.png",
//                 "https://i.ibb.co/cSBv1B66/banner-5-phone-size.png",
//                 "https://i.ibb.co/GvmTvSDg/banner-1-phone-size.png",
//                 "https://i.ibb.co/jk4hRnbY/banner-3-phone-size.png",
//                 "https://i.ibb.co/Zp85wF1g/banner-4-phone-size.png",
//               ].map((banner, index) => (
//                 <SwiperSlide key={index}>
//                   <img
//                     src={banner}
//                     alt={`Banner ${index + 1}`}
//                     className="w-full h-[40vh] object-fill"
//                     loading="lazy"
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           )}
//         </div>

//         {/* Show loading skeletons OR actual content */}
//         {showProductSkeleton ? (
//           <>
//             <ProductSectionSkeleton />
//             <ProductSectionSkeleton />
//             <ProductSectionSkeleton />
//           </>
//         ) : (
//           <>
//             <Footwere
//               products={latest_product}
//               openLoginModal={openLoginModal}
//               closeLoginModal={closeLoginModal}
//               categorys={categorys}
//             />

//             <DiwaliOffer
//               products={latest_product}
//               openLoginModal={openLoginModal}
//               closeLoginModal={closeLoginModal}
//             />

//             <Products1
//               products={latest_product}
//               openLoginModal={openLoginModal}
//               closeLoginModal={closeLoginModal}
//             />

//             <Jewelary
//               products={latest_product}
//               openLoginModal={openLoginModal}
//               closeLoginModal={closeLoginModal}
//             />
//           </>
//         )}

//         {/* Fallback if data doesn't load after timeout */}
//         {!showLoading && latest_product.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No products available at the moment.</p>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {isLoginModalOpen && (
//         <LoginModal
//           closeModal={closeLoginModal}
//           openRegisterModal={openRegisterModal}
//           openForgetModal={openForgetModal}
//         />
//       )}
//       {isRegisterModalOpen && (
//         <RegisterModal
//           closeModal={closeRegisterModal}
//           openLoginModal={openLoginModal}
//         />
//       )}
//       {isForgetModalOpen && (
//         <ForgetModal
//           closeModal={closeForgetModal}
//           openLoginModal={openLoginModal}
//         />
//       )}

//       <Footer />

//       <div className="fixed bottom-0 w-full md:hidden z-50">
//         <MobileFooter />
//       </div>
//     </div>
//   );
// };

// export default Home;

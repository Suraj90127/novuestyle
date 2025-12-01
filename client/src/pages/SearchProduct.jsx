// import React, { useEffect, useState } from "react";
// import bannerDefault from "../assets/banner/banner1.jpg";
// import bannerKids from "../assets/banner/banmen1.jpg";

// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { CiHeart } from "react-icons/ci";
// import MobileFooter from "../components/MobileFooter";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   // get_product_category,
//   get_products,
//   // search_products,
// } from "../store/reducers/homeReducer";
// import { add_to_card, add_to_wishlist } from "../store/reducers/cardReducer";
// import { toast } from "react-toastify";
// import { messageClear } from "../store/reducers/authReducer";
// import { Link, useSearchParams } from "react-router-dom";
// import LoginModal from "../Authentication/Login";
// import RegisterModal from "../Authentication/Register";
// import ForgetModal from "../Authentication/ForgetPassword";


// const SearchProduct = () => {
//   const [searchParams] = useSearchParams();
//   const category = searchParams.get("category");
//   const searchValue = searchParams.get("value");
//   const gender = searchParams.get("gender");



//   const genderBannerMap = {
//     kids: bannerKids,
//     male: "https://i.ibb.co/tPPXQrm0/KELVINBAN4-2.jpg",
//     pets: "https://i.ibb.co/tpb0C03y/PETSBAN-1.jpg",
//     motivation: "https://i.ibb.co/qLwWjfDF/MOTIVATIONBAN.jpg",
//     fitness: "https://i.ibb.co/dsWDb1Xq/FITNESSBAN.jpg",
//   };
//   const bannerImg = genderBannerMap[gender?.toLowerCase()] || bannerDefault;

//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { products, latest_product } = useSelector((state) => state.home);

//   console.log("products11111111111", products);
//   console.log("latest_product", latest_product);


//   const [isLoginModalOpen, setLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
//   const [isForgetModalOpen, setForgetModalOpen] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(10);

//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   const query = {
//   //     searchValue: searchValue,
//   //   };
//   //   dispatch(search_products(query));
//   // }, [dispatch, searchValue]);
//   useEffect(() => {
//     (async () => {
//       try {
//         console.log("get_products call horaha hai...");
//         const res = await dispatch(get_products()).unwrap();
//         console.log("API se response:", res);
//       } catch (err) {
//         console.log("get_products error:", err);
//       }
//     })();
//   }, [dispatch]);


//   const add_wishlist = async (pro) => {
//     try {
//       const response = await dispatch(
//         add_to_wishlist({
//           userId: userInfo.id,
//           productId: pro._id,
//           name: pro.name,
//           price: pro.price,
//           image: pro.images[0],
//           discount: pro.discount,
//           rating: pro.rating,
//           slug: pro.slug,
//         })
//       ).unwrap();

//       toast.success(response.message);
//       dispatch(messageClear());
//     } catch (error) {
//       toast.error(error.error || "An error occurred");
//       dispatch(messageClear());
//     }
//   };

//   const openLoginModal = () => setLoginModalOpen(true);
//   const closeLoginModal = () => setLoginModalOpen(false);
//   const openForgetModal = () => setForgetModalOpen(true);
//   const openRegisterModal = () => {
//     setLoginModalOpen(false);
//     setRegisterModalOpen(true);
//   };
//   const closeRegisterModal = () => setRegisterModalOpen(false);
//   const closeForgetModal = () => setForgetModalOpen(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="bg-[#ecf1f2]">
//       <Header />
//       <div className="mt-[90px] md:pt-[50px]">
//         <div className="w-[100%] mx-auto">
//           <img src={bannerImg} alt="banner" className="w-full h-auto" />
//         </div>

//         <div className="w-[98%] md:w-[90%] mx-auto py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-2 ">
//             {products.map((p) => (
//               <div key={p._id} className="bg-white rounded shadow-sm">
//                 <div className="relative">
//                   <div className="absolute top-2 right-2 p-1 z-40">
//                     <CiHeart
//                       onClick={() => add_wishlist(p)}
//                       className="text-xl cursor-pointer text-gray-300"
//                     />
//                   </div>
//                   <Link to={`/product/details/${p.slug}`}>
//                     <img
//                       src={p.images?.[0]?.url}
//                       alt={p.name}
//                       className="w-full sm:h-56 md:h-full object-cover"
//                     />
//                   </Link>
//                 </div>
//                 <div className="mt-2">
//                   {/* <p className="text-gray-400 p-2">{p.category}</p> */}
//                   <div className="p-3">
//                     <Link to={`/product/details/${p.slug}`}>
//                       <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
//                         {p.name}
//                       </h3>
//                     </Link>
//                     <div className="flex items- flex-wrap gap-1">
//                       <span className="text-base font-bold text-gray-900">
//                         ₹
//                         {p.price -
//                           Math.floor((p.price * (p.discount || 0)) / 100)}
//                       </span>
//                       {p.discount > 0 && (
//                         <>
//                           <span className="text-sm text-gray-500 line-through">
//                             ₹{p.price}
//                           </span>
//                           <span className="text-sm font-semibold text-green-600 ml-1">
//                             ₹ {p.discount}% OFF
//                           </span>
//                         </>
//                       )}
//                     </div>
//                     <p className="text-xs text-purple-600 mt-1">
//                       Lowest price in last 30 days
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

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
//       <div className="fixed bottom-0 w-full sm:block md:hidden">
//         <MobileFooter />
//       </div>
//     </div>
//   );
// };

// export default SearchProduct;


import React, { useEffect, useState } from "react";
import bannerDefault from "../assets/banner/banner1.jpg";
import bannerKids from "../assets/banner/banmen1.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CiHeart } from "react-icons/ci";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import {
  get_products,
} from "../store/reducers/homeReducer";
import { add_to_wishlist } from "../store/reducers/cardReducer";
import { toast } from "react-toastify";
import { messageClear } from "../store/reducers/authReducer";
import { Link, useSearchParams } from "react-router-dom";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchValue = searchParams.get("value");
  const gender = searchParams.get("gender");

  const genderBannerMap = {
    kids: bannerKids,
    male: "https://i.ibb.co/tPPXQrm0/KELVINBAN4-2.jpg",
    pets: "https://i.ibb.co/tpb0C03y/PETSBAN-1.jpg",
    motivation: "https://i.ibb.co/qLwWjfDF/MOTIVATIONBAN.jpg",
    fitness: "https://i.ibb.co/dsWDb1Xq/FITNESSBAN.jpg",
  };
  const bannerImg = genderBannerMap[gender?.toLowerCase()] || bannerDefault;

  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { products, totalProduct } = useSelector((state) => state.home);

  console.log("products11111111111", products);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Fixed useEffect to handle page reloads
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching products...");
        await dispatch(get_products({
          page: 1,
          limit: 100,
          // Add any filters you need from URL params
          category: category,
          searchValue: searchValue,
          gender: gender
        })).unwrap();
      } catch (err) {
        console.log("get_products error:", err);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch products on component mount and when URL params change
    fetchProducts();
  }, [dispatch, category, searchValue, gender]);

  const add_wishlist = async (pro) => {
    if (!userInfo) {
      setLoginModalOpen(true);
      return;
    }

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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#ecf1f2] min-h-screen">
        <Header />
        <div className="mt-[90px] md:pt-[50px] flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="mt-[90px] md:pt-[50px]">
        <div className="w-[100%] mx-auto">
          <img src={bannerImg} alt="banner" className="w-full h-auto" />
        </div>

        <div className="w-[98%] md:w-[90%] mx-auto py-8">
          {!products || products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-600">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-2 ">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded shadow-sm">
                  <div className="relative">
                    <div className="absolute top-2 right-2 p-1 z-40">
                      <CiHeart
                        onClick={() => add_wishlist(p)}
                        className="text-xl cursor-pointer text-gray-300 hover:text-red-500 transition-colors"
                      />
                    </div>
                    <Link onClick={() => handleProductClick(p)}
                      to={`/product/details/${p.slug}`}>
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.name}
                        className="w-full sm:h-56 md:h-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="mt-2">
                    <div className="p-3">
                      <Link onClick={() => handleProductClick(p)}
                        to={`/product/details/${p.slug}`}>
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
                              {p.discount}% OFF
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

export default SearchProduct;

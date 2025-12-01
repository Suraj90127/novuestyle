// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   ShoppingBag,
//   Star,
//   ShoppingCart,
//   User,
//   MessageCircle
// } from "lucide-react";

// const MobileFooter = () => {
//   const location = useLocation();

//   const menuItems = [
//     {
//       path: "/",
//       icon: Home,
//       label: "Home",
//       active: location.pathname === "/"
//     },
//     {
//       path: "/collections",
//       icon: ShoppingBag,
//       label: "Shop",
//       active: location.pathname === "/collections"
//     },
//     {
//       path: "/cart",
//       icon: ShoppingCart,
//       label: "Cart",
//       active: location.pathname === "/cart"
//     },
//     {
//       path: "/dashboard-client",
//       icon: User,
//       label: "Account",
//       active: location.pathname === "/dashboard-client"
//     }
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 z-[100] block md:hidden">
//       <div className="grid grid-cols-4 gap-1">
//         {menuItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className="flex flex-col items-center justify-center group"
//           >
//             <div className={`relative p-2 rounded-xl transition-all duration-300 ${item.active
//                 ? "bg-primary/20 text-primary"
//                 : "text-gray-600 hover:text-primary hover:bg-gray-50"
//               }`}>
//               <item.icon
//                 className={`w-5 h-5 transition-all duration-300 ${item.active ? "scale-110" : "group-hover:scale-105"
//                   }`}
//                 strokeWidth={item.active ? 2.5 : 2}
//               />

//               {/* Active indicator dot */}
//               {item.active && (
//                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
//               )}
//             </div>

//             <span className={`text-xs font-medium mt-1 transition-all duration-300 ${item.active ? "text-primary" : "text-gray-600 group-hover:text-primary"
//               }`}>
//               {item.label}
//             </span>
//           </Link>
//         ))}

//       </div>

//       {/* Cart Badge - You can integrate this with your cart state */}
//       {/* <div className="absolute top-1 right-1/4 transform translate-x-3 -translate-y-1">
//         <div className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//           3
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default MobileFooter;


import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import { userDetail } from "../store/reducers/authReducer";

const MobileFooter = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // console.log("userInfo", userInfo);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);

  useEffect(() => {
    // Dispatch actions to fetch categories and products on component mount
    dispatch(userDetail());
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


  const handleNavigate = () => {
    if (!userInfo) {
      openLoginModal();
    } else {
      navigate("/dashboard-client");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 z-[100] block md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {/* Home Link */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center group"
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ${location.pathname === "/"
            ? "bg-primary/20 text-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}>
            <Home
              className={`w-5 h-5 transition-all duration-300 ${location.pathname === "/" ? "scale-110" : "group-hover:scale-105"
                }`}
              strokeWidth={location.pathname === "/" ? 2.5 : 2}
            />
            {location.pathname === "/" && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className={`text-xs font-medium mt-1 transition-all duration-300 ${location.pathname === "/" ? "text-primary" : "text-gray-600 group-hover:text-primary"
            }`}>
            Home
          </span>
        </Link>

        {/* Shop Link */}
        <Link
          to="/collections"
          className="flex flex-col items-center justify-center group"
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ${location.pathname === "/collections"
            ? "bg-primary/20 text-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}>
            <ShoppingBag
              className={`w-5 h-5 transition-all duration-300 ${location.pathname === "/collections" ? "scale-110" : "group-hover:scale-105"
                }`}
              strokeWidth={location.pathname === "/collections" ? 2.5 : 2}
            />
            {location.pathname === "/collections" && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className={`text-xs font-medium mt-1 transition-all duration-300 ${location.pathname === "/collections" ? "text-primary" : "text-gray-600 group-hover:text-primary"
            }`}>
            Shop
          </span>
        </Link>

        {/* Cart Link */}
        <Link
          to="/cart"
          className="flex flex-col items-center justify-center group"
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ${location.pathname === "/cart"
            ? "bg-primary/20 text-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}>
            <ShoppingCart
              className={`w-5 h-5 transition-all duration-300 ${location.pathname === "/cart" ? "scale-110" : "group-hover:scale-105"
                }`}
              strokeWidth={location.pathname === "/cart" ? 2.5 : 2}
            />
            {location.pathname === "/cart" && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className={`text-xs font-medium mt-1 transition-all duration-300 ${location.pathname === "/cart" ? "text-primary" : "text-gray-600 group-hover:text-primary"
            }`}>
            Cart
          </span>
        </Link>

        {/* Account Link */}
        <button
          onClick={handleNavigate}
          className="flex flex-col items-center justify-center group w-full"
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ${location.pathname === "/dashboard-client"
            ? "bg-primary/20 text-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}>
            <User
              className={`w-5 h-5 transition-all duration-300 ${location.pathname === "/dashboard-client" ? "scale-110" : "group-hover:scale-105"
                }`}
              strokeWidth={location.pathname === "/dashboard-client" ? 2.5 : 2}
            />
            {location.pathname === "/dashboard-client" && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className={`text-xs font-medium mt-1 transition-all duration-300 ${location.pathname === "/dashboard-client" ? "text-primary" : "text-gray-600 group-hover:text-primary"
            }`}>
            Account
          </span>
        </button>
      </div>

      {/* Cart Badge - You can integrate this with your cart state */}
      {/* <div className="absolute top-1 right-1/4 transform translate-x-3 -translate-y-1">
        <div className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          3
        </div>
      </div> */}

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
    </div>
  );
};

export default MobileFooter;
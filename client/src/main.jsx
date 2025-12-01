// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { Provider } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import store from "./store/index";
// import {
//   CheckCircle,
//   XCircle,
//   ShoppingCart,
//   Heart,
//   AlertCircle,
//   Truck,
//   X,
// } from "lucide-react";

// // Custom toast components
// const CustomToast = ({ type, message, icon: Icon }) => (
//   <div className="custom-toast">
//     <div className="toast-icon">
//       <Icon size={20} />
//     </div>
//     <div className="toast-content">
//       <span className="toast-message">{message}</span>
//     </div>
//     <button className="toast-close-btn">
//       <X size={16} />
//     </button>
//   </div>
// );

// // Custom toast functions
// export const toastSuccess = (message) =>
//   toast.success(message, {
//     icon: <CheckCircle size={20} className="text-green-500" />,
//     className: "toast-success",
//   });

// export const toastError = (message) =>
//   toast.error(message, {
//     icon: <XCircle size={20} className="text-red-500" />,
//     className: "toast-error",
//   });

// export const toastWarning = (message) =>
//   toast.warning(message, {
//     icon: <AlertCircle size={20} className="text-yellow-500" />,
//     className: "toast-warning",
//   });

// export const toastInfo = (message) =>
//   toast.info(message, {
//     icon: <Truck size={20} className="text-blue-500" />,
//     className: "toast-info",
//   });

// export const toastCart = (message) =>
//   toast(message, {
//     icon: <ShoppingCart size={20} className="text-purple-500" />,
//     className: "toast-cart",
//   });

// export const toastFavorite = (message) =>
//   toast(message, {
//     icon: <Heart size={20} className="text-pink-500" />,
//     className: "toast-favorite",
//   });

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <App />
//     <ToastContainer
//       position="top-right"
//       autoClose={4000}
//       hideProgressBar={false}
//       newestOnTop
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="light"
//       toastClassName="custom-toast-wrapper"
//       bodyClassName="custom-toast-body"
//       progressClassName="custom-toast-progress"
//       // theme="colored"
//       style={{
//         zIndex: 9999,
//       }}
//     />
//   </Provider>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer ,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/index"; // ✅ Remove curly braces - default import
import {
  CheckCircle,
  XCircle,
  ShoppingCart,
  Heart,
  AlertCircle,
  Truck,
} from "lucide-react";

export const toastSuccess = (message) =>
  toast.success(message, {
    icon: <CheckCircle size={20} className="text-green-500" />,
    className: "toast-success",
  });

export const toastError = (message) =>
  toast.error(message, {
    icon: <XCircle size={20} className="text-red-500" />,
    className: "toast-error",
  });

export const toastWarning = (message) =>
  toast.warning(message, {
    icon: <AlertCircle size={20} className="text-yellow-500" />,
    className: "toast-warning",
  });

export const toastInfo = (message) =>
  toast.info(message, {
    icon: <Truck size={20} className="text-blue-500" />,
    className: "toast-info",
  });

export const toastCart = (message) =>
  toast(message, {
    icon: <ShoppingCart size={20} className="text-purple-500" />,
    className: "toast-cart",
  });

export const toastFavorite = (message) =>
  toast(message, {
    icon: <Heart size={20} className="text-pink-500" />,
    className: "toast-favorite",
  });


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        zIndex: 9999,
      }}
    />
  </Provider>
);
// import React, { useState, useEffect } from "react";
// import img from "../assets/logo.png";
// import {
//   AiOutlineRight,
//   AiOutlineLeft,
//   AiOutlineQuestionCircle,
//   AiOutlineDown,
//   AiOutlineUp,
// } from "react-icons/ai";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import ForgetModal from "../components/CheckoutRight";
// import { customer_login, messageClear } from "../store/reducers/authReducer";
// import { useDispatch, useSelector } from "react-redux";
// import api from "../api/api";
// import LoginModal from "../Authentication/Login";
// import RegisterModal from "../Authentication/Register";
// import { place_order } from "../store/reducers/orderReducer";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";
// import { MdLock } from "react-icons/md";
// import { FaShoppingCart } from "react-icons/fa";
// import { sendMetaEventSafe } from "../utils/sendMetaEvent";

// // --------------------------------------------------------
// // Order Summary Component (same design as screenshot)
// // --------------------------------------------------------
// function OrderSummary({ price, items, products, shipping_fee }) {
//   const [open, setOpen] = useState(false);
//   // console.log("products   qq", products);

//   const save = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const firstErrorField = Object.keys(errors)[0];
//       const el = document.querySelector(`[name="${firstErrorField}"]`);
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }

//     Cookies.set("shippingAddress", JSON.stringify(state), { expires: 7 });
//     setRes(true);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//       {/* Header */}
//       <div
//         className="justify-between items-center p-4 cursor-pointer"
//       // onClick={() => setOpen(!open)}
//       >
//         <div className="flex justify-between pb-2">
//           <h2 className="text-[17px] flex text-gray-700 ">
//             <span className="mr-2 mt-1">
//               <FaShoppingCart />
//             </span>
//             <span>Order Summary</span>
//           </h2>
//           <p className="text-sm text-gray-500">{items} items</p>
//           {/* <p className="text-green-600 text-sm font-medium">
//             ₹800 saved so far
//           </p> */}
//         </div>

//         <div className="border-t border-gray-200">
//           {products.map((shop, i) => (
//             <div key={i} className="my-4">
//               {/* <h3 className="font-semibold text-gray-800 mb-1">
//                 {shop.shopName}
//               </h3> */}

//               {shop.products.map((p, j) => {
//                 const discounted =
//                   p.productInfo.price -
//                   Math.floor(
//                     (p.productInfo.price * p.productInfo.discount) / 100
//                   );

//                 return (
//                   <div
//                     key={j}
//                     className="flex md:gap-16 sm:gap-5 border border-gray-200 rounded-lg mb-2"
//                   >
//                     <img
//                       src={p.productInfo.images[0].url}
//                       className="sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-md border object-cover"
//                     />

//                     <div className="flex flex-col gap-2 sm:gap-0 mt-2">
//                       <p className="font-medium text-gray-800 text-sm line-clamp-1">
//                         {p.productInfo.name}
//                       </p>
//                       <div className="flex gap-2">
//                         <p className="font-normal text-gray-700 text-base">
//                           ₹{discounted}
//                         </p>
//                         <p className="line-through text-gray-400 text-base font-light">
//                           ₹{p.productInfo.price}
//                         </p>
//                       </div>

//                       <p className="font-light text-gray-700 text-base">
//                         {p.color} / {p.size}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>

//         <div className="font-normal text-md space-y-2 bg-gray-200 p-4 rounded-md">
//           <p className="flex justify-between">
//             <span className="">MRP Total</span>
//             <span className="">₹ {price}</span>
//           </p>
//           <p className="flex justify-between">
//             <span className="">Shipping</span>
//             <span className="">₹ {shipping_fee}</span>
//           </p>
//           <p className="flex justify-between">
//             <span className="">Total</span>
//             <span className="">₹ {price + shipping_fee}</span>
//           </p>
//         </div>

//         {/* 
//         {open ? (
//           <AiOutlineUp className="text-gray-600 ml-3" />
//         ) : (
//           <AiOutlineDown className="text-gray-600 ml-3" />
//         )} */}
//       </div>

//       {/* Expanded section */}
//       {/* {open && ( */}

//       {/* )} */}
//     </div>
//   );
// }

// // --------------------------------------------------------
// // Main Checkout Page
// // --------------------------------------------------------

// export default function CheckoutPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [email, setEmail] = useState("");
//   const { userInfo } = useSelector((state) => state.auth);

//   const [isLoginModalOpen, setLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
//   const [isForgetModalOpen, setForgetModalOpen] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [res, setRes] = useState(false);

//   const [state, setState] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     post: "",
//     province: "",
//     city: "",
//     area: "",
//   });

//   const inputHandle = (e) => {
//     setState({
//       ...state,
//       [e.target.name]: e.target.value,
//     });
//   };

//   useEffect(() => {
//     const savedAddress = Cookies.get("shippingAddress");
//     if (savedAddress) {
//       setState(JSON.parse(savedAddress));
//       setRes(true);
//     }
//   }, []);

//   const validateForm = () => {
//     let newErrors = {};

//     if (!state.name.trim()) newErrors.name = "Name is required";
//     else if (state.name.trim().length < 3)
//       newErrors.name = "Name must be at least 3 characters";

//     if (!state.address.trim()) newErrors.address = "Address is required";

//     if (!state.phone.trim()) newErrors.phone = "Phone number is required";
//     else if (!/^\d{10}$/.test(state.phone))
//       newErrors.phone = "Phone number must be 10 digits";

//     if (!state.post.trim()) newErrors.post = "Pin code is required";
//     else if (!/^\d{6}$/.test(state.post))
//       newErrors.post = "Pin code must be 6 digits";

//     if (!state.province.trim()) newErrors.province = "State is required";

//     if (!state.city.trim()) newErrors.city = "City is required";

//     if (!state.area.trim()) newErrors.area = "Landmark / area is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const {
//     state: { products, price, shipping_fee, items },
//   } = useLocation();

//   console.log("shipping_fee on checkout", shipping_fee);

//   // SAVE ADDRESS
//   // const save = (e) => {
//   //   e.preventDefault();
//   //   const { name, address, phone, post, province, city, area } = state;
//   //   if (name && address && phone && post && province && city && area) {
//   //     Cookies.set("shippingAddress", JSON.stringify(state), { expires: 7 });
//   //     setRes(true);
//   //   }
//   // };

//   const save = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const firstErrorField = Object.keys(errors)[0];
//       const el = document.querySelector(`[name="${firstErrorField}"]`);
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }

//     Cookies.set("shippingAddress", JSON.stringify(state), { expires: 7 });
//     setRes(true);
//   };

//   const clearAddress = () => {
//     Cookies.remove("shippingAddress");
//     setRes(false);
//     setState({
//       name: "",
//       address: "",
//       phone: "",
//       post: "",
//       province: "",
//       city: "",
//       area: "",
//     });
//   };

//   const placeOrderNow = () => {
//     if (!validateForm()) {
//       const firstErrorField = Object.keys(errors)[0];
//       const el = document.querySelector(`[name="${firstErrorField}"]`);
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }
//     dispatch(
//       place_order({
//         price,
//         products,
//         shipping_fee,
//         shippingInfo: state,
//         userId: userInfo.id,
//         navigate,
//         items,
//       })
//     );
//     sendMetaEventSafe({
//       eventType: "InitiateCheckout",
//       price: price + shipping_fee,
//       order: products[0].products,
//       products: products,
//       userInfo: userInfo,
//     });
//     // sendMetaEvent("Purchase", price, order, products, userInfo);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 overflow-x-hidden">
//       <header className="flex justify-between items-center py-2 px-4 md:px-12 border-b bg-white">
//         <img
//           src={`https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png`}
//           alt="Logo"
//           className=" h-[60px]"
//         />
//         <p className="text-gray-400 flex items-center justify-center gap-2 font-medium">
//           100% secure payment{" "}
//           <span>
//             <MdLock />
//           </span>
//         </p>
//       </header>
//       <div className="flex flex-col items-center flex-1 overflow-y-auto py-6 px-1">
//         <div className="w-full md:w-[70%] mx-auto">
//           {/* ORDER SUMMARY DROPDOWN */}
//           <OrderSummary
//             price={price}
//             items={items}
//             products={products}
//             shipping_fee={shipping_fee}
//           />

//           {/* Address Form */}
//           <div className="bg-white p-6 shadow-sm rounded-md">
//             {!res && (
//               <form onSubmit={save}>
//                 <h2 className="text-2xl font-[500] mb-4">Shipping address</h2>

//                 <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600">
//                   <div className="flex flex-col gap-1 w-full">
//                     <label>Name</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.name}
//                       type="text"
//                       name="name"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="Name"
//                     />
//                     {errors.name && (
//                       <p className="text-red-500 text-sm">{errors.name}</p>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-1 w-full">
//                     <label>Address</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.address}
//                       type="text"
//                       name="address"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="House / street"
//                     />
//                     {errors.address && (
//                       <p className="text-red-500 text-sm">{errors.address}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600 mt-4">
//                   <div className="flex flex-col gap-1 w-full">
//                     <label>Phone</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.phone}
//                       type="number"
//                       name="phone"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="Phone"
//                     />
//                     {errors.phone && (
//                       <p className="text-red-500 text-sm">{errors.phone}</p>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-1 w-full">
//                     <label>Pin Code</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.post}
//                       type="text"
//                       name="post"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="Pin code"
//                     />
//                     {errors.post && (
//                       <p className="text-red-500 text-sm">{errors.post}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600 mt-4">
//                   <div className="flex flex-col gap-1 w-full">
//                     <label>State</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.province}
//                       type="text"
//                       name="province"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="State"
//                     />
//                     {errors.province && (
//                       <p className="text-red-500 text-sm">{errors.province}</p>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-1 w-full">
//                     <label>City</label>
//                     <input
//                       onChange={inputHandle}
//                       value={state.city}
//                       type="text"
//                       name="city"
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="City"
//                     />
//                     {errors.city && (
//                       <p className="text-red-500 text-sm">{errors.city}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1 w-full mt-4">
//                   <label>Landmark</label>
//                   <input
//                     onChange={inputHandle}
//                     value={state.area}
//                     type="text"
//                     name="area"
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="Near area..."
//                   />
//                   {errors.area && (
//                     <p className="text-red-500 text-sm">{errors.area}</p>
//                   )}
//                 </div>

//                 <button className="mt-4 px-3 py-2 rounded bg-primary text-white">
//                   Save
//                 </button>
//               </form>
//             )}

//             {res && (
//               <div className="">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-lg font-semibold">
//                       Delivery Information
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       Deliver to {state.name}
//                     </p>
//                   </div>

//                   <button
//                     onClick={clearAddress}
//                     className="text-primary font-medium"
//                   >
//                     Change
//                   </button>
//                 </div>

//                 <p className="text-gray-600 text-sm">
//                   {state.address}, {state.area}, {state.city}, {state.province}{" "}
//                   — {state.post}
//                 </p>

//                 <p className="text-gray-600 text-sm mt-4">
//                   Email: {userInfo?.email}
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col gap-6 items-center justify-center mt-6 mb-[100px]">
//             <h3 className="text-2xl text-gray-300 font-semibold">
//               Powered By Novue Style
//             </h3>
//             <img
//               src="https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png"
//               alt="img"
//               className="h-[100px] w-auto"
//             />
//           </div>

//           {/* CONTINUE BUTTON */}
//           <div className="flex flex-col gap-2 justify-between items-center mt-8 fixed bottom-0  bg-white py-4 w-full md:w-[70%] border-t">
//             <button
//               onClick={placeOrderNow}
//               // disabled={!res}
//               className="bg-primary text-white px-6 py-2 w-full"
//             >
//               Continue to shipping
//             </button>

//             <Link
//               to="/cart"
//               className="flex items-center text-primary border w-full justify-center px-6 py-2"
//             >
//               <button className="flex items-center text-primary">
//                 <AiOutlineLeft className="mr-1" /> Return to cart
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Right Side Panel */}
//       {/* <div className="hidden md:block bg-gray-100 w-1/3 p-6 sticky top-0 h-screen overflow-y-auto">
//         <ForgetModal products={products} price={price} />
//       </div> */}

//       {isLoginModalOpen && (
//         <LoginModal
//           closeModal={() => setLoginModalOpen(false)}
//           openRegisterModal={() => setRegisterModalOpen(true)}
//           openForgetModal={() => setForgetModalOpen(true)}
//         />
//       )}

//       {isRegisterModalOpen && (
//         <RegisterModal
//           closeModal={() => setRegisterModalOpen(false)}
//           openLoginModal={() => setLoginModalOpen(true)}
//         />
//       )}

//       {isForgetModalOpen && (
//         <ForgetModal
//           closeModal={() => setForgetModalOpen(false)}
//           openLoginModal={() => setLoginModalOpen(true)}
//         />
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  AiOutlineLeft,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ForgetModal from "../components/CheckoutRight";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import { place_order } from "../store/reducers/orderReducer";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { MdLock, MdEdit, MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";

// --------------------------------------------------------
// Order Summary Component (same design as screenshot)
// --------------------------------------------------------
function OrderSummary({ price, items, products, shipping_fee }) {
  const [open, setOpen] = useState(false);

  console.log("shipping_fee", shipping_fee);


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header */}
      <div className="justify-between items-center p-4 cursor-pointer">
        <div className="flex justify-between pb-2">
          <h2 className="text-[17px] flex text-gray-700 ">
            <span className="mr-2 mt-1">
              <FaShoppingCart />
            </span>
            <span>Order Summary</span>
          </h2>
          <p className="text-sm text-gray-500">{items} items</p>
        </div>

        <div className="border-t border-gray-200">
          {products?.map((shop, i) => (
            <div key={i} className="my-4">
              {shop.products.map((p, j) => {
                const discounted =
                  p.productInfo.price -
                  Math.floor(
                    (p.productInfo.price * p.productInfo.discount) / 100
                  );

                return (
                  <div
                    key={j}
                    className="flex md:gap-16 sm:gap-5 border border-gray-200 rounded-lg mb-2"
                  >
                    <img
                      src={p.productInfo.images[0].url}
                      className="sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-md border object-cover"
                    />

                    <div className="flex flex-col gap-2 sm:gap-0 mt-2">
                      <p className="font-medium text-gray-800 text-sm line-clamp-1">
                        {p.productInfo.name}
                      </p>
                      <div className="flex gap-2">
                        <p className="font-normal text-gray-700 text-base">
                          ₹{discounted}
                        </p>
                        <p className="line-through text-gray-400 text-base font-light">
                          ₹{p.productInfo.price}
                        </p>
                      </div>

                      <p className="font-light text-gray-700 text-base">
                        {p.color} / {p.size}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="font-normal text-md space-y-2 bg-gray-200 p-4 rounded-md">
          <p className="flex justify-between">
            <span className="">MRP Total</span>
            <span className="">₹ {price}</span>
          </p>
          <p className="flex justify-between">
            <span className="">Shipping</span>
            <span className="">₹ {shipping_fee}</span>
          </p>
          <p className="flex justify-between">
            <span className="">Total</span>
            <span className="">₹ {price + shipping_fee || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Address Form Component
// --------------------------------------------------------
function AddressForm({
  address,
  onSave,
  onCancel,
  isEditing = false,
  errors = {}
}) {
  const [formData, setFormData] = useState(
    address || {
      name: "",
      address: "",
      phone: "",
      post: "",
      province: "",
      city: "",
      area: "",
    }
  );

  const inputHandle = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm rounded-md">
      <h2 className="text-2xl font-[500] mb-4">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h2>

      <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600">
        <div className="flex flex-col gap-1 w-full">
          <label>Name</label>
          <input
            onChange={inputHandle}
            value={formData.name}
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label>Address</label>
          <input
            onChange={inputHandle}
            value={formData.address}
            type="text"
            name="address"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="House / street"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600 mt-4">
        <div className="flex flex-col gap-1 w-full">
          <label>Phone</label>
          <input
            onChange={inputHandle}
            value={formData.phone}
            type="number"
            name="phone"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Phone"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label>Pin Code</label>
          <input
            onChange={inputHandle}
            value={formData.post}
            type="text"
            name="post"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Pin code"
          />
          {errors.post && (
            <p className="text-red-500 text-sm">{errors.post}</p>
          )}
        </div>
      </div>

      <div className="flex md:flex-row sm:flex-col gap-5 text-slate-600 mt-4">
        <div className="flex flex-col gap-1 w-full">
          <label>State</label>
          <input
            onChange={inputHandle}
            value={formData.province}
            type="text"
            name="province"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="State"
          />
          {errors.province && (
            <p className="text-red-500 text-sm">{errors.province}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label>City</label>
          <input
            onChange={inputHandle}
            value={formData.city}
            type="text"
            name="city"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full mt-4">
        <label>Landmark</label>
        <input
          onChange={inputHandle}
          value={formData.area}
          type="text"
          name="area"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Near area..."
        />
        {errors.area && (
          <p className="text-red-500 text-sm">{errors.area}</p>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" className="px-4 py-2 rounded bg-primary text-white">
          {isEditing ? "Update Address" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// --------------------------------------------------------
// Address Card Component
// --------------------------------------------------------
function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-200'
        }`}
      onClick={() => onSelect(address)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{address.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      <div className={`w-4 h-4 rounded-full border mb-2 ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'
        }`}></div>

      <p className="text-sm text-gray-600">
        {address.address}, {address.area}, {address.city}, {address.province} - {address.post}
      </p>
      <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
    </div>
  );
}

// --------------------------------------------------------
// Utility functions for user-specific address storage
// --------------------------------------------------------
const getUserAddressesKey = (userId) => `userAddresses_${userId}`;
const getUserSelectedAddressKey = (userId) => `selectedAddress_${userId}`;

const loadUserAddresses = (userId) => {
  try {
    const addressesKey = getUserAddressesKey(userId);
    const selectedAddressKey = getUserSelectedAddressKey(userId);

    const savedAddresses = Cookies.get(addressesKey);
    const selectedAddr = Cookies.get(selectedAddressKey);

    const addresses = savedAddresses ? JSON.parse(savedAddresses) : [];
    const selectedAddress = selectedAddr ? JSON.parse(selectedAddr) : null;

    return { addresses, selectedAddress };
  } catch (error) {
    console.error("Error loading user addresses:", error);
    return { addresses: [], selectedAddress: null };
  }
};

const saveUserAddresses = (userId, addresses) => {
  try {
    const addressesKey = getUserAddressesKey(userId);
    Cookies.set(addressesKey, JSON.stringify(addresses), { expires: 30 }); // 30 days expiry
  } catch (error) {
    console.error("Error saving user addresses:", error);
  }
};

const saveUserSelectedAddress = (userId, selectedAddress) => {
  try {
    const selectedAddressKey = getUserSelectedAddressKey(userId);
    if (selectedAddress) {
      Cookies.set(selectedAddressKey, JSON.stringify(selectedAddress), { expires: 30 });
    } else {
      Cookies.remove(selectedAddressKey);
    }
  } catch (error) {
    console.error("Error saving selected address:", error);
  }
};

// --------------------------------------------------------
// Main Checkout Page
// --------------------------------------------------------

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    state: { products, price, shipping_fee, items },
  } = useLocation();

  // Load addresses for current user on component mount
  useEffect(() => {
    if (userInfo && userInfo.id) {
      const { addresses: loadedAddresses, selectedAddress: loadedSelectedAddress } =
        loadUserAddresses(userInfo.id);

      setAddresses(loadedAddresses);

      // Set selected address
      if (loadedSelectedAddress) {
        setSelectedAddress(loadedSelectedAddress);
      } else if (loadedAddresses.length > 0) {
        setSelectedAddress(loadedAddresses[0]);
      }
    }
  }, [userInfo]);

  // Save addresses to cookies whenever addresses change for current user
  useEffect(() => {
    if (userInfo && userInfo.id && addresses.length > 0) {
      saveUserAddresses(userInfo.id, addresses);
    }
  }, [addresses, userInfo]);

  // Save selected address to cookies whenever it changes for current user
  useEffect(() => {
    if (userInfo && userInfo.id) {
      saveUserSelectedAddress(userInfo.id, selectedAddress);
    }
  }, [selectedAddress, userInfo]);

  const validateForm = (formData) => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!formData.post.trim()) newErrors.post = "Pin code is required";
    else if (!/^\d{6}$/.test(formData.post))
      newErrors.post = "Pin code must be 6 digits";

    if (!formData.province.trim()) newErrors.province = "State is required";

    if (!formData.city.trim()) newErrors.city = "City is required";

    if (!formData.area.trim()) newErrors.area = "Landmark / area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = (formData) => {
    if (!validateForm(formData)) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(addr =>
        addr === editingAddress ? formData : addr
      );
      setAddresses(updatedAddresses);

      // Update selected address if it was the one being edited
      if (selectedAddress === editingAddress) {
        setSelectedAddress(formData);
      }

      setEditingAddress(null);
    } else {
      // Add new address
      const newAddresses = [...addresses, formData];
      setAddresses(newAddresses);

      // Auto-select the first address
      if (newAddresses.length === 1) {
        setSelectedAddress(formData);
      }
    }

    setShowAddressForm(false);
    setErrors({});
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressToDelete) => {
    const updatedAddresses = addresses.filter(addr => addr !== addressToDelete);
    setAddresses(updatedAddresses);

    // If deleted address was selected, select another one or clear selection
    if (selectedAddress === addressToDelete) {
      setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
    setErrors({});
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setErrors({});
  };

  const placeOrderNow = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!validateForm(selectedAddress)) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    dispatch(
      place_order({
        price,
        products,
        shipping_fee,
        shippingInfo: selectedAddress,
        userId: userInfo.id,
        navigate,
        items,
      })
    );

    sendMetaEventSafe({
      eventType: "InitiateCheckout",
      price: price + shipping_fee,
      order: products[0].products,
      products: products,
      userInfo: userInfo,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show login prompt if user is not logged in
  if (!userInfo || !userInfo.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to manage your addresses and proceed with checkout.</p>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="flex justify-between items-center py-2 px-4 md:px-12 border-b bg-white">
        <img
          src={`https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png`}
          alt="Logo"
          className=" h-[60px]"
        />
        <p className="text-gray-400 flex items-center justify-center gap-2 font-medium">
          100% secure payment{" "}
          <span>
            <MdLock />
          </span>
        </p>
      </header>

      <div className="flex flex-col items-center flex-1 overflow-y-auto py-6 px-1">
        <div className="w-full md:w-[70%] mx-auto">
          {/* ORDER SUMMARY */}
          <OrderSummary
            price={price}
            items={items}
            products={products}
            shipping_fee={shipping_fee}
          />

          {/* Address Management */}
          <div className="bg-white p-6 shadow-sm rounded-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-[500]">Shipping Address</h2>
              <button
                onClick={handleAddNewAddress}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Add More Address
              </button>
            </div>

            {showAddressForm ? (
              <AddressForm
                address={editingAddress}
                onSave={handleSaveAddress}
                onCancel={cancelAddressForm}
                isEditing={!!editingAddress}
                errors={errors}
              />
            ) : (
              <>
                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="grid gap-4 mb-6">
                    {addresses.map((address, index) => (
                      <AddressCard
                        key={index}
                        address={address}
                        isSelected={selectedAddress === address}
                        onSelect={handleSelectAddress}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteAddress}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No addresses saved. Please add a shipping address.
                  </div>
                )}

                {/* Selected Address Display */}
                {selectedAddress && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Selected Delivery Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">
                        {selectedAddress.name}
                      </p>
                      <p className="text-gray-600">
                        {selectedAddress.address}, {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.province} - {selectedAddress.post}
                      </p>
                      <p className="text-gray-600">Phone: {selectedAddress.phone}</p>
                      <p className="text-gray-600 mt-2">
                        Email: {userInfo?.email}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-6 items-center justify-center mt-6 mb-[100px]">
            <h3 className="text-2xl text-gray-300 font-semibold">
              Powered By Novue Style
            </h3>
            <img
              src="https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png"
              alt="img"
              className="h-[100px] w-auto"
            />
          </div>

          {/* CONTINUE BUTTON */}
          <div className="flex flex-col gap-2 justify-between items-center mt-8 fixed bottom-0 bg-white py-4 w-full md:w-[70%] border-t">
            <button
              onClick={placeOrderNow}
              disabled={!selectedAddress}
              className={`px-6 py-2 w-full ${selectedAddress
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Continue to shipping
            </button>

            <Link
              to="/cart"
              className="flex items-center text-primary border w-full justify-center px-6 py-2"
            >
              <button className="flex items-center text-primary">
                <AiOutlineLeft className="mr-1" /> Return to cart
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal
          closeModal={() => setLoginModalOpen(false)}
          openRegisterModal={() => setRegisterModalOpen(true)}
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
    </div>
  );
}
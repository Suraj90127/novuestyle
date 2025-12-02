// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import img2 from "../assets/banner/banner1.jpg";
// import Footer from "../components/Footer";
// import { AiOutlineQuestionCircle, AiOutlineDashboard, AiOutlineShopping, AiOutlineHeart, AiOutlineLogout } from "react-icons/ai";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import MobileFooter from "../components/MobileFooter";
// import { useDispatch, useSelector } from "react-redux";
// import { messageClear, userDetail } from "../store/reducers/authReducer";
// import { toast } from "react-toastify";
// import api from "../api/api";
// import { user_reset } from "../store/reducers/authReducer";
// import { reset_count } from "../store/reducers/cardReducer";
// import { get_orders } from "../store/reducers/orderReducer";
// import { IoMdMenu } from "react-icons/io";
// // import { userDetail } from './../store/reducers/authReducer';


// export default function Component() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const active = urlParams.get('active');
//   const { userInfo } = useSelector((state) => state.auth);
//   const { myOrders, order } = useSelector((state) => state.order);
//   const [isAddFormVisible, setIsAddFormVisible] = useState(false);
//   const [isEditFormVisible, setIsEditFormVisible] = useState(false);
//   const [country, setCountry] = useState("India");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [address, setAddress] = useState("");
//   const [apartment, setApartment] = useState("");
//   const [city, setCity] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [phone, setPhone] = useState("");
//   const [state, setState] = useState("all");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


//   useEffect(() => {
//     dispatch(get_orders({ status: state, customerId: userInfo.id }));
//   }, [state]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // dispatch(userDetail())
//     dispatch(messageClear());
//   });

//   const redirect = (ord) => {
//     let items = 0;
//     if (ord.products && Array.isArray(ord.products)) {
//       for (let i = 0; i < ord.products.length; i++) {
//         items += ord.products[i]?.quantity || 0;
//       }
//     }
//     navigate("/payment", {
//       state: {
//         price: ord.price,
//         items,
//         orderId: ord._id,
//       },
//     });
//   };

//   const logout = async () => {
//     try {
//       const { data } = await api.get("/customer/logout");
//       localStorage.removeItem("customerToken");
//       toast.success(data.message);
//       dispatch(user_reset());
//       dispatch(reset_count());
//       navigate("/");
//     } catch (error) {
//       toast.error(error.response.data);
//     }
//   };

//   const handleAddNewAddress = () => {
//     setIsAddFormVisible(!isAddFormVisible);
//     setIsEditFormVisible(false);
//   };

//   const handleEditAddress = () => {
//     setIsEditFormVisible(!isEditFormVisible);
//     setIsAddFormVisible(false);
//   };

//     useEffect(() => {
//     dispatch(userDetail());
//   }, [dispatch]);

//   const [activeSection, setActiveSection] = useState(active || "dashboard");

//   const user = {
//     name: userInfo?.name,
//     email: userInfo?.email,
//     address: {
//       name: userInfo?.name,
//       country: "India",
//     },
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header />

//       {/* Banner */}
      // <div className="mt-[100px] md:mt-[130px] lg:mt-[140px]">
      //   <div className="relative w-full   overflow-hidden">
      //     <img
      //       src={img2}
      //       alt="banner"
      //       className="w-full h-full object-cover"
      //     />
      //     {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      //       <h1 className="text-2xl md:text-4xl font-bold text-white">My Account</h1>
      //     </div> */}
      //   </div>
      // </div>

//       {/* Mobile Menu Toggle */}
//       <div className="md:hidden px-4 py-3 bg-white shadow-sm">
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="flex items-center justify-between w-full text-gray-700 font-medium"
//         >
//           <span>{activeSection === "dashboard" ? "Dashboard" : activeSection === "myorders" ? "My Orders" : "Account"}</span>
//           <IoMdMenu className="text-2xl" />
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 gap-6">
//         {/* Sidebar */}
//         <div className={`fixed right-0 top-0 sm:mt-[25%] md:mt-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-64 md:top-auto md:right-auto md:h-auto md:shadow-none z-50 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           } md:translate-x-0`}
//           style={{ top: 'var(--header-height, 0px)' }}
//         >
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="p-4 border-b flex justify-between items-center md:block">
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-800">Hello, {user?.name}</h3>
//                 <p className="text-sm text-gray-500">{user?.email}</p>
//               </div>
//               <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="md:hidden text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <nav className="space-y-1 p-2">
//               <button
//                 className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "dashboard"
//                   ? "bg-primary-100 text-primary-600"
//                   : "hover:bg-gray-100 text-gray-700"
//                   }`}
//                 onClick={() => {
//                   setActiveSection("dashboard");
//                   setMobileMenuOpen(false);
//                 }}
//               >
//                 <AiOutlineDashboard className="mr-3" />
//                 Dashboard
//               </button>

//               <button
//                 className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "myorders"
//                   ? "bg-primary-100 text-primary-600"
//                   : "hover:bg-gray-100 text-gray-700"
//                   }`}
//                 onClick={() => {
//                   setActiveSection("myorders");
//                   setMobileMenuOpen(false);
//                 }}
//               >
//                 <AiOutlineShopping className="mr-3" />
//                 My Orders
//               </button>

//               <Link to="/wishlist">
//                 <button
//                   className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "wishlist"
//                     ? "bg-primary-100 text-primary-600"
//                     : "hover:bg-gray-100 text-gray-700"
//                     }`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <AiOutlineHeart className="mr-3" />
//                   Wishlist
//                 </button>
//               </Link>

//               <button
//                 onClick={logout}
//                 className="w-full flex items-center px-4 py-3 text-left rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
//               >
//                 <AiOutlineLogout className="mr-3" />
//                 Logout
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           {activeSection === "dashboard" && (
//             <div className="space-y-6">
//               {/* Welcome Card */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h1 className="text-lg md:text-xl font-semibold text-gray-800">
//                   Hello {user?.name}{" "}
//                   <span className="text-gray-500 font-normal">
//                     ({user?.name}?
//                     <button
//                       className="ml-1 text-primary-600 hover:underline"
//                       onClick={logout}
//                     >
//                       Sign out
//                     </button>
//                     )
//                   </span>
//                 </h1>
//                 <p className="mt-2 text-gray-600">
//                   From your account dashboard you can view your recent orders, manage your
//                   shipping and billing addresses, and edit your password and account details.
//                 </p>
//               </div>

//               {/* Order History */}
//               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <h2 className="text-lg font-semibold p-6 border-b text-gray-800">
//                   Order History
//                 </h2>
//                 <div onClick={() => {
//                   setActiveSection("myorders");
//                   // setMobileMenuOpen(false);
//                 }} 
//                 className="bg-yellow-50 p-4 text-yellow-700 border-l-4 border-yellow-400">
//                   You have {myOrders.length} order(s) in your history
//                 </div>
//               </div>

//               {/* Account Details */}
//               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <h2 className="text-lg font-semibold p-6 border-b text-gray-800">
//                   Account details
//                 </h2>
//                 <div className="grid gap-4 p-6">
//                   <div className="flex flex-col sm:flex-row justify-between">
//                     <label className="font-medium text-gray-700">Name:</label>
//                     <div className="text-gray-600">{user?.name}</div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-between">
//                     <label className="font-medium text-gray-700">E-mail:</label>
//                     <div className="text-gray-600">{user?.email}</div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-between">
//                     <label className="font-medium text-gray-700">Address:</label>
//                     <div className="text-gray-600">Not set</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeSection === "addresses" && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   The following addresses will be used on the checkout page by default.
//                 </h2>
//               </div>

//               {/* Add New Address Section */}
//               <button
//                 onClick={handleAddNewAddress}
//                 className="px-6 py-3 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
//               >
//                 ADD A NEW ADDRESS
//               </button>

//               {isAddFormVisible && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
//                   <div className="space-y-4">
//                     <select
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                       value={country}
//                       onChange={(e) => setCountry(e.target.value)}
//                     >
//                       <option>Pakistan</option>
//                     </select>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={firstName}
//                           onChange={(e) => setFirstName(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={lastName}
//                           onChange={(e) => setLastName(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                         value={apartment}
//                         onChange={(e) => setApartment(e.target.value)}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={city}
//                           onChange={(e) => setCity(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={postalCode}
//                           onChange={(e) => setPostalCode(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div className="relative">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                       />
//                       <AiOutlineQuestionCircle className="absolute right-3 top-9 text-gray-400" />
//                     </div>

//                     <div className="flex justify-end space-x-3 pt-2">
//                       <button
//                         onClick={handleAddNewAddress}
//                         className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//                       >
//                         Save Address
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Default Address Section */}
//               <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
//                 <h3 className="text-base font-bold text-gray-800 mb-4">DEFAULT ADDRESS</h3>
//                 <div className="space-y-2 text-gray-600">
//                   <div>{user?.address?.name}</div>
//                   <div>{user?.address?.country}</div>
//                   <div className="flex gap-2 pt-4">
//                     <button
//                       onClick={handleEditAddress}
//                       className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
//                     >
//                       EDIT
//                     </button>
//                     <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
//                       DELETE
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Edit Address Form */}
//               {isEditFormVisible && (
//                 <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Edit Address</h3>
//                   <div className="space-y-4">
//                     <select
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                       value={country}
//                       onChange={(e) => setCountry(e.target.value)}
//                     >
//                       <option>India</option>
//                     </select>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={firstName}
//                           onChange={(e) => setFirstName(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={lastName}
//                           onChange={(e) => setLastName(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                         value={apartment}
//                         onChange={(e) => setApartment(e.target.value)}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={city}
//                           onChange={(e) => setCity(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                           value={postalCode}
//                           onChange={(e) => setPostalCode(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div className="relative">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                       />
//                       <AiOutlineQuestionCircle className="absolute right-3 top-9 text-gray-400" />
//                     </div>

//                     <div className="flex justify-end space-x-3 pt-2">
//                       <button
//                         onClick={handleEditAddress}
//                         className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//                       >
//                         Save Changes
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeSection === "myorders" && (
//             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//               <div className="p-6 border-b">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                   <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
//                   <select
//                     className="outline-none px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                     value={state}
//                     onChange={(e) => setState(e.target.value)}
//                   >
//                     <option value="all">All orders</option>
//                     <option value="placed">Placed</option>
//                     <option value="pending">Pending</option>
//                     <option value="cancelled">Cancelled</option>
//                     <option value="warehouse">Warehouse</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order Id
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Payment status
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order status
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//              <tbody className="bg-white divide-y divide-gray-200">
//   {myOrders?.length > 0 ? (
//     myOrders.map((o, i) => (
//       <tr
//         key={i}
//         onClick={() => navigate(`/dashboard/order/details/${o._id}`)}
//         className="hover:bg-gray-50 cursor-pointer"
//       >
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           #{o._id.slice(-8).toUpperCase()}
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           ₹{o.price}
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           <span
//             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//               o.payment_status === "paid"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-yellow-100 text-yellow-800"
//             }`}
//           >
//             {o.payment_status}
//           </span>
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           <span
//             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//               o.delivery_status === "delivered"
//                 ? "bg-green-100 text-green-800"
//                 : o.delivery_status === "cancelled"
//                 ? "bg-red-100 text-red-800"
//                 : "bg-blue-100 text-blue-800"
//             }`}
//           >
//             {o.delivery_status === "pending"
//               ? "To be Printed"
//               : o.delivery_status}
//           </span>
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//           {o.payment_status !== "paid" && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // prevent row click
//                 redirect(o);
//               }}
//               className="text-primary-600 hover:text-primary-900"
//             >
//               Pay Now
//             </button>
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td
//         colSpan="5"
//         className="px-6 py-4 text-center text-sm text-gray-500"
//       >
//         No orders found
//       </td>
//     </tr>
//   )}
// </tbody>

//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//       <div className="fixed bottom-0 w-full sm:block md:hidden">
//         <MobileFooter />
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import Header from "../components/Header";
import img2 from "../assets/banner/banner1.jpg";
import Footer from "../components/Footer";
import { 
  AiOutlineQuestionCircle, 
  AiOutlineDashboard, 
  AiOutlineShopping, 
  AiOutlineHeart, 
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineFileText
} from "react-icons/ai";
import { 
  IoMdMenu,
  IoIosArrowForward,
  IoIosArrowDown
} from "react-icons/io";
import { BsCreditCard, BsTruck } from "react-icons/bs";
import { Link, useNavigate, } from "react-router-dom";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { messageClear, userDetail } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import api from "../api/api";
import { user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";
import { get_orders } from "../store/reducers/orderReducer";

export default function Component() {
  const urlParams = new URLSearchParams(window.location.search);
  const active = urlParams.get('active');
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders, } = useSelector((state) => state.order);

  console.log("myorder",myOrders);
  
  
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [country, setCountry] = useState("India");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(get_orders({ status: state, customerId: userInfo.id }));
  }, [state]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(messageClear());
  }, [dispatch]);

  useEffect(() => {
    dispatch(userDetail());
  }, [dispatch]);

  const [activeSection, setActiveSection] = useState(active || "dashboard");

  const user = {
    name: userInfo?.name,
    email: userInfo?.email,
    address: {
      name: userInfo?.name,
      country: "India",
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const redirect = (ord) => {
    let items = 0;
    if (ord.products && Array.isArray(ord.products)) {
      for (let i = 0; i < ord.products.length; i++) {
        items += ord.products[i]?.quantity || 0;
      }
    }
    navigate("/payment", {
      state: {
        price: ord.price,
        items,
        orderId: ord._id,
      },
    });
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/customer/logout");
      localStorage.removeItem("customerToken");
      toast.success(data.message);
      dispatch(user_reset());
      dispatch(reset_count());
      navigate("/");
         // Force full page reload after navigation
    setTimeout(() => {
      window.location.reload();
    }, 100);
    } catch (error) {
      toast.error(error.response?.data || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    setIsAddFormVisible(!isAddFormVisible);
    setIsEditFormVisible(false);
  };

  const handleEditAddress = () => {
    setIsEditFormVisible(!isEditFormVisible);
    setIsAddFormVisible(false);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <AiOutlineDashboard /> },
    { id: "myorders", label: "My Orders", icon: <AiOutlineShopping /> },
    { id: "addresses", label: "Addresses", icon: <AiOutlineHome /> },
    { id: "account", label: "Account Details", icon: <AiOutlineUser /> },
    { id: "wishlist", label: "Wishlist", icon: <AiOutlineHeart />, link: "/wishlist" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      {/* Profile Header */}
      <div className="mt-[100px] md:mt-[130px] lg:mt-[140px]">
        <div className="relative w-full   overflow-hidden">
          <img
            src={img2}
            alt="banner"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white">My Account</h1>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden sticky top-[80px] z-30 bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full text-gray-700 font-medium py-2"
          >
            <div className="flex items-center space-x-3">
              {menuItems.find(item => item.id === activeSection)?.icon}
              <span>{menuItems.find(item => item.id === activeSection)?.label}</span>
            </div>
            {mobileMenuOpen ? <AiOutlineClose /> : <IoMdMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`lg:w-64 ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out' : 'hidden'} lg:block lg:relative lg:transform-none`}
            style={{ top: mobileMenuOpen ? 'var(--header-height, 97px)' : '0' }}
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full lg:h-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Quick Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>

              <nav className="space-y-1 p-4">
                {menuItems.map((item) => (
                  item.link ? (
                    <Link key={item.id} to={item.link}>
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${activeSection === item.id
                            ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                            : "hover:bg-gray-50 text-gray-700"
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.label}
                        </div>
                        <IoIosArrowForward className="text-gray-400" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${activeSection === item.id
                          ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                          : "hover:bg-gray-50 text-gray-700"
                        }`}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.label}
                      </div>
                      <IoIosArrowForward className="text-gray-400" />
                    </button>
                  )
                ))}
              </nav>

              {/* Stats Card */}
              <div className="p-4 border-t">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 ">
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Orders</p>
                      <p className="text-2xl font-bold">{myOrders?.length || 0}</p>
                    </div>
                    <BsTruck className="text-2xl opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{myOrders?.length || 0}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                        <AiOutlineShopping className="text-primary-600 text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                          {myOrders?.filter(o => o.delivery_status === 'pending').length || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <AiOutlineFileText className="text-yellow-600 text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Delivered</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                          {myOrders?.filter(o => o.delivery_status === 'delivered').length || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <BsTruck className="text-green-600 text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                          ₹{myOrders?.reduce((sum, o) => sum + (o.price || 0), 0) || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <BsCreditCard className="text-blue-600 text-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                      <button
                        onClick={() => setActiveSection("myorders")}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                      >
                        <span>View All</span>
                        <IoIosArrowForward />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myOrders?.slice(0, 5).map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/dashboard/order/details/${order._id}`)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium text-gray-900">{order.new_order_id}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              ₹{order.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                                {order.delivery_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!myOrders || myOrders.length === 0) && (
                      <div className="text-center py-12">
                        <AiOutlineShopping className="text-gray-300 text-4xl mx-auto mb-3" />
                        <p className="text-gray-500">No orders yet</p>
                        <Link to="/products">
                          <button className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Start Shopping
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{userInfo?.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveSection("myorders")}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center space-x-3"
                      >
                        <AiOutlineShopping className="text-primary-600 text-xl" />
                        <span className="font-medium">View Orders</span>
                      </button>
                      <button
                        onClick={() => setActiveSection("addresses")}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center space-x-3"
                      >
                        <AiOutlineHome className="text-primary-600 text-xl" />
                        <span className="font-medium">Manage Address</span>
                      </button>
                      <Link to="/products">
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center space-x-3 w-full">
                          <AiOutlineShopping className="text-primary-600 text-xl" />
                          <span className="font-medium">Continue Shopping</span>
                        </button>
                      </Link>
                      <button
                        onClick={logout}
                        className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
                      >
                        <AiOutlineLogout className="text-red-600 text-xl" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "addresses" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Addresses</h2>
                  <p className="text-gray-600">Add or edit your shipping addresses for faster checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Default Address Card */}
                  <div className="bg-white rounded-xl shadow-sm border-2 border-primary-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <AiOutlineHome className="mr-2" />
                        Default Address
                      </h3>
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-3 py-1 rounded-full">
                        Primary
                      </span>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="font-medium">{user?.address?.name}</p>
                      <p>{user?.address?.country}</p>
                      <p>Phone: Not provided</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleEditAddress}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <AiOutlineEdit />
                        <span>Edit</span>
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2 transition-colors">
                        <AiOutlineDelete />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Add New Address Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-200 p-6">
                    <button
                      onClick={handleAddNewAddress}
                      className="w-full h-full flex flex-col items-center justify-center p-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                        <AiOutlineHome className="text-primary-600 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Add New Address</h3>
                      <p className="text-gray-500 text-sm text-center mb-4">
                        Add a new shipping address for faster checkout
                      </p>
                      <span className="text-primary-600 font-medium">+ Add Address</span>
                    </button>
                  </div>
                </div>

                {/* Address Forms */}
                {(isAddFormVisible || isEditFormVisible) && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {isAddFormVisible ? "Add New Address" : "Edit Address"}
                      </h3>
                      <button
                        onClick={isAddFormVisible ? handleAddNewAddress : handleEditAddress}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <AiOutlineClose className="text-xl" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House number and street name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="Apartment, suite, unit, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="Enter postal code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Enter phone number"
                            />
                            <AiOutlineQuestionCircle className="absolute right-3 top-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={isAddFormVisible ? handleAddNewAddress : handleEditAddress}
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                        >
                          {isAddFormVisible ? "Save Address" : "Update Address"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "myorders" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col justify-between gap-4">
                    <div className="">
                      <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
                      <p className="text-gray-600 mt-1">Track and manage your orders</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="all">All Orders</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="warehouse">Warehouse</option>
                      </select>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {myOrders?.length > 0 ? (
                    myOrders.map((order) => (
                      <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-bold text-gray-800">
                                    Order  - {order.new_order_id}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                                    {order.delivery_status === "pending" ? "To be Printed" : order.delivery_status}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">
                                  Placed on {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <button
                                onClick={() => toggleOrderDetails(order._id)}
                                className="lg:hidden text-primary-600 hover:text-primary-700"
                              >
                                {expandedOrder === order._id ? <IoIosArrowDown /> : <IoIosArrowForward />}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-lg text-gray-800">₹{order.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Payment</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                                  {order.payment_status}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Items</p>
                                <p className="font-medium text-gray-800">
                                  {order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0} items
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Action</p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/dashboard/order/details/${order._id}`)}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                  >
                                    View Details
                                  </button>
                                  {/* {order.payment_status !== "paid" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        redirect(order);
                                      }}
                                      className="text-green-600 hover:text-green-700 text-sm font-medium ml-2"
                                    >
                                      Pay Now
                                    </button>
                                  )} */}
                                </div>
                              </div>
                            </div>

                            {/* Expanded Order Details */}
                            {expandedOrder === order._id && (
                              <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                                <h4 className="font-medium text-gray-800 mb-3">Order Details</h4>
                                <div className="space-y-3">
                                  {order.products?.map((product, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                      <div className="w-12 h-12 bg-gray-200 rounded">
                                        <img src={product.images[0].url} alt="" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                                        <p className="text-sm text-gray-500 mt-2">Color: {product.color}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex lg:flex-col gap-2 sm:justify-between">
                            <button
                              onClick={() => navigate(`/dashboard/order/details/${order._id}`)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            >
                              <AiOutlineEye />
                              <span className="">View</span>
                            </button>
                         {order.payment_status === "COD" ? (
                            order.codFeeStatus !== "paid" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  redirect(order);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                              >
                                <BsCreditCard />
                                <span className="">Pay</span>
                              </button>
                            )
                            ) : (
                              order.payment_status !== "paid" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    redirect(order);
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                >
                                  <BsCreditCard />
                                  <span className="">Pay</span>
                                </button>
                              )
                            )}
                                                      
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <AiOutlineShopping className="text-gray-300 text-5xl mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                      <Link to="/products">
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                          Start Shopping
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "account" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Details</h2>
                  <p className="text-gray-600">Update your personal information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          defaultValue={user?.name}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          defaultValue={user?.email}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <button className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium mt-4">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Password Update</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium mt-4">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden z-20">
        <MobileFooter />
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
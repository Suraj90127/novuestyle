import { useEffect, useState } from "react";
import Header from "../components/Header";
import img2 from "../assets/banner/banner1.jpg";
import Footer from "../components/Footer";
import { AiOutlineQuestionCircle, AiOutlineDashboard, AiOutlineShopping, AiOutlineHeart, AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { messageClear, userDetail } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import api from "../api/api";
import { user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";
import { get_orders } from "../store/reducers/orderReducer";
import { IoMdMenu } from "react-icons/io";
// import { userDetail } from './../store/reducers/authReducer';


export default function Component() {
  const urlParams = new URLSearchParams(window.location.search);
  const active = urlParams.get('active');
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders, order } = useSelector((state) => state.order);
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


  useEffect(() => {
    dispatch(get_orders({ status: state, customerId: userInfo.id }));
  }, [state]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // dispatch(userDetail())
    dispatch(messageClear());
  });

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
      const { data } = await api.get("/customer/logout");
      localStorage.removeItem("customerToken");
      toast.success(data.message);
      dispatch(user_reset());
      dispatch(reset_count());
      navigate("/");
    } catch (error) {
      toast.error(error.response.data);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Banner */}
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

      {/* Mobile Menu Toggle */}
      <div className="md:hidden px-4 py-3 bg-white shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full text-gray-700 font-medium"
        >
          <span>{activeSection === "dashboard" ? "Dashboard" : activeSection === "myorders" ? "My Orders" : "Account"}</span>
          <IoMdMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <div className={`fixed right-0 top-0 sm:mt-[25%] md:mt-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-64 md:top-auto md:right-auto md:h-auto md:shadow-none z-50 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0`}
          style={{ top: 'var(--header-height, 0px)' }}
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center md:block">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Hello, {user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1 p-2">
              <button
                className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "dashboard"
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
                onClick={() => {
                  setActiveSection("dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                <AiOutlineDashboard className="mr-3" />
                Dashboard
              </button>

              <button
                className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "myorders"
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
                onClick={() => {
                  setActiveSection("myorders");
                  setMobileMenuOpen(false);
                }}
              >
                <AiOutlineShopping className="mr-3" />
                My Orders
              </button>

              <Link to="/wishlist">
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${activeSection === "wishlist"
                    ? "bg-primary-100 text-primary-600"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiOutlineHeart className="mr-3" />
                  Wishlist
                </button>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-left rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <AiOutlineLogout className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  Hello {user?.name}{" "}
                  <span className="text-gray-500 font-normal">
                    ({user?.name}?
                    <button
                      className="ml-1 text-primary-600 hover:underline"
                      onClick={logout}
                    >
                      Sign out
                    </button>
                    )
                  </span>
                </h1>
                <p className="mt-2 text-gray-600">
                  From your account dashboard you can view your recent orders, manage your
                  shipping and billing addresses, and edit your password and account details.
                </p>
              </div>

              {/* Order History */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h2 className="text-lg font-semibold p-6 border-b text-gray-800">
                  Order History
                </h2>
                <div onClick={() => {
                  setActiveSection("myorders");
                  // setMobileMenuOpen(false);
                }} 
                className="bg-yellow-50 p-4 text-yellow-700 border-l-4 border-yellow-400">
                  You have {myOrders.length} order(s) in your history
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h2 className="text-lg font-semibold p-6 border-b text-gray-800">
                  Account details
                </h2>
                <div className="grid gap-4 p-6">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <label className="font-medium text-gray-700">Name:</label>
                    <div className="text-gray-600">{user?.name}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <label className="font-medium text-gray-700">E-mail:</label>
                    <div className="text-gray-600">{user?.email}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <label className="font-medium text-gray-700">Address:</label>
                    <div className="text-gray-600">Not set</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "addresses" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  The following addresses will be used on the checkout page by default.
                </h2>
              </div>

              {/* Add New Address Section */}
              <button
                onClick={handleAddNewAddress}
                className="px-6 py-3 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
              >
                ADD A NEW ADDRESS
              </button>

              {isAddFormVisible && (
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
                  <div className="space-y-4">
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option>Pakistan</option>
                    </select>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <AiOutlineQuestionCircle className="absolute right-3 top-9 text-gray-400" />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={handleAddNewAddress}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Default Address Section */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-800 mb-4">DEFAULT ADDRESS</h3>
                <div className="space-y-2 text-gray-600">
                  <div>{user?.address?.name}</div>
                  <div>{user?.address?.country}</div>
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleEditAddress}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                    >
                      EDIT
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      DELETE
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Address Form */}
              {isEditFormVisible && (
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Edit Address</h3>
                  <div className="space-y-4">
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option>India</option>
                    </select>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <AiOutlineQuestionCircle className="absolute right-3 top-9 text-gray-400" />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={handleEditAddress}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "myorders" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
                  <select
                    className="outline-none px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="all">All orders</option>
                    <option value="placed">Placed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="warehouse">Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
             <tbody className="bg-white divide-y divide-gray-200">
  {myOrders?.length > 0 ? (
    myOrders.map((o, i) => (
      <tr
        key={i}
        onClick={() => navigate(`/dashboard/order/details/${o._id}`)}
        className="hover:bg-gray-50 cursor-pointer"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{o._id.slice(-8).toUpperCase()}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ₹{o.price}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              o.payment_status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {o.payment_status}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              o.delivery_status === "delivered"
                ? "bg-green-100 text-green-800"
                : o.delivery_status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {o.delivery_status === "pending"
              ? "To be Printed"
              : o.delivery_status}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {o.payment_status !== "paid" && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent row click
                redirect(o);
              }}
              className="text-primary-600 hover:text-primary-900"
            >
              Pay Now
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="5"
        className="px-6 py-4 text-center text-sm text-gray-500"
      >
        No orders found
      </td>
    </tr>
  )}
</tbody>

                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
}
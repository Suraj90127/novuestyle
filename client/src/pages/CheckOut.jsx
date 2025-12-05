

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
import CheckoutLoginPopup from "./CheckoutLoginPopup";

// --------------------------------------------------------
// Order Summary Component (same design as screenshot)
// --------------------------------------------------------

function OrderSummary({ price, items, products, shipping_fee }) {
  const cartItems = Array.isArray(products) ? products : [];

  // console.log("products11", cartItems);
  // console.log("shipping_fee", shipping_fee);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
          {cartItems.map((item, i) => {
            // original MRP backend product se
            const mrp = item.product?.price ?? item.price ?? 0;
            // discounted price jo tumne cookie me store ki hai
            const discounted = item.price ?? mrp;
            const imgSrc =
              item.image || item.product?.images?.[0]?.url || "";

            return (
              <div key={i} className="my-4">
                <div className="flex md:gap-16 sm:gap-5 border border-gray-200 rounded-lg mb-2">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-md border object-cover"
                  />

                  <div className="flex flex-col gap-2 sm:gap-0 mt-2">
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">
                      {item.name}
                    </p>

                    <div className="flex gap-2 items-center">
                      <p className="font-normal text-gray-700 text-base">
                        ₹{discounted}
                      </p>
                      {mrp && mrp !== discounted && (
                        <p className="line-through text-gray-400 text-base font-light">
                          ₹{mrp}
                        </p>
                      )}
                    </div>

                    <p className="font-light text-gray-700 text-base">
                      {item.color} / {item.size} &nbsp; × {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
            <span className="">₹ {(price || 0) + (shipping_fee || 0)}</span>
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

  // console.log("user",userInfo);
  

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

  // console.log("products, price, shipping_fee, items",products, price, shipping_fee, items);
  

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

//   const placeOrderNow = () => {
//     if (!selectedAddress) {
//       toast.error("Please select a shipping address");
//       return;
//     }

//     if (!validateForm(selectedAddress)) {
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
//         shippingInfo: selectedAddress,
//         userId: userInfo.id,
//         navigate,
//         items,
//       })
//     );

//    sendMetaEventSafe({
//   eventType: "InitiateCheckout",
//   price: price + shipping_fee,
//   order: products,   // pura cart pass kar do
//   products: products,
//   userInfo: userInfo,
//  });

//   };

  
const CART_KEY = "guestCart";
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

  // Dispatch the order with .unwrap() to handle promise
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
  )
  .unwrap() // This gives you the promise result
  .then((result) => {
    console.log("Order placed successfully:", result);
    
    // Clear cart from cookies after successful order
    try {
      // Clear the main cart cookie
      Cookies.remove('guestCart');
      
      // Also clear any other cart-related cookies
      Cookies.remove('cartTotal');
      Cookies.remove('cartCount');
      
      console.log("Cart cookies cleared after successful order");
    
      // Dispatch an action to clear cart from Redux state if you're using it
      // dispatch(clearCartFromState());
      
    } catch (cookieError) {
      console.error("Error clearing cart cookies:", cookieError);
    }
    
    // Show success message
    toast.success(result.message || "Order placed successfully!");
    
    // Send Meta event for Purchase (not just InitiateCheckout)
    sendMetaEventSafe({
      eventType: "Purchase",
      price: price + shipping_fee,
      order: products,
      products: products,
      userInfo: userInfo,
    });
    
    // Navigate to payment or order confirmation page
    if (result.redirectTo) {
      navigate(result.redirectTo);
    } else if (result.orderId) {
      navigate(`/payment/${result.orderId}`);
    }
    
  })
  .catch((error) => {
    console.error("Order placement failed:", error);
    
    // Show error message
    toast.error(error?.error || "Failed to place order. Please try again.");
    
    // Send Meta event for failed checkout
    sendMetaEventSafe({
      eventType: "AddPaymentInfo",
      price: price + shipping_fee,
      order: products,
      products: products,
      userInfo: userInfo,
      success: false
    });
  });

  // Send Meta event for InitiateCheckout (this happens regardless of success/failure)
  sendMetaEventSafe({
    eventType: "InitiateCheckout",
    price: price + shipping_fee,
    order: products,
    products: products,
    userInfo: userInfo,
  });
};


useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // console.log("userInfo on checkout page",userInfo);
  



  if (!userInfo) {
     const cartItems = Array.isArray(products) ? products : [];

  // console.log("products11", cartItems);
  // console.log("shipping_fee", shipping_fee);
  return (
    <CheckoutLoginPopup
      onLogin={() => setLoginModalOpen(true)}  
      product={cartItems}
      shipping_fee={shipping_fee}
    />
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
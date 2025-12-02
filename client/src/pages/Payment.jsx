import React, { useEffect, useState } from "react";
import img1 from "../assets/upi.CmgCfll8.svg";
import img2 from "../assets/master.CzeoQWmc.svg";
import img3 from "../assets/netbanking.C9e9yzjv.svg";
import img4 from "../assets/visa.sxIq5Dot.svg";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { FaCcAmazonPay } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cod from "../assets/cod.png";
import pay from "../assets/pay.png";
import axios from "axios";
import Swal from "sweetalert2";
import { MdLock, MdOutlineEmail } from "react-icons/md";
import { getShipping } from "../store/reducers/homeReducer";
import { sendMetaEvent } from "../utils/sendMetaEvent";

export default function Payment() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { shipping } = useSelector((state) => state.home);

  // console.log("userInfo", userInfo);
  // console.log("shipping", shipping);

  let codFee = shipping?.shipping?.cod_fee;

  const [selectedMethod, setSelectedMethod] = useState("ONLINEPAY");
  const [finalPrice, setFinalPrice] = useState(0);

  const {
    state: { price, items, orderId, shippingInfo, products },
  } = useLocation();

  // console.log("products", products[0].products);
  // console.log("shippingInfo", shippingInfo);

  let phone = shippingInfo?.phone;

  // console.log("shippingInfo", phone);

  const navigate = useNavigate();

  // ON PAYMENT METHOD CHANGE
  const handleMethodChange = (e) => {
    const method = e.target.value;
    setSelectedMethod(method);
  };

  const create_payment = async () => {
    try {
      const { data } = await axios.post(
        // "http://localhost:8000/api/order/create-payment",
        "https://novuestyle.com/api/order/create-payment",
        { price, codFee, type: selectedMethod, orderId, userInfo }
      );

      const order = data.order;

      // console.log("order on payment", order);
      // await sendMetaEvent(
      //   "Purchase",
      //   price,
      //   order,
      //   products[0]?.products,
      //   userInfo
      // );

      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      // FIRST create common options
      const options = {
        key: "rzp_live_RfdIJyl4jkmca6",
        amount: order.amount,
        currency: "INR",
        name: "Nouvestyale",
        description:
          selectedMethod === "COD" ? "COD Fee Payment" : "Order Payment",
        order_id: order.id,

        prefill: {
          name: phone,
          email: userInfo?.email,
          contact: phone,
        },
      };

      // NOW add handler based on selectedMethod
      if (selectedMethod === "COD") {
        options.handler = function (response) {
          axios
            .post("https://novuestyle.com/api/order/confirm", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              selectedMethod,
            })
            .then(() => {
              Swal.fire({
                title: "Confirm COD?",
                text: "₹120 COD Charge Has Been Paid",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                Swal.fire({
                  title: "Order Placed",
                  text: "Your Order Was Successfully Placed!",
                  icon: "success",
                });
                navigate("/dashboard-client");
              });
            })
            .catch(() => {
              Swal.fire({
                title: "Payment Failed",
                text: "Verification failed",
                icon: "error",
              });
            });
        };
      } else {
        // Online Payment handler
        options.handler = function (response) {
          axios
            .post("https://novuestyle.com/api/order/confirm", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              selectedMethod,
            })
            .then(() => {
              Swal.fire({
                title: "Payment Success",
                text: "Your payment is confirmed",
                icon: "success",
              });
              navigate("/dashboard-client");
            })
            .catch(() => {
              Swal.fire({
                title: "Payment Failed",
                text: "Verification failed",
                icon: "error",
              });
            });
        };
      }

      // Open Razorpay
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while creating payment.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    dispatch(getShipping());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-10">
      {/* HEADER */}
      <header className="flex justify-between items-center py-2 px-4 md:px-12 border-b bg-white shadow-sm">
        <img
          src={`https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png`}
          alt="Logo"
          className="h-[60px]"
        />
        <p className="text-gray-600 flex items-center gap-2 text-sm font-medium">
          100% secure payment <MdLock />
        </p>
      </header>

      <div className="flex flex-col items-center flex-1 overflow-y-auto md:p-12">
        <div className="w-full md:w-[80%] lg:w-[70%] mx-auto">
          <div className="p-4">
            {/* ORDER SUMMARY */}
            <div className="grid grid-cols-1 border rounded bg-white shadow-sm">
              <div className="flex justify-between items-center border-b p-3">
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-black text-xs md:text-sm">
                  {userInfo.email}
                </p>
                <MdOutlineEmail className="h-5 w-5 text-primary" />
              </div>

              <div className="flex justify-between items-center border-b p-3">
                <p className="text-gray-500 text-sm">Items</p>
                <p className="text-black text-xs md:text-sm">{items}</p>
              </div>

              <div className="flex justify-between items-center border-b p-3">
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-black text-xs md:text-sm">₹{price}</p>
              </div>

              {selectedMethod === "COD" && (
                <div className="flex justify-between items-center border-b p-3 bg-amber-50">
                  <p className="text-gray-700 text-sm font-semibold">
                    COD Charge
                  </p>
                  <p className="text-amber-700 text-xs md:text-sm font-bold">
                    ₹ {codFee}
                  </p>
                </div>
              )}

              {/* <div className="flex justify-between items-center p-3">
                <p className="text-gray-900 text-sm font-bold">Final Price</p>
                <p className="text-black font-bold text-xs md:text-sm">
                  ₹{finalPrice}
                </p>
              </div> */}
            </div>

            {/* PAYMENT SECTION */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Payment</h2>
              <p className="text-gray-400 text-sm mb-4">
                Choose payment method
              </p>

              {/* COD */}
              <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm mb-4 border">
                <label htmlFor="cod" className="flex items-center gap-4 w-full">
                  <input
                    type="radio"
                    id="cod"
                    name="method"
                    value="COD"
                    className="h-4 w-4"
                    onChange={handleMethodChange}
                    checked={selectedMethod === "COD"}
                  />
                  <div className="text-gray-800 font-[600] text-sm">
                    <p>Cash on Delivery</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Advance ₹ {codFee} COD charge applies.
                    </p>
                  </div>
                </label>
                <img src={cod} alt="cod" className="h-10 md:h-14" />
              </div>

              {/* ONLINE */}
              <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                <label htmlFor="pay" className="flex items-center gap-4 w-full">
                  <input
                    type="radio"
                    id="pay"
                    name="method"
                    value="ONLINEPAY"
                    className="h-4 w-4"
                    onChange={handleMethodChange}
                    checked={selectedMethod === "ONLINEPAY"}   // ← ADD THIS
                  />
                  <div className="text-gray-800 font-[600] text-sm">
                    <p>Online Payment</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Pay with UPI, Card, Wallet or NetBanking.
                    </p>
                  </div>
                </label>
                <img src={pay} alt="pay" className="h-10 md:h-14" />
              </div>

              {/* Razorpay Logos */}
              <div className="border border-gray-300 bg-[#f5f6ff] p-3 rounded mt-4 flex justify-between items-center">
                <span className="text-gray-500 text-xs md:text-sm font-[500]">
                  Razorpay Secure (UPI, Cards, Wallets)
                </span>
                <div className="hidden md:flex space-x-2 items-center">
                  <img src={img1} className="w-8 h-8" />
                  <img src={img2} className="w-8 h-8" />
                  <img src={img3} className="w-8 h-8" />
                  <img src={img4} className="w-8 h-8" />
                </div>
              </div>

              {/* Razorpay Info */}
              <div className="flex flex-col items-center text-center bg-[#f4f4f4] py-5 px-3 mt-4 rounded">
                <FaCcAmazonPay className="text-[80px] text-gray-400 mb-2" />
                <p className="text-gray-500 text-xs md:text-sm">
                  After clicking "Pay now", you will be redirected securely to
                  Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM BUTTONS */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-md flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <Link to="/" className="w-full md:w-auto">
          <button className="flex items-center justify-center gap-1 w-full py-3 rounded border text-primary font-semibold">
            <AiOutlineLeft className="w-4 h-4" />
            Return to Information
          </button>
        </Link>

        <button
          onClick={create_payment}
          className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded font-semibold shadow active:scale-[0.98]"
        >
          {selectedMethod === "COD" ? "Place Order" : "Pay Now"}
        </button>
      </div>
    </div >
  );
}

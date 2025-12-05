


// import React, { useState, useEffect } from "react";
import { MdLock, MdArrowBack, MdArrowForward, MdLocalOffer, 
         MdOutlineCardGiftcard, MdOutlineSms } from "react-icons/md";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { AiOutlineTag } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { customer_login, verify_otp, resend_otp, messageClear } from "../store/reducers/authReducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function CheckoutLoginPopup({ onLogin, product, shipping_fee }) {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input, 3: Coupons, 4: Coupon details
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [existingUser, setExistingUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [savedAmount] = useState(100);

  console.log("step", step);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Calculate totals from product data
  const calculateTotals = () => {
    let mrpTotal = 0;
    let discountedTotal = 0;
    let itemCount = 0;

    if (product && Array.isArray(product)) {
      product.forEach(item => {
        const originalPrice = item.product?.price || item.price || 0;
        const discountedPrice = item.price || originalPrice;
        const quantity = item.quantity || 1;

        mrpTotal += originalPrice * quantity;
        discountedTotal += discountedPrice * quantity;
        itemCount += quantity;
      });
    }

    return {
      mrpTotal,
      discountedTotal,
      itemCount,
      discount: mrpTotal - discountedTotal,
      totalPayable: discountedTotal + (shipping_fee || 0)
    };
  };

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setLoading(true);
    try {
      const result = await dispatch(customer_login({ phone })).unwrap();
      
      console.log("OTP send result:", result);
      
      if (result?.otpSent) {
        setOtpSent(true);
        setExistingUser(result.existingUser);
        setStep(2); // Move to OTP input
        setCountdown(60); // 60 seconds countdown
        
        toast.success(result.message || "OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
      
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error(err?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
      dispatch(messageClear());
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      const result = await dispatch(verify_otp({ phone, otp })).unwrap();
      
      console.log("OTP verify result:", result);
      
      if (result?.token) {
        toast.success("Login successful!");
        
        // Store token if needed
        if (result.token) {
          localStorage.setItem("customerToken", result.token);
        }
        
        // If it's a new user without name, ask for name in next step
        if (result.user?.isNewUser) {
          setStep(3); // Move to profile setup (optional)
        } else {
          setStep(3); // Move to coupons section
        }
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
      
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error(err?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
      dispatch(messageClear());
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before resending`);
      return;
    }
    
    setLoading(true);
    try {
      const result = await dispatch(resend_otp({ phone })).unwrap();
      
      if (result?.otpSent) {
        setCountdown(60);
        setOtp(""); // Clear previous OTP
        toast.success("OTP resent successfully!");
      } else {
        toast.error("Failed to resend OTP");
      }
      
    } catch (err) {
      toast.error(err?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
      dispatch(messageClear());
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      handleSendOTP();
    } else if (step === 2) {
      handleVerifyOTP();
    } else if (step === 3) {
      // Process with coupon and proceed
      onLogin();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleCouponArrowClick = () => {
    // Move to step 4 (coupon details)
    setStep(4);
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      toast.success(`Coupon "${couponCode}" applied!`);
      setCouponCode("");
    } else {
      toast.error("Please enter a coupon code");
    }
  };

  const handleViewAllCoupons = () => {
    // Show all available coupons
    toast.info("Showing all available coupons");
  };

  // Mock product items for display (using your actual data)
  const productItems = product && Array.isArray(product) ? product.slice(0, 2) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md md:rounded-2xl shadow-2xl overflow-hidden sm:h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5987b8] to-[#2c5e93] text-white p-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              {(step === 2 || step === 3 || step === 4) && (
                <button
                  onClick={handleBack}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <IoChevronBack className="text-xl" />
                </button>
              )}
              <img
                src="https://i.ibb.co/fYKJTScf/nouvestyale-logo-png-black.png"
                alt="logo"
                className="h-8"
              />
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">{totals.itemCount} items</p>
              <p className="text-sm font-semibold">{formatCurrency(totals.totalPayable)}</p>
            </div>
          </div>
        </div>

        {/* Saved Amount Banner */}
        <div className="bg-green-50 border-b border-green-100 px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IoShieldCheckmarkOutline className="text-green-600" size={20} />
              <span className="text-sm text-green-800 font-medium">You saved {formatCurrency(savedAmount)}</span>
            </div>
            <div className="text-xs text-green-600">
              {formatCurrency(totals.discount + savedAmount)} saved so far
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? (
            // Step 1: Phone number input
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-center">Login to continue</h2>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Enter your mobile number to proceed
                </p>

                <div className="border-2 border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-medium">+91</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter mobile number"
                      className="outline-none w-full text-lg font-medium placeholder:text-gray-400"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Order Summary Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-sm text-gray-600">{totals.itemCount} items</span>
                  </h3>

                  {productItems.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3 pb-3 border-b border-gray-200 last:border-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image || item.product?.images?.[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm">{formatCurrency(item.price)}</span>
                          {item.product?.price && item.product.price > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(item.product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">MRP Total</span>
                      <span>{formatCurrency(totals.mrpTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount on MRP</span>
                      <span className="text-green-600">-{formatCurrency(totals.discount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className={shipping_fee ? "text-gray-800" : "text-green-600"}>
                        {shipping_fee ? formatCurrency(shipping_fee) : "FREE"}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span>To Pay</span>
                      <span>{formatCurrency(totals.totalPayable)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            // Step 2: OTP verification
            <div className="p-4">
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdOutlineSms className="text-blue-600 text-2xl" />
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
                  <p className="text-gray-600 text-sm">
                    OTP sent to <span className="font-medium">+91 {phone}</span>
                  </p>
                  <p className="text-sm text-green-600 mb-4">
                    {existingUser ? "Welcome back!" : "Welcome! You're almost there"}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 4-digit OTP
                  </label>
                  <input
                    type="tel"
                    maxLength={4}
                    placeholder="Enter OTP"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    disabled={loading}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive OTP?
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 font-medium hover:text-blue-800'}`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-6">
                  <p>By verifying, you agree to our Terms & Privacy Policy</p>
                </div>
              </div>
            </div>
          ) : step === 3 ? (
            // Step 3: Coupon/Gift Card section
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">Apply Coupon</h2>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden flex">
                    <div className="flex items-center px-3 bg-gray-50">
                      <AiOutlineTag className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 outline-none px-2 py-3"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="bg-primary text-white px-4 rounded-lg font-medium"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MdLocalOffer className="text-blue-500" />
                    <span>2 coupons available</span>
                  </div>
                  <button
                    onClick={handleCouponArrowClick}
                    className="text-primary text-sm flex items-center gap-1"
                  >
                    View All <MdArrowForward />
                  </button>
                </div>
              </div>

              {/* Gift Card Section */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MdOutlineCardGiftcard className="text-purple-600" size={20} />
                    <span className="font-medium">Login to Redeem Gift Card</span>
                  </div>
                  <BsArrowRight className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Unlock gift cards and special offers by logging in
                </p>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items</span>
                    <span>{totals.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MRP Total</span>
                    <span>{formatCurrency(totals.mrpTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Discount</span>
                    <span className="text-green-600">-{formatCurrency(totals.discount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                    <span>Total Payable</span>
                    <span>{formatCurrency(totals.totalPayable)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Step 4: View All Coupons
            <div className="p-4">
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MdArrowBack size={20} />
                </button>
                <h2 className="text-lg font-semibold">Available Coupons</h2>
              </div>

              {/* Available Coupons */}
              <div className="space-y-4 mb-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-green-800">WELCOME100</h4>
                      <p className="text-sm text-green-700">Get ₹100 off on first order</p>
                    </div>
                    <button className="text-green-700 border border-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-green-700 hover:text-white transition">
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-green-600">Valid on orders above ₹999</p>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-blue-800">FLAT50</h4>
                      <p className="text-sm text-blue-700">Get flat ₹50 off</p>
                    </div>
                    <button className="text-blue-700 border border-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 hover:text-white transition">
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">Valid on all orders</p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Terms & Conditions</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                  <li>Coupons are valid for a limited time</li>
                  <li>Only one coupon can be applied per order</li>
                  <li>Not valid with other offers</li>
                  <li>Minimum order value applies</li>
                </ul>
              </div>
            </div>
          )}

          {/* Newsletter Subscription */}
          <div className="px-4 py-3 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary" defaultChecked />
              <span className="text-sm text-gray-700">Send me order updates & offers (no spam)</span>
            </label>
          </div>
        </div>

        {/* Footer with Continue Button */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-center gap-2 mb-3 text-xs text-gray-500">
            <MdLock size={14} />
            <span>Secured by GoKwik</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>PCI DSS Certified</span>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading || 
              (step === 1 && phone.length !== 10) || 
              (step === 2 && otp.length !== 4)
            }
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              loading || 
              (step === 1 && phone.length !== 10) || 
              (step === 2 && otp.length !== 4)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#5987b8] to-[#2c5e93] text-white hover:opacity-90'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {step === 1 ? 'Sending OTP...' : step === 2 ? 'Verifying...' : 'Processing...'}
              </span>
            ) : (
              step === 1 ? 'Continue' : step === 2 ? 'Verify OTP' : step === 3 ? 'Proceed to Payment' : 'Back to Checkout'
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-3">
            By proceeding, I agree to GoKwik's{" "}
            <button className="text-primary underline">Privacy Policy</button> and{" "}
            <button className="text-primary underline">T&C</button>
          </p>
        </div>
      </div>
    </div>
  );
}
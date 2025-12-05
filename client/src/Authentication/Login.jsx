import React, { useState, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiMessageSquare } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { customer_login, verify_otp, resend_otp, messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";

const LoginModal = ({ closeModal, openRegisterModal, openForgetModal }) => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [existingUser, setExistingUser] = useState(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = () => {
    let newErrors = {};
    
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone must be 10 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    let newErrors = {};
    
    if (!otp.trim()) newErrors.otp = "OTP is required";
    else if (!/^\d{4}$/.test(otp)) newErrors.otp = "OTP must be 4 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandle = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setPhone(phoneValue);
    } else if (name === 'otp') {
      // Only allow numbers and limit to 4 digits
      const otpValue = value.replace(/\D/g, '').slice(0, 4);
      setOtp(otpValue);
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const sendOTP = async (e) => {
    if (e) e.preventDefault();
    
    if (!validatePhone()) {
      return;
    }
    
    try {
      const result = await dispatch(customer_login({ phone })).unwrap();

      console.log("result",result);
      

      if (result?.otpSent) {
        setExistingUser(result.existingUser);
        setStep(2); // Move to OTP input
        setCountdown(60); // 60 seconds countdown
        
        toast.success(result.message || "OTP sent successfully!");
        
        // If development mode, show OTP in console
        if (result.otp) {
          console.log(`OTP for ${phone}: ${result.otp}`);
        }
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }

    } catch (err) {
      toast.error(err?.error || "Failed to send OTP. Please try again.");
      setErrors({
        ...errors,
        server: err?.error || "Login failed"
      });
    } finally {
      dispatch(messageClear());
    }
  };

  const verifyOTP = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }
    
    try {
      const result = await dispatch(verify_otp({ phone, otp })).unwrap();

      if (result?.token) {
        toast.success("Login successful! Welcome back.");
        
        setTimeout(() => {
          closeModal();
          // Refresh page or redirect as needed
          window.location.reload();
        }, 500);
      } else {
        toast.error("OTP verification failed. Please try again.");
      }

    } catch (err) {
      toast.error(err?.error || "Invalid OTP. Please try again.");
      setErrors({
        ...errors,
        server: err?.error || "OTP verification failed"
      });
    } finally {
      dispatch(messageClear());
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before resending`);
      return;
    }
    
    try {
      const result = await dispatch(resend_otp({ phone })).unwrap();

      if (result?.otpSent) {
        setCountdown(60);
        setOtp(""); // Clear previous OTP
        toast.success("OTP resent successfully!");
        
        // If development mode, show OTP in console
        if (result.otp) {
          console.log(`New OTP for ${phone}: ${result.otp}`);
        }
      } else {
        toast.error("Failed to resend OTP");
      }
      
    } catch (err) {
      toast.error(err?.error || "Failed to resend OTP");
    } finally {
      dispatch(messageClear());
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
      setErrors({});
    }
  };

  const handleforget = () => {
    openForgetModal();
    closeModal();
  };

  const handleRegister = () => {
    openRegisterModal();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center sm:mt-32 md:mt-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>
      
      {/* Modal Container - Fixed height with scrolling */}
      <div className="relative bg-white md:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {loader && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <ScaleLoader color="#5987b8" height={30} width={3} />
              <p className="mt-3 text-gray-600 font-medium text-sm">
                {step === 1 ? 'Sending OTP...' : 'Verifying OTP...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Header - Fixed height */}
        <div className="bg-gradient-to-r from-[#5987b8] to-[#2c5e93] text-white p-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {step === 1 ? 'Login with Mobile' : 'Enter OTP'}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {step === 1 ? 'Enter your mobile number' : 'Verify your identity'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? (
            // Step 1: Phone number input
            <div className="p-6">
              {errors.server && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.server}
                  </p>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="text-[#5987b8] text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Mobile Number</h3>
                <p className="text-gray-600 text-sm">We'll send an OTP to verify your number</p>
              </div>

              <form onSubmit={sendOTP}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <span className="text-gray-700 font-medium">+91</span>
                      <div className="h-4 w-px bg-gray-300"></div>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={inputHandle}
                      maxLength={10}
                      className={`w-full pl-16 pr-4 py-3 text-base rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#5987b8] focus:border-transparent`}
                      placeholder="Enter 10-digit number"
                      disabled={loader}
                    />
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                  <p className="mt-2 text-xs text-gray-500">
                    We'll send a 4-digit OTP to this number
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loader || phone.length !== 10}
                  className={`w-full py-3 px-4 text-base rounded-lg font-semibold text-white transition-all ${
                    loader || phone.length !== 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#5987b8] to-[#2c5e93] hover:opacity-90 shadow-md'
                  }`}
                >
                  {loader ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <div className="mt-6">
                {/* <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">Or login with</span>
                  </div>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div> */}

                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Don't have an account?
                  </p>
                  <button
                    onClick={handleRegister}
                    className="text-[#5987b8] font-medium hover:text-[#2c5e93] hover:underline"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: OTP verification
            <div className="p-6">
              {errors.server && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.server}
                  </p>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageSquare className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter OTP</h3>
                <p className="text-gray-600 text-sm mb-1">
                  OTP sent to <span className="font-semibold">+91 {phone}</span>
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {existingUser ? 'Welcome back!' : 'Welcome! You\'re almost there'}
                </p>
              </div>

              <form onSubmit={verifyOTP}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 4-digit OTP *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="otp"
                      value={otp}
                      onChange={inputHandle}
                      maxLength={4}
                      className={`w-full px-4 py-3 text-2xl text-center tracking-widest rounded-lg border ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#5987b8] focus:border-transparent`}
                      placeholder="0000"
                      disabled={loader}
                    />
                  </div>
                  {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp}</p>}
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive OTP?
                    </p>
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={countdown > 0 || loader}
                      className={`text-sm font-medium ${
                        countdown > 0 || loader
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-[#5987b8] hover:text-[#2c5e93]'
                      }`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loader || otp.length !== 4}
                  className={`w-full py-3 px-4 text-base rounded-lg font-semibold text-white transition-all ${
                    loader || otp.length !== 4
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#5987b8] to-[#2c5e93] hover:opacity-90 shadow-md'
                  }`}
                >
                  {loader ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-4">
                  By verifying, you agree to our{" "}
                  <button type="button" className="text-[#5987b8] hover:text-[#2c5e93] hover:underline">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-[#5987b8] hover:text-[#2c5e93] hover:underline">
                    Privacy Policy
                  </button>
                </p>
                
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[#5987b8] font-medium hover:text-[#2c5e93] hover:underline"
                >
                  ← Change phone number
                </button>
              </div>
            </div>
          )}

          {/* Alternative login option */}
          <div className="px-6 pb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">
                  {step === 1 ? 'Need help?' : 'Having trouble?'}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleforget}
                className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
              >
                Forgot your password?
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Contact support if you're having issues with OTP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
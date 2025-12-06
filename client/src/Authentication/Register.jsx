import React, { useEffect, useState } from "react";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { customer_register, messageClear } from "../store/reducers/authReducer";
import { ScaleLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const RegisterModal = ({ closeModal, openLoginModal }) => {
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    
    if (!state.name.trim()) newErrors.name = "Name is required";
    else if (state.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!state.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(state.email)) newErrors.email = "Email is invalid";
    
    if (!state.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(state.phone)) newErrors.phone = "Phone must be 10 digits";
    
    if (!state.password) newErrors.password = "Password is required";
    else if (state.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!agreed) newErrors.agreed = "You must agree to terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const register = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await dispatch(customer_register(state)).unwrap();

      if (result?.message) {
        toast.success("Registration successful! Welcome to our store.");
        dispatch(messageClear());
        
        setTimeout(() => {
          closeModal();
          // if (openLoginModal) {
          //   openLoginModal();
          // }
        }, 500);
      }

    } catch (err) {
      toast.error(err?.error || err || "Registration failed. Please try again.");
      setErrors({
        ...errors,
        server: err?.error || err || "Registration failed"
      });
    } finally {
      dispatch(messageClear());
    }
  };

  const handlelogin = () => {
    openLoginModal();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center sm:mt-36 md:mt-28">
      {/* Backdrop */}
      <div 
        className="fixed  bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>
      
      {/* Modal Container - Fixed height with scrolling */}
      <div className="relative bg-white md:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {loader && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <ScaleLoader color="#3B82F6" height={30} width={3} />
              <p className="mt-3 text-gray-600 font-medium text-sm">Creating your account...</p>
            </div>
          </div>
        )}
        
        {/* Header - Fixed height */}
        <div className="bg-gradient-to-r from-[#5987b8] to-[#2c5e93] text-white p-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Create Account</h2>
              <p className="text-blue-100 text-sm mt-1">Join our community</p>
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
          <form onSubmit={register} className="p-5">
            {errors.server && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.server}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="name"
                    value={state.name}
                    onChange={inputHandle}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#5987b8] focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="phone"
                    value={state.phone}
                    onChange={inputHandle}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#5987b8] focus:border-transparent`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={inputHandle}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#5987b8] focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={state.password}
                    onChange={inputHandle}
                    className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#5987b8] focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {/* Terms Checkbox - Compact version */}
              <div className="flex items-start space-x-2 pt-1">
                <div className="flex items-center h-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) {
                        setErrors({ ...errors, agreed: "" });
                      }
                    }}
                    className="h-3.5 w-3.5 text-[#5987b8] focus:ring-[#5987b8] border-gray-300 rounded"
                  />
                </div>
                <div className="text-xs">
                  <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                    I agree to{" "}
                    <button type="button" className="text-[#5987b8] hover:text-[#5987b8]">
                      Terms
                    </button>{" "}
                    &{" "}
                    <button type="button" className="text-[#5987b8] hover:text-[#5987b8]">
                      Privacy
                    </button>
                  </label>
                  {errors.agreed && <p className="text-red-600 text-xs mt-0.5">{errors.agreed}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loader}
                className={`w-full py-2.5 px-4 text-sm rounded-lg font-semibold text-white transition-all mt-2 ${
                  loader 
                    ? 'bg-[#5987b8]  cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#5987b8] to-[#2c5e93] hover:from-[#5987b8]  hover:to-[#2c5e93] shadow'
                }`}
              >
                {loader ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-5 pb-5">
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <button
              onClick={handlelogin}
              className="w-full py-2.5 px-4 text-sm border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign In Instead
            </button>
            
            <div className="mt-3 text-center">
              <p className="text-[10px] text-gray-500">
                By registering, you confirm you're 16+ years old
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
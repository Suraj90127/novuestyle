import React, { useState, useEffect } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
// import { verifyOtpAndResetPassword } from "../../../backend/controllers/home/customerAuthController";
import { verifyOtpAndResetPassword } from "../store/reducers/authReducer";
import { toast } from "react-toastify";

const ForgetModal = ({ closeModal, openLoginModal, openPasswordModal }) => {
  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useSelector((state) => state.auth);

  // const [email, setEmail] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [cpassword, setCpassword] = useState("");
  const [state, setState] = useState({
    email: "",
    otp: "",
    npassword: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle Confirm Password input separately
  const handleConfirmPassword = (e) => {
    setCpassword(e.target.value);
  };

  useEffect(() => {
    let timer;
    if (showOTPInput && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
      setShowOTPInput(false);
      setCountdown(120);
    }
    return () => clearInterval(timer);
  }, [showOTPInput, countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // console.log("bhaic", state.email);

    try {
      // Send the email as an object
      let email = state.email;

      const { data } = await api.post("/forgot-password", { email });

      // If the request is successful, show success toast
      toast.success(data.message);

      // Clear the email field after successful API call
      // setEmail("");
      setShowOTPInput(true);
    } catch (error) {
      // If there is an error, show error toast
      const errorMessage = error.response?.data?.message || "User Not found";
      toast.error(errorMessage);
      console.error("Error sending OTP:", error);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();

    const password = state.npassword;
    const confirmPassword = cpassword;

    // Password matching validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // Dispatch OTP verification and password reset
    dispatch(verifyOtpAndResetPassword(state))
      .unwrap()
      .then((data) => {
        // If successful, show success message and open password modal
        toast.success(data.message);
        openPasswordModal();
        closeModal();
      })
      .catch((error) => {
        // If there is an error, show error message
        toast.error(
          errorMessage || "An error occurred while resetting the password."
        );
      });
  };
  const handleCancel = () => {
    closeModal();
  };

  const handleLogin = () => {
    openLoginModal();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full relative">
        {/* Close button */}
        <div className="bg-black text-white p-3">
          <button
            className="absolute top-2 right-4 text-2xl text-white hover:text-white"
            onClick={closeModal}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-center">Reset Password</h2>
        </div>

        <form
          className="p-8"
          onSubmit={showOTPInput ? handleOTPSubmit : handleSendOTP}
        >
          {!showOTPInput ? (
            <>
              <div className="mb-4 relative">
                <label className="block mb-1 text-gray-600">Email *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={state.email}
                    onChange={inputHandle}
                    name="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                // onClick={}
                type="submit"
                className="w-full bg-primary text-white py-2 hover:bg-primary/90 transition-all mb-2"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              {/* OTP Input Field */}
              {countdown > 0 ? (
                <>
                  <div className="mb-4 relative">
                    <label className="block mb-1 text-gray-600">
                      Enter OTP *
                    </label>
                    <input
                      type="number"
                      value={state.otp}
                      onChange={inputHandle}
                      name="otp"
                      id="otp"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Enter the OTP"
                      required
                    />
                  </div>
                  <p className="text-primary text-sm mb-4">
                    OTP expires in: {Math.floor(countdown / 60)}:
                    {countdown % 60 < 10 ? "0" : ""}
                    {countdown % 60}
                  </p>
                  <div className="mb-4 relative">
                    <label className="block mb-1 text-gray-600">
                      New Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        onChange={inputHandle}
                        value={state.npassword}
                        id="npassword"
                        name="npassword"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter your new Password"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6 relative">
                    <label className="block mb-1 text-gray-600">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={cpassword}
                        onChange={handleConfirmPassword}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter again your password"
                        id="cpassword"
                        name="cpassword"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 hover:bg-primary/90 transition-all mb-2"
                  >
                    Submit OTP
                  </button>
                </>
              ) : (
                <p className="text-red-600 text-center mb-4">
                  OTP has expired. Please request a new one.
                </p>
              )}
            </>
          )}
          <button
            type="button"
            className="w-full bg-primary text-white py-2 hover:bg-primary/90 transition-all"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>

        {/* Create Account */}
        <div className="text-center px-8 mb-5">
          <p className="text-gray-600 text-sm text-justify">
            Registering for this site allows you to access your order status and
            history. Just fill in the fields below, and we’ll get a new account
            set up for you in no time. We will only ask you for information
            necessary to make the purchase process faster and easier.
          </p>
          <button
            onClick={handleLogin}
            className="text-primary hover:underline"
          >
            Login Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetModal;

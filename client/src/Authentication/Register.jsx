import React, { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { customer_register, messageClear } from "../store/reducers/authReducer";
import FadeLoader from "react-spinners/FadeLoader";
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

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // const register = (e) => {
  //   e.preventDefault();
  //   dispatch(customer_register(state));
  // };

  // useEffect(() => {
  //   if (successMessage) {
  //     toast.success(successMessage);
  //     dispatch(messageClear());
  //     closeModal();
  //     // openLoginModal();
  //   }
  //   if (errorMessage) {
  //     toast.error(errorMessage);
  //     dispatch(messageClear());
  //   }
  // }, [successMessage, errorMessage, userInfo, navigate, dispatch]);

  const register = async (e) => {
    e.preventDefault();
    try {
      // unwrap() throws on rejected, returns payload on fulfilled
      const result = await dispatch(customer_register(state)).unwrap();

      // console.log("result",result);


      // Adjust these property names based on your thunk's returned payload
      if (result?.message) {
        closeModal();
        toast.success(result.message);
        dispatch(messageClear());
      }



      if (userInfo) {
        closeModal();
        // navigate("/");
      }

    } catch (err) {
      // console.log("err",err);
      // err is usually the rejectWithValue payload or error message
      toast.error(err?.error || err || "Username & Password wrong");
    } finally {
      dispatch(messageClear());
    }
  };

  const handlelogin = () => {
    openLoginModal();
    closeModal();
  };
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center top-0 left-0">
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
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
            <h2 className="text-xl font-semibold text-center">REGISTER</h2>
          </div>

          {/* Register Form */}
          <form className="p-8" onSubmit={register}>
            <div className="mb-4 relative">
              <label className="block mb-1 text-gray-600">Name *</label>
              <input
                type="text"
                onChange={inputHandle}
                value={state.name}
                id="name"
                name="name"
                className="w-full pl-3 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block mb-1 text-gray-600">Phone Number *</label>
              <input
                type="number"
                onChange={inputHandle}
                value={state.phone}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block mb-1 text-gray-600">Email *</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  onChange={inputHandle}
                  value={state.email}
                  id="email"
                  name="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-6 relative">
              <label className="block mb-1 text-gray-600">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  onChange={inputHandle}
                  value={state.password}
                  id="password"
                  name="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-primary text-white py-2  hover:bg-primary/90 transition-all">
              REGISTER
            </button>
          </form>
          {/* Create Account */}
          <div className="text-center px-8 mb-5">
            <p>Already have a account?</p>
            <p className="text-gray-600 text-sm">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our privacy policy.
            </p>
            <button
              onClick={handlelogin}
              className="text-primary hover:underline"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;

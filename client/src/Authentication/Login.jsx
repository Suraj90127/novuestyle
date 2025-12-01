import React, { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineGoogle } from "react-icons/ai";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector, useDispatch } from "react-redux";
import { customer_login, messageClear } from "../store/reducers/authReducer";
import { toast } from "react-toastify";

const LoginModal = ({ closeModal, openRegisterModal, openForgetModal }) => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      // unwrap() throws on rejected, returns payload on fulfilled
      const result = await dispatch(customer_login(state)).unwrap();

      // Adjust these property names based on your thunk's returned payload
      if (result?.message) {
        closeModal();
        toast.success(result.message);
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

  const handleforget = () => {
    openForgetModal();
    closeModal();
  };

  const handleRegister = () => {
    openRegisterModal();
    closeModal();
  };
  const handleclose = () => {
    closeModal();
  };
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center top-0 left-0">
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[9999999]">
          <FadeLoader />
        </div>
      )}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 top-[0] flex items-center justify-center z-50">
        <div className="bg-white max-w-md w-full relative">
          {/* Close button */}
          <div className="bg-black text-white p-3">
            <button
              className="absolute top-2 right-4 text-2xl text-white hover:text-white"
              onClick={handleclose}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-center">SIGN IN</h2>
          </div>

          {/* Sign-in Form */}
          <form className="p-8" onSubmit={login}>
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
                  onChange={inputHandle}
                  value={state.password}
                  type="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your password"
                  id="password"
                  name="password"
                  required
                />
              </div>
            </div>

            <button
              className="w-full bg-primary text-white py-2  hover:bg-primary/90 transition-all"
            // onSubmit={handleSubmit}
            >
              LOGIN
            </button>

            <p className="text-gray-600 mt-4" onClick={handleforget}>
              <Link to="#" className="text-gray-600">
                Forgot your password?
              </Link>
            </p>
          </form>

          {/* Create Account */}
          <div className="text-center px-8 mb-5">
            <p>No account yet?</p>
            <p className="text-gray-600 text-sm text-justify">
              Registering for this site allows you to access your order status
              and history. Just fill in the fields below, and we’ll get a new
              account set up for you in no time. We will only ask you for
              information necessary to make the purchase process faster and
              easier.
            </p>
            <button
              onClick={handleRegister}
              className="text-primary hover:underline"
            >
              Create An Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

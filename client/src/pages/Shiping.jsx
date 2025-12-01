import React, { useEffect, useState } from "react";
import img from "../assets/logo.png";
import {
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import CheckoutRight from "../components/CheckoutRight";
import { useSelector } from "react-redux";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

export default function Shipping() {
  const { userInfo } = useSelector((state) => state.auth);
  const [discountCode, setDiscountCode] = useState("");
  const products = [
    {
      id: 1,
      name: "Beautiful Gold Pink Gem Nosepin",
      price: 99.0,
      quantity: 1,
      image: img,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex flex-col items-center flex-1 overflow-y-auto py-6 md:p-12">
        <img src={img} alt="Logo" className="mb-8 h-20 w-auto" />
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>Cart</li>
            <AiOutlineRight className="w-3 text-gray-500 h-3" />
            <li>Information</li>
            <AiOutlineRight className="w-3 text-gray-500 h-3" />
            <li>Shipping</li>
            <AiOutlineRight className="w-3 text-gray-500 h-3" />
            <li>Payment</li>
          </ol>
        </nav>

        <div className="w-full md:w-[80%] lg:w-[70%] mx-auto">
          <div className="p-4 ">
          <div className="grid grid-cols-1 border-[1px] p-4 rounded">
              <div className="flex justify-between items-center border-b p-2">
                <p className="text-gray-500 text-sm">Contact</p>
                <p className="text-black text-[10px] md:text-sm">
                  {userInfo.email}
                </p>
                <button className="text-primary md:text-sm">
                <MdOutlineEmail className='h-5 w-5' />
                </button>
              </div>
              <div className="flex justify-between items-center p-2">
                <p className="text-gray-500 text-sm">Ship to</p>
                <p className="text-black text-[10px] md:text-sm">
                  {userInfo.address}
                </p>
                <button className="text-primary md:text-sm">
                <IoLocationOutline className='h-5 w-5' />
                </button>
              </div>
              <div className="flex justify-between items-center p-2">
                <p className="text-gray-500 text-sm">Shipping method</p>
                <p className="text-black text-[10px] md:text-sm">
                  Standard Shipping
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-[500] mb-2">Shipping Method</h3>
              <div className="flex justify-between items-start p-4 border-[1px] border-black rounded-lg bg-[#f5f6ff]">
                <div>
                  <p className="text-gray-500">Standard Shipping Charges</p>
                  <p className="text-gray-500">Made to order</p>
                </div>
                <p className="text-black font-semibold">₹0.00</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link to="/checkout">
              <button className="flex items-center text-primary">
                <AiOutlineLeft className="w-4 h-4 mr-1" />
                Return to Information
              </button>
            </Link>
            <Link to="/payment">
              <button className="bg-primary text-white px-6 py-2">
                Continue to Payment
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-gray-100 w-1/3 p-6 md:p-12 sticky top-0 h-screen overflow-y-auto">
        <CheckoutRight />
      </div>
    </div>
  );
}

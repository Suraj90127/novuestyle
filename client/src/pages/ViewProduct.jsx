import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { get_order } from "../store/reducers/orderReducer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import {
  MapPin,
  Calendar,
  Package,
  CreditCard,
  Truck,
  Mail,
  ArrowLeft,
  Home,
  Tag,
} from "lucide-react";

import { getShipping } from './../store/reducers/homeReducer';
import Shipping from './Shiping';

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { myOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
   const { shipping } = useSelector((state) => state.home);

     let codFee = shipping?.shipping?.cod_fee;
     let Shipping_fee = shipping?.shipping?.shipping_fee;

  useEffect(() => {
    dispatch(get_order(id));
    dispatch(getShipping());
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-900 border-green-300";
      case "unpaid":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };



  
  console.log("myOrder",myOrder);
  

  const calculateDiscountedPrice = (price, discount) => {
    return price - Math.floor((price * discount) / 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* MAIN CONTENT */}
      <div className="pt-28 md:pb-20  max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-2 border-b px-4">
          <Link
            to="/dashboard-client"
            className="inline-flex items-center gap-2 text-primary hover:opacity-75 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
            Order Details
          </h1>
          <p className="text-gray-600 mt-1 text-sm tracking-wide">
            ORDER ID: <span className="font-semibold text-xl">{myOrder.new_order_id}</span>
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6 md:mb-10">
          {/* ORDER INFO */}
          <div className="bg-white border-b  p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Order Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono text-gray-900">{myOrder.new_order_id}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date</span>
                <span className="text-gray-900">{formatDate(myOrder.date)}</span>
                
              </div>

                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Actual Amount</span>
                <span className="text-gray-900">₹ {myOrder.price-Shipping_fee}</span>
              </div>

                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="text-gray-900">+ ₹ {Shipping_fee}</span>
              </div>
               {myOrder.payment_status==="COD" &&(
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">COD Amount</span>
                <span className="text-gray-900"> - {codFee}</span>
              </div>
              )}

              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-700">Total Pay Amount</span>
                <span className="text-primary">₹ {myOrder.payment_status==="COD" ? myOrder.price-codFee:myOrder.price}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT / DELIVERY STATUS */}
          <div className="bg-white border-b p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Status</h2>
            </div>

            <div className="sm:space-y-1 md:space-y-5">
              {/* Payment */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Payment</span>
                <span
                  className={`px-3 py-1 text-sm font-medium border ${getStatusColor(
                    myOrder.payment_status
                  )}`}
                >
                  {myOrder.payment_status?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">COD Fee</span>
                <span
                  className={`px-3 py-1 text-sm font-medium `}
                >
                  {myOrder.codFeeStatus}
                </span>
              </div>
                 {/* Delivery */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Delivery</span>
                <span
                  className={`px-3 py-1 text-sm font-medium  `}
                >
                  {myOrder.delivery_status}
                </span>
              </div>
              {myOrder?.remarks&&(

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Remarks</span>
                <span
                  className={`px-3 py-1 text-sm font-medium`}
                >
                  {myOrder?.remarks}
                </span>
              </div>
              )}
              {myOrder.trackingNumber&&(

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Tracking Number</span>
                <span
                  className={`px-3 py-1 text-sm font-medium  `}
                >
                  {myOrder.trackingNumber}
                </span>
              </div>
              )}

           
            </div>
          </div>

          {/* SHIPPING INFO */}
          <div className="bg-white border-b  p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-2">
                <Home className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-700 mt-1 leading-relaxed">
                    {myOrder.shippingInfo?.address},{" "}
                    {myOrder.shippingInfo?.area}, 
                    {myOrder.shippingInfo?.city},{" "}
                    {myOrder.shippingInfo?.province}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS SECTION */}
        <div className="bg-white  p-3">
          <div className="px-6 py-4 border-b border-gray-300">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({myOrder.products?.length || 0})
            </h2>
          </div>

          <div className="p-2">
            <div className="space-y-6">
              {myOrder.products?.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-5 bg-gray-50 border border-gray-300"
                >
                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover border border-gray-400"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <Link
                      to={`/product/details/${product.slug}`}
                      className="sm:text-md md:text-lg font-normal text-gray-700 hover:text-primary transition"
                    >
                      {product.name}
                    </Link>
                  {/* PRICE */}
                  <div className="text-left flex items-center gap-2">
                    <div className="text-lg font-semibold text-primary">
                      ₹{calculateDiscountedPrice(product.price, product.discount)}
                    </div>

                    {product.discount > 0 && (
                      <div className="text-sm text-gray-600 mt-1 flex">
                        <span className="line-through block">
                          ₹{product.price}
                        </span>
                      </div>
                    )}
                  </div>
                  </div>

                </div>
              ))}
            </div>

            {/* ORDER PRICE SUMMARY */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">₹{myOrder.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER */}
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>

      <Footer />
    </div>
  );
};

export default ViewProduct;

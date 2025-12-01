import React, { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { get_card_products } from "../store/reducers/cardReducer";
import { customer_login, userDetail } from "../store/reducers/authReducer";

const CheckoutRight = ({ products, price }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { shipping_fee } = useSelector((state) => state.card);
  const dispatch = useDispatch();


  

  // useEffect(() => {
  //   dispatch(customer_login());
  // }, [dispatch]);


    useEffect(() => {
    dispatch(userDetail());
  }, [dispatch]);
  

  useEffect(() => {
    dispatch(get_card_products(userInfo.id));
  }, []);

  const totalAmount = price + shipping_fee;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <RiSecurePaymentLine className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <p className="text-sm text-gray-500">Review your items</p>
        </div>
      </div>

      {/* Products List */}
      <div className="mb-6">
        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((seller, sellerIndex) => (
              <div key={sellerIndex} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                {/* Seller Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900 text-sm">{seller.shopName}</h3>
                </div>
                
                {/* Products */}
                <div className="space-y-3">
                  {seller.products.map((product, productIndex) => {
                    const discountedPrice = product?.productInfo?.price - 
                      Math.floor((product?.productInfo?.price * product?.productInfo?.discount) / 100);
                    
                    return (
                      <div key={productIndex} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="relative flex-shrink-0">
                          <img
                            src={product?.productInfo?.images[0]?.url}
                            alt={product?.productInfo?.name || "Product"}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                            {product?.quantity || 1}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                            {product?.productInfo?.name || "Unnamed Product"}
                          </h4>
                          
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">₹{discountedPrice}</span>
                            {product?.productInfo?.discount > 0 && (
                              <>
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{product?.productInfo?.price}
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                  Save {product?.productInfo?.discount}%
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Product Variants */}
                          <div className="flex gap-3 text-xs text-gray-600">
                            {product?.size && (
                              <span>Size: {product.size}</span>
                            )}
                            {product?.color && (
                              <span>Color: {product.color}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TbTruckDelivery className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No products in cart</p>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{price}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Shipping</span>
              <div className="group relative">
                <AiOutlineQuestionCircle className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Delivery charges
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <span className={`font-medium ${shipping_fee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {shipping_fee === 0 ? 'FREE' : `₹${shipping_fee}`}
            </span>
          </div>
          
          {/* Optional: Discount Code */}
          <div className="flex justify-between items-center text-green-600">
            <span>Discount Applied</span>
            <span className="font-medium">-₹0</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">₹{totalAmount}</div>
              <div className="text-xs text-gray-500">Inclusive of all taxes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <RiSecurePaymentLine className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium">Secure SSL Encryption</span>
        </div>
        <p className="text-xs text-green-700 mt-1">Your payment information is protected with 256-bit encryption</p>
      </div>
    </div>
  );
};

export default CheckoutRight;
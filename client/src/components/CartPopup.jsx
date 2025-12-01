// CartPopup.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { customer_login } from "../store/reducers/authReducer";

import { useNavigate } from "react-router-dom";
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "../store/reducers/cardReducer";
import { toast } from "react-toastify";

const CartPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const navegate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    card_products,
    successMessage,
    price,
    buy_product_item,
    shipping_fee,
    outofstock_products,
  } = useSelector((state) => state.card);

  useEffect(() => {
    dispatch(customer_login());
  }, [dispatch]);

  useEffect(() => {
    dispatch(get_card_products(userInfo?.id));
  }, []);

  useEffect(() => {
    if (successMessage) {
      dispatch(messageClear());
      dispatch(get_card_products(userInfo?.id));
    }
  }, [successMessage]);

  const redirect = () => {
    navegate("/checkout", {
      state: {
        products: card_products,
        price: price,
        shipping_fee: shipping_fee,
        items: buy_product_item,
      },
    });
  };

  const cart = card_products.flatMap((temp) => temp.products);
  const cart_info = cart.flatMap((temp) => temp.productInfo);

  return (
    <div className="absolute md:top-16 sm:top-1 md:right-10 sm:-right-2 bg-white shadow-lg py-2 sm:w-[250px]  md:w-[300px] z-50">
      <h2 className="text-lg font-semibold mb-2 px-4 pt-5">Your Cart</h2>
      {cart_info?.length === 0 ? (
        <p className="text-gray-500 px-4">Your cart is empty.</p>
      ) : (
        cart_info.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="flex gap-3 items-center py-2 px-4 border-b-[1px] border-gray-300"
          >
            <img
              src={item.images[0].url}
              alt={item.name}
              className="h-14 w-12 object-cover mr-2"
            />
            <div>
              <p className="font-medium">
                {item.name.split(" ").slice(0, 4).join(" ")}...
              </p>
              <p className="text-gray-600">
                ₹ {item.price - Math.floor((item.price * item.discount) / 100)}
              </p>
            </div>
          </div>
        ))
      )}
      <div className="flex flex-col gap-2 justify-between mt-4 px-4">
        <Link to="/cart">
          <button
            className="bg-gray-500 text-white px-4 py-2 w-full"
            onClick={onClose}
          >
            View Cart
          </button>
        </Link>

        <button
          onClick={redirect}
          className="bg-primary text-white px-4 py-2 w-full"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPopup;

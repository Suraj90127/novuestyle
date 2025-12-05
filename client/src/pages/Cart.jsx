// // CartPage.js
// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Link, useNavigate } from "react-router-dom";
// import MobileFooter from "../components/MobileFooter";
// import { useDispatch, useSelector } from "react-redux";
// import { customer_login, messageClear } from "../store/reducers/authReducer";
// import { add_coupon, get_coupons } from "../store/reducers/couponReducer";
// import { toast } from "react-toastify";
// import {
//   delete_card_product,
//   get_card_products,
//   quantity_dec,
//   quantity_inc,
// } from "../store/reducers/cardReducer";
// import { MdDeleteOutline } from "react-icons/md";
// import { sendMetaEventSafe } from "../utils/sendMetaEvent";

// const CartPage = () => {
//   const [couponCode, setCouponCode] = useState("");

//   const [discountPrice, setDiscountPrice] = useState();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.auth);
//   const {
//     card_products,
//     successMessage,
//     price,
//     buy_product_item,
//     shipping_fee,
//     outofstock_products,
//   } = useSelector((state) => state.card);

//   // console.log(
//   //   " card_products",
//   //   card_products,
//   //   "successMessage",
//   //   successMessage,
//   //   "price",
//   //   price,
//   //   "buy_product_item",
//   //   buy_product_item,
//   //   "shipping_fee",
//   //   shipping_fee,
//   //   "outofstock_products",
//   //   outofstock_products
//   // );

//   const { coupons, loader } = useSelector((state) => state.coupon);

//   // Handle redirect to checkout page
//   // const redirect = () => {
//   //   navigate("/checkout", {
//   //     state: {
//   //       products: card_products,
//   //       price: discountPrice ? discountPrice : price,
//   //       shipping_fee: shipping_fee,
//   //       items: buy_product_item,
//   //     },
//   //   });
//   // };

//   const redirect = async () => {
//     try {
//       // 1️⃣ Fire InitiateCheckout event BEFORE redirect
//       await sendMetaEventSafe({
//         eventType: "InitiateCheckout",
//         price: price,
//         order: null,
//         products: card_products,
//         userInfo: userInfo, // guest allowed
//       });
//     } catch (err) {
//       console.log("InitiateCheckout SAFE ERROR:", err.message);
//     }

//     // 2️⃣ Proceed to checkout page
//     navigate("/checkout", {
//       state: {
//         products: card_products,
//         price: discountPrice ? discountPrice : price,
//         shipping_fee: shipping_fee,
//         items: buy_product_item,
//       },
//     });
//   };

//   const applyCoupon = () => {
//     // Find the coupon in the coupons array based on the coupon code entered by the user
//     const matchingCoupon = coupons.find((coupon) => coupon.name === couponCode);

//     if (matchingCoupon) {
//       // Check if the entered price is greater than or equal to the coupon's price limit
//       if (price >= matchingCoupon.price) {
//         // Calculate the discounted price if the coupon is valid
//         setDiscountPrice(price - (price * matchingCoupon.discount) / 100);
//       } else {
//         alert(
//           "Invalid price. The price must be greater than or equal to the coupon's minimum price."
//         );
//       }
//     } else {
//       alert("Invalid coupon code.");
//     }
//   };

//   // Increment quantity
//   const inc = (quantity, stock, card_id) => {
//     // Convert values to numbers to ensure proper comparison
//     const currentQty = Number(quantity);
//     const stockLimit = Number(stock);
//     const temp = currentQty + 1;

//     // Only proceed if we're not exceeding stock
//     if (temp <= stockLimit) {
//       dispatch(
//         quantity_inc({
//           cardId: card_id,
//           userId: userInfo.id,
//         })
//       )
//         .then((response) => {
//           dispatch(get_card_products(userInfo.id));
//         })
//         .catch((error) => {
//           console.error("4. Action failed:", error);
//           toast.error(error.message || "Error incrementing quantity");
//         });
//     } else {
//       toast.error("Cannot exceed available stock");
//     }
//   };

//   // Decrement quantity
//   const dec = (quantity, card_id) => {
//     // Convert quantity to number and check if it's greater than 1
//     const currentQty = Number(quantity);

//     // Only proceed if quantity will not go below 1
//     if (currentQty > 1) {
//       dispatch(
//         quantity_dec({
//           cardId: card_id,
//           userId: userInfo.id,
//         })
//       )
//         .then((response) => {
//           dispatch(get_card_products(userInfo.id));
//         })
//         .catch((error) => {
//           console.error("4. Action failed:", error);
//           toast.error(error.message || "Error decrementing quantity");
//         });
//     } else {
//       toast.error("Quantity cannot be less than 1");
//     }
//   };

//   // Handle delete product from the cart
//   const handleDelete = (productId) => {
//     dispatch(delete_card_product(productId))
//       .unwrap()
//       .then((response) => {
//         if (response.message) {
//           toast.success(response.message);
//         }
//         dispatch(get_card_products(userInfo.id));
//       })
//       .catch((error) => {
//         if (error.error) {
//           toast.error(error.error);
//         }
//       })
//       .finally(() => {
//         dispatch(messageClear()); // Clear messages after displaying
//       });
//   };

//   // Fetch user info (login check)
//   useEffect(() => {
//     if (userInfo) {
//       dispatch(get_card_products(userInfo.id));
//     } else {
//       dispatch(customer_login());
//     }
//   }, [dispatch, userInfo]);

//   // Fetch all coupons on component mount
//   useEffect(() => {
//     dispatch(get_coupons());
//   }, [dispatch]);

//   // Watch for successMessage and show it in the toast
//   useEffect(() => {
//     if (successMessage) {
//       dispatch(messageClear()); // Clear the success message after display
//     }
//   }, [successMessage, dispatch]);

//   // Scroll to top on page load
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   return (
//     <div className="bg-[#ecf1f2] overflow-hidden">
//       <Header />
//       <div className="mb-4 md:mb-2 mt-[100px] md:mt-[100px]">
//         <img
//           src="https://i.ibb.co/vxDnRX0V/KELVINBAN6.jpg"
//           alt="banner"
//           className="w-full h-full object-cover md:h-auto"
//         />
//       </div>
//       <div className="font-sans  mx-auto md:p-6 ">
//         <section className="bg-[#eeeeee]">
//           <div className="w-[100%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto md:py-6">
//             {card_products.length > 0 || outofstock_products.length > 0 ? (
//               <div className="flex flex-wrap">
//                 <div className="w-full md:w-[67%]">
//                   <div className="pr-0 md:pr-3">
//                     <div className="flex flex-col gap-3">
//                       <div className="bg-primary p-4">
//                         <h2 className="text-md text-white font-semibold">
//                           Stock Products {card_products.length}
//                         </h2>
//                       </div>
//                       {card_products.map((p, i) => (
//                         <div
//                           key={i}
//                           className="flex bg-white p-4 flex-col gap-2 mt-2 overflow-hidden"
//                         >
//                           <div className="flex justify-between items-center">
//                             <h2 className="font-semibold text-primary text-lg">
//                               {p.shopName}
//                             </h2>
//                           </div>
//                           {p.products.map((pt, j) => (
//                             <div
//                               key={j}
//                               className="w-full flex sm:flex-col md:flex-row border-b-2 md:justify-between py-3"
//                             >
//                               <div className="flex sm:w-full gap-2 w-7/12">
//                                 <div className="flex gap-10 justify-start items-start">
//                                   <img
//                                     className="w-[120px] h-full object-cover"
//                                     src={pt.productInfo.images[0].url}
//                                     alt="product image"
//                                   />
//                                   <div className="md:pr-4 space-y-2 text-slate-600">
//                                     <h2 className="text-md font-semibold text-gray-900">
//                                       {pt.productInfo.name}
//                                     </h2>

//                                     <h2 className="text-base text-primary font-semibold flex items-center justify-between">
//                                       <span className=" text-green-500 ">
//                                         {" "}
//                                         ₹
//                                         {pt.productInfo.price -
//                                           Math.floor(
//                                             (pt.productInfo.price *
//                                               pt.productInfo.discount) /
//                                             100
//                                           )}
//                                         <span className=" text-primary ml-2 font-[400]">
//                                           -{pt.productInfo.discount}%
//                                         </span>
//                                       </span>
//                                     </h2>
//                                     <p className="mt-0">
//                                       <span className="text-base">
//                                         <span className="font-semibold text-gray-500 text-[14px]">
//                                           {" "}
//                                           Size :
//                                         </span>{" "}
//                                         {pt.size}
//                                       </span>
//                                     </p>
//                                     <p className="mt-0">
//                                       <span className="text-base">
//                                         <span className="font-semibold text-gray-500 text-[14px]">
//                                           {" "}
//                                           Color :
//                                         </span>{" "}
//                                         {pt.color}
//                                       </span>
//                                     </p>

//                                     <div className="flex gap-5 ">
//                                       <div className="flex bg-gray-100 h-[30px] justify-center items-center text-xl w-fit">
//                                         <div
//                                           onClick={() =>
//                                             dec(pt.quantity, pt._id)
//                                           }
//                                           className="px-3 cursor-pointer"
//                                         >
//                                           -
//                                         </div>
//                                         <div className="px-3">
//                                           {pt.quantity}
//                                         </div>
//                                         <div
//                                           onClick={() =>
//                                             inc(
//                                               pt.quantity,
//                                               pt.productInfo.stock,
//                                               pt._id
//                                             )
//                                           }
//                                           className="px-3 cursor-pointer"
//                                         >
//                                           +
//                                         </div>
//                                       </div>
//                                       <button
//                                         onClick={() => handleDelete(pt._id)} // Replace pt._id with your actual product ID
//                                         className="px-5 py-[3px]  text-red-500 w-fit"
//                                       >
//                                         <MdDeleteOutline className="text-2xl" />
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ))}
//                       {outofstock_products.length > 0 && (
//                         <div className="flex flex-col gap-3">
//                           <div className="bg-white p-4">
//                             <h2 className="text-md text-red-500 font-semibold">
//                               Out of Stock {outofstock_products.length}
//                             </h2>
//                           </div>
//                           <div className="bg-white p-4">
//                             {outofstock_products.map((p, i) => (
//                               <div key={i} className="w-full flex flex-wrap">
//                                 <div className="flex sm:w-full gap-2 w-7/12">
//                                   <div className="flex gap-2 justify-start items-center">
//                                     <img
//                                       className="w-[80px] h-[80px]"
//                                       src={p.products[0].images[0]}
//                                       alt="product image"
//                                     />
//                                     <div className="pr-4 text-slate-600">
//                                       <h2 className="text-md">
//                                         {p.products[0].name}
//                                       </h2>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="flex justify-between w-5/12 sm:w-full sm:mt-3">
//                                   <div className="pl-4 sm:pl-0">
//                                     <h2 className="text-lg text-primary">
//                                       ₹
//                                       {p.products[0].price -
//                                         Math.floor(
//                                           (p.products[0].price *
//                                             p.products[0].discount) /
//                                           100
//                                         )}{" "}
//                                     </h2>
//                                     <p className="line-through">
//                                       {p.products[0].price}
//                                     </p>
//                                     <p>-{p.products[0].discount}%</p>
//                                   </div>
//                                   <div className="flex gap-2 flex-col">
//                                     <div className="flex bg-gray-100 h-[30px] justify-center items-center text-xl">
//                                       <div
//                                         onClick={() => dec(p.quantity, p._id)}
//                                         className="px-3 cursor-pointer"
//                                       >
//                                         -
//                                       </div>
//                                       <div className="px-3">{p.quantity}</div>
//                                       <div
//                                         onClick={() =>
//                                           dec(
//                                             p.quantity,
//                                             p.products[0].stock,
//                                             p._id
//                                           )
//                                         }
//                                         className="px-3 cursor-pointer"
//                                       >
//                                         +
//                                       </div>
//                                     </div>
//                                     <button
//                                       onClick={() =>
//                                         dispatch(delete_card_product(p._id))
//                                       }
//                                       className="px-5 py-[3px] bg-red-500 text-white"
//                                     >
//                                       Delete
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="w-full md:w-[33%]">
//                   <div className="pl-0 md:pl-3 md-lg:mt-5">
//                     {card_products.length > 0 && (
//                       <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
//                         <h2 className="text-xl font-bold">Order Summary</h2>
//                         <div className="flex justify-between items-center">
//                           <span>{buy_product_item} Item</span>
//                           <span>₹{price}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span>Shipping Fee</span>
//                           <span>₹{shipping_fee}</span>
//                         </div>
//                         <div className="flex gap-2">
//                           <input
//                             className="w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm"
//                             type="text"
//                             value={couponCode}
//                             placeholder="Input Vauchar Coupon"
//                             onChange={(e) => setCouponCode(e.target.value)}
//                           />
//                           <button
//                             onClick={applyCoupon}
//                             className="px-5 py-[1px] bg-primary text-white rounded-sm uppercase text-sm"
//                           >
//                             Apply
//                           </button>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span>Total</span>
//                           <span className="text-lg text-primary">
//                             ₹{" "}
//                             {discountPrice
//                               ? discountPrice + shipping_fee
//                               : price + shipping_fee}
//                           </span>
//                         </div>
//                         <button
//                           onClick={redirect}
//                           className="px-5 py-3 rounded-sm hover:shadow-primary/20 hover:shadow-lg bg-primary text-sm text-white uppercase"
//                         >
//                           Proceed to checkout {buy_product_item}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <Link className="px-4 py-3 bg-black text-white" to="/">
//                   Shop Now
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* </div> */}
//       </div>
//       <Footer />
//       <div className="fixed bottom-0 w-full sm:block md:hidden">
//         <MobileFooter />
//       </div>
//     </div>
//   );
// };

// export default CartPage;



// CartPage.js
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";
import { get_coupons } from "../store/reducers/couponReducer";
import { getShipping } from "../store/reducers/homeReducer";

const CART_KEY = "guestCart";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { coupons } = useSelector((state) => state.coupon);

  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState(null);
  // const [shippingFee, setShippingFee] = useState(0); // agar tumhara shipping API hai to yahan se update kar sakte ho

  
   const { shipping } = useSelector(
      (state) => state.home
    );

   const shippingFee = shipping?.shipping?.shipping_fee;
  // 🔹 Cookie se cart load
  const loadCartFromCookie = () => {
    try {
      const raw = Cookies.get(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.log("cart cookie parse error:", err);
      setCartItems([]);
    }
  };

  // 🔹 Derived values: total items & price
  const buy_product_item = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const price = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // 🔹 Quantity increment
  const inc = (productId, color, size) => {
    const updated = cartItems.map((item) => {
      if (
        String(item.productId) === String(productId) &&
        item.color === color &&
        item.size === size
      ) {
        return {
          ...item,
          quantity: (item.quantity || 1) + 1,
        };
      }
      return item;
    });

    setCartItems(updated);
    Cookies.set(CART_KEY, JSON.stringify(updated), { expires: 7 });
  };

  // 🔹 Quantity decrement
  const dec = (productId, color, size) => {
    const updated = cartItems
      .map((item) => {
        if (
          String(item.productId) === String(productId) &&
          item.color === color &&
          item.size === size
        ) {
          const newQty = (item.quantity || 1) - 1;
          if (newQty < 1) {
            toast.error("Quantity cannot be less than 1");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });

    setCartItems(updated);
    Cookies.set(CART_KEY, JSON.stringify(updated), { expires: 7 });
  };

  // 🔹 Delete product from cart
  const handleDelete = (productId, color, size) => {
    const updated = cartItems.filter(
      (item) =>
        !(
          String(item.productId) === String(productId) &&
          item.color === color &&
          item.size === size
        )
    );

    setCartItems(updated);
    Cookies.set(CART_KEY, JSON.stringify(updated), { expires: 7 });
    toast.success("Product removed from cart");
  };

  // 🔹 Apply coupon
  const applyCoupon = () => {
    const matchingCoupon = coupons.find(
      (coupon) => coupon.name === couponCode
    );

    if (matchingCoupon) {
      if (price >= matchingCoupon.price) {
        const discounted = price - (price * matchingCoupon.discount) / 100;
        setDiscountPrice(discounted);
      } else {
        alert(
          "Invalid price. The price must be greater than or equal to the coupon's minimum price."
        );
      }
    } else {
      alert("Invalid coupon code.");
    }
  };

  // 🔹 Checkout redirect + Meta InitiateCheckout
  const redirect = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await sendMetaEventSafe({
        eventType: "InitiateCheckout",
        price: discountPrice ?? price,
        order: null,
        products: cartItems,
        userInfo: userInfo || {},
      });
    } catch (err) {
      console.log("InitiateCheckout SAFE ERROR:", err.message);
    }

    navigate("/checkout", {
      state: {
        products: cartItems,
        price: discountPrice ?? price,
        shipping_fee: shippingFee,
        items: buy_product_item,
      },
    });
  };

    useEffect(() => {
        dispatch(getShipping());
      }, [dispatch]);
  

  // 🔹 On mount: load cart & coupons
  useEffect(() => {
    loadCartFromCookie();
  }, []);

  useEffect(() => {
    dispatch(get_coupons());
  }, [dispatch]);

  // 🔹 Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#ecf1f2] overflow-hidden">
      <Header />

      <div className="mb-4 md:mb-2 mt-[100px] md:mt-[100px]">
        <img
          src="https://i.ibb.co/vxDnRX0V/KELVINBAN6.jpg"
          alt="banner"
          className="w-full h-full object-cover md:h-auto"
        />
      </div>

      <div className="font-sans mx-auto md:p-6">
        <section className="bg-[#eeeeee]">
          <div className="w-[100%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto md:py-6">
            {cartItems.length > 0 ? (
              <div className="flex flex-wrap">
                {/* LEFT SIDE - PRODUCTS */}
                <div className="w-full md:w-[67%]">
                  <div className="pr-0 md:pr-3">
                    <div className="flex flex-col gap-3">
                      <div className="bg-primary p-4">
                        <h2 className="text-md text-white font-semibold">
                          Products in Cart ({cartItems.length})
                        </h2>
                      </div>

                      <div className="flex flex-col gap-2">
                        {cartItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex bg-white p-4 flex-col gap-2 mt-2 overflow-hidden"
                          >
                            <div className="w-full flex sm:flex-col md:flex-row border-b-2 md:justify-between py-3">
                              <div className="flex sm:w-full gap-2 w-7/12">
                                <div className="flex gap-4 justify-start items-start">
                                  <img
                                    className="w-[120px] h-full object-cover"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                  <div className="md:pr-4 space-y-2 text-slate-600">
                                    <h2 className="text-md font-semibold text-gray-900">
                                      {item.name}
                                    </h2>

                                    <h2 className="text-base text-primary font-semibold flex items-center justify-between">
                                      <span className="text-green-500">
                                        ₹ {item.price}
                                      </span>
                                    </h2>

                                    <p className="mt-0">
                                      <span className="text-base">
                                        <span className="font-semibold text-gray-500 text-[14px]">
                                          Size :
                                        </span>{" "}
                                        {item.size}
                                      </span>
                                    </p>

                                    <p className="mt-0">
                                      <span className="text-base">
                                        <span className="font-semibold text-gray-500 text-[14px]">
                                          Color :
                                        </span>{" "}
                                        {item.color}
                                      </span>
                                    </p>

                                    <div className="flex gap-5">
                                      <div className="flex bg-gray-100 h-[30px] justify-center items-center text-xl w-fit">
                                        <div
                                          onClick={() =>
                                            dec(
                                              item.productId,
                                              item.color,
                                              item.size
                                            )
                                          }
                                          className="px-3 cursor-pointer"
                                        >
                                          -
                                        </div>
                                        <div className="px-3">
                                          {item.quantity}
                                        </div>
                                        <div
                                          onClick={() =>
                                            inc(
                                              item.productId,
                                              item.color,
                                              item.size
                                            )
                                          }
                                          className="px-3 cursor-pointer"
                                        >
                                          +
                                        </div>
                                      </div>

                                      <button
                                        onClick={() =>
                                          handleDelete(
                                            item.productId,
                                            item.color,
                                            item.size
                                          )
                                        }
                                        className="px-5 py-[3px] text-red-500 w-fit"
                                      >
                                        <MdDeleteOutline className="text-2xl" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE - SUMMARY */}
                <div className="w-full md:w-[33%]">
                  <div className="pl-0 md:pl-3 md-lg:mt-5">
                    <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                      <h2 className="text-xl font-bold">Order Summary</h2>

                      <div className="flex justify-between items-center">
                        <span>{buy_product_item} Item</span>
                        <span>₹ {price}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Shipping Fee</span>
                        <span>₹ {shippingFee}</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          className="w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm"
                          type="text"
                          value={couponCode}
                          placeholder="Input Voucher Coupon"
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-5 py-[1px] bg-primary text-white rounded-sm uppercase text-sm"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Total</span>
                        <span className="text-lg text-primary">
                          ₹{" "}
                          {(discountPrice ?? price) + shippingFee}
                        </span>
                      </div>

                      <button
                        onClick={redirect}
                        className="px-5 py-3 rounded-sm hover:shadow-primary/20 hover:shadow-lg bg-primary text-sm text-white uppercase"
                      >
                        Proceed to checkout {buy_product_item}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10">
                <Link className="px-4 py-3 bg-black text-white" to="/">
                  Shop Now
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default CartPage;

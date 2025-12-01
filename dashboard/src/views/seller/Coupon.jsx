import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import {
  addCoupon,
  deleteCoupon,
  getCoupons,
} from "../../store/Reducers/couponReducer";
import Swal from "sweetalert2";
import { overrideStyle } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";

const Coupon = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    name: "",
    price: "",
    discount: "",
    userlimit: "",
  });

  const { coupons, loader } = useSelector((state) => state.coupon);

  // Fetch all coupons on component mount
  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const add = (e) => {
    e.preventDefault();

    // Create a plain object with the form data
    const couponData = {
      name: state.name,
      price: state.price,
      discount: state.discount,
      userlimit: state.userlimit,
    };

    Swal.fire({
      title: "Submitting coupon",
      text: "Are you sure you want to submit this coupon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch action to add coupon
        dispatch(addCoupon(couponData)) // Sending plain object to the action
          .unwrap()
          .then(() => {
            // Show success popup
            Swal.fire({
              title: "Success!",
              text: "Your coupon has been added successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            // window.reload();
          })
          .catch((error) => {
            // Show error popup
            Swal.fire({
              title: "Error!",
              text: "There was a problem submitting your coupon.",
              icon: "error",
            });
          });
      }
    });
  };

  const couponDelete = (id) => {
    dispatch(deleteCoupon(id));
    // console.log("id", id);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Coupon</h1>
        <Link
          className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
          to="/seller/dashboard"
        >
          Coupon
        </Link>
      </div>

      <form onSubmit={add}>
        <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="name">Coupon Title</label>
            <input
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              onChange={inputHandle}
              value={state.name}
              type="text"
              placeholder="Enter Coupon Name.."
              name="name"
              id="name"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="discount">Discount Offer in %</label>
            <input
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              onChange={inputHandle}
              value={state.discount}
              type="number"
              placeholder="Enter Discount Price."
              name="discount"
              id="discount"
            />
          </div>
        </div>

        <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="price">Up to Price</label>
            <input
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              onChange={inputHandle}
              value={state.price}
              type="number"
              placeholder="Up To Price"
              name="price"
              id="price"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="userlimit">User Limit/ coupon</label>
            <input
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              onChange={inputHandle}
              value={state.userlimit}
              type="number"
              placeholder="User Limit"
              name="userlimit"
              id="userlimit"
            />
          </div>
        </div>

        <div className="flex">
          <button
            disabled={loader ? true : false}
            className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
          >
            {loader ? (
              <PropagateLoader color="#fff" cssOverride={overrideStyle} />
            ) : (
              "Upload Coupon"
            )}
          </button>
        </div>
      </form>

      <div>
        <div className="my-6">
          <h2 className="text-lg text-[#d0d2d6] font-semibold">All Coupons</h2>
          <div className="mt-4 space-y-4">
            {coupons.length === 0 ? (
              <p className="text-red-400 text-2xl font-normal">
                No coupons available.
              </p>
            ) : (
              coupons.map((coupon) => (
                <div className="p-4 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] flex justify-between">
                  <div key={coupon._id} className="">
                    <h3 className="font-semibold">{coupon.name}</h3>
                    <p>Price: ₹{coupon.price}</p>
                    <p>Discount: {coupon.discount}%</p>
                    <p>User Limit: {coupon.userlimit}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => couponDelete(coupon._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;

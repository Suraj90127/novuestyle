import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import domtoPDF from "dom-to-pdf";
import {
  messageClear,
  get_seller_order,
  seller_order_status_update,
} from "../../store/Reducers/OrderReducer";
import "../../App.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const contentRef = useRef();

  const { order, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );

  console.log("ooo", order);

  const handleDownloadPdf = () => {
    window.print();
  };

  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId]);

  const [status, setStatus] = useState("");
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchData, setDispatchData] = useState({
    trackingNumber: "",
    remarks: ""
  });

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  const status_update = (e) => {
    const selectedStatus = e.target.value;

    if (selectedStatus === "Dispatch") {
      // Show popup for dispatch details
      setShowDispatchModal(true);
      // Temporarily keep the status as current until modal is submitted
      setStatus(order?.delivery_status);
    } else {
      // For other statuses, update directly
      dispatch(
        seller_order_status_update({
          orderId,
          info: {
            coustomerId: order.orderId,
            status: selectedStatus,
            trackingNumber: "",
            remarks: ""
          }
        })
      );
      setStatus(selectedStatus);
    }
  };

  const handleDispatchSubmit = () => {
    if (!dispatchData.trackingNumber.trim()) {
      toast.error("Please enter tracking number");
      return;
    }

    dispatch(
      seller_order_status_update({
        orderId,
        info: {
          coustomerId: order.orderId,
          status: "Dispatch",
          trackingNumber: dispatchData.trackingNumber,
          remarks: dispatchData.remarks
        }
      })
    );
    setStatus("Dispatch");
    setShowDispatchModal(false);
    setDispatchData({ trackingNumber: "", remarks: "" });
  };

  const handleCloseModal = () => {
    setShowDispatchModal(false);
    setDispatchData({ trackingNumber: "", remarks: "" });
    // Reset select to current status
    setStatus(order?.delivery_status);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleDispatchDataChange = (e) => {
    setDispatchData({
      ...dispatchData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-end items-center p-4">
          <select
            onChange={status_update}
            value={status}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="pending">pending</option>
            <option value="To be Printed">To be Printed</option>
            <option value="Dispatch">Dispatch</option>
            <option value="cancelled">cancelled</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div className="p-4 md:pl-14 mx-auto flex flex-col justify-center">
          <div className=" bg-[#283046]" ref={contentRef}>
            <h2 className="text-xl text-[#d0d2d6] mb-10">Order Details</h2>
            <div className="flex gap-2 text-lg text-[#d0d2d6]">
              <h2>#{order._id}</h2>
              <span className="text-orange-500">{order.date}</span>
            </div>

            {/* Display Tracking Info if available */}
            {order?.trackingNumber && (
              <div className="mt-4 p-4 bg-slate-800 rounded-md">
                <h3 className="text-lg text-white font-semibold mb-2">Dispatch Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">
                      <span className="text-white font-medium">Tracking Number:</span> {order.trackingNumber}
                    </p>
                  </div>
                  {order?.remarks && (
                    <div>
                      <p className="text-gray-400">
                        <span className="text-white font-medium">Remarks:</span> {order.remarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap">
              <div className="md:w-[50%]">
                <div className="pr-3 text-[#d0d2d6] text-lg flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="py-2 text-green-500 text-xl font-semibold">
                      Deliver To:
                    </h2>
                    {order.shippingInfo && (
                      <div className="flex flex-col gap-2">
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">Name:</span>{" "}
                          {order.shippingInfo.name}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">
                            Address:
                          </span>{" "}
                          {order.shippingInfo.address}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">Phone:</span>{" "}
                          {order.shippingInfo.phone}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">Post:</span>{" "}
                          {order.shippingInfo.post}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">
                            Province:{" "}
                          </span>
                          {order.shippingInfo.province}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">City:</span>{" "}
                          {order.shippingInfo.city}
                        </p>
                        <p className="flex justify-between text-gray-400">
                          <span className="font-[600] text-white">Area: </span>
                          {order.shippingInfo.area}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-3 text-white">
                    <h2 className="text-[600]">Payment Status:</h2>
                    <span className="text-base text-gray-400">
                      {order.payment_status}
                    </span>
                  </div>
                  <span className="flex justify-between text-gray-400">
                    <span className="text-white text-[600]">Price:</span> ₹
                    {order.price}
                  </span>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="text-[#d0d2d6] flex flex-col gap-6">
                      {order?.products?.map((p, i) => (
                        <div
                          key={i}
                          className="flex gap-3 text-md items-center"
                        >
                          <img
                            className="w-[150px] h-[150px]"
                            src={p.image}
                            alt={p.name}
                          />
                          <div>
                            <h2 className="text-white font-[500] text-lg">
                              {p.name}
                            </h2>
                            <p>

                              <span className="text-green-500">{p.brand}</span>
                              <p className="text-lg">Quantity: {p.quantity}</p>
                            </p>
                            <div className="flex justify-between">

                              <p>
                                <span>Size : </span>
                                <span>{p.size}</span>
                              </p>
                              <p>
                                <span>Fabric Code : </span>
                                <span>{p.fabric}</span>
                              </p>
                            </div>
                            <div className="flex justify-between">

                              <p>
                                <span>Color : </span>
                                <span>{p.color}</span>
                              </p>
                              <p>
                                <span>Design Code: </span>
                                <span>{p.design}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-500 rounded-md mt-6 text-white"
              onClick={handleDownloadPdf}
            >
              Print Bills
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#283046] rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl text-white font-semibold mb-4">
              Dispatch Order
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[#d0d2d6] text-sm mb-2">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={dispatchData.trackingNumber}
                  onChange={handleDispatchDataChange}
                  className="w-full px-3 py-2 bg-[#1a2234] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none focus:border-blue-500"
                  placeholder="Enter tracking number"
                  required
                />
              </div>

              <div>
                <label className="block text-[#d0d2d6] text-sm mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={dispatchData.remarks}
                  onChange={handleDispatchDataChange}
                  className="w-full px-3 py-2 bg-[#1a2234] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none focus:border-blue-500"
                  placeholder="Enter any remarks"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import {
  get_seller_created_orders,
  seller_order_remark_update,
  messageClear
} from "../../store/Reducers/OrderReducer";
import { toast } from "react-hot-toast";

const CreatedOrders = () => {
  const dispatch = useDispatch();
  const { totalOrder, createdOrders, errorMessage, successMessage } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    dispatch(
      get_seller_created_orders({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
        sellerId: userInfo._id,
      })
    );
  }, [parPage, currentPage, searchValue]);

  // Handle success/error messages from Redux
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setRemarks(order.remarks || "");
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
    setRemarks("");
  };

  const handleUpdateRemarks = () => {
    if (!selectedOrder) return;

    console.log("selectedOrder", selectedOrder);

    dispatch(
      seller_order_remark_update({
        orderId: selectedOrder.orderId,
        info: {
          remarks: remarks,
        }
      })
    );
  };

  // Handle successful remarks update
  useEffect(() => {
    if (successMessage && successMessage.includes("Remarks updated")) {
      // Refresh orders data
      dispatch(
        get_seller_created_orders({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          sellerId: userInfo._id,
        })
      );
      handleClosePopup();
    }
  }, [successMessage]);

  const getStatusBadgeClass = (status, type) => {
    const baseClasses = "py-2 px-4 rounded-full text-lg capitalize";

    if (type === 'payment') {
      switch (status) {
        case "paid":
          return `${baseClasses} bg-green-500 text-white`;
        case "COD":
          return `${baseClasses} bg-red-500 text-white`;
        default:
          return `${baseClasses} bg-yellow-500 text-black`;
      }
    } else {
      switch (status) {
        case "deliverd":
        case "processing":
          return `${baseClasses} bg-green-500 text-white`;
        case "pending":
          return `${baseClasses} bg-yellow-500 text-black`;
        default:
          return `${baseClasses} bg-red-500 text-white`;
      }
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Order Id
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Size
                </th>
                <th scope="col" className="py-3 px-4">
                  Remark
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Order Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Date
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {createdOrders.map((d, i) => (
                <tr key={i} className="border-b border-slate-700">
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap flex flex-col"
                  >
                    #{d._id?.slice(-6)}
                  </td>

                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.products.map((product, index) => (
                      <div key={index}>{product.name}</div>
                    ))}
                  </td>

                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap text-lg"
                  >
                    ₹{d.price}
                  </td>

                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.products.map((product, index) => (
                      <div key={index}>{product.size}</div>
                    ))}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.remarks || "N/A"}
                  </td>

                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <span className={getStatusBadgeClass(d.payment_status, 'payment')}>
                      {d.payment_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <span className={getStatusBadgeClass(d.delivery_status, 'delivery')}>
                      {d.delivery_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.date}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <button
                      onClick={() => handleViewDetails(d)}
                      className="p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalOrder <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>

      {/* Order Details Popup */}
      {showPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#283046] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-white font-semibold">
                Order Details - #{selectedOrder._id?.slice(-6)}
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Information */}
              <div className="bg-[#1a2234] p-4 rounded-lg">
                <h4 className="text-lg text-green-500 font-semibold mb-4">
                  Shipping Information
                </h4>
                {selectedOrder.shippingInfo && (
                  <div className="space-y-3 text-[#d0d2d6]">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Name:</span>
                      <span>{selectedOrder.shippingInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Address:</span>
                      <span className="text-right">{selectedOrder.shippingInfo.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Phone:</span>
                      <span>{selectedOrder.shippingInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Pin Code:</span>
                      <span>{selectedOrder.shippingInfo.post}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">State:</span>
                      <span>{selectedOrder.shippingInfo.province}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">City:</span>
                      <span>{selectedOrder.shippingInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Area:</span>
                      <span>{selectedOrder.shippingInfo.area}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Information */}
              <div className="bg-[#1a2234] p-4 rounded-lg">
                <h4 className="text-lg text-green-500 font-semibold mb-4">
                  Order Information
                </h4>
                <div className="space-y-3 text-[#d0d2d6]">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Order Date:</span>
                    <span>{selectedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Total Price:</span>
                    <span>₹{selectedOrder.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Payment Status:</span>
                    <span className={getStatusBadgeClass(selectedOrder.payment_status, 'payment')}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Delivery Status:</span>
                    <span className={getStatusBadgeClass(selectedOrder.delivery_status, 'delivery')}>
                      {selectedOrder.delivery_status}
                    </span>
                  </div>
                </div>

                {/* Remarks Section */}
                <div className="mt-6">
                  <h4 className="text-lg text-green-500 font-semibold mb-4">
                    Remarks
                  </h4>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none focus:border-blue-500"
                    placeholder="Add remarks here..."
                    rows="4"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateRemarks}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Update Remarks
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Information */}
            <div className="mt-6 bg-[#1a2234] p-4 rounded-lg">
              <h4 className="text-lg text-green-500 font-semibold mb-4">
                Products
              </h4>
              <div className="space-y-4">
                {selectedOrder.products.map((product, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-slate-700 pb-4">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{product.name}</h5>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-[#d0d2d6]">
                        <div>
                          <span className="font-medium text-white">Size:</span> {product.size}
                        </div>
                        <div>
                          <span className="font-medium text-white">Color:</span> {product.color}
                        </div>
                        <div>
                          <span className="font-medium text-white">Quantity:</span> {product.quantity}
                        </div>
                        <div>
                          <span className="font-medium text-white">Brand:</span> {product.brand || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedOrders;
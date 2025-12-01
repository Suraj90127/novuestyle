


import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import { get_seller_orders } from "../../store/Reducers/OrderReducer";

const Orders = () => {
  const dispatch = useDispatch();
  const { totalOrder, myOrders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // console.log("myOrders", myOrders);


  // Filter orders based on selected filters
  const filteredOrders = myOrders.filter((order) => {
    const deliveryMatch = deliveryFilter === "all" || order.delivery_status === deliveryFilter;
    const paymentMatch = paymentFilter === "all" || order.payment_status === paymentFilter;
    return deliveryMatch && paymentMatch;
  });

  useEffect(() => {
    dispatch(
      get_seller_orders({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
        sellerId: userInfo._id,
      })
    );
  }, [parPage, currentPage, searchValue]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [deliveryFilter, paymentFilter]);

  // Get unique status values for dropdown options
  const deliveryStatusOptions = ["all", "pending", "processing", "warehouse", "cancelled", "deliverd"];
  const paymentStatusOptions = ["all", "paid", "unpaid"];

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

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-4">
          {/* Delivery Status Filter */}
          <div className="flex flex-col">
            <label className="text-[#d0d2d6] text-sm mb-2">Delivery Status</label>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none focus:border-blue-500"
            >
              {deliveryStatusOptions.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status === "all" ? "All Delivery Status" : status}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex flex-col">
            <label className="text-[#d0d2d6] text-sm mb-2">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none focus:border-blue-500"
            >
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status === "all" ? "All Payment Status" : status}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-col justify-end">
            <div className="flex flex-wrap gap-2">
              {deliveryFilter !== "all" && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm capitalize">
                  Delivery: {deliveryFilter}
                </span>
              )}
              {paymentFilter !== "all" && (
                <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm capitalize">
                  Payment: {paymentFilter}
                </span>
              )}
              {(deliveryFilter !== "all" || paymentFilter !== "all") && (
                <button
                  onClick={() => {
                    setDeliveryFilter("all");
                    setPaymentFilter("all");
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders Count */}
        <div className="mb-4">
          <p className="text-[#d0d2d6]">
            Showing {filteredOrders.length} of {myOrders.length} orders
            {(deliveryFilter !== "all" || paymentFilter !== "all") &&
              ` (filtered)`
            }
          </p>
        </div>

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
                  Color
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((d, i) => (
                  <tr key={i} className="border-b border-slate-700">
                    <td
                      scope="row"
                      className="py-3 px-4 font-medium whitespace-nowrap flex flex-col"
                    >
                      #{d._id.slice(-6)}
                    </td>

                    <td
                      scope="row"
                      className="py-3 px-4 font-medium whitespace-nowrap"
                    >
                      {d.products.map((product, i) => (
                        <div key={i}>{product.name}</div>
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
                      {d.products.map((product, i) => (
                        <div key={i}>{product.size}</div>
                      ))}
                    </td>
                    <td
                      scope="row"
                      className="py-3 px-4 font-medium whitespace-nowrap"
                    >
                      {d.products.map((product, i) => (
                        <div key={i}>{product.color}</div>
                      ))}
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
                      <Link
                        to={`/seller/dashboard/order/details/${d._id}`}
                        className="p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 px-4 text-center text-[#d0d2d6]">
                    No orders found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredOrders.length > 0 && totalOrder <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={filteredOrders.length}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
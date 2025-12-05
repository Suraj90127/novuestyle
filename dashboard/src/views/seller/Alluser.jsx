import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { delete_customer, get_all_user,bulk_delete_customers,messageClear } from "../../store/Reducers/authReducer";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  RefreshCw,
  Plus,
  Mail as MailIcon,
  Shield,
  Clock,
  BarChart3,
  TrendingUp,
  UserPlus,
  Clock as TodayIcon,
  AlertTriangle,
  Info,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
// import { bulk_delete_customers } from "../../../../controllers/home/customerAuthController";
// import { messageClear } from "../../store/Reducers/categoryReducer";

const AllUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alluser, deleteLoading, deleteSuccess, deleteError, successMessage } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterMethod, setFilterMethod] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [showFilters, setShowFilters] = useState(false);
  const [todayRegistrations, setTodayRegistrations] = useState(0);

   // State for delete functionality
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);




  const customers = alluser?.customers || [];
  const pagination = alluser?.pagination || {};

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, itemsPerPage, searchTerm, filterMethod]);

  useEffect(() => {
    // Calculate today's registrations when customers data loads
    if (customers.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayRegCount = customers.filter(customer => {
        const customerDate = new Date(customer.createdAt);
        customerDate.setHours(0, 0, 0, 0);
        return customerDate.getTime() === today.getTime();
      }).length;
      
      setTodayRegistrations(todayRegCount);
    }
  }, [customers]);

  const fetchCustomers = () => {
    setLoading(true);
    dispatch(get_all_user({
      page: currentPage,
      parPage: itemsPerPage,
      searchValue: searchTerm
    })).finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const handleSelectCustomer = (id) => {
    setSelectedCustomers(prev =>
      prev.includes(id)
        ? prev.filter(customerId => customerId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer._id));
    }
  };

  const handleExport = () => {
    const csvData = [
      ["ID", "Name", "Email", "Phone", "Method", "Created At"],
      ...customers.map(customer => [
        customer._id,
        customer.name,
        customer.email,
        customer.phone,
        customer.method,
        new Date(customer.createdAt).toLocaleDateString()
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "menualy": return "bg-blue-900/30 text-blue-400 border border-blue-800/50";
      case "google": return "bg-red-900/30 text-red-400 border border-red-800/50";
      case "facebook": return "bg-blue-900/30 text-blue-400 border border-blue-800/50";
      default: return "bg-gray-800 text-gray-400 border border-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    const phoneStr = phone.toString();
    return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  // Get today's date for display
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

    // Handle success/error messages
  useEffect(() => {
    if (deleteSuccess) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        dispatch(messageClear());
      }, 3000);
    }
    
    if (deleteError) {
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
        dispatch(messageClear());
      }, 3000);
    }
  }, [deleteSuccess, deleteError, dispatch]);


  // Move filteredCustomers calculation to the top level, before the return statement
const filteredCustomers = customers
  .filter(customer => filterMethod === "all" || customer.method === filterMethod)
  .sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  useEffect(() => {
    if (deleteSuccess) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        dispatch(messageClear());
      }, 3000);
      
      // Refresh customers list after successful delete
      if (deleteType === "bulk" || customerToDelete) {
        fetchCustomers();
      }
    }
    
    if (deleteError) {
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
        dispatch(messageClear());
      }, 3000);
    }
  }, [deleteSuccess, deleteError, dispatch, deleteType, customerToDelete]);

  // Handle single customer delete
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setDeleteType("single");
    setBulkDeleteCount(0);
    setShowDeleteModal(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedCustomers.length === 0) {
      return;
    }
    setCustomerToDelete(null);
    setDeleteType("bulk");
    setBulkDeleteCount(selectedCustomers.length);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (deleteType === "single" && customerToDelete) {
      await dispatch(delete_customer({ customerId: customerToDelete._id }));
      setSelectedCustomers(prev => prev.filter(id => id !== customerToDelete._id));
    } else if (deleteType === "bulk" && selectedCustomers.length > 0) {
      await dispatch(bulk_delete_customers({ customerIds: selectedCustomers }));
      setSelectedCustomers([]);
    }
    setShowDeleteModal(false);
  };

  // Get modal title based on delete type
  const getModalTitle = () => {
    if (deleteType === "single") {
      return "Delete Customer";
    } else if (deleteType === "bulk") {
      return `Delete ${bulkDeleteCount} Customer${bulkDeleteCount > 1 ? 's' : ''}`;
    }
    return "Delete";
  };

  // Get warning message based on delete type
  const getWarningMessage = () => {
    if (deleteType === "single") {
      return "This customer will be permanently deleted. This action cannot be undone.";
    } else if (deleteType === "bulk") {
      return `${bulkDeleteCount} customer${bulkDeleteCount > 1 ? 's' : ''} will be permanently deleted. This action cannot be undone.`;
    }
    return "";
  };

  // Get customer info for display
  const getCustomerInfo = () => {
    if (deleteType === "single" && customerToDelete) {
      return (
        <div className="bg-[#283046] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7367f0] to-[#9e95f5] flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {customerToDelete?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-white text-lg">{customerToDelete?.name}</div>
              <div className="text-sm text-[#b4b7bd]">{customerToDelete?.email}</div>
              <div className="text-xs text-[#b4b7bd] mt-1">
                Phone: {formatPhone(customerToDelete?.phone)}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (deleteType === "bulk") {
      return (
        <div className="bg-[#283046] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ea5455] to-[#ff6b6b] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-lg">
                {bulkDeleteCount} Customer{bulkDeleteCount > 1 ? 's' : ''} Selected
              </div>
              <div className="text-sm text-[#b4b7bd]">
                All selected customers will be permanently deleted
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Single reusable Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#343d55] rounded-xl border border-[#3b4253] max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              deleteType === "single" ? "bg-[#ea5455]/20" : "bg-[#ff9f43]/20"
            }`}>
              {deleteType === "single" ? (
                <Trash2 className="w-6 h-6 text-[#ea5455]" />
              ) : (
                <AlertCircle className="w-6 h-6 text-[#ff9f43]" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{getModalTitle()}</h3>
              <p className="text-[#b4b7bd] mt-1">
                {deleteType === "single" ? "Confirm to delete this customer" : "Confirm bulk deletion"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setCustomerToDelete(null);
            }}
            className="p-2 hover:bg-[#283046] rounded-lg transition-colors"
            disabled={deleteLoading}
          >
            <X className="w-5 h-5 text-[#b4b7bd]" />
          </button>
        </div>

        {/* Customer Info */}
        {getCustomerInfo()}

        {/* Warning Section */}
        <div className="bg-[#283046] border border-[#ea5455]/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-[#ea5455] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Warning</span>
          </div>
          <p className="text-sm text-[#b4b7bd] mb-3">{getWarningMessage()}</p>
          <ul className="text-sm text-[#b4b7bd] space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#ea5455]"></div>
              All data will be permanently removed
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#ea5455]"></div>
              This action cannot be reversed
            </li>
            {deleteType === "single" && (
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#ea5455]"></div>
                Associated records will be affected
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setCustomerToDelete(null);
            }}
            disabled={deleteLoading}
            className="flex-1 px-4 py-3 border border-[#3b4253] bg-[#283046] hover:bg-[#3b4253] text-[#d0d2d6] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleteLoading}
            className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
              deleteType === "single" 
                ? "bg-gradient-to-r from-[#ea5455] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ea5455]" 
                : "bg-gradient-to-r from-[#ff9f43] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ff9f43]"
            } text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {deleteLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {deleteType === "single" ? "Deleting..." : "Deleting..."}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {deleteType === "single" ? "Delete Customer" : `Delete ${bulkDeleteCount}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Success Toast Component
  const SuccessToast = () => (
    <div className="fixed top-6 right-6 bg-gradient-to-r from-green-900/90 to-emerald-900/90 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-700/50 z-50 animate-slideIn backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
        <div>
          <div className="font-semibold">Success!</div>
          <div className="text-sm text-green-200 mt-1 max-w-xs">{successMessage}</div>
        </div>
      </div>
    </div>
  );

  // Error Toast Component
  const ErrorToast = () => (
    <div className="fixed top-6 right-6 bg-gradient-to-r from-red-900/90 to-rose-900/90 text-white px-6 py-4 rounded-xl shadow-2xl border border-red-700/50 z-50 animate-slideIn backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
        <div>
          <div className="font-semibold">Error!</div>
          <div className="text-sm text-red-200 mt-1 max-w-xs">{deleteError}</div>
        </div>
      </div>
    </div>
  );

  // Update delete button in customer table row
  const renderDeleteButton = (customer) => (
    <button
      onClick={() => handleDeleteCustomer(customer)}
      className="p-2 bg-[#283046] hover:bg-[#ea5455] text-[#ea5455] hover:text-white border border-[#ea5455]/30 hover:border-[#ea5455] rounded-lg transition-all duration-300"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );

  // Update bulk delete button in selected actions bar
  const renderBulkDeleteButton = () => (
    <button
      onClick={handleBulkDelete}
      disabled={selectedCustomers.length === 0 || deleteLoading}
      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
        selectedCustomers.length === 0 || deleteLoading
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-[#ea5455] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ea5455] text-white hover:shadow-lg"
      }`}
    >
      <Trash2 className="w-4 h-4" />
      Delete Selected
    </button>
  );


  return (
    <div className="min-h-screen bg-[#283046] text-[#d0d2d6] p-4 md:p-6">
          {showDeleteModal && <DeleteConfirmationModal />}
      
      {/* Success/Error Toasts */}
      {showSuccessToast && <SuccessToast />}
      {showErrorToast && <ErrorToast />}
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Customer Management</h1>
            <p className="text-[#b4b7bd] mt-1">Manage and monitor all customer accounts</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => navigate('/customer/add')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </button> */}
            
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-[#3b4253] bg-[#343d55] hover:bg-[#3b4253] transition-colors flex items-center gap-2 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-[#7367f0] text-white rounded-lg hover:bg-[#6559d8] transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Increased to 5 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Today's Registrations Card */}
          <div className="bg-gradient-to-br from-[#ff9f43]/20 to-[#ff6b6b]/20 rounded-xl p-4 border border-[#ff9f43]/30 hover:border-[#ff9f43]/50 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#ffd8b8] font-medium">Today's Registration</p>
                <p className="text-3xl font-bold text-white mt-2">{todayRegistrations}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TodayIcon className="w-4 h-4 text-[#ff9f43]" />
                  <p className="text-xs text-[#ffd8b8]">{getTodayDate()}</p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">+{Math.floor(todayRegistrations / 2)} from yesterday</span>
                  </div>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff9f43] to-[#ff6b6b] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#ff9f43]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#ffd8b8]">Daily Target</span>
                <span className="text-xs text-white font-semibold">{pagination.totalCustomers || 0}</span>
              </div>
              <div className="mt-2 w-full bg-[#3b4253] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#ff9f43] to-[#ff6b6b] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todayRegistrations / 15) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Total Customers Card */}
          <div className="bg-[#343d55] rounded-xl p-4 border border-[#3b4253] hover:border-[#7367f0]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#b4b7bd]">Total Customers</p>
                <p className="text-2xl font-bold text-white mt-1">{pagination.totalCustomers || 0}</p>
                <p className="text-xs text-green-400 mt-1">↗ +12% from last month</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#7367f0]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#7367f0]" />
              </div>
            </div>
          </div>

          {/* Active Card */}
          <div className="bg-[#343d55] rounded-xl p-4 border border-[#3b4253] hover:border-[#28c76f]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#b4b7bd]">Active</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {customers.length} of {pagination.totalCustomers || 0}
                </p>
                <p className="text-xs text-blue-400 mt-1">Showing on this page</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#28c76f]/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-[#28c76f]" />
              </div>
            </div>
          </div>

          {/* Page Card */}
          <div className="bg-[#343d55] rounded-xl p-4 border border-[#3b4253] hover:border-[#00cfe8]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#b4b7bd]">Page</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {currentPage} / {pagination.totalPages || 1}
                </p>
                <p className="text-xs text-[#b4b7bd] mt-1">Navigation</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#00cfe8]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#00cfe8]" />
              </div>
            </div>
          </div>

          {/* Selected Card */}
          <div className="bg-[#343d55] rounded-xl p-4 border border-[#3b4253] hover:border-[#ff9f43]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#b4b7bd]">Selected</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {selectedCustomers.length}
                </p>
                <p className="text-xs text-[#b4b7bd] mt-1">For bulk actions</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ff9f43]/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#ff9f43]" />
              </div>
            </div>
          </div>
        </div>

        {/* Registration Trends */}
        <div className="bg-[#343d55] rounded-xl border border-[#3b4253] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Registration Trends</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#b4b7bd]">Last 7 days</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="flex items-end h-20 gap-2">
            {[5, 8, 12, 10, 15, 8, todayRegistrations].map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#7367f0] to-[#9e95f5] rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(count / 15) * 80}px` }}
                  title={`${count} registrations`}
                ></div>
                <span className="text-xs text-[#b4b7bd] mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#343d55] rounded-xl border border-[#3b4253] p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-[#b4b7bd]" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-24 py-3 bg-[#283046] border border-[#3b4253] text-[#d0d2d6] rounded-lg focus:ring-2 focus:ring-[#7367f0] focus:border-[#7367f0] placeholder-[#676d7d]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-3 px-3 py-1 bg-[#7367f0] text-white rounded-md hover:bg-[#6559d8] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-[#3b4253] bg-[#283046] hover:bg-[#343d55] transition-colors rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-[#283046] border border-[#3b4253] rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[#b4b7bd] mb-2">Registration Method</label>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#343d55] border border-[#3b4253] text-[#d0d2d6] rounded-lg focus:ring-2 focus:ring-[#7367f0] focus:border-[#7367f0]"
                >
                  <option value="all">All Methods</option>
                  <option value="menualy">Manual Registration</option>
                  <option value="google">Google Sign-in</option>
                  <option value="facebook">Facebook Sign-in</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#b4b7bd] mb-2">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-[#343d55] border border-[#3b4253] text-[#d0d2d6] rounded-lg focus:ring-2 focus:ring-[#7367f0] focus:border-[#7367f0]"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#b4b7bd] mb-2">Sort By</label>
                <select
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 bg-[#343d55] border border-[#3b4253] text-[#d0d2d6] rounded-lg focus:ring-2 focus:ring-[#7367f0] focus:border-[#7367f0]"
                >
                  <option value="createdAt">Registration Date</option>
                  <option value="name">Customer Name</option>
                  <option value="email">Email Address</option>
                  <option value="method">Registration Method</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-[#343d55] rounded-xl border border-[#3b4253] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7367f0]"></div>
              </div>
              <p className="text-center text-[#b4b7bd] mt-4">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-16 h-16 text-[#3b4253] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No customers found</h3>
              <p className="text-[#b4b7bd]">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-[#3b4253]">
                <thead className="bg-[#283046]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.length === customers.length && customers.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0] border-[#3b4253] bg-[#283046] rounded"
                        />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer
                        {sortConfig.key === "name" && (
                          <span className="text-[#7367f0]">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        Email
                        {sortConfig.key === "email" && (
                          <span className="text-[#7367f0]">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort("method")}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Method
                        {sortConfig.key === "method" && (
                          <span className="text-[#7367f0]">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Joined
                        {sortConfig.key === "createdAt" && (
                          <span className="text-[#7367f0]">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#b4b7bd] uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4253]">
                  {filteredCustomers.map((customer) => {
                    const customerDate = new Date(customer.createdAt);
                    customerDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isToday = customerDate.getTime() === today.getTime();
                    
                    return (
                      <tr
                        key={customer._id}
                        className={`hover:bg-[#283046] transition-colors ${
                          selectedCustomers.includes(customer._id) ? "bg-[#283046]/70" : ""
                        } ${isToday ? "border-l-4 border-l-[#ff9f43]" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer._id)}
                            onChange={() => handleSelectCustomer(customer._id)}
                            className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0] border-[#3b4253] bg-[#283046] rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7367f0] to-[#9e95f5] flex items-center justify-center mr-3 shadow-lg">
                              <span className="text-white font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-white flex items-center gap-2">
                                {customer.name}
                                {isToday && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#ff9f43]/20 to-[#ff6b6b]/20 text-[#ff9f43] text-xs rounded-full border border-[#ff9f43]/30">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-[#b4b7bd]">ID: {customer._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-white">
                            <Mail className="w-4 h-4 mr-2 text-[#7367f0]" />
                            <span className="truncate max-w-[200px]">{customer.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-white">
                            <Phone className="w-4 h-4 mr-2 text-[#00cfe8]" />
                            {formatPhone(customer.phone)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(customer.method)}`}>
                            {customer.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-[#28c76f]" />
                            {formatDate(customer.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {/* <button
                              onClick={() => navigate(`/customer/${customer._id}`)}
                              className="p-2 bg-[#283046] hover:bg-[#7367f0] text-[#7367f0] hover:text-white border border-[#7367f0]/30 hover:border-[#7367f0] rounded-lg transition-all duration-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/customer/edit/${customer._id}`)}
                              className="p-2 bg-[#283046] hover:bg-[#28c76f] text-[#28c76f] hover:text-white border border-[#28c76f]/30 hover:border-[#28c76f] rounded-lg transition-all duration-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button> */}
                           
                            <button
                                onClick={() => handleDeleteCustomer(customer)}
                                className="p-2 bg-[#283046] hover:bg-[#ea5455] text-[#ea5455] hover:text-white border border-[#ea5455]/30 hover:border-[#ea5455] rounded-lg transition-all duration-300"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[#3b4253]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-[#b4b7bd]">
                    Showing <span className="font-medium text-white">{customers.length}</span> of{" "}
                    <span className="font-medium text-white">{pagination.totalCustomers || 0}</span> customers
                    {todayRegistrations > 0 && (
                      <span className="ml-2 text-[#ff9f43]">• {todayRegistrations} registered today</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPreviousPage}
                      className={`px-3 py-2 border rounded-lg flex items-center gap-1 transition-colors ${
                        pagination.hasPreviousPage
                          ? "border-[#3b4253] bg-[#283046] hover:bg-[#343d55] text-[#d0d2d6] hover:text-white"
                          : "border-[#2d3344] text-[#676d7d] cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, pagination.totalPages || 1)).keys()].map((num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num + 1)}
                          className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all ${
                            currentPage === num + 1
                              ? "border-[#7367f0] bg-[#7367f0] text-white font-semibold shadow-lg"
                              : "border-[#3b4253] bg-[#283046] hover:bg-[#343d55] text-[#d0d2d6]"
                          }`}
                        >
                          {num + 1}
                        </button>
                      ))}
                      {pagination.totalPages > 5 && (
                        <span className="px-2 text-[#676d7d]">...</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`px-3 py-2 border rounded-lg flex items-center gap-1 transition-colors ${
                        pagination.hasNextPage
                          ? "border-[#3b4253] bg-[#283046] hover:bg-[#343d55] text-[#d0d2d6] hover:text-white"
                          : "border-[#2d3344] text-[#676d7d] cursor-not-allowed"
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Actions Bar */}
      {selectedCustomers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#343d55] rounded-xl shadow-2xl border border-[#7367f0] p-4 z-10 min-w-[300px] backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7367f0]/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#7367f0]" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  {selectedCustomers.length} customer(s) selected
                </div>
                <div className="text-xs text-[#b4b7bd]">Ready for bulk actions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log("Export selected:", selectedCustomers);
                }}
                className="px-3 py-2 border border-[#3b4253] bg-[#283046] hover:bg-[#343d55] text-[#d0d2d6] hover:text-white rounded-lg transition-colors text-sm"
              >
                Export
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${selectedCustomers.length} customer(s)?`)) {
                    setSelectedCustomers([]);
                  }
                }}
                className="px-3 py-2 bg-gradient-to-r from-[#ea5455] to-[#ff6b6b] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedCustomers([])}
                className="px-3 py-2 border border-[#3b4253] bg-[#283046] hover:bg-[#343d55] text-[#d0d2d6] hover:text-white rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

       <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllUser;
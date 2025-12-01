import {
  AiFillDashboard,
  AiOutlineShoppingCart,
  AiOutlinePlus,
} from "react-icons/ai";
import { BiCategory, BiLoaderCircle } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { CiChat1, CiDiscount1 } from "react-icons/ci";
import { BsCurrencyDollar, BsChat, BsCardHeading } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { RiCoupon2Fill } from "react-icons/ri";
import AllGift from "../views/seller/AllGift";
export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "admin",
    path: "/admin/dashboard/orders",
  },

  {
    id: 3,
    title: "Sellers",
    icon: <FiUsers />,
    role: "admin",
    path: "/admin/dashboard/sellers",
  },
  {
    id: 4,
    title: "Payment request",
    icon: <BsCurrencyDollar />,
    role: "admin",
    path: "/admin/dashboard/payment-request",
  },
  {
    id: 5,
    title: "Deactive Sellers",
    icon: <FiUsers />,
    role: "admin",
    path: "/admin/dashboard/deactive-sellers",
  },
  {
    id: 6,
    title: "Sellers Request",
    icon: <BiLoaderCircle />,
    role: "admin",
    path: "/admin/dashboard/sellers-request",
  },
  {
    id: 7,
    title: "Chat Seller",
    icon: <CiChat1 />,
    role: "admin",
    path: "/admin/dashboard/chat-sellers",
  },
  {
    id: 8,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "seller",
    path: "/seller/dashboard",
  },
  {
    id: 9,
    title: "Category",
    icon: <BiCategory />,
    role: "seller",
    path: "/seller/dashboard/category",
  },
  {
    id: 10,
    title: "Upload Banner",
    icon: <AiOutlinePlus />,
    role: "seller",
    path: "/seller/dashboard/upload-banner",
  },
  {
    id: 11,
    title: "Add Product",
    icon: <AiOutlinePlus />,
    role: "seller",
    path: "/seller/dashboard/add-product",
  },
  {
    id: 13,
    title: "All Product",
    icon: <RiProductHuntLine />,
    role: "seller",
    path: "/seller/dashboard/products",
  },
  // {
  //   id: 12,
  //   title: "Add Gift Product",
  //   icon: <AiOutlinePlus />,
  //   role: "seller",
  //   path: "/seller/dashboard/add-gift",
  // },
  // {
  //   id: 13,
  //   title: "All Gift Product",
  //   icon: <RiProductHuntLine />,
  //   role: "seller",
  //   path: "/seller/dashboard/all-gift",
  // },

  {
    id: 14,
    title: "Add Coupon",
    icon: <RiCoupon2Fill />,
    role: "seller",
    path: "/seller/dashboard/add-coupon",
  },
  {
    id: 15,
    title: "Upload Blogs",
    icon: <AiOutlinePlus />,
    role: "seller",
    path: "/seller/dashboard/add-blogs",
  },

  {
    id: 13,
    title: "Query Form",
    icon: <RiProductHuntLine />,
    role: "seller",
    path: "/seller/dashboard/queryform",
  },
  {
    id: 16,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "seller",
    path: "/seller/dashboard/orders",
  },
  {
    id: 16,
    title: "Created Orders",
    icon: <AiOutlineShoppingCart />,
    role: "seller",
    path: "/seller/dashboard/created-orders",
  },
  {
    id: 17,
    title: "Payments",
    icon: <BsCurrencyDollar />,
    role: "seller",
    path: "/seller/dashboard/payments",
  },
  // {
  //   id: 16,
  //   title: "Chat Customer",
  //   icon: <BsChat />,
  //   role: "seller",
  //   path: "/seller/dashboard/chat-customer",
  // },
  // {
  //   id: 17,
  //   title: "Chat Support",
  //   icon: <CiChat1 />,
  //   role: "seller",
  //   path: "/seller/dashboard/chat-support",
  // },
  {
    id: 18,
    title: "Profile",
    icon: <FiUsers />,
    role: "seller",
    path: "/seller/dashboard/profile",
  },
  {
    id: 19,
    title: "Heading",
    icon: <BsCardHeading />,
    role: "seller",
    path: "/seller/dashboard/heading",
  },
  {
    id: 20,
    title: "Discount",
    icon: <CiDiscount1 />,
    role: "seller",
    path: "/seller/dashboard/discount",
  },

];

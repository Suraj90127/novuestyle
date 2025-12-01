// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferPromotion from "./pages/OfferPromotion";
import GiftStore from "./pages/GiftStore";
import BestSeller from "./pages/BestSeller";
import SingleProduct from "./pages/SingleProduct";
import BrandStory from "./pages/BrandStory";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermCondition from "./pages/TermCondition";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckOut";
import Shipping from "./pages/Shiping";
import Payment from "./pages/Payment";
import CustomerReviews from "./pages/CustomerReviews";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import CategoriesData from "./pages/CategoriesData";
import ViewProduct from "./pages/ViewProduct";
import QueryForm from "./pages/QueryForm";
import ProductFilter from "./Home/ProductFilter";
import SearchProduct from "./pages/SearchProduct";
import ProfileMenu from "./pages/ProfileMenu";
import "./App.css";
import SubCategoriesData from "./pages/SubCategoryData";
import ProductCustomizer from "./pages/ProductCustomizer";
import Contact from "./components/Contact";
import SippingPolicy from "./components/SippingPolicy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-customizer" element={<ProductCustomizer />} />
        {/* <Route path="/collections" element={<Collections />} /> */}
        {/* <Route path="/evil-eye" element={<EvilEye />} /> */}
        <Route path="/offer-promotion" element={<OfferPromotion />} />
        <Route path="/gift-store" element={<GiftStore />} />
        <Route path="/products/search?" element={<BestSeller />} />
        <Route path="/product" element={<SearchProduct />} />

        <Route path="/product/details/:slug" element={<SingleProduct />} />
        <Route path="/story" element={<BrandStory />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/term-condition" element={<TermCondition />} />
        <Route path="/profilemenu" element={<ProfileMenu />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/shiping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<CustomerReviews />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogdetail/:slug" element={<BlogDetail />} />
        <Route path="/dashboard-client" element={<Dashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/category-data/:slug" element={<CategoriesData />} />
        <Route
          path="/sub-category-data/:category/:slug"
          element={<SubCategoriesData />}
        />
        <Route path="/dashboard/order/details/:id" element={<ViewProduct />} />
        <Route path="/queryform" element={<QueryForm />} />
        <Route path="/collections" element={<ProductFilter />} />
        <Route path="/shipping-policy" element={<SippingPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;

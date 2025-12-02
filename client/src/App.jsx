// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";

// Lazy load all page components
const OfferPromotion = lazy(() => import("./pages/OfferPromotion"));
const GiftStore = lazy(() => import("./pages/GiftStore"));
const BestSeller = lazy(() => import("./pages/BestSeller"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const BrandStory = lazy(() => import("./pages/BrandStory"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const TermCondition = lazy(() => import("./pages/TermCondition"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/CheckOut"));
const Shipping = lazy(() => import("./pages/Shiping"));
const Payment = lazy(() => import("./pages/Payment"));
const CustomerReviews = lazy(() => import("./pages/CustomerReviews"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const CategoriesData = lazy(() => import("./pages/CategoriesData"));
const ViewProduct = lazy(() => import("./pages/ViewProduct"));
const QueryForm = lazy(() => import("./pages/QueryForm"));
const ProductFilter = lazy(() => import("./Home/ProductFilter"));
const SearchProduct = lazy(() => import("./pages/SearchProduct"));
const ProfileMenu = lazy(() => import("./pages/ProfileMenu"));
const SubCategoriesData = lazy(() => import("./pages/SubCategoryData"));
const ProductCustomizer = lazy(() => import("./pages/ProductCustomizer"));
const Contact = lazy(() => import("./components/Contact"));
const SippingPolicy = lazy(() => import("./components/SippingPolicy"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Simple Skeleton Loader for better UX
const SkeletonLoader = ({ type = "page" }) => {
  if (type === "page") {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="h-16 bg-gray-200"></div>
        <div className="max-w-7xl mx-auto p-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Suspense fallback={<SkeletonLoader type="page" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Performance-critical routes with custom loaders */}
          <Route 
            path="/product-customizer" 
            element={
              <Suspense fallback={<SkeletonLoader type="customizer" />}>
                <ProductCustomizer />
              </Suspense>
            } 
          />
          
          <Route 
            path="/product/details/:slug" 
            element={
              <Suspense fallback={<SkeletonLoader type="product" />}>
                <SingleProduct />
              </Suspense>
            } 
          />
          
          <Route 
            path="/cart" 
            element={
              <Suspense fallback={<SkeletonLoader type="cart" />}>
                <Cart />
              </Suspense>
            } 
          />
          
          <Route 
            path="/checkout" 
            element={
              <Suspense fallback={<SkeletonLoader type="checkout" />}>
                <CheckoutPage />
              </Suspense>
            } 
          />
          
          {/* Regular routes */}
          <Route path="/offer-promotion" element={<OfferPromotion />} />
          <Route path="/gift-store" element={<GiftStore />} />
          <Route path="/products/search?" element={<BestSeller />} />
          <Route path="/product" element={<SearchProduct />} />
          <Route path="/story" element={<BrandStory />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/term-condition" element={<TermCondition />} />
          <Route path="/profilemenu" element={<ProfileMenu />} />
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
      </Suspense>
    </Router>
  );
}

export default App;
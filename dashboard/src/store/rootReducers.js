import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import chatReducer from "./Reducers/chatReducer";
import OrderReducer from "./Reducers/OrderReducer";
import PaymentReducer from "./Reducers/PaymentReducer";
import dashboardIndexReducer from "./Reducers/dashboardIndexReducer";
import blogReducer from "./Reducers/blogReducer";
import couponReducer from "./Reducers/couponReducer";
import bannerReducer from "./Reducers/bannerReducer";
import giftReducer from "./Reducers/giftReducer";
import subCategoryReducer from './Reducers/subCategoryReducer';
import headingsReducer from './Reducers/headingsReducer';
import heading2Reducer from './Reducers/heading2Reducer';
import heading3Reducer from './Reducers/heading3Reducer';
import heading4Reducer from './Reducers/heading4Reducer';
import heading5Reducer from './Reducers/heading5Reducer';
import discountReducer from './Reducers/discountReducer'
const rootReducer = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  chat: chatReducer,
  order: OrderReducer,
  payment: PaymentReducer,
  dashboardIndex: dashboardIndexReducer,
  blog: blogReducer,
  coupon: couponReducer,
  banner: bannerReducer,
  gift: giftReducer,
  subcategory: subCategoryReducer,
  headings: headingsReducer,
  heading2: heading2Reducer,
  heading3: heading3Reducer,
  heading4: heading4Reducer,
  heading5: heading5Reducer,
  discount:discountReducer



};
export default rootReducer;

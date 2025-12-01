import authReducer from "./reducers/authReducer";
import homeReducer from "./reducers/homeReducer";
import cardReducer from "./reducers/cardReducer";
import blogReducer from "./reducers/blogReducer";
import couponReducer from "./reducers/couponReducer";
import bannerReducer from "./reducers/bannerReducer";
import giftReducer from "./reducers/giftReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducers = {
  auth: authReducer,
  home: homeReducer,
  card: cardReducer,
  blog: blogReducer,
  coupon: couponReducer,
  banner: bannerReducer,
  gift: giftReducer,
  order: orderReducer,
};
export default rootReducers;

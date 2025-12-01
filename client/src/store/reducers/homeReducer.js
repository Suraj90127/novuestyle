import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

//
export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/home/get-categorys");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/get_products",
  async (
    { page, limit, priceMin, priceMax, rating, color },
    { fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(`/home/get-products`, {
        params: { page, limit, priceMin, priceMax, rating, color },
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response || error.message);
    }
  }
);

export const get_product = createAsyncThunk(
  "product/get_product",
  async (slug, { fulfillWithValue }) => {
    // console.log("slug", slug);
    try {
      const { data } = await api.get(`/home/get-product/${slug}`);
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const get_product_category = createAsyncThunk(
  "product/get_product_category",
  async (value, { fulfillWithValue }) => {
    // console.log("api calling", value);
    try {
      const { data } = await api.get(`/home/get-products-cat/${value}`);
      // console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/home/price-range-latest-product");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const query_products = createAsyncThunk(
  "product/query_products",
  async (query, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/query-products?category=${query.category}&&rating=${query.rating
        }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice
        }&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ""
        }`
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const search_products = createAsyncThunk(
  "product/search_products",
  async (query, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/search_products?searchValue=${query.searchValue}`
      );
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const customer_review = createAsyncThunk(
  "review/customer_review",
  async (info, { fulfillWithValue }) => {
    try {
      const { data } = await api.post("/home/customer/submit-review", info);
      return fulfillWithValue(data);
    } catch (error) { }
  }
);

export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      return fulfillWithValue(data);
    } catch (error) { }
  }
);

export const getheadingfirst = createAsyncThunk(
  "product/get-headingfirst",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-heading`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getheadingsecond = createAsyncThunk(
  "product/get-heading2",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-heading2`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getheadingthird = createAsyncThunk(
  "product/get-heading3",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-heading3`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getheadingfourth = createAsyncThunk(
  "product/get-heading4",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-heading4`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getheadingfivth = createAsyncThunk(
  "product/get-heading5",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-heading5`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getDiscount = createAsyncThunk(
  "product/discount",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_discount`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const getSubCatData = createAsyncThunk(
  "product/subData",
  async ({ category, slug, page, limit }, { fulfillWithValue }) => {
    // console.log("slug on reducer page", slug);
    try {
      const { data } = await api.get(`/product-sub/${category}/${slug}`, {
        params: { page, limit },
      });

      // console.log("data on reducer", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const getShipping = createAsyncThunk(
  "product/getShipping",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-shipping`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const homeReducer = createSlice({
  name: "home",
  initialState: {
    categorys: [],
    products: [],
    totalProduct: 0,
    parPage: 4,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
      low: 0,
      high: 100,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    successMessage: "",
    errorMessage: "",
    totalReview: 0,
    rating_review: [],
    reviews: [],
    firstheading: null,
    thirdheading: null,
    secondheading: null,
    fourthheading: null,
    fivthheading: null,
    discount: [],
    subData: [],
    product_cat: [],
    loading: false,
    error: null,
    shipping: null,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.categorys = payload.categorys;
      })
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.latest_product = payload.latest_product;
        state.topRated_product = payload.topRated_product;
        state.discount_product = payload.discount_product;
      })
      .addCase(get_product.fulfilled, (state, { payload }) => {
        state.product = payload.product;
        state.relatedProducts = payload.relatedProducts;
        state.moreProducts = payload.moreProducts;
      })
      .addCase(get_product_category.fulfilled, (state, { payload }) => {
        state.product_cat = payload.product;
      })
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latest_product;
        state.priceRange = payload.priceRange;
      })
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.totalProduct = payload.totalProduct;
        state.parPage = payload.parPage;
      })
      .addCase(search_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
      })
      .addCase(customer_review.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        state.reviews = payload.reviews;
        state.totalReview = payload.totalReview;
        state.rating_review = payload.rating_review;
      })
      .addCase(getheadingfirst.fulfilled, (state, { payload }) => {
        state.firstheading = payload;
      })
      .addCase(getheadingsecond.fulfilled, (state, { payload }) => {
        state.secondheading = payload;
      })
      .addCase(getheadingthird.fulfilled, (state, { payload }) => {
        state.thirdheading = payload;
      })
      .addCase(getheadingfourth.fulfilled, (state, { payload }) => {
        state.fourthheading = payload;
      })
      .addCase(getheadingfivth.fulfilled, (state, { payload }) => {
        state.fivthheading = payload;
      })
      .addCase(getDiscount.fulfilled, (state, { payload }) => {
        state.discount = payload.data;
      })
      .addCase(getSubCatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🔹 Fulfilled
      .addCase(getSubCatData.fulfilled, (state, { payload }) => {
        // Append if more data is loaded
        state.subData = payload.data;
        state.loading = false;
      })

      // 🔹 Rejected
      .addCase(getSubCatData.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message || "Failed to load subcategory data";
      })
      .addCase(getShipping.fulfilled, (state, { payload }) => {
        state.shipping = payload;
      });
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;

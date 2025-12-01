import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // Ensure that `api` is properly set up to make API calls

// Utility function to manage cache with localStorage
const cacheKey = "cachedCoupons";

const getCachedCoupons = () => {
  const cachedData = localStorage.getItem(cacheKey);
  return cachedData ? JSON.parse(cachedData) : null;
};

const setCachedCoupons = (data) => {
  localStorage.setItem(cacheKey, JSON.stringify(data));
};

export const addCoupon = createAsyncThunk(
  "blog/add_blog",
  async (coupon, { rejectWithValue, fulfillWithValue }) => {
    // console.log("object", blog);
    try {
      const { data } = await api.post("/add-coupon", coupon, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-coupon", { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-coupon/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue({ id, message: data.message });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const couponReducer = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    successMessage: "",
    errorMessage: "",
    loader: false,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: {
    // Add Coupon
    [addCoupon.pending]: (state) => {
      state.loader = true;
    },
    [addCoupon.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [addCoupon.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },

    // Get Coupons
    [getCoupons.pending]: (state) => {
      state.loader = true;
    },
    [getCoupons.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.coupons = payload.couponData;
    },
    [getCoupons.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },

    // Delete Coupon
    [deleteCoupon.pending]: (state) => {
      state.loader = true;
    },
    [deleteCoupon.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      // Remove the deleted coupon from the state
      state.coupons = state.coupons.filter(
        (coupon) => coupon._id !== payload.id
      );
    },
    [deleteCoupon.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
  },
});

export const { clearMessages } = couponReducer.actions;
export default couponReducer.reducer;

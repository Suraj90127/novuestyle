import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // Ensure that `api` is properly set up to make API calls

// Async actions for coupons

// Add Coupon
export const add_coupon = createAsyncThunk(
  "coupon/addCoupon",
  async (
    { name, price, discount, userlimit },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(
        "/add-coupon",
        { name, price, discount, userlimit },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get All Coupons
export const get_coupons = createAsyncThunk(
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

// Delete Coupon
export const delete_coupon = createAsyncThunk(
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

// Coupon Slice
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
  extraReducers: (builder) => {
    builder
      // Add Coupon
      .addCase(add_coupon.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_coupon.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(add_coupon.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.coupons.push(payload.coupon); // Add the new coupon to the list
      })

      // Get All Coupons
      .addCase(get_coupons.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_coupons.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(get_coupons.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.coupons = payload.couponData;
      })

      // Delete Coupon
      .addCase(delete_coupon.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_coupon.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(delete_coupon.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== payload.id
        );
      });
  },
});

export const { clearMessages } = couponReducer.actions;
export default couponReducer.reducer;

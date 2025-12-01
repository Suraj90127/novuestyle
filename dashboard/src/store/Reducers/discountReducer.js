import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchDiscounts = createAsyncThunk(
  "discount/fetchDiscounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/get_discount`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to fetch discounts"
      );
    }
  }
);

export const addDiscount = createAsyncThunk(
  "discount/addDiscount",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/add_discount`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.discount;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to add discount"
      );
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/update_discount`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { id },
      });
      return response.data.discount;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to update discount"
      );
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/delete_discount/${id}`);
      return response.data.data._id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to delete discount"
      );
    }
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discounts: [],
    loading: false,
    error: "", // make error always a string
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDiscount.fulfilled, (state, action) => {
        state.discounts.push(action.payload);
      })
      .addCase(addDiscount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        const index = state.discounts.findIndex(d => d._id === action.payload._id);
        if (index !== -1) state.discounts[index] = action.payload;
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter(d => d._id !== action.payload);
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default discountSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";

// Upload banners action
export const uploadBanners = createAsyncThunk(
  "banners/upload",
  async (formData) => {
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.uploadedBanners;
  }
);

// Get all banners action
export const getBanners = createAsyncThunk("banners/getAll", async () => {
  const response = await api.get("/get-banner");
  console.log("response", response);
  return response.data.bannerData;
});

// Delete banner action
export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (bannerId) => {
    await api.delete(`/banner-delete/${bannerId}`);
    return bannerId;
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: { banners: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(...action.payload);
      })
      .addCase(uploadBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(
          (banner) => banner._id !== action.payload
        );
      });
  },
});

export default bannerSlice.reducer;

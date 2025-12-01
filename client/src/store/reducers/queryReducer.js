
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import api from "../../api/api";

// // Upload banners action
// export const queryform = createAsyncThunk(
//   "query/form",
//   async (formData) => {
//     const response = await api.post("/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data.uploadedBanners;
//   }
// );



// const querySlice = createSlice({
//   name: "query",
//   initialState: { banners: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(uploadBanners.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(uploadBanners.fulfilled, (state, action) => {
//         state.loading = false;
//         state.banners.push(...action.payload);
//       })
//       .addCase(uploadBanners.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
      
      
//   },
// });

// export default querySlice.reducer;

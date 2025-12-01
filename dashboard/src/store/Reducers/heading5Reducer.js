import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


// Async Thunks
export const fetchHeadings = createAsyncThunk("heading5/fetchHeadings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/get-heading5`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createHeading = createAsyncThunk("heading5/createHeading", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post(`/save-heading5`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateHeading = createAsyncThunk("heading5/updateHeading", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/update-heading5/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteHeading = createAsyncThunk("heading5/deleteHeading", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/delete-heading5/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const heading5Slice = createSlice({
  name: "heading5",
  initialState: { headings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHeadings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHeadings.fulfilled, (state, action) => { state.loading = false; state.headings = action.payload; })
      .addCase(fetchHeadings.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      // Create
      .addCase(createHeading.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createHeading.fulfilled, (state, action) => { state.loading = false; state.headings.push(action.payload); })
      .addCase(createHeading.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      // Update
      .addCase(updateHeading.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateHeading.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.headings.findIndex(h => h._id === action.payload._id);
        if (index !== -1) state.headings[index] = action.payload;
      })
      .addCase(updateHeading.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      // Delete
      .addCase(deleteHeading.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteHeading.fulfilled, (state, action) => { state.loading = false; state.headings = state.headings.filter(h => h._id !== action.payload); })
      .addCase(deleteHeading.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export default heading5Slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const API_URL = "/api/dashboard/headings"; 


export const fetchHeadings = createAsyncThunk(
  "headings/fetchHeadings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/get-heading`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHeading = createAsyncThunk(
  "headings/createHeading",
  async (headingData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/save-heading`, headingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a heading
export const updateHeading = createAsyncThunk(
  "headings/updateHeading",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update-heading/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteHeading = createAsyncThunk(
  "headings/deleteHeading",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-heading/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const headingsSlice = createSlice({
  name: "headings",
  initialState: {
    headings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHeadings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeadings.fulfilled, (state, action) => {
        state.loading = false;
        state.headings = action.payload;
      })
      .addCase(fetchHeadings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch headings";
      })

      // Create
      .addCase(createHeading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHeading.fulfilled, (state, action) => {
        state.loading = false;
        state.headings.push(action.payload);
      })
      .addCase(createHeading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create heading";
      })

      // Update
      .addCase(updateHeading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHeading.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.headings.findIndex(h => h._id === action.payload._id);
        if (index !== -1) state.headings[index] = action.payload;
      })
      .addCase(updateHeading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update heading";
      })

      // Delete
      .addCase(deleteHeading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHeading.fulfilled, (state, action) => {
        state.loading = false;
        state.headings = state.headings.filter(h => h._id !== action.payload);
      })
      .addCase(deleteHeading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete heading";
      });
  },
});

export default headingsSlice.reducer;

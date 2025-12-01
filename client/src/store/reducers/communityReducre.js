import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const get_communities = createAsyncThunk(
  "community/get_communities",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/communities", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_community = createAsyncThunk(
  "community/get_community",
  async (communityId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/community/${communityId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_community = createAsyncThunk(
  "community/delete_community",
  async (communityId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/community/${communityId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  communities: [],
  community: "",
};

const communityReducer = createSlice({
  name: "community",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_communities.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_communities.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(get_communities.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.communities = payload.communities;
      })
      .addCase(get_community.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_community.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(get_community.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.community = payload.community;
      })
      .addCase(delete_community.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_community.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(delete_community.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.communities = state.communities.filter(
          (community) => community._id !== payload.communityId
        );
      });
  },
});

export const { messageClear } = communityReducer.actions;
export default communityReducer.reducer;

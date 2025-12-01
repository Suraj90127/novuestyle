import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_gift = createAsyncThunk(
  "gift/add_gift",
  async (gift, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/gift-add", gift, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_gift = createAsyncThunk(
  "gift/updategift",
  async (gift, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/gift-update", gift, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const gift_image_update = createAsyncThunk(
  "gift/gift_image_update",
  async (
    { oldImage, newImage, giftId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("giftId", giftId);
      const { data } = await api.post("/gift-image-update", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_gifts = createAsyncThunk(
  "gift/get_gifts",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/gifts-get`, {
        withCredentials: true,
      });
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_gift = createAsyncThunk(
  "gift/get_gift",
  async (giftId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/gift-get/${giftId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete gift async thunk
export const delete_gift = createAsyncThunk(
  "gift/delete_gift",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    // console.log("delete gift id", id);
    try {
      const { data } = await api.delete(`/gift-delete/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const giftReducer = createSlice({
  name: "gift",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    gifts: [],
    gift: "",
    totalgift: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [add_gift.pending]: (state, _) => {
      state.loader = true;
    },
    [add_gift.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [add_gift.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [get_gifts.fulfilled]: (state, { payload }) => {
      // state.totalgift = payload.totalgift;
      console.log("payload", payload);
      state.gifts = payload.gifts;
    },
    [get_gift.fulfilled]: (state, { payload }) => {
      state.gift = payload.gift;
    },
    [update_gift.pending]: (state, _) => {
      state.loader = true;
    },
    [update_gift.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [update_gift.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.gift = payload.gift;
      state.successMessage = payload.message;
    },
    [gift_image_update.fulfilled]: (state, { payload }) => {
      state.gift = payload.gift;
      state.successMessage = payload.message;
    },
    // Delete gift
    [delete_gift.pending]: (state, _) => {
      state.loader = true;
    },
    [delete_gift.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [delete_gift.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      // Optionally, remove the deleted gift from the state
      state.gifts = state.gifts.filter((p) => p._id !== payload.giftId);
    },
  },
});
export const { messageClear } = giftReducer.actions;
export default giftReducer.reducer;

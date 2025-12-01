import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// ✅ Add Category
export const categoryAdd = createAsyncThunk(
  "category/categoryAdd",
  async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const { data } = await api.post("/category-add", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Get Categories
export const get_category = createAsyncThunk(
  "category/get_category",
  async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Edit Category
export const edit_category = createAsyncThunk(
  "category/edit_category",
  async ({ categoryId, name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (image) formData.append("image", image);

      const { data } = await api.put(`/category-edit/${categoryId}`, formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Delete Category
export const delete_category = createAsyncThunk(
  "category/delete_category",
  async (categoryId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete_category/${categoryId}`, {
        withCredentials: true,
      });
      return fulfillWithValue({ data, categoryId });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const categoryReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    categorys: [],
    totalCategory: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    // 🔹 Add Category
    [categoryAdd.pending]: (state) => {
      state.loader = true;
    },
    [categoryAdd.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [categoryAdd.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.categorys = [...state.categorys, payload.category];
    },

    // 🔹 Get Categories
    [get_category.fulfilled]: (state, { payload }) => {
      state.totalCategory = payload.totalCategory;
      state.categorys = payload.categorys;
    },

    // 🔹 Edit Category
    [edit_category.pending]: (state) => {
      state.loader = true;
    },
    [edit_category.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [edit_category.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.categorys = state.categorys.map((cat) =>
        cat._id === payload.category._id ? payload.category : cat
      );
    },

    // 🔹 Delete Category
    [delete_category.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.data.message;
      state.categorys = state.categorys.filter(
        (cat) => cat._id !== payload.categoryId
      );
      state.totalCategory -= 1;
    },
    [delete_category.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
  },
});

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;

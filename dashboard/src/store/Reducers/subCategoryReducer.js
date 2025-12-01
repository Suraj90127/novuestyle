import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const subCategoryAdd = createAsyncThunk(
  "subcategory/add",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/category/${formData.get("categoryId")}/subcategory`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

export const subCategoryEdit = createAsyncThunk(
  "subcategory/edit",
  async ({ categoryId, subCategoryId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/category/${categoryId}/subcategory/${subCategoryId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

export const subCategoryDelete = createAsyncThunk(
  "subcategory/delete",
  async ({ categoryId, subCategoryId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(
        `/category/${categoryId}/subcategory/${subCategoryId}`
      );
      return { message: data.message, subCategoryId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "subcategory/fetch",
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/category-get`);
      const category = data.categorys.find((c) => c._id === categoryId);
      return category?.subCategory || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

const initialState = {
  loader: false,
  subcategories: [],
  totalSubCategory: 0,
  successMessage: "",
  errorMessage: "",
};

const subCategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
    resetSubcategories: (state) => {
      state.subcategories = [];
      state.totalSubCategory = 0;
      state.loader = false;
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subCategoryAdd.pending, (state) => { state.loader = true; })
      .addCase(subCategoryAdd.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message || "Subcategory added successfully";
        if (payload.category?.subCategory) {
          state.subcategories = payload.category.subCategory;
          state.totalSubCategory = payload.category.subCategory.length;
        }
      })
      .addCase(subCategoryAdd.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to add subcategory";
      })

      .addCase(subCategoryEdit.pending, (state) => { state.loader = true; })
      .addCase(subCategoryEdit.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message || "Subcategory updated successfully";
        if (payload.category?.subCategory) {
          state.subcategories = payload.category.subCategory;
          state.totalSubCategory = payload.category.subCategory.length;
        }
      })
      .addCase(subCategoryEdit.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to edit subcategory";
      })

      .addCase(subCategoryDelete.pending, (state) => { state.loader = true; })
      .addCase(subCategoryDelete.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message || "Subcategory deleted successfully";
        state.subcategories = state.subcategories.filter(
          (s) => s._id !== payload.subCategoryId
        );
        state.totalSubCategory = state.subcategories.length;
      })
      .addCase(subCategoryDelete.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to delete subcategory";
      })

      .addCase(fetchSubcategories.pending, (state) => { state.loader = true; })
      .addCase(fetchSubcategories.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.subcategories = payload;
        state.totalSubCategory = payload.length;
      })
      .addCase(fetchSubcategories.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to fetch subcategories";
      });
  },
});

export const { messageClear, resetSubcategories } = subCategorySlice.actions;
export default subCategorySlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// Thunks for recipe actions

export const add_recipe = createAsyncThunk(
  "recipe/add_recipe",
  async (recipe, { rejectWithValue, fulfillWithValue }) => {
    // console.log("object", recipe);
    try {
      const { data } = await api.post("/recipe-add", recipe, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_recipes = createAsyncThunk(
  "recipe/get_recipes",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/recipe-gets", {
        withCredentials: true,
      });
      console.log("objectget_recipes", data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_recipe = createAsyncThunk(
  "recipe/get_recipe",
  async (recipeId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/recipe/${recipeId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_recipe = createAsyncThunk(
  "recipe/delete_recipe",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/recipe/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const recipeReducer = createSlice({
  name: "recipe",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    recipes: [],
    recipe: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    // Add recipe
    [add_recipe.pending]: (state) => {
      state.loader = true;
    },
    [add_recipe.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [add_recipe.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.recipes.push(payload.recipe); // Add the new recipe to the list
    },

    // Get all recipes
    [get_recipes.pending]: (state) => {
      state.loader = true;
    },
    [get_recipes.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [get_recipes.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.recipes = payload.recipeData;
    },

    // Get a single recipe
    [get_recipe.pending]: (state) => {
      state.loader = true;
    },
    [get_recipe.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [get_recipe.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.recipeData = payload.recipeData;
    },

    // Delete recipe
    [delete_recipe.pending]: (state) => {
      state.loader = true;
    },
    [delete_recipe.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [delete_recipe.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.recipes = state.recipes.filter(
        (recipe) => recipe._id !== payload.recipeId
      );
    },
  },
});

export const { messageClear } = recipeReducer.actions;
export default recipeReducer.reducer;

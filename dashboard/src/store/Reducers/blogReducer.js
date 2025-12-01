import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunks for blog actions

export const add_blog = createAsyncThunk(
  "blog/add_blog",
  async (blog, { rejectWithValue, fulfillWithValue }) => {
    // console.log("object", blog);
    try {
      const { data } = await api.post("/blog-add", blog, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_blogs = createAsyncThunk(
  "blog/get_blogs",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/blog-gets", {
        withCredentials: true,
      });
      console.log("objectget_blogs", data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_blog = createAsyncThunk(
  "blog/get_blog",
  async (blogId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/blog/${blogId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_blog = createAsyncThunk(
  "blog/delete_blog",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/blog/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const blogReducer = createSlice({
  name: "blog",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    blogs: [],
    blog: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    // Add blog
    [add_blog.pending]: (state) => {
      state.loader = true;
    },
    [add_blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [add_blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.blogs.push(payload.blog); // Add the new blog to the list
    },

    // Get all blogs
    [get_blogs.pending]: (state) => {
      state.loader = true;
    },
    [get_blogs.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [get_blogs.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.blogs = payload.blogData;
    },

    // Get a single blog
    [get_blog.pending]: (state) => {
      state.loader = true;
    },
    [get_blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [get_blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.blogData = payload.blogData;
    },

    // Delete blog
    [delete_blog.pending]: (state) => {
      state.loader = true;
    },
    [delete_blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [delete_blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.blogs = state.blogs.filter(
        (blog) => blog._id !== payload.blogId
      );
    },
  },
});

export const { messageClear } = blogReducer.actions;
export default blogReducer.reducer;

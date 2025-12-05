import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt from "jwt-decode";
import api from "../../api/api";
export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      if (role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info);
      const { data } = await api.post("/seller-register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-image-upload", image, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-info-add", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_all_user = createAsyncThunk(
  "auth/get_all_user",
  
  async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/customers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete single customer
export const delete_customer = createAsyncThunk(
  "auth/delete_customer",
  async ({ customerId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/customer/${customerId}`, { 
        withCredentials: true 
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Bulk delete customers
export const bulk_delete_customers = createAsyncThunk(
  "auth/bulk_delete_customers",
  async ({ customerIds }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/customers/bulk-delete', 
        { customerIds },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const returnRole = (token) => {
  if (token) {
    const decodeToken = jwt(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
    alluser:null,
     deleteLoading: false,
    deleteSuccess: false,
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
       state.deleteSuccess = false;
      state.deleteError = "";
    },
  },
  extraReducers: {
    [admin_login.pending]: (state, _) => {
      state.loader = true;
    },
    [admin_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [admin_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [seller_login.pending]: (state, _) => {
      state.loader = true;
    },
    [seller_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [seller_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [seller_register.pending]: (state, _) => {
      state.loader = true;
    },
    [seller_register.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [seller_register.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [get_user_info.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.role = payload.userInfo.role;
    },
    [profile_image_upload.pending]: (state, _) => {
      state.loader = true;
    },
    [profile_image_upload.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.successMessage = payload.message;
    },
    [profile_info_add.pending]: (state, _) => {
      state.loader = true;
    },
    [profile_info_add.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.successMessage = payload.message;
    },
    [get_all_user.pending]: (state, _) => {
      state.loader = true;
    },
    [get_all_user.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.alluser = payload.data;
      state.successMessage = payload.message;
    },
    [delete_customer.pending]: (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.deleteError = "";
      },
      [delete_customer.fulfilled]: (state, { payload }) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.successMessage = payload.message;
        
        // Remove deleted customer from alluser array
        if (state.alluser.customers && payload.deletedCustomer) {
          state.alluser.customers = state.alluser.customers.filter(
            customer => customer._id !== payload.deletedCustomer.id
          );
          state.alluser.pagination.totalCustomers -= 1;
        }
      },
      [delete_customer.rejected]: (state, { payload }) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.deleteError = payload?.message || "Failed to delete customer";
      },
      [bulk_delete_customers.pending]: (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.deleteError = "";
      },
      [bulk_delete_customers.fulfilled]: (state, { payload }) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.successMessage = payload.message;
        
        // Remove deleted customers from alluser array
        if (state.alluser.customers && payload.details?.valid) {
          state.alluser.customers = state.alluser.customers.filter(
            customer => !payload.details.valid.includes(customer._id)
          );
          state.alluser.pagination.totalCustomers -= payload.details.deleted;
        }
      },
      [bulk_delete_customers.rejected]: (state, { payload }) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.deleteError = payload?.message || "Failed to delete customers";
      }
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer.reducer;

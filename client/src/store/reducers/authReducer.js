import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import jwt_decode from "jwt-decode";

// Customer Register Action
export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-register", info);
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Customer Login Action
export const customer_login = createAsyncThunk(
  "auth/customer_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-login", info);
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userDetail = createAsyncThunk(
  "auth/user-details",

  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/useringfo`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Verify OTP and Reset Password Action
export const verifyOtpAndResetPassword = createAsyncThunk(
  "auth/verifyOtpAndResetPassword",
  async ({ email, otp, npassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reset-password", {
        email,
        otp,
        npassword,
      });
      return data; // Returns the success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "An error occurred"
      );
    }
  }
);

// Token Decoder Utility Function
const decodeToken = (token) => {
  if (token) {
    return jwt_decode(token);
  }
  return "";
};

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: decodeToken(localStorage.getItem("customerToken")),
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      state.userInfo = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Customer Register Cases
      .addCase(customer_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_register.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(customer_register.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })

      // Customer Login Cases
      .addCase(customer_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })

      .addCase(userDetail.pending, (state) => {
        state.loader = true;
      })
      .addCase(userDetail.rejected, (state, { payload }) => {
        // console.log('register rejected payload:', payload); // Log payload
        state.errorMessage = payload?.errorMessage || "An error occurred";
        state.loader = false;
      })
      .addCase(userDetail.fulfilled, (state, { payload }) => {
        const userData = payload.data;
        // console.log("user", userData);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userData;
      })

      // Verify OTP and Reset Password Cases
      .addCase(verifyOtpAndResetPassword.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(verifyOtpAndResetPassword.rejected, (state, { payload }) => {
        state.errorMessage =
          payload || "Failed to verify OTP or reset password.";
        state.loader = false;
      })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
      });
  },
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;

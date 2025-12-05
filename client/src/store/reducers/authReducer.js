import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';


// Customer Register Action
export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/customer/customer-register",
        info,
        {
          withCredentials: true,   // 👈 important
        }
      );
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

// Customer Login Action
export const customer_login = createAsyncThunk(
  "auth/customer_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/customer/customer-login",
        info,
        {
          withCredentials: true,   // 👈 important
        }
      );

      console.log("token data", data);
      
    
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
    }
  }
);

// Add these action creators
export const verify_otp = createAsyncThunk(
  'auth/verify_otp',
  async (info, { rejectWithValue }) => {
    try {
      const res = await api.post(`/customer/verify-otp`, info, {
        withCredentials: true
      });

      console.log("resss",res);
      
        localStorage.setItem("customerToken", res.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const resend_otp = createAsyncThunk(
  'auth/resend_otp',
  async (info, { rejectWithValue }) => {
    try {
      const res = await api.post(`/customer/resend-otp`, info, {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const userDetail = createAsyncThunk(
  "auth/user-details",

  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/useringfo`, { withCredentials: true });
      console.log(" data",data);
      
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
    userInfo: decodeToken(Cookies.get('customerToken')),
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
      .addCase(verify_otp.pending, (state) => {
        state.loader = true;
      })
      .addCase(verify_otp.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(verify_otp.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })
      .addCase(resend_otp.pending, (state) => {
        state.loader = true;
      })
      .addCase(resend_otp.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(resend_otp.fulfilled, (state, { payload }) => {
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
        // console.log("userData",userData);
        
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

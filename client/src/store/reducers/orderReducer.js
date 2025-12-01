import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const place_order = createAsyncThunk(
  "order/place_order",
  async ({
    price,
    products,
    shipping_fee,
    shippingInfo,
    userId,
    navigate,
    items,
  }) => {
    // console.log("productsaaa", products);
    try {
      const { data } = await api.post("/home/order/palce-order", {
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        navigate,
        items,
      });
      navigate("/payment", {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.orderId,
          shippingInfo,
          products,
        },
      });
      console.log(data);
      return true;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_orders = createAsyncThunk(
  "order/get_orders",
  async ({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
    // console.log("customerId", customerId, "status", status);
    try {
      const { data } = await api.get(
        `/home/customer/gat-orders/${customerId}/${status}`
      );

      // console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_order = createAsyncThunk(
  "order/get_order",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/customer/gat-order/${id}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {},
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Customer Register Cases
      .addCase(get_orders.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_orders.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(get_orders.fulfilled, (state, { payload }) => {
        state.myOrders = payload.orders;
        // console.log("payload", payload);
      })

      .addCase(get_order.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_order.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "An unexpected error occurred.";
        state.loader = false;
      })
      .addCase(get_order.fulfilled, (state, { payload }) => {
        state.myOrder = payload.order;
        // console.log("payload", payload);
      });
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;

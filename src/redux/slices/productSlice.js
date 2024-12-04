import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://1643c81e9479d928.mokky.dev/item";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(BASE_URL);
    return response.data.map((product) => ({
      ...product,
      orderedQuantity: 0,
      total: 0,
    }));
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    incrementQuantity: (state, action) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product && product.orderedQuantity < product.available) {
        product.orderedQuantity += 1;
        product.total = product.orderedQuantity * product.price;
      }
    },
    decrementQuantity: (state, action) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product && product.orderedQuantity > 0) {
        product.orderedQuantity -= 1;
        product.total = product.orderedQuantity * product.price;
      }
    },
    calculateDiscount: (state) => {
      const total = state.items.reduce((sum, item) => sum + item.total, 0);
      state.discount = total > 1000 ? total * 0.1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "successded";
        state.items = action.payload.map((product) => ({
          ...product,
          orderedQuantity: 0,
          total: 0,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("Error loading data:", action.error.message);
        state.status = "failed";
      });
  },
});

export const { incrementQuantity, decrementQuantity, calculateDiscount } = productsSlice.actions;
export default productsSlice.reducer;

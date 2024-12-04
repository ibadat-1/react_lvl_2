import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});


export default store;
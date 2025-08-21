import pageReducer from "../Slices/pagesSlice.js";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
   pages:pageReducer 
  },
});

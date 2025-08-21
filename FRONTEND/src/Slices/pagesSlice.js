import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [{}],
  userSearches:localStorage.getItem("UserSearches") || []
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
     setFeedbacks : (state , action) => {
           state.feedbacks = action.payload ;
     },
     setUserHistory : (state ,action)=> {
       state.userSearches = [...state , action.payload]
     }
  },
});

export const {
  setFeedbacks ,
  setUserHistory
} = pagesSlice.actions;

export default pagesSlice.reducer;
